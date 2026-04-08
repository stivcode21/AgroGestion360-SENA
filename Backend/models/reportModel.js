const db = require("../config/db");

exports.getInventoryReportRows = async ({ fechaInicio }) => {
  // Trae el stock actual y resume el consumo de cada insumo desde la fecha base.
  const query = `
    SELECT
      i.id_insumo,
      t.nombre AS categoria,
      i.cantidad AS stock_actual,
      COALESCE(SUM(c.cantidad), 0) AS total_consumido,
      MAX(c.fecha_registro) AS ultimo_consumo
    FROM inventario i
    JOIN tipo_insumo t
      ON i.id_tipo = t.id_tipo
    LEFT JOIN consumo_insumo c
      ON c.id_insumo = i.id_insumo
      AND c.fecha_registro >= $1::date
    GROUP BY
      i.id_insumo,
      t.nombre,
      i.cantidad
    ORDER BY i.id_insumo
  `;

  const { rows } = await db.query(query, [fechaInicio]);
  return rows;
};

exports.getPayrollReportRows = async ({ fechaInicio }) => {
  // Consolida por trabajador las actividades pagadas y el total abonado en el periodo.
  const query = `
    SELECT
      t.id_trabajador,
      t.nombre_completo,
      t.numero_documento,
      COUNT(a.id_registro) AS total_actividades_realizadas,
      COALESCE(SUM(a.monto), 0) AS pago_total
    FROM trabajadores t
    LEFT JOIN actividades a
      ON a.id_trabajador = t.id_trabajador
      AND a.id_estado = 2
      AND a.fecha_inicio >= $1::date
    GROUP BY
      t.id_trabajador,
      t.nombre_completo,
      t.numero_documento
    ORDER BY t.id_trabajador
  `;

  const { rows } = await db.query(query, [fechaInicio]);
  return rows;
};

exports.getActivityPaymentInvoiceRow = async ({ idActividad }) => {
  const query = `
    SELECT
      a.id_registro,
      a.actividad,
      a.monto,
      t.id_trabajador,
      t.nombre_completo,
      t.numero_documento,
      t.rol
    FROM actividades a
    JOIN trabajadores t
      ON a.id_trabajador = t.id_trabajador
    WHERE a.id_registro = $1
    LIMIT 1
  `;

  const { rows } = await db.query(query, [idActividad]);
  return rows[0] || null;
};
