const fs = require('fs');
const path = require('path');
const pool = require('./db');

async function migrate() {
  const initPath = path.join(__dirname, '../../database/init.sql');

  if (!fs.existsSync(initPath)) {
    console.log('[Migrate] No se encontró database/init.sql, omitiendo migración.');
    return;
  }

  const sql = fs.readFileSync(initPath, 'utf-8');

  try {
    await pool.query(sql);
    console.log('[Migrate] Tablas creadas/verificadas correctamente.');
  } catch (err) {
    console.error('[Migrate] Error ejecutando migración:', err.message);
  }
}

module.exports = migrate;
