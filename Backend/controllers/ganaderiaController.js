const {
  getGanaderiaPaginated,
  getGanaderiaById,
  updateGanaderia,
  deleteGanaderia,
  filterGanaderiaPaginated,
  createGanaderia,
  getVacunasByAnimalId,
  sellGanaderia,
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
      vacunas,
    } = req.body;

    if (!tipo || !peso_inicial || !estado_salud) {
      return res.status(400).json({
        message: "tipo, peso_inicial y estado_salud son obligatorios.",
      });
    }

    const newGanado = await createGanaderia({
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
      vacunas: Array.isArray(vacunas) ? vacunas : [],
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
    const vacunas = await getVacunasByAnimalId(id);

    if (!animal) {
      return res.status(404).json({ message: "Animal no encontrado." });
    }

    return res.status(200).json({
      message: "Animal encontrado.",
      data: animal,
      vacunas,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

exports.listVacunasByAnimal = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "ID inválido." });
    }

    const animal = await getGanaderiaById(id);

    if (!animal) {
      return res.status(404).json({ message: "Animal no encontrado." });
    }

    const vacunas = await getVacunasByAnimalId(id);

    return res.status(200).json({
      message: "Vacunaciones encontradas.",
      data: vacunas,
    });
  } catch (error) {
    if (error.message === "INVALID_VACCINATION_DATA") {
      return res.status(400).json({
        message:
          "Cada vacunacion debe incluir tipo, dosis y responsable.",
      });
    }

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
      vacunas: Array.isArray(req.body.vacunas) ? req.body.vacunas : [],
    });

    return res.status(200).json({
      message: "Animal actualizado correctamente.",
      data: updated,
    });
  } catch (error) {
    if (error.message === "INVALID_VACCINATION_DATA") {
      return res.status(400).json({
        message:
          "Cada vacunacion debe incluir tipo, dosis y responsable.",
      });
    }

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

    const deleted = await deleteGanaderia(id);

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
    const { tipo, orden, estado, search } = req.query;

    const result = await filterGanaderiaPaginated(
      page,
      tipo,
      orden,
      estado,
      search,
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

exports.sellGanaderia = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { comprador, monto_total, observaciones } = req.body;

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "ID inválido." });
    }

    if (!String(comprador ?? "").trim() || !String(monto_total ?? "").trim()) {
      return res.status(400).json({
        message: "comprador y monto_total son obligatorios.",
      });
    }

    const sale = await sellGanaderia({
      id_animal: id,
      comprador: String(comprador).trim(),
      monto_total: Number(monto_total),
      observaciones: String(observaciones ?? "").trim() || null,
    });

    return res.status(201).json({
      message: "Venta registrada correctamente.",
      data: sale,
    });
  } catch (error) {
    if (error.message === "ANIMAL_NOT_FOUND") {
      return res.status(404).json({ message: "Animal no encontrado." });
    }

    if (error.message === "ANIMAL_ALREADY_SOLD") {
      return res.status(409).json({ message: "Este animal ya fue vendido." });
    }

    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};
