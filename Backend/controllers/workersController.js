const {
  getWorkersPaginated,
  getWorkerById,
  updateWorker,
  deleteWorker,
  filterWorkersPaginated,
  registerWorker,
} = require("../models/workersModel");

// 🔹 LISTAR
exports.listWorkers = async (req, res) => {
  try {
    const page = parseInt(req.params.page, 10) || 1;
    const limit = 10;
    const result = await getWorkersPaginated(page);

    return res.status(200).json({
      page,
      limit,
      total: result.total,
      totalPages: Math.ceil(result.total / limit),
      data: result.workers,
    });
  } catch (error) {
    console.error("Error al listar trabajadores:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

// 🔹 CREAR
exports.registerWorkers = async (req, res) => {
  try {
    const {
      nombre_completo,
      id_tipo_documento,
      numero_documento,
      celular,
      id_tipo_trabajador,
      direccion,
      observaciones,
      estado,
      edad,
      url_img,
    } = req.body;

    // 🔥 Validación correcta (evita NaN)
    if (
      !nombre_completo ||
      !numero_documento ||
      estado === undefined ||
      isNaN(Number(id_tipo_documento)) ||
      isNaN(Number(id_tipo_trabajador))
    ) {
      return res.status(400).json({
        message:
          "Datos inválidos: nombre_completo, numero_documento, id_tipo_documento, id_tipo_trabajador y estado son obligatorios y deben ser válidos.",
      });
    }

    const estadoParsed = estado === true || estado === "true";

    const newWorker = await registerWorker({
      nombre_completo,
      id_tipo_documento: Number(id_tipo_documento),
      url_img: url_img || null,
      numero_documento,
      celular: celular || null,
      id_tipo_trabajador: Number(id_tipo_trabajador),
      direccion: direccion || null,
      observaciones: observaciones || null,
      estado: estadoParsed,
      edad: edad ? Number(edad) : null,
    });

    return res.status(201).json({
      message: "Trabajador creado correctamente.",
      data: newWorker,
    });
  } catch (error) {
    console.error("Error al crear trabajador:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

// 🔹 OBTENER POR ID
exports.getWorkersById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "ID inválido." });
    }

    const worker = await getWorkerById(id);
    if (!worker) {
      return res.status(404).json({ message: "Trabajador no encontrado." });
    }

    return res.status(200).json({
      message: "Trabajador encontrado.",
      data: worker,
    });
  } catch (error) {
    console.error("Error al obtener trabajador:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

// 🔹 EDITAR
exports.editWorkers = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "ID inválido." });
    }

    const existing = await getWorkerById(id);
    if (!existing) {
      return res.status(404).json({ message: "Trabajador no encontrado." });
    }

    const updatedData = {
      nombre_completo: req.body.nombre_completo ?? existing.nombre_completo,
      id_tipo_documento: !isNaN(Number(req.body.id_tipo_documento))
        ? Number(req.body.id_tipo_documento)
        : existing.id_tipo_documento,
      numero_documento: req.body.numero_documento ?? existing.numero_documento,
      celular: req.body.celular ?? existing.celular,
      id_tipo_trabajador: !isNaN(Number(req.body.id_tipo_trabajador))
        ? Number(req.body.id_tipo_trabajador)
        : existing.id_tipo_trabajador,
      direccion: req.body.direccion ?? existing.direccion,
      observaciones: req.body.observaciones ?? existing.observaciones,
      estado:
        req.body.estado !== undefined
          ? req.body.estado === true || req.body.estado === "true"
          : existing.estado,
      edad: req.body.edad ? Number(req.body.edad) : existing.edad,
      url_img: req.body.url_img ?? existing.url_img,
    };

    const updated = await updateWorker(id, updatedData);

    return res.status(200).json({
      message: "Trabajador actualizado correctamente.",
      data: updated,
    });
  } catch (error) {
    console.error("Error al editar trabajador:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

// 🔹 ELIMINAR
exports.deleteWorkers = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "ID inválido." });
    }

    const deleted = await deleteWorker(id);
    if (!deleted) {
      return res.status(404).json({ message: "Trabajador no encontrado." });
    }

    return res.status(200).json({
      message: "Trabajador eliminado correctamente.",
      id: deleted.id_trabajador,
    });
  } catch (error) {
    console.error("Error al eliminar trabajador:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

// 🔹 FILTRAR + PAGINADO
exports.filterWorkersPaginated = async (req, res) => {
  try {
    const page = parseInt(req.params.page, 10) || 1;
    const { tipo, orden, search } = req.query;

    const result = await filterWorkersPaginated(page, tipo, orden, search);

    return res.status(200).json({
      page,
      limit: result.limit,
      total: result.total,
      totalPages: Math.ceil(result.total / result.limit),
      data: result.workers,
    });
  } catch (error) {
    console.error("Error al filtrar trabajadores:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};
