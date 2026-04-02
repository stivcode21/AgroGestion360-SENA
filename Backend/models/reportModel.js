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
