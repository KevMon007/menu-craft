// src/index.js
// MenuCraft SaaS - Backend Entry Point
// Issue #5 - Subtarea 1: Inicialización del servidor Express

require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`[MenuCraft API] Servidor corriendo en http://localhost:${PORT}`);
  console.log(`[MenuCraft API] Entorno: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;