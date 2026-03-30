const cloudinary = require("../config/cloudinary");

// Convierte el upload por stream de Cloudinary en una promesa mas facil de esperar con await.
const uploadBufferToCloudinary = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      },
    );

    uploadStream.end(buffer);
  });

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Debes seleccionar una imagen." });
    }

    // Si no se define carpeta en .env, usa esta ruta por defecto en Cloudinary.
    const folder = process.env.CLOUDINARY_FOLDER || "agrogestion360/products";
    const result = await uploadBufferToCloudinary(req.file.buffer, folder);

    // Solo devolvemos la URL final para guardarla despues en la base de datos.
    return res.status(200).json({
      message: "Imagen subida correctamente.",
      url: result.secure_url,
    });
  } catch (error) {
    console.error("Error al subir imagen:", error);
    return res.status(500).json({ message: "No se pudo subir la imagen." });
  }
};
