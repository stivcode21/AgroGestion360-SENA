const db = require("../config/db");

const insertVaccinations = async (client, idAnimal, vacunas = []) => {
  const insertedVaccinations = [];

  for (const vacuna of vacunas) {
    if (
      !String(vacuna?.tipoVacuna ?? "").trim() ||
      !String(vacuna?.dosis ?? "").trim() ||
      !String(vacuna?.responsable ?? "").trim()
    ) {
      const error = new Error("INVALID_VACCINATION_DATA");
      throw error;
    }

    const values = [
      vacuna.tipoVacuna || null,
      vacuna.fecha_aplicacion || null,
      vacuna.dosis || null,
      vacuna.responsable || null,
      vacuna.observaciones2 || null,
      idAnimal,
    ];

    const result = await client.query(
      `
        INSERT INTO vacunas (
          tipo_vacuna,
          fecha_aplicacion,
          dosis,
          responsable,
          observaciones,
          id_animal
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `,
      values,
    );

    insertedVaccinations.push(result.rows[0]);
  }

  return insertedVaccinations;
};

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
    vacunas = [],
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

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const res1 = await client.query(query, values);
    const insertedVaccinations = await insertVaccinations(
      client,
      res1.rows[0].id_animal,
      vacunas,
    );

    await client.query("COMMIT");

    return {
      ganaderia: res1.rows[0],
      vacunas: insertedVaccinations,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

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

exports.getVacunasByAnimalId = async (id) => {
  const query = `
    SELECT *
    FROM vacunas v
    WHERE v.id_animal = $1
    ORDER BY v.fecha_aplicacion DESC NULLS LAST
  `;

  const { rows } = await db.query(query, [id]);
  return rows;
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
    vacunas = [],
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

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const res1 = await client.query(query, values);
    await client.query(
      `
        DELETE FROM vacunas
        WHERE id_animal = $1
      `,
      [id],
    );

    const insertedVaccinations = await insertVaccinations(client, id, vacunas);

    await client.query("COMMIT");

    return {
      ganaderia: res1.rows[0],
      vacunas: insertedVaccinations,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
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
exports.filterGanaderiaPaginated = async (page, tipo, orden, estado, search) => {
  const limit = 10;
  const offset = (page - 1) * limit;

  let baseQuery = `FROM ganaderia g`;

  const values = [];
  const condiciones = [];

  if (tipo) {
    const vendido = tipo === "true";
    values.push(vendido);
    condiciones.push(`g.vendido = $${values.length}`);
  }

  if (estado) {
    values.push(estado);
    condiciones.push(`g.estado_salud = $${values.length}`);
  }

  if (search?.trim()) {
    values.push(`%${search.trim()}%`);
    condiciones.push(
      `g.nombre ILIKE $${values.length} OR g.estado_salud ILIKE $${values.length} OR g.raza ILIKE $${values.length}`,
    );
  }

  if (condiciones.length > 0) {
    baseQuery += ` WHERE ` + condiciones.join(" AND ");
  }

  let orderClause = ` ORDER BY g.id_animal DESC`;

  if (orden === "recientes") {
    orderClause = ` ORDER BY g.fecha_ingreso DESC NULLS LAST, g.id_animal DESC`;
  }

  if (orden === "az") {
    orderClause = ` ORDER BY g.nombre ASC, g.id_animal ASC`;
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
    ${orderClause}
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

exports.sellGanaderia = async ({
  id_animal,
  comprador,
  monto_total,
  observaciones,
}) => {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const animalResult = await client.query(
      `
        SELECT id_animal, vendido
        FROM ganaderia
        WHERE id_animal = $1
        FOR UPDATE
      `,
      [id_animal],
    );

    const animal = animalResult.rows[0];

    if (!animal) {
      throw new Error("ANIMAL_NOT_FOUND");
    }

    if (animal.vendido) {
      throw new Error("ANIMAL_ALREADY_SOLD");
    }

    const saleResult = await client.query(
      `
        INSERT INTO ventas_animales (
          id_animal,
          comprador,
          monto_total,
          observaciones
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `,
      [id_animal, comprador, monto_total, observaciones ?? null],
    );

    await client.query(
      `
        UPDATE ganaderia
        SET vendido = true
        WHERE id_animal = $1
      `,
      [id_animal],
    );

    await client.query("COMMIT");
    return saleResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
