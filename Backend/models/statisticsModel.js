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
