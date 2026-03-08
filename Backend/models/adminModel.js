const db = require("../config/db");

exports.findAdminByUser = async (user) => {
  const { rows } = await db.query("SELECT * FROM usuarios WHERE correo = $1", [
    user,
  ]);
  return rows.length > 0 ? rows[0] : null;
};

exports.findUserByEmail = async (email) => {
  const { rows } = await db.query("SELECT * FROM usuarios WHERE correo = $1", [
    email,
  ]);

  if (rows.length === 0) return null;

  const user = { ...rows[0] };
  delete user.contrasena;

  return user;
};
