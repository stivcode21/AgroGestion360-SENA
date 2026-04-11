const db = require("../config/db");

// PAGINADO
exports.getActivitiesPaginated = async (page) => {
  const limit = 10;
  const offset = (page - 1) * limit;

  const query = `
    SELECT
      a.id_registro,
      a.url_evidencia,
      a.urlcomprobante,
      a.fecha_inicio,
      a.fecha_fin,
      a.duracion,
      a.monto,
      a.observaciones,
      a.actividad,
      a.id_trabajador,
      t.nombre_completo AS trabajador,
      t.numero_documento AS documento,
      e.nombre AS estado
    FROM actividades a
    JOIN trabajadores t
      ON a.id_trabajador = t.id_trabajador
    JOIN estado_actividades e
      ON a.id_estado = e.id_estado
    ORDER BY a.id_registro
    LIMIT $1 OFFSET $2
  `;

  const countQuery = `SELECT COUNT(*) FROM actividades`;

  const result = await db.query(query, [limit, offset]);
  const total = await db.query(countQuery);

  return {
    activities: result.rows,
    total: parseInt(total.rows[0].count),
  };
};

// CREAR
exports.createActivity = async (activityData) => {
  const {
    id_trabajador,
    duracion,
    actividad,
    id_estado,
    url_evidencia,
    fecha_inicio,
    monto,
    observaciones,
  } = activityData;

  const query = `
    INSERT INTO actividades (
      id_trabajador,
      duracion,
      actividad,
      id_estado,
      url_evidencia,
      fecha_inicio,
      monto,
      observaciones
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *
  `;

  const values = [
    id_trabajador,
    duracion,
    actividad,
    id_estado,
    url_evidencia ?? null,
    fecha_inicio,
    monto,
    observaciones,
  ];

  const { rows } = await db.query(query, values);
  return rows[0];
};

// OBTENER POR ID
exports.getActivityById = async (id) => {
  const query = `
    SELECT
      a.id_registro,
      a.url_evidencia,
      a.urlcomprobante,
      a.fecha_inicio,
      a.fecha_fin,
      a.duracion,
      a.actividad,
      a.id_trabajador,
      t.nombre_completo AS trabajador,
      t.numero_documento AS documento,
      t.url_img AS trabajador_img,
      a.id_estado,
      e.nombre AS estado,
      a.monto,
      a.observaciones
    FROM actividades a
    JOIN trabajadores t
      ON a.id_trabajador = t.id_trabajador
    JOIN estado_actividades e
      ON a.id_estado = e.id_estado
    WHERE a.id_registro = $1
  `;

  const { rows } = await db.query(query, [id]);
  return rows[0];
};

// ACTUALIZAR
exports.updateActivity = async (id, data) => {
  const {
    id_trabajador,
    actividad,
    id_estado,
    monto,
    observaciones,
    url_evidencia,
    urlcomprobante,
    fecha_inicio,
    fecha_fin,
    duracion,
  } = data;

  const query = `
    UPDATE actividades
    SET
      id_trabajador = $1,
      actividad = $2,
      id_estado = $3,
      monto = $4,
      observaciones = $5,
      url_evidencia = $6,
      urlcomprobante = $7,
      fecha_inicio = $8,
      fecha_fin = $9,
      duracion = $10
    WHERE id_registro = $11
    RETURNING *
  `;

  const values = [
    id_trabajador,
    actividad,
    id_estado,
    monto,
    observaciones,
    url_evidencia,
    urlcomprobante ?? null,
    fecha_inicio,
    fecha_fin,
    duracion,
    id,
  ];

  const { rows } = await db.query(query, values);
  return rows[0] || null;
};

// ELIMINAR
exports.deleteActivity = async (id) => {
  const query = `
    DELETE FROM actividades
    WHERE id_registro = $1
    RETURNING *
  `;

  const { rows } = await db.query(query, [id]);
  return rows[0];
};

exports.filterActivitiesPaginatedModel = async (page, tipo, orden, search) => {
  const limit = 10;
  const offset = (page - 1) * limit;

  let baseQuery = `
    FROM actividades a
    JOIN trabajadores t
      ON a.id_trabajador = t.id_trabajador
    JOIN estado_actividades e
      ON a.id_estado = e.id_estado
  `;

  const values = [];
  const condiciones = [];

  if (tipo) {
    values.push(tipo);
    condiciones.push(`a.id_estado = $${values.length}`);
  }

  if (search?.trim()) {
    values.push(`%${search.trim()}%`);
    condiciones.push(
      `(a.actividad ILIKE $${values.length} OR t.nombre_completo ILIKE $${values.length})`,
    );
  }

  if (condiciones.length > 0) {
    baseQuery += ` WHERE ` + condiciones.join(" AND ");
  }

  let orderClause = ` ORDER BY a.id_registro`;

  if (orden === "recientes") {
    orderClause = ` ORDER BY a.fecha_inicio DESC`;
  }

  if (orden === "az") {
    orderClause = ` ORDER BY a.actividad ASC`;
  }

  const activitiesQuery = `
    SELECT
      a.id_registro,
      a.url_evidencia,
      a.urlcomprobante,
      a.fecha_inicio,
      a.fecha_fin,
      a.duracion,
      a.monto,
      a.observaciones,
      a.actividad,
      t.nombre_completo AS trabajador,
      t.numero_documento AS documento,
      e.nombre AS estado
    ${baseQuery}
    ${orderClause}
    LIMIT $${values.length + 1} OFFSET $${values.length + 2}
  `;

  const countQuery = `
    SELECT COUNT(*) AS total
    ${baseQuery}
  `;

  const activities = await db.query(activitiesQuery, [
    ...values,
    limit,
    offset,
  ]);
  const total = await db.query(countQuery, values);

  return {
    activities: activities.rows,
    total: parseInt(total.rows[0].total, 10),
    limit,
  };
};
