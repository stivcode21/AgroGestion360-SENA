const {
  createRequest,
  getRequestById,
  updateRequest,
  deleteRequestModel,
  getRequestsList,
} = require("../models/requestModel");

exports.listRequests = async (req, res) => {
  try {
    const result = await getRequestsList();

    res.json({
      data: result.requests,
    });
  } catch (error) {
    console.error("Error al listar solicitudes:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

exports.postRequest = async (req, res) => {
  try {
    const {
      titulo,
      motivo,
      id_tipo_insumo,
      cantidad,
      especie_destino,
      unidad_medida,
      proveedor,
      fecha_vencimiento,
    } = req.body;

    if (!titulo || !motivo || !id_tipo_insumo || !cantidad) {
      return res.status(400).json({
        message: "titulo, motivo, id_tipo_insumo y cantidad son obligatorios.",
      });
    }

    const newRequest = await createRequest({
      titulo,
      motivo,
      id_tipo_insumo,
      cantidad,
      especie_destino,
      unidad_medida,
      proveedor,
      fecha_vencimiento,
    });

    return res.status(201).json({
      message: "Solicitud creada correctamente.",
      data: newRequest,
    });
  } catch (error) {
    console.error("Error al crear solicitud:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

exports.getRequest = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "ID de solicitud invalido." });
    }

    const request = await getRequestById(id);
    if (!request) {
      return res.status(404).json({ message: "Solicitud no encontrada." });
    }

    return res.status(200).json({
      message: "Solicitud encontrada.",
      data: request,
    });
  } catch (error) {
    console.error("Error al obtener solicitud:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

exports.editRequest = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "ID de solicitud invalido." });
    }

    const existing = await getRequestById(id);
    if (!existing) {
      return res.status(404).json({ message: "Solicitud no encontrada." });
    }

    const updated = await updateRequest(id, {
      ...existing,
      ...req.body,
      titulo: req.body.titulo?.trim() ?? existing.titulo,
      motivo: req.body.motivo?.trim() ?? existing.motivo,
    });

    return res.status(200).json({
      message: "Solicitud actualizada correctamente.",
      data: updated,
    });
  } catch (error) {
    console.error("Error al editar solicitud:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

exports.deleteRequest = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "ID de solicitud invalido." });
    }

    const deleted = await deleteRequestModel(id);

    if (!deleted) {
      return res.status(404).json({ message: "Solicitud no encontrada." });
    }

    return res.status(200).json({
      message: "Solicitud eliminada correctamente.",
      id_solicitud: deleted.id_solicitud,
    });
  } catch (error) {
    console.error("Error al eliminar solicitud:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};
