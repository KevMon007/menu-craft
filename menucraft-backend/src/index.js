require('dotenv').config();

const REQUIRED_VARS = ['JWT_SECRET'];
const DB_VARS = ['DB_HOST', 'DB_USER', 'DB_PASS', 'DB_NAME'];

const missing = REQUIRED_VARS.filter(v => !process.env[v]);
if (!process.env.DATABASE_URL) {
  missing.push(...DB_VARS.filter(v => !process.env[v]));
}

if (missing.length > 0) {
  console.error(`[MenuCraft API] Faltan variables de entorno requeridas: ${missing.join(', ')}`);
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
}

const app = require('./app');
const migrate = require('./config/migrate');

const PORT = process.env.PORT || 3000;

migrate().then(() => {
  app.listen(PORT, () => {
    console.log(`[MenuCraft API] Servidor corriendo en http://localhost:${PORT}`);
    console.log(`[MenuCraft API] Entorno: ${process.env.NODE_ENV || 'development'}`);
  });
});

module.exports = app;
