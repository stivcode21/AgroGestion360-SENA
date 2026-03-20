const db = require("../config/db");

// 🔹 PAGINADO
exports.getActivitiesPaginated = async (page) => {
  const limit = 10;
  const offset = (page - 1) * limit;

  const query = `
    SELECT
      a.id_registro,
      a.url_evidencia,
      a.fecha_inicio,
      a.fecha_fin,
      a.duracion,
      a.monto,
      a.observaciones,
      a.documento,
      a.actividad,
      t.nombre_completo AS trabajador,
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

// 🔹 CREAR
exports.createActivity = async (activityData) => {
  const {
    id_trabajador,
    id_estado,
    monto,
    observaciones,
    url_evidencia,
    fecha_inicio,
    fecha_fin,
    duracion
  } = activityData;

  const query = `
    INSERT INTO actividades (
      id_trabajador,
      id_estado,
      monto,
      observaciones,
      url_evidencia,
      fecha_inicio,
      fecha_fin,
      duracion
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *
  `;

  const values = [
    id_trabajador,
    id_estado,
    monto,
    observaciones,
    url_evidencia,
    fecha_inicio,
    fecha_fin,
    duracion
  ];

  const { rows } = await db.query(query, values);
  return rows[0];
};

// 🔹 OBTENER POR ID
exports.getActivityById = async (id) => {
  const query = `
    SELECT
      a.id_registro,
      a.url_evidencia,
      a.fecha_inicio,
      a.fecha_fin,
      a.duracion,
      a.id_trabajador,
      t.nombre_completo AS trabajador,
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

// 🔹 ACTUALIZAR
exports.updateActivity = async (id, data) => {
  const {
    id_trabajador,
    id_estado,
    monto,
    observaciones,
    url_evidencia,
    fecha_inicio,
    fecha_fin,
    duracion
  } = data;

  const query = `
    UPDATE actividades
    SET
      id_trabajador = $1,
      id_estado = $2,
      monto = $3,
      observaciones = $4,
      url_evidencia = $5,
      fecha_inicio = $6,
      fecha_fin = $7,
      duracion = $8
    WHERE id_registro = $9
    RETURNING *
  `;

  const values = [
    id_trabajador,
    id_estado,
    monto,
    observaciones,
    url_evidencia,
    fecha_inicio,
    fecha_fin,
    duracion,
    id
  ];

  const { rows } = await db.query(query, values);
  return rows[0];
};

// 🔹 ELIMINAR
exports.deleteActivity = async (id) => {
  const query = `
    DELETE FROM actividades
    WHERE id_registro = $1
    RETURNING *
  `;

  const { rows } = await db.query(query, [id]);
  return rows[0];
};
