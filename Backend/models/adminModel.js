const db = require("../config/db");

exports.findAdminByUser = async (user) => {
  const { rows } = await db.query("SELECT * FROM admins WHERE usuario = $1", [
    user,
  ]);
  return rows.length > 0 ? rows[0] : null;
};
