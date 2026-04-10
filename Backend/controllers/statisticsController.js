const { getDashboardCardsStats } = require("../models/statisticsModel");

exports.getDashboardCardsStats = async (_req, res) => {
  try {
    const stats = await getDashboardCardsStats();

    return res.status(200).json({
      message: "Estadisticas del dashboard obtenidas correctamente.",
      data: stats,
    });
  } catch (error) {
    console.error("Error al obtener estadisticas del dashboard:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};
