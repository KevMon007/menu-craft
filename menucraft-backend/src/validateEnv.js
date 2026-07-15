const REQUIRED_ENV_VARS = [
  'PORT',
  'NODE_ENV',
  'FRONTEND_URL',
  'DB_HOST',
  'DB_PORT',
  'DB_USER',
  'DB_PASS',
  'DB_NAME',
  'JWT_SECRET',
  'JWT_EXPIRES_IN'
];

function validateEnv() {
  const missingVars = REQUIRED_ENV_VARS.filter(key => !process.env[key]);

  if (missingVars.length > 0) {
    console.error('\n❌ ============================================================');
    console.error('ERROR CRÍTICO DE CONFIGURACIÓN: Faltan variables de entorno obligatorias:');
    console.error(missingVars.join(', '));
    console.error('============================================================\n');
    console.error('Por favor, revisa tu archivo .env y asegúrate de incluir todos los valores requeridos.');
    process.exit(1); // Detiene el servidor por completo
  }
}

module.exports = validateEnv;
