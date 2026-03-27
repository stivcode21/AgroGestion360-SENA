const db = require("../config/db");

exports.getRequestsList = async () => {
  const requestsQuery = `
    SELECT * FROM solicitud 
    ORDER BY id_solicitud DESC
    `;

  const requests = await db.query(requestsQuery);

  return {
    requests: requests.rows,
  };
};

exports.createRequest = async (requestData) => {
  const {
    titulo,
    motivo,
    id_tipo_insumo,
    cantidad,
    especie_destino,
    unidad_medida,
    proveedor,
    fecha_vencimiento,
  } = requestData;

  const query = `
    INSERT INTO solicitud (
      titulo,
      motivo,
      id_tipo_insumo,
      cantidad,
      especie_destino,
      unidad_medida,
      proveedor,
      fecha_vencimiento
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;

  const values = [
    titulo,
    motivo,
    id_tipo_insumo,
    cantidad,
    especie_destino ?? null,
    unidad_medida ?? null,
    proveedor ?? null,
    fecha_vencimiento ?? null,
  ];

  const { rows } = await db.query(query, values);
  return rows[0];
};

exports.getRequestById = async (id) => {
  const query = `
    SELECT * FROM solicitud WHERE id_solicitud = $1
  `;

  const { rows } = await db.query(query, [id]);
  return rows[0] || null;
};

exports.updateRequest = async (id, requestData) => {
  const {
    titulo,
    motivo,
    id_tipo_insumo,
    cantidad,
    especie_destino,
    unidad_medida,
    proveedor,
    fecha_vencimiento,
  } = requestData;

  const query = `
    UPDATE solicitud
    SET
      titulo = $1,
      motivo = $2,
      id_tipo_insumo = $3,
      cantidad = $4,
      especie_destino = $5,
      unidad_medida = $6,
      proveedor = $7,
      fecha_vencimiento = $8
    WHERE id_solicitud = $9
    RETURNING *
  `;

  const values = [
    titulo,
    motivo,
    id_tipo_insumo,
    cantidad,
    especie_destino ?? null,
    unidad_medida ?? null,
    proveedor ?? null,
    fecha_vencimiento ?? null,
  ];

  const { rows } = await db.query(query, values);
  return rows[0] || null;
};

exports.deleteRequestModel = async (id) => {
  const query = `
    DELETE FROM solicitud
    WHERE id_solicitud = $1
  `;

  const { rows } = await db.query(query, [id]);
  return rows[0] || null;
};
