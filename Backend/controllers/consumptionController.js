const {
  getConsumptionByActivityId,
  createConsumptionItems,
  replaceConsumptionItemsByActivity,
} = require("../models/consumptionModel");
const { getProductById } = require("../models/productModel");

// Convierte los datos del body a numeros y descarta items sin id valido.
const normalizeItems = (items = []) =>
  items
    .map((item) => ({
      id_insumo: Number(item.id_insumo),
      cantidad: Number(item.cantidad),
    }))
    .filter((item) => !Number.isNaN(item.id_insumo));

// validamos el stock disponible
const validateStockAvailability = async (items = []) => {
  const requestedByProduct = new Map();

  // Suma cantidades repetidas del mismo insumo antes de validar el stock.
  items.forEach((item) => {
    const previous = requestedByProduct.get(item.id_insumo) ?? 0;
    requestedByProduct.set(item.id_insumo, previous + item.cantidad);
  });

  for (const [idInsumo, requested] of requestedByProduct.entries()) {
    const stockItem = await getProductById(idInsumo);

    if (!stockItem) {
      return `El insumo ${idInsumo} no existe en inventario.`;
    }

    const available = Number(stockItem.cantidad ?? 0);

    if (requested > available) {
      return `El insumo ${stockItem.nombre} solo tiene ${available} unidades disponibles.`;
    }
  }

  return null;
};

// obtiene los cosumos de productos relacionados a id de la actividad
exports.getConsumptionByActivity = async (req, res) => {
  try {
    const activityId = parseInt(req.params.id, 10);

    if (Number.isNaN(activityId)) {
      return res.status(400).json({ message: "ID de actividad inválido." });
    }

    const consumptions = await getConsumptionByActivityId(activityId);

    return res.status(200).json({
      message: "Consumos encontrados.",
      data: consumptions,
    });
  } catch (error) {
    console.error("Error al obtener consumos:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

exports.createConsumption = async (req, res) => {
  try {
    const id_actividad = Number(req.body.id_actividad);
    const id_responsable = Number(req.body.id_responsable);
    const items = normalizeItems(req.body.items);

    // No deja crear consumos vacios o con ids invalidos.
    if (
      Number.isNaN(id_actividad) ||
      Number.isNaN(id_responsable) ||
      items.length === 0
    ) {
      return res.status(400).json({
        message:
          "id_actividad, id_responsable y al menos un insumo son obligatorios.",
      });
    }

    const hasInvalidQuantity = items.some(
      (item) => Number.isNaN(item.cantidad) || item.cantidad <= 0,
    );

    if (hasInvalidQuantity) {
      return res.status(400).json({
        message: "Cada insumo debe tener una cantidad válida.",
      });
    }

    const stockError = await validateStockAvailability(items);

    if (stockError) {
      return res.status(400).json({ message: stockError });
    }

    // Si todo esta bien, guarda todos los items en una sola operacion.
    const createdItems = await createConsumptionItems({
      id_actividad,
      id_responsable,
      items,
    });

    return res.status(201).json({
      message: "Consumo registrado correctamente.",
      data: createdItems,
    });
  } catch (error) {
    console.error("Error al crear consumo:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

exports.updateConsumptionByActivity = async (req, res) => {
  try {
    const id_actividad = parseInt(req.params.id, 10);
    const id_responsable = Number(req.body.id_responsable);
    const items = normalizeItems(req.body.items);

    if (Number.isNaN(id_actividad) || Number.isNaN(id_responsable)) {
      return res.status(400).json({
        message: "id_actividad e id_responsable son obligatorios.",
      });
    }

    const hasInvalidQuantity = items.some(
      (item) => Number.isNaN(item.cantidad) || item.cantidad <= 0,
    );

    if (hasInvalidQuantity) {
      return res.status(400).json({
        message: "Cada insumo debe tener una cantidad válida.",
      });
    }

    const stockError = await validateStockAvailability(items);

    if (stockError) {
      return res.status(400).json({ message: stockError });
    }

    // Reemplaza por completo los consumos actuales de la actividad.
    const updatedItems = await replaceConsumptionItemsByActivity({
      id_actividad,
      id_responsable,
      items,
    });

    return res.status(200).json({
      message:
        updatedItems.length > 0
          ? "Consumo actualizado correctamente."
          : "Consumo limpiado correctamente.",
      data: updatedItems,
    });
  } catch (error) {
    console.error("Error al actualizar consumo:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};
