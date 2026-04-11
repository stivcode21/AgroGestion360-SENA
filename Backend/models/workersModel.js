const db = require("../config/db");

const LIMIT = 10;

// PAGINADO
exports.getWorkersPaginated = async (page) => {
  const pageNumber = parseInt(page, 10) || 1;
  const offset = (pageNumber - 1) * LIMIT;

  const query = `
    SELECT
      t.id_trabajador,
      t.nombre_completo,
      t.url_img,
      t.numero_documento,
      t.celular,
      t.direccion,
      t.observaciones,
      t.fecha_registro,
      t.estado,
      t.edad,
      t.rol,
      t.id_tipo_documento,
      td.nombre AS tipo_documento
    FROM trabajadores t
    JOIN tipo_documento td
      ON t.id_tipo_documento = td.id_tipo
    ORDER BY t.id_trabajador
    LIMIT $1 OFFSET $2
  `;

  const countQuery = `SELECT COUNT(*) AS total FROM trabajadores`;

  try {
    const result = await db.query(query, [LIMIT, offset]);
    const total = await db.query(countQuery);

    return {
      workers: result.rows,
      total: parseInt(total.rows[0].total, 10),
      limit: LIMIT,
    };
  } catch (error) {
    console.error("DB Error:", error);
    throw new Error("Error en la base de datos");
  }
};

// CREAR
exports.registerWorker = async (workerData) => {
  const {
    nombre_completo,
    id_tipo_documento,
    url_img,
    numero_documento,
    celular,
    rol,
    direccion,
    observaciones,
    estado,
    edad,
  } = workerData;

  const estadoParsed = estado === true || estado === "true";

  const query = `
    INSERT INTO trabajadores (
      nombre_completo,
      id_tipo_documento,
      url_img,
      numero_documento,
      celular,
      rol,
      direccion,
      observaciones,
      estado,
      edad,
      fecha_registro
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW())
    RETURNING *
  `;

  const values = [
    nombre_completo,
    Number(id_tipo_documento),
    url_img || null,
    numero_documento,
    celular || null,
    rol,
    direccion || null,
    observaciones || null,
    estadoParsed,
    edad ? Number(edad) : null,
  ];

  try {
    const { rows } = await db.query(query, values);
    return rows[0];
  } catch (error) {
    console.error("DB Error:", error);
    throw new Error("Error en la base de datos");
  }
};

// OBTENER POR ID
exports.getWorkerById = async (id) => {
  const query = `
    SELECT
      t.id_trabajador,
      t.nombre_completo,
      t.url_img,
      t.numero_documento,
      t.celular,
      t.direccion,
      t.observaciones,
      t.fecha_registro,
      t.estado,
      t.edad,
      t.rol,
      t.id_tipo_documento,
      td.nombre AS tipo_documento
    FROM trabajadores t
    JOIN tipo_documento td
      ON t.id_tipo_documento = td.id_tipo
    WHERE t.id_trabajador = $1
  `;

  try {
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  } catch (error) {
    console.error("DB Error:", error);
    throw new Error("Error en la base de datos");
  }
};

// ACTUALIZAR
exports.updateWorker = async (id, data) => {
  const {
    nombre_completo,
    url_img,
    id_tipo_documento,
    numero_documento,
    celular,
    rol,
    direccion,
    observaciones,
    estado,
    edad,
  } = data;

  const estadoParsed = estado === true || estado === "true";

  const query = `
    UPDATE trabajadores
    SET
      nombre_completo = $1,
      url_img = $2,
      id_tipo_documento = $3,
      numero_documento = $4,
      celular = $5,
      rol = $6,
      direccion = $7,
      observaciones = $8,
      estado = $9,
      edad = $10
    WHERE id_trabajador = $11
    RETURNING *
  `;

  const values = [
    nombre_completo,
    url_img || null,
    Number(id_tipo_documento),
    numero_documento,
    celular || null,
    rol,
    direccion || null,
    observaciones || null,
    estadoParsed,
    edad ? Number(edad) : null,
    id,
  ];

  try {
    const { rows } = await db.query(query, values);
    return rows[0] || null;
  } catch (error) {
    console.error("DB Error:", error);
    throw new Error("Error en la base de datos");
  }
};

// ELIMINAR (sin cambios)
exports.deleteWorker = async (id) => {
  const query = `
    DELETE FROM trabajadores
    WHERE id_trabajador = $1
    RETURNING *
  `;

  try {
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  } catch (error) {
    console.error("DB Error:", error);
    throw new Error("Error en la base de datos");
  }
};

// FILTRO + PAGINADO
exports.filterWorkersPaginated = async (page, tipo, orden, search) => {
  const pageNumber = parseInt(page, 10) || 1;
  const offset = (pageNumber - 1) * LIMIT;

  const hasEstadoFilter = tipo === "true" || tipo === "false";

  let baseQuery = `
    FROM trabajadores t
    JOIN tipo_documento td
      ON t.id_tipo_documento = td.id_tipo
  `;

  const values = [];
  const condiciones = [];

  if (hasEstadoFilter) {
    values.push(tipo === "true");
    condiciones.push(`t.estado = $${values.length}`);
  }

  if (search && typeof search === "string" && search.trim()) {
    values.push(`%${search.trim()}%`);
    condiciones.push(
      `(t.nombre_completo ILIKE $${values.length} OR t.numero_documento ILIKE $${values.length}  OR t.rol ILIKE $${values.length})`,
    );
  }

  if (condiciones.length > 0) {
    baseQuery += ` WHERE ` + condiciones.join(" AND ");
  }

  const allowedOrders = ["recientes", "az"];
  let orderClause = ` ORDER BY t.id_trabajador`;

  if (allowedOrders.includes(orden)) {
    if (orden === "recientes") orderClause = ` ORDER BY t.fecha_registro DESC`;
    if (orden === "az") orderClause = ` ORDER BY t.nombre_completo ASC`;
  }

  const workersQuery = `
    SELECT
      t.id_trabajador,
      t.nombre_completo,
      t.url_img,
      t.numero_documento,
      t.celular,
      t.direccion,
      t.observaciones,
      t.fecha_registro,
      t.estado,
      t.edad,
      t.rol,
      t.id_tipo_documento,
      td.nombre AS tipo_documento
    ${baseQuery}
    ${orderClause}
    LIMIT $${values.length + 1} OFFSET $${values.length + 2}
  `;

  const countQuery = `
    SELECT COUNT(*) AS total
    ${baseQuery}
  `;

  try {
    const workers = await db.query(workersQuery, [...values, LIMIT, offset]);
    const total = await db.query(countQuery, values);

    return {
      workers: workers.rows,
      total: parseInt(total.rows[0].total, 10),
      limit: LIMIT,
    };
  } catch (error) {
    console.error("DB Error:", error);
    throw new Error("Error en la base de datos");
  }
};
