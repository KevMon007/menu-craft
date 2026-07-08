// src/controllers/upload.controller.js
//
// Endpoint dedicado a subir imágenes de platillos. Devuelve la url_foto
// que el frontend luego enviará en el body de POST/PUT /api/products.

const cloudinary   = require('../config/cloudinary');
const AppError     = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// Sube un buffer a Cloudinary vía stream (sin tocar el disco)
const subirBufferACloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(buffer);
  });
};

// ─── POST /api/uploads/platillo ───────────────────────────────
// Form-data: campo "imagen" (archivo)
const uploadPlatilloImage = asyncHandler(async (req, res, next) => {
  const { restaurante_id } = req.usuario;

  if (!req.file) {
    return next(new AppError('No se recibió ningún archivo en el campo "imagen"', 400));
  }

  // Aislamos las imágenes por restaurante dentro de Cloudinary (multi-tenant)
  const folder = `menucraft/${restaurante_id}/platillos`;

  const resultado = await subirBufferACloudinary(req.file.buffer, folder);

  return res.status(201).json({
    message: 'Imagen subida exitosamente',
    url_foto: resultado.secure_url,
    public_id: resultado.public_id,
  });
});

module.exports = { uploadPlatilloImage };