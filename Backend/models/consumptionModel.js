const db = require("../config/db");

// Inserta un solo insumo consumido y devuelve el registro creado.
const insertConsumptionItem = async (
  client,
  id_actividad,
  id_responsable,
  item,
) => {
  const query = `
    INSERT INTO consumo_insumo (
      id_actividad,
      id_responsable,
      id_insumo,
      cantidad
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;

  const values = [
    id_actividad,
    id_responsable,
    item.id_insumo,
    item.cantidad,
  ];

  const { rows } = await client.query(query, values);
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
