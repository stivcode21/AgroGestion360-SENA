const db = require("../config/db");

// Inserta un solo insumo consumido y devuelve el registro creado.
const insertConsumptionItem = async (
  client,
  id_actividad,
  id_responsable,
  item,
) => {
  const values = [id_actividad, id_responsable, item.id_insumo, item.cantidad];

  // 1. Descontar inventario primero
  const updateQuery = `
    UPDATE inventario
    SET cantidad = cantidad - $1
    WHERE id_insumo = $2
      AND cantidad >= $1
    RETURNING *;
  `;

  const updateValues = [item.cantidad, item.id_insumo];
  const updateResult = await client.query(updateQuery, updateValues);

  if (updateResult.rowCount === 0) {
    throw new Error(
      `Stock insuficiente para el insumo con id ${item.id_insumo}`,
    );
  }

  // 2. Insertar consumo solo si el descuento sí se pudo hacer
  const insertQuery = `
    INSERT INTO consumo_insumo (
      id_actividad,
      id_responsable,
      id_insumo,
      cantidad
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const { rows } = await client.query(insertQuery, values);
  return rows[0];
};

exports.getConsumptionByActivityId = async (activityId) => {
  const query = `
    SELECT
      c.id_consumo,
      c.id_actividad,
      c.id_responsable,
      c.id_insumo,
      c.cantidad,
      c.fecha_registro,
      i.nombre,
      i.marca,
      i.unidad_medida,
      i.cantidad AS stock_disponible
    FROM consumo_insumo c
    JOIN inventario i
      ON c.id_insumo = i.id_insumo
    WHERE c.id_actividad = $1
    ORDER BY c.id_consumo
  `;

  const { rows } = await db.query(query, [activityId]);
  return rows;
};

exports.createConsumptionItems = async ({
  id_actividad,
  id_responsable,
  items,
}) => {
  const client = await db.connect();

  try {
    // La transaccion asegura que se guarden todos los items o ninguno.
    await client.query("BEGIN");

    const insertedItems = [];

    for (const item of items) {
      insertedItems.push(
        await insertConsumptionItem(client, id_actividad, id_responsable, item),
      );
    }

    await client.query("COMMIT");
    return insertedItems;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

exports.replaceConsumptionItemsByActivity = async ({
  id_actividad,
  id_responsable,
  items,
}) => {
  const client = await db.connect();

  try {
    // Aqui se reemplaza toda la lista de consumos de la actividad.
    await client.query("BEGIN");

    // Primero elimina lo anterior para volver a guardar el estado completo.
    await client.query(
      `
        DELETE FROM consumo_insumo
        WHERE id_actividad = $1
      `,
      [id_actividad],
    );

    const updatedItems = [];

    for (const item of items) {
      updatedItems.push(
        await insertConsumptionItem(client, id_actividad, id_responsable, item),
      );
    }

    await client.query("COMMIT");
    return updatedItems;
  } catch (error) {
    // Si algo falla, deja la actividad como estaba antes.
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
