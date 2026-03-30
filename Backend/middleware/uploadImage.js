const multer = require("multer");

// Guarda el archivo temporalmente en memoria para enviarlo luego a Cloudinary.
const storage = multer.memoryStorage();

const fileFilter = (_req, file, callback) => {
  // Solo deja pasar archivos cuyo tipo sea una imagen.
  if (!file.mimetype?.startsWith("image/")) {
    callback(new Error("Solo se permiten archivos de imagen."));
    return;
  }

  callback(null, true);
};

const upload = multer({
  storage,
  limits: {
    // Limita el tamano para evitar cargas demasiado pesadas.
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter,
});

exports.uploadSingleImage = upload.single("image");
