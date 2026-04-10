const db = require("../config/db");

// PAGINADO
exports.getGanaderiaPaginated = async (page) => {
  const limit = 10;
  const offset = (page - 1) * limit;

  const query = `
    SELECT
      g.id_animal,
      g.tipo,
      g.fecha_ingreso,
      g.estado_salud,
      g.origen_ciudad,
      TO_CHAR(g.fecha_nacimiento, 'YYYY-MM-DD') AS fecha_nacimiento,
      g.peso_inicial,
      g.nombre,
      g.observaciones,
      g.url_img,
      g.raza,
      g.vendido
    FROM ganaderia g
    ORDER BY g.id_animal
    LIMIT $1 OFFSET $2
  `;

  const countQuery = `SELECT COUNT(*) FROM ganaderia`;

  const result = await db.query(query, [limit, offset]);
  const total = await db.query(countQuery);

  return {
    ganaderia: result.rows,
    total: parseInt(total.rows[0].count),
  };
};

// CREAR ✅ (ARREGLADO)
exports.createGanaderia = async (data) => {
  const {
    tipo,
    fecha_ingreso,
    estado_salud,
    origen_ciudad,
    fecha_nacimiento,
    peso_inicial,
    observaciones,
    nombre,
    url_img,
    raza,
    vendido,
  } = data;

  const query = `
    INSERT INTO ganaderia (
      tipo,
      fecha_ingreso,
      estado_salud,
      origen_ciudad,
      fecha_nacimiento,
      peso_inicial,
      observaciones,
      nombre,
      url_img,
      raza,
      vendido
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    RETURNING *
  `;

  const values = [
    tipo,
    fecha_ingreso || null,
    estado_salud,
    origen_ciudad || null,
    fecha_nacimiento || null,
    peso_inicial,
    observaciones || null,
    nombre,
    url_img || null,
    raza || null,
    vendido ?? false,
  ];

  const { rows } = await db.query(query, values);
  return rows[0];
};

// OBTENER POR ID ✅ (ARREGLADO)
exports.getGanaderiaById = async (id) => {
  const query = `
    SELECT
      g.id_animal,
      g.tipo,
      g.fecha_ingreso,
      g.estado_salud,
      g.origen_ciudad,
      TO_CHAR(g.fecha_nacimiento, 'YYYY-MM-DD') AS fecha_nacimiento,
      g.peso_inicial,
      g.observaciones,
      g.nombre,
      g.url_img,
      g.raza,
      g.vendido
    FROM ganaderia g
    WHERE g.id_animal = $1
  `;

  const { rows } = await db.query(query, [id]);
  return rows[0];
};

// ACTUALIZAR
exports.updateGanaderia = async (id, data) => {
  const {
    tipo,
    fecha_ingreso,
    estado_salud,
    origen_ciudad,
    fecha_nacimiento,
    peso_inicial,
    observaciones,
    nombre,
    url_img,
    raza,
    vendido,
  } = data;

  const query = `
    UPDATE ganaderia
    SET
      tipo = $1,
      fecha_ingreso = $2,
      estado_salud = $3,
      origen_ciudad = $4,
      fecha_nacimiento = $5,
      peso_inicial = $6,
      observaciones = $7,
      nombre = $8,
      url_img = $9,
      raza = $10,
      vendido = $11
    WHERE id_animal = $12
    RETURNING *
  `;

  const values = [
    tipo,
    fecha_ingreso || null,
    estado_salud,
    origen_ciudad || null,
    fecha_nacimiento || null,
    peso_inicial,
    observaciones || null,
    nombre,
    url_img || null,
    raza || null,
    vendido ?? false,
    id,
  ];

  const { rows } = await db.query(query, values);
  return rows[0] || null;
};

// ELIMINAR
exports.deleteGanaderia = async (id) => {
  const query = `
    DELETE FROM ganaderia
    WHERE id_animal = $1
    RETURNING *
  `;

  const { rows } = await db.query(query, [id]);
  return rows[0];
};

// FILTRO (OPCIONAL mejorar también)
exports.filterGanaderiaPaginatedModel = async (page, tipo, estado, search) => {
  const limit = 10;
  const offset = (page - 1) * limit;

  let baseQuery = `FROM ganaderia g`;

  const values = [];
  const condiciones = [];

  if (tipo) {
    values.push(tipo);
    condiciones.push(`g.tipo = $${values.length}`);
  }

  if (estado) {
    values.push(estado);
    condiciones.push(`g.estado_salud = $${values.length}`);
  }

  if (search?.trim()) {
    values.push(`%${search.trim()}%`);
    condiciones.push(`g.nombre ILIKE $${values.length}`);
  }

  if (condiciones.length > 0) {
    baseQuery += ` WHERE ` + condiciones.join(" AND ");
  }

  const query = `
    SELECT
      g.id_animal,
      g.tipo,
      g.fecha_ingreso,
      g.estado_salud,
      g.origen_ciudad,
      TO_CHAR(g.fecha_nacimiento, 'YYYY-MM-DD') AS fecha_nacimiento,
      g.peso_inicial,
      g.observaciones,
      g.nombre,
      g.url_img,
      g.raza,
      g.vendido
    ${baseQuery}
    ORDER BY g.id_animal DESC
    LIMIT $${values.length + 1} OFFSET $${values.length + 2}
  `;

  const countQuery = `
    SELECT COUNT(*) AS total
    ${baseQuery}
  `;

  const result = await db.query(query, [...values, limit, offset]);
  const total = await db.query(countQuery, values);

  return {
    ganaderia: result.rows,
    total: parseInt(total.rows[0].total, 10),
    limit,
  };
};
