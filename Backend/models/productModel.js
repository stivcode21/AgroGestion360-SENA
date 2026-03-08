const db = require("../config/db");

exports.getProductsPaginated = async (page) => {
  const limit = 10;
  const offset = (page - 1) * limit;

  const productsQuery = `
      SELECT
        i.id_insumo,
        t.nombre AS tipo,
        i.nombre,
        i.marca,
        i.cantidad,
        i.fecha_registro,
        i.fecha_vencimiento,
        i.unidad_medida,
        i.proveedor,
        i.precio_unitario,
        i.observaciones
      FROM inventario i
      JOIN tipo_insumo t
      ON i.id_tipo = t.id_tipo
      ORDER BY i.id_insumo
      LIMIT $1 OFFSET $2
  `;

  const countQuery = `
    SELECT COUNT(*) FROM inventario
  `;

  const products = await db.query(productsQuery, [limit, offset]);
  const total = await db.query(countQuery);

  return {
    products: products.rows,
    total: parseInt(total.rows[0].count),
  };
};

exports.createProduct = async (productData) => {
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
  } = productData;

  const query = `
    INSERT INTO inventario (
      nombre,
      id_tipo,
      marca,
      cantidad,
      fecha_vencimiento,
      unidad_medida,
      proveedor,
      precio_unitario,
      observaciones
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `;

  const values = [
    nombre,
    id_tipo,
    marca ?? null,
    cantidad,
    fecha_vencimiento ?? null,
    unidad_medida ?? null,
    proveedor ?? null,
    precio_unitario,
    observaciones ?? null,
  ];

  const { rows } = await db.query(query, values);
  return rows[0];
};

exports.getProductById = async (id) => {
  const query = `
    SELECT
        i.id_insumo,
        t.nombre AS tipo,
        i.nombre,
        i.marca,
        i.cantidad,
        i.fecha_registro,
        i.fecha_vencimiento,
        i.unidad_medida,
        i.proveedor,
        i.precio_unitario,
        i.observaciones
      FROM inventario i
      JOIN tipo_insumo t
      ON i.id_tipo = t.id_tipo WHERE i.id_insumo = $1
  `;

  const { rows } = await db.query(query, [id]);
  return rows[0] || null;
};

exports.updateProduct = async (id, productData) => {
  const {
    id_tipo,
    nombre,
    marca,
    cantidad,
    fecha_vencimiento,
    unidad_medida,
    proveedor,
    precio_unitario,
    observaciones,
  } = productData;

  const query = `
    UPDATE inventario
    SET
      id_tipo = $1,
      nombre = $2,
      marca = $3,
      cantidad = $4,
      fecha_vencimiento = $5,
      unidad_medida = $6,
      proveedor = $7,
      precio_unitario = $8,
      observaciones = $9
    WHERE id_insumo = $10
    RETURNING *
  `;

  const values = [
    id_tipo,
    nombre,
    marca ?? null,
    cantidad,
    fecha_vencimiento ?? null,
    unidad_medida ?? null,
    proveedor ?? null,
    precio_unitario,
    observaciones ?? null,
    id,
  ];

  const { rows } = await db.query(query, values);
  return rows[0] || null;
};

exports.deleteProduct = async (id) => {
  const query = `
    DELETE FROM inventario
    WHERE id_insumo = $1
    RETURNING id_insumo
  `;

  const { rows } = await db.query(query, [id]);
  return rows[0] || null;
};
