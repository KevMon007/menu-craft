// src/app.js
// Separamos la app de la instancia del servidor para poder importarla en tests
// sin que el servidor quede "escuchando"

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// ─── Middlewares Globales ─────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true, // Necesario para que el navegador envíe cookies httpOnly
  })
);

// ─── Endpoint de Salud (Issue #5 - Subtarea 1) ───────────────────────────────
// GET /health → { status: "ok" }
// Usado por Docker y load balancers para verificar que el servicio está vivo
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'MenuCraft API',
    timestamp: new Date().toISOString(),
  });
});

// ─── Rutas del API ────────────────────────────────────────────────────────────
// Se irán montando progresivamente en issues posteriores
// app.use('/api/auth', require('./routes/auth.routes'));
// app.use('/api/categories', require('./routes/categories.routes'));
// app.use('/api/products', require('./routes/products.routes'));
// app.use('/api/menu', require('./routes/menu.routes'));

// ─── Manejo de Rutas No Encontradas ──────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// ─── Manejo Global de Errores ─────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Error]', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
  });
});

module.exports = app;