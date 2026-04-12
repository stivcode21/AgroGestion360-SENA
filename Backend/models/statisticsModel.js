const db = require("../config/db");

exports.getDashboardCardsStats = async () => {
  const [
    inventoryResult,
    workersResult,
    activitiesResult,
    ganaderiaResult,
  ] = await Promise.all([
    db.query("SELECT COUNT(*) AS total FROM inventario"),
    db.query("SELECT COUNT(*) AS total FROM trabajadores"),
    db.query("SELECT COUNT(*) AS total FROM actividades"),
    db.query("SELECT COUNT(*) AS total FROM ganaderia"),
  ]);

  return {
    inventario: Number(inventoryResult.rows[0].total || 0),
    trabajadores: Number(workersResult.rows[0].total || 0),
    actividades: Number(activitiesResult.rows[0].total || 0),
    ganaderia: Number(ganaderiaResult.rows[0].total || 0),
  };
};

exports.getDashboardOverviewStats = async () => {
  const activityPaymentsQuery = `
    SELECT
      EXTRACT(DOW FROM a.fecha_creacion)::int AS day_index,
      COUNT(*)::int AS total
    FROM actividades a
    JOIN estado_actividades e
      ON a.id_estado = e.id_estado
    WHERE LOWER(e.nombre) = 'completada'
      AND a.fecha_creacion IS NOT NULL
    GROUP BY day_index
  `;

  const totalAssetsQuery = `
    SELECT COALESCE(SUM(i.cantidad * i.precio_unitario), 0) AS total
    FROM inventario i
  `;

  const topWorkersQuery = `
    SELECT
      t.id_trabajador,
      t.nombre_completo,
      t.url_img,
      COUNT(a.id_registro)::int AS total_actividades
    FROM trabajadores t
    JOIN actividades a
      ON t.id_trabajador = a.id_trabajador
    GROUP BY t.id_trabajador, t.nombre_completo, t.url_img
    ORDER BY total_actividades DESC, t.nombre_completo ASC
    LIMIT 5
  `;

  const [activitiesResult, totalAssetsResult, topWorkersResult] =
    await Promise.all([
      db.query(activityPaymentsQuery),
      db.query(totalAssetsQuery),
      db.query(topWorkersQuery),
    ]);

  const dayLabels = {
    1: "Lun",
    2: "Mar",
    3: "Mie",
    4: "Jue",
    5: "Vie",
    6: "Sab",
    0: "Dom",
  };

  const dayOrder = [1, 2, 3, 4, 5, 6, 0];
  const totalsByDay = new Map(
    activitiesResult.rows.map((row) => [Number(row.day_index), Number(row.total)]),
  );

  const activitySeries = dayOrder.map((day) => ({
    day: dayLabels[day],
    total: totalsByDay.get(day) ?? 0,
  }));

  return {
    activityPayments: {
      total: activitySeries.reduce((sum, item) => sum + item.total, 0),
      series: activitySeries,
    },
    totalAssets: {
      value: Number(totalAssetsResult.rows[0].total || 0),
    },
    topWorkers: topWorkersResult.rows,
  };
};
