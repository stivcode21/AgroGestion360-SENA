const {
  getGanaderiaPaginated,
  getGanaderiaById,
  updateGanaderia,
  deleteGanaderia: deleteGanaderiaModel,
  filterGanaderiaPaginatedModel,
  createGanaderia: createGanaderiaModel,
} = require("../models/ganaderiaModel");

// LISTAR
exports.listGanaderia = async (req, res) => {
  try {
    const page = parseInt(req.params.page, 10) || 1;
    const limit = 10;

    const result = await getGanaderiaPaginated(page);

    return res.status(200).json({
      page,
      limit,
      total: result.total,
      totalPages: Math.ceil(result.total / limit),
      data: result.ganaderia,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

// CREAR
exports.createGanaderia = async (req, res) => {
  try {
    const {
      nombre,
      tipo,
      fecha_ingreso,
      estado_salud,
      origen_ciudad,
      fecha_nacimiento,
      peso_inicial,
      observaciones,
      url_img,
      raza, 
      vendido,
    } = req.body;

    if (!tipo || !peso_inicial || !estado_salud) {
      return res.status(400).json({
        message: "tipo, peso_inicial y estado_salud son obligatorios.",
      });
    }

    const newGanado = await createGanaderiaModel({
      nombre,
      tipo,
      fecha_ingreso,
      estado_salud,
      origen_ciudad,
      fecha_nacimiento,
      peso_inicial,
      observaciones,
      url_img,
      raza,
      vendido,
    });

    return res.status(201).json({
      message: "Animal registrado correctamente.",
      data: newGanado,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

// OBTENER
exports.getGanaderia = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "ID inválido." });
    }

    const animal = await getGanaderiaById(id);

    if (!animal) {
      return res.status(404).json({ message: "Animal no encontrado." });
    }

    return res.status(200).json({
      message: "Animal encontrado.",
      data: animal,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

// EDITAR
exports.editGanaderia = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "ID inválido." });
    }

    const existing = await getGanaderiaById(id);

    if (!existing) {
      return res.status(404).json({ message: "Animal no encontrado." });
    }

    const updated = await updateGanaderia(id, {
      ...existing,
      ...req.body,
    });

    return res.status(200).json({
      message: "Animal actualizado correctamente.",
      data: updated,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

// ELIMINAR
exports.deleteGanaderia = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "ID inválido." });
    }

    const deleted = await deleteGanaderiaModel(id);

    if (!deleted) {
      return res.status(404).json({ message: "Animal no encontrado." });
    }

    return res.status(200).json({
      message: "Animal eliminado correctamente.",
      id: deleted.id_animal,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

// FILTRO
exports.filterGanaderiaPaginated = async (req, res) => {
  try {
    const page = parseInt(req.params.page, 10) || 1;
    const { tipo, estado, search } = req.query;

    const result = await filterGanaderiaPaginatedModel(
      page,
      tipo,
      estado,
      search
    );

    res.json({
      page,
      limit: result.limit,
      total: result.total,
      totalPages: Math.ceil(result.total / result.limit),
      data: result.ganaderia,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};
