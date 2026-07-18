// src/app.js
// Separamos la app de la instancia del servidor para poder importarla en tests
// sin que el servidor quede "escuchando"

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const multer = require('multer');

const app = express();
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

// ─── Middlewares Globales ─────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Origen no permitido por CORS'));
    },
    credentials: true, // Necesario para que el navegador envíe cookies httpOnly
  })
);

// ─── Endpoint de Salud (Issue #5 - Subtarea 1) ───────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'MenuCraft API',
    timestamp: new Date().toISOString(),
  });
});

// ─── Rutas del API ────────────────────────────────────────────────────────────

app.use('/api/auth',       require('./routes/auth.routes'));
app.use('/api/categories', require('./routes/categories.routes'));
app.use('/api/products',   require('./routes/products.routes'));
app.use('/api/menu',       require('./routes/menu.routes'));
app.use('/api/uploads',    require('./routes/upload.routes')); // Carga de imágenes (Cloudinary)

// ─── Manejo de Rutas No Encontradas ──────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// ─── Manejo Global de Errores (Estandarizado) ────────────────────────────────
// Captura: AppError (operacionales), errores de Multer, y errores no controlados.
app.use((err, req, res, next) => {
  // Errores propios de Multer (archivo muy grande, campo inesperado, etc.)
  if (err instanceof multer.MulterError) {
    const mensaje = err.code === 'LIMIT_FILE_SIZE'
      ? 'La imagen supera el tamaño máximo permitido (5MB)'
      : `Error al procesar el archivo: ${err.message}`;
    console.error(`[Error][Multer] ${err.code} - ${err.message}`);
    return res.status(400).json({ error: mensaje });
  }

  const statusCode = err.statusCode || 500;
  const isOperational = err.isOperational || false;

  // Solo logueamos el stack completo si es un error inesperado (bug real, no operacional)
  if (!isOperational) {
    console.error('[Error inesperado]', err);
  } else {
    console.error(`[Error] ${statusCode} - ${err.message}`);
  }

  res.status(statusCode).json({
    error: err.message || 'Error interno del servidor',
    ...(err.details ? { details: err.details } : {}),
  });
});

module.exports = app;
