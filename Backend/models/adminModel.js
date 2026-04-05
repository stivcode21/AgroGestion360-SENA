const db = require("../config/db");

exports.findAdminByEmail = async (user) => {
  const { rows } = await db.query("SELECT * FROM usuarios WHERE correo = $1", [
    user,
  ]);
  return rows.length > 0 ? rows[0] : null;
};

exports.findAdminByUser = async (id_usuario) => {
  const { rows } = await db.query(
    "SELECT * FROM usuarios WHERE id_usuario = $1",
    [id_usuario],
  );
  if (rows.length === 0) return null;

  const { contrasena: _contrasena, ...admin } = rows[0];
  return admin;
};

exports.findAdmins = async (id_rol) => {
  const admins = await db.query("SELECT * FROM usuarios WHERE id_rol = $1", [
    id_rol,
  ]);

  if (admins.rows.length === 0) return null;

  return admins.rows.map(({ contrasena, ...admin }) => admin);
};

exports.updateAdmin = async (id, adminData) => {
  const {
    nombre_completo,
    edad,
    id_tipo_documento,
    numero_documento,
    celular,
    url_img,
    correo,
    contrasena,
    estado,
  } = adminData;

  const query = `
    UPDATE usuarios
    SET
      nombre_completo = $1,
      edad = $2,
      id_tipo_documento = $3,
      numero_documento = $4,
      celular = $5,
      url_img = $6,
      correo = $7,
      contrasena = COALESCE($8, contrasena),
      estado = $9
    WHERE id_usuario = $10
    RETURNING *
  `;

  const values = [
    nombre_completo,
    edad,
    id_tipo_documento,
    numero_documento,
    celular,
    url_img,
    correo,
    contrasena,
    estado,
    id,
  ];

  const { rows } = await db.query(query, values);
  if (rows.length === 0) return null;

  const { contrasena: _contrasena, ...admin } = rows[0];
  return admin;
};

exports.createAdmin = async (adminData) => {
  const {
    nombre_completo,
    edad,
    id_tipo_documento,
    numero_documento,
    celular,
    url_img,
    correo,
    contrasena,
    id_rol,
    estado,
  } = adminData;

  const query = `
    INSERT INTO usuarios (
      nombre_completo,
      edad,
      id_tipo_documento,
      numero_documento,
      celular,
      url_img,
      correo,
      contrasena,
      id_rol,
      estado
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *
  `;

  const values = [
    nombre_completo,
    edad,
    id_tipo_documento,
    numero_documento,
    celular,
    url_img ?? null,
    correo,
    contrasena,
    id_rol,
    estado,
  ];

  const { rows } = await db.query(query, values);
  if (rows.length === 0) return null;

  const { contrasena: _contrasena, ...admin } = rows[0];
  return admin;
};

exports.updateUserPassword = async (id, newPassword) => {
  const query = `
    UPDATE usuarios
    SET contrasena = $1
    WHERE id_usuario = $2
    RETURNING id_usuario, correo
  `;

  const { rows } = await db.query(query, [newPassword, id]);
  return rows.length > 0 ? rows[0] : null;
};
