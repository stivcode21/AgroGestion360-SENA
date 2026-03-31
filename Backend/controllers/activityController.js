const {
  getActivitiesPaginated,
  getActivityById,
  updateActivity,
  deleteActivity,
  filterActivitiesPaginatedModel,
  createActivity,
} = require("../models/activityModel");

// 🔹 LISTAR
exports.listActivities = async (req, res) => {
  try {
    const page = parseInt(req.params.page, 10) || 1;
    const limit = 10;

    const result = await getActivitiesPaginated(page);

    return res.status(200).json({
      page,
      limit,  
      total: result.total,
      totalPages: Math.ceil(result.total / limit),
      data: result.activities,
    });
  } catch (error) {
    console.error("Error al listar actividades:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

// 🔹 CREAR
exports.createActivity = async (req, res) => {
  try {
    const {
      id_trabajador,
      duracion,
      actividad,
      id_estado,
      url_evidencia,
      fecha_inicio,
      monto,
      observaciones,
      
    } = req.body;

    if (!id_trabajador || !id_estado || !monto) {
      return res.status(400).json({
        message: "id_trabajador, id_estado y monto son obligatorios.",
      });
    }

    const newActivity = await createActivity({
      id_trabajador,
      duracion,
      actividad,
      id_estado,
      url_evidencia,
      fecha_inicio,
      monto,
      observaciones,
    });

    return res.status(201).json({
      message: "Actividad creada correctamente.",
      data: newActivity,
    });
  } catch (error) {
    console.error("Error al crear actividad:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

// 🔹 OBTENER POR ID
exports.getActivity = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "ID inválido." });
    }

    const activity = await getActivityById(id);

    if (!activity) {
      return res.status(404).json({ message: "Actividad no encontrada." });
    }

    return res.status(200).json({
      message: "Actividad encontrada.",
      data: activity,
    });
  } catch (error) {
    console.error("Error al obtener actividad:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

// 🔹 EDITAR
exports.editActivity = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "ID inválido." });
    }

    const existing = await getActivityById(id);

    if (!existing) {
      return res.status(404).json({ message: "Actividad no encontrada." });
    }

    const updated = await updateActivity(id, {
      ...existing,
      ...req.body,
    });

    return res.status(200).json({
      message: "Actividad actualizada correctamente.",
      data: updated,
    });
    
  } catch (error) {
    console.error("Error al editar actividad:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

// 🔹 ELIMINAR
exports.deleteActivity = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "ID inválido." });
    }

    const deleted = await deleteActivity(id);

    if (!deleted) {
      return res.status(404).json({ message: "Actividad no encontrada." });
    }

    return res.status(200).json({
      message: "Actividad eliminada correctamente.",
      id: deleted.id_registro,
    });
  } catch (error) {
    console.error("Error al eliminar actividad:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

exports.filterActivitiesPaginated = async (req, res) => {
  try {
    const page = parseInt(req.params.page, 10) || 1;
    const { tipo, orden, search } = req.query;

    const result = await filterActivitiesPaginatedModel(
      page,
      tipo,
      orden,
      search
    );

    res.json({
      page,
      limit: result.limit,
      total: result.total,
      totalPages: Math.ceil(result.total / result.limit),
      data: result.activities,
    });
  } catch (error) {
    console.error("Error al filtrar actividades:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};
