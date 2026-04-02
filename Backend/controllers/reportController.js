const { getInventoryReportRows } = require("../models/reportModel");

const toIsoDate = (date) => date.toISOString().split("T")[0];

const getDefaultRange = () => {
  const today = new Date();
  const start = new Date(today);
  // El reporte siempre se calcula tomando los ultimos 6 meses.
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
        { header: "Categoria", key: "categoria" },
        { header: "Stock actual", key: "stock_actual" },
        { header: "Consumido", key: "total_consumido" },
        { header: "Ultimo consumo", key: "ultimo_consumo" },
      ],
      rows: inventoryRows.map((row) => ({
        // Cada fila se adapta al formato exacto que espera la plantilla PDF.
        codigo: `PRD-${row.id_insumo}`,
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
