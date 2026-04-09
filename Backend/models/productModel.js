const db = require("../config/db");

exports.getProductsPaginated = async (page) => {
  const limit = 10;
  const offset = (page - 1) * limit;

  const productsQuery = `
      SELECT
        i.id_insumo,
        i.id_tipo,
        t.nombre AS tipo,
        i.nombre,
        i.url_img,
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

exports.getTipoInsumo = async () => {
  const query = `
    SELECT
      id_tipo AS id,
      nombre
    FROM tipo_insumo
    ORDER BY id_tipo
  `;

  const { rows } = await db.query(query);
  return rows;
};

exports.createProduct = async (productData) => {
  const {
    nombre,
    id_tipo,
    url_img,
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
      url_img,
      marca,
      cantidad,
      fecha_vencimiento,
      unidad_medida,
      proveedor,
      precio_unitario,
      observaciones
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *
  `;

  const values = [
    nombre,
    id_tipo,
    url_img ?? null,
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
        i.id_tipo,
        t.nombre AS tipo,
        i.nombre,
        i.url_img,
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
    url_img,
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
      url_img = $3,
      marca = $4,
      cantidad = $5,
      fecha_vencimiento = $6,
      unidad_medida = $7,
      proveedor = $8,
      precio_unitario = $9,
      observaciones = $10
    WHERE id_insumo = $11
    RETURNING *
  `;

  const values = [
    id_tipo,
    nombre,
    url_img ?? null,
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

exports.deleteProductModel = async (id) => {
  const query = `
    DELETE FROM inventario
    WHERE id_insumo = $1
    RETURNING id_insumo
  `;

  const { rows } = await db.query(query, [id]);
  return rows[0] || null;
};

exports.filterProductsPaginatedModel = async (page, tipo, orden, search) => {
  const limit = 10;
  const offset = (page - 1) * limit;

  let baseQuery = `
    FROM inventario i
    JOIN tipo_insumo t
    ON i.id_tipo = t.id_tipo
  `;

  const values = [];
  const condiciones = [];

  if (tipo) {
    values.push(tipo);
    condiciones.push(`i.id_tipo = $${values.length}`);
  }

  if (search?.trim()) {
    values.push(`%${search.trim()}%`);
    condiciones.push(
      `(i.nombre ILIKE $${values.length} OR i.marca ILIKE $${values.length})`,
    );
  }

  if (condiciones.length > 0) {
    baseQuery += ` WHERE ` + condiciones.join(" AND ");
  }

  let orderClause = ` ORDER BY i.id_insumo`;

  if (orden === "recientes") {
    orderClause = ` ORDER BY i.fecha_registro DESC`;
  }

  if (orden === "az") {
    orderClause = ` ORDER BY i.nombre ASC`;
  }

  const productsQuery = `
    SELECT
      i.id_insumo,
      i.id_tipo,
      t.nombre AS tipo,
      i.nombre,
      i.url_img,
      i.marca,
      i.cantidad,
      i.fecha_registro,
      i.fecha_vencimiento,
      i.unidad_medida,
      i.proveedor,
      i.precio_unitario,
      i.observaciones
    ${baseQuery}
    ${orderClause}
    LIMIT $${values.length + 1} OFFSET $${values.length + 2}
  `;

  const countQuery = `
    SELECT COUNT(*) AS total
    ${baseQuery}
  `;

  const products = await db.query(productsQuery, [...values, limit, offset]);
  const total = await db.query(countQuery, values);

  return {
    products: products.rows,
    total: parseInt(total.rows[0].total, 10),
    limit,
  };
};
