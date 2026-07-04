// src/middlewares/upload.middleware.js
//
// Multer recibe el archivo en memoria (buffer) — no se escribe a disco,
// lo cual es importante porque Railway usa filesystems efímeros.
// El buffer se sube directamente a Cloudinary desde el controller.

const multer = require('multer');
const AppError = require('../utils/AppError');

const MAX_FILE_SIZE_MB = 5;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(new AppError('Formato de imagen no soportado. Usa JPG, PNG o WEBP', 400));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024 },
});

module.exports = upload;