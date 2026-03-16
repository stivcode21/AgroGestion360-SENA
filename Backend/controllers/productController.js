const {
  getProductsPaginated,
  createProduct,
  getProductById,
  updateProduct,
  deleteProductModel,
  filterProductsPaginatedModel,
} = require("../models/productModel");

exports.listProducts = async (req, res) => {
  try {
    const page = parseInt(req.params.page, 10) || 1;
    const limit = 10;

    const result = await getProductsPaginated(page);

    res.json({
      page,
      limit,
      total: result.total,
      totalPages: Math.ceil(result.total / limit),
      data: result.products,
    });
  } catch (error) {
    console.error("Error al listar productos:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

exports.postProduct = async (req, res) => {
  try {
    const {
      nombre,
      id_tipo,
      marca,
      cantidad,
      fecha_vencimiento,
      unidad_medida,
      proveedor,
      precio_unitario,
      observaciones,
    } = req.body;

    if (!nombre || !cantidad || !precio_unitario) {
      return res.status(400).json({
        message:
          "id_tipo, nombre, cantidad y precio_unitario son obligatorios.",
      });
    }

    const newProduct = await createProduct({
      nombre: nombre.trim(),
      id_tipo,
      marca,
      cantidad,
      fecha_vencimiento,
      unidad_medida,
      proveedor,
      precio_unitario,
      observaciones,
    });

    return res.status(201).json({
      message: "Producto creado correctamente.",
      data: newProduct,
    });
  } catch (error) {
    console.error("Error al crear producto:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "ID de producto invalido." });
    }

    const product = await getProductById(id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    return res.status(200).json({
      message: "Producto encontrado.",
      data: product,
    });
  } catch (error) {
    console.error("Error al editar producto:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

exports.editProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "ID de producto invalido." });
    }

    const existing = await getProductById(id);
    if (!existing) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    // se pasan los datos existentes y luego sobre escribimo con los datos del body
    const updated = await updateProduct(id, {
      ...existing,
      ...req.body,
      nombre: req.body.nombre?.trim() ?? existing.nombre,
    });

    return res.status(200).json({
      message: "Producto actualizado correctamente.",
      data: updated,
    });
  } catch (error) {
    console.error("Error al editar producto:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "ID de producto invalido." });
    }

    const deleted = await deleteProductModel(id);

    if (!deleted) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    return res.status(200).json({
      message: "Producto eliminado correctamente.",
      id_insumo: deleted.id_insumo,
    });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

exports.filterProductsPaginated = async (req, res) => {
  try {
    const page = parseInt(req.params.page, 10) || 1;
    const { tipo, orden } = req.query;

    const result = await filterProductsPaginatedModel(page, tipo, orden);

    res.json({
      page,
      limit: result.limit,
      total: result.total,
      totalPages: Math.ceil(result.total / result.limit),
      data: result.products,
    });
  } catch (error) {
    console.error("Error al filtrar productos:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};
