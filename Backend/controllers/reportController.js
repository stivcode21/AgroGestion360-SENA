const {
  getInventoryReportRows,
  getPayrollReportRows,
  getActivityPaymentInvoiceRow,
} = require("../models/reportModel");

const toIsoDate = (date) => date.toISOString().split("T")[0];

// El reporte siempre se calcula tomando los ultimos 6 meses.
const getDefaultRange = () => {
  const today = new Date();
  const start = new Date(today);
  start.setMonth(start.getMonth() - 6);

  return {
    fechaInicio: toIsoDate(start),
  };
};

const formatReportDateTime = (value = new Date()) => {
  const formatter = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return formatter.format(value).replace(",", "");
};

const formatCopCurrency = (value) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));

//formateamos la fecha de ultimo consumo
const formatLastConsumption = (value) => {
  if (!value) {
    return "Sin consumo";
  }

  // Convierte la fecha cruda de BD en un texto mas claro para el PDF.
  return formatReportDateTime(new Date(value));
};

exports.getInventoryReport = async (req, res) => {
  try {
    const defaultRange = getDefaultRange();
    const fechaInicio = defaultRange.fechaInicio;

    // Consulta la data base del reporte desde el modelo.
    const inventoryRows = await getInventoryReportRows({
      fechaInicio,
    });

    // Aqui se arma el JSON final que luego el frontend convierte en PDF.
    const reportData = {
      title: "Reporte de inventario",
      intro:
        "Este reporte presenta el stock actual del inventario y el consumo registrado por insumo durante los ultimos 6 meses.",
      generatedAt: formatReportDateTime(),
      periodLabel: "Ultimos 6 meses",
      fileName: `reporte-inventario-${toIsoDate(new Date())}.pdf`,
      columns: [
        { header: "Codigo", key: "codigo" },
        { header: "Nombre", key: "nombre" },
        { header: "Categoria", key: "categoria" },
        { header: "Stock actual", key: "stock_actual" },
        { header: "Consumido", key: "total_consumido" },
        { header: "Ultimo consumo", key: "ultimo_consumo" },
      ],
      rows: inventoryRows.map((row) => ({
        // Cada fila se adapta al formato exacto que espera la plantilla PDF.
        codigo: `PRD-${row.id_insumo}`,
        nombre: row.nombre,
        categoria: row.categoria,
        stock_actual: Number(row.stock_actual ?? 0),
        total_consumido: Number(row.total_consumido ?? 0),
        ultimo_consumo: formatLastConsumption(row.ultimo_consumo),
      })),
    };

    return res.status(200).json({
      message: "Reporte de inventario generado correctamente.",
      data: reportData,
    });
  } catch (error) {
    console.error("Error al generar reporte de inventario:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

exports.getPayrollReport = async (req, res) => {
  try {
    const defaultRange = getDefaultRange();
    const fechaInicio = defaultRange.fechaInicio;

    // El modelo devuelve el consolidado por trabajador para el periodo.
    const payrollRows = await getPayrollReportRows({
      fechaInicio,
    });

    // Sumamos todos los pagos individuales para obtener el total de nomina.
    const totalNomina = payrollRows.reduce(
      (acumulador, row) => acumulador + Number(row.pago_total ?? 0),
      0,
    );

    // Aqui adaptamos la respuesta al formato que ya espera el generador PDF.
    const reportData = {
      title: "Reporte de pagos de nomina",
      intro:
        "Este reporte consolida por trabajador las actividades pagadas y el valor total abonado durante los ultimos 6 meses.",
      generatedAt: formatReportDateTime(),
      periodLabel: "Ultimos 6 meses",
      fileName: `reporte-pagos-nomina-${toIsoDate(new Date())}.pdf`,
      summary: [
        {
          label: "Total pagado en nomina",
          value: formatCopCurrency(totalNomina),
        },
      ],
      columns: [
        { header: "ID", key: "id_trabajador" },
        { header: "Nombre", key: "nombre_completo" },
        { header: "Cedula", key: "numero_documento" },
        {
          header: "Actividades realizadas",
          key: "total_actividades_realizadas",
        },
        { header: "Pago total", key: "pago_total" },
      ],
      rows: payrollRows.map((row) => ({
        id_trabajador: Number(row.id_trabajador),
        nombre_completo: row.nombre_completo,
        numero_documento: row.numero_documento,
        total_actividades_realizadas: Number(
          row.total_actividades_realizadas ?? 0,
        ),
        pago_total: formatCopCurrency(row.pago_total),
      })),
    };

    return res.status(200).json({
      message: "Reporte de pagos generado correctamente.",
      data: reportData,
    });
  } catch (error) {
    console.error("Error al generar reporte de pagos:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

exports.getActivityPaymentInvoice = async (req, res) => {
  try {
    const idActividad = parseInt(req.params.idActividad, 10);

    if (Number.isNaN(idActividad)) {
      return res.status(400).json({ message: "ID de actividad invalido." });
    }

    const invoiceRow = await getActivityPaymentInvoiceRow({ idActividad });

    if (!invoiceRow) {
      return res
        .status(404)
        .json({ message: "No se encontro la actividad para generar la factura." });
    }

    const invoiceData = {
      documentType: "activity-payment-invoice",
      title: "Factura de pago de actividad",
      generatedAt: formatReportDateTime(),
      fileName: `factura-pago-actividad-${idActividad}-${toIsoDate(new Date())}.pdf`,
      worker: {
        id: Number(invoiceRow.id_trabajador),
        nombre: invoiceRow.nombre_completo,
        numeroDocumento: invoiceRow.numero_documento,
        rol: invoiceRow.rol,
      },
      activity: {
        id: Number(invoiceRow.id_registro),
        nombre: invoiceRow.actividad,
        montoPagado: formatCopCurrency(invoiceRow.monto),
        montoPagadoRaw: Number(invoiceRow.monto ?? 0),
      },
      signature: {
        label: "Firma del trabajador",
      },
    };

    return res.status(200).json({
      message: "Factura de pago generada correctamente.",
      data: invoiceData,
    });
  } catch (error) {
    console.error("Error al generar factura de pago por actividad:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};
