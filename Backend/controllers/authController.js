const jwt = require("jsonwebtoken");
const {
  findAdminByEmail,
  findAdmins,
  updateAdmin,
  createAdmin,
  findAdminByUser,
  updateUserPassword,
} = require("../models/adminModel");
const transporter = require("../config/email");

const getAuthCookieOptions = (req) => {
  const isHttps =
    process.env.NODE_ENV === "production" ||
    req.secure ||
    req.get("x-forwarded-proto") === "https";

  return {
    httpOnly: true,
    secure: isHttps,
    sameSite: isHttps ? "none" : "lax",
  };
};

exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones b�sicas
    if (!email?.trim() || !password?.trim()) {
      return res
        .status(400)
        .json({ message: "Correo y contraseña son requeridos." });
    }

    // Buscar usuario
    const user = await findAdminByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "Correo no registrado." });
    }

    if (user.estado === false) {
      return res.status(403).json({ message: "Usuario deshabilitado." });
    }

    // Verificar contrase�a (por ahora sin encriptar)
    const isMatch = password === user.contrasena;
    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta." });
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        id_admin: user.id_usuario,
        email: user.correo,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" },
    );

    // Configurar cookie
    res.cookie("token", token, {
      ...getAuthCookieOptions(req),
      maxAge: 2 * 60 * 60 * 1000, // 2 horas
    });

    // Respuesta
    return res.status(200).json({
      message: "Inicio de sesion exitoso.",
      user: {
        id_admin: user.id_usuario,
        correo: user.correo,
      },
    });
  } catch (error) {
    console.error("Error en inicio de sesi�n:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

exports.userController = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "El id_usuario es requerido." });
    }

    const user = await findAdminByUser(id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    return res.status(200).json({
      message: "Usuario encontrado.",
      user,
    });
  } catch (error) {
    console.error("Error al obtener usuario por id:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

exports.getAdmins = async (req, res) => {
  try {
    const id = 2;

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "no se obtuvo el id del admin." });
    }

    const admins = await findAdmins(id);

    if (!admins) {
      return res.status(404).json({ message: "admins no encontrados." });
    }

    return res.status(200).json({
      message: "admins encontrados.",
      admins,
    });
  } catch (error) {
    console.error("Error al obtener usuario los admins", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

exports.editAdmin = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "ID del admin invalido." });
    }

    const existing = await findAdminByUser(id);
    if (!existing) {
      return res.status(404).json({ message: "Admin no encontrado." });
    }

    // se pasan los datos existentes y luego sobre escribimo con los datos del body
    const updated = await updateAdmin(id, {
      ...existing,
      ...req.body,
      nombre_completo:
        req.body.nombre_completo?.trim() ?? existing.nombre_completo,
    });

    return res.status(200).json({
      message: "Admin actualizado correctamente.",
      data: updated,
    });
  } catch (error) {
    console.error("Error al editar admin:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

exports.createAdminController = async (req, res) => {
  try {
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
    } = req.body;

    if (
      !nombre_completo?.trim() ||
      !id_tipo_documento ||
      !numero_documento ||
      !correo?.trim() ||
      !contrasena?.trim() ||
      !id_rol
    ) {
      return res.status(400).json({
        message:
          "nombre_completo, id_tipo_documento, numero_documento, correo, contrasena e id_rol son obligatorios.",
      });
    }

    const existing = await findAdminByEmail(correo.trim());
    if (existing) {
      return res.status(409).json({ message: "El correo ya esta registrado." });
    }

    const newAdmin = await createAdmin({
      nombre_completo: nombre_completo.trim(),
      edad,
      id_tipo_documento,
      numero_documento,
      celular,
      url_img,
      correo: correo.trim(),
      contrasena: contrasena.trim(),
      id_rol,
      estado,
    });

    return res.status(201).json({
      message: "Admin creado correctamente.",
      data: newAdmin,
    });
  } catch (error) {
    console.error("Error al crear admin:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

exports.logoutController = (req, res) => {
  res.clearCookie("token", {
    ...getAuthCookieOptions(req),
    path: "/",
  });
  return res.status(200).json({ message: "Sesion cerrada correctamente." });
};

const generateTemporaryPassword = (length = 10) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";

  for (let i = 0; i < length; i += 1) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }

  return password;
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const cleanEmail = email?.trim();

    if (!cleanEmail) {
      return res.status(400).json({ message: "Correo es requerido." });
    }

    const user = await findAdminByEmail(cleanEmail);
    if (!user) {
      return res.status(404).json({ message: "Correo no encontrado." });
    }

    //genera contraseña aleatoria
    const newPassword = generateTemporaryPassword();

    //actualiza la base de datos
    const updatedUser = await updateUserPassword(user.id_usuario, newPassword);
    if (!updatedUser) {
      return res
        .status(500)
        .json({ message: "No se pudo actualizar la contraseña." });
    }

    //envia el correo
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.correo,
      subject: "Nueva contraseña - AgroGestion360",
      text: `Tu nueva contraseña temporal es: ${newPassword}. Usala para iniciar sesion.`,
    });

    return res
      .status(200)
      .json({ message: "Nueva contraseña enviada a tu correo." });
  } catch (error) {
    console.error("Error en forgot password:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};
