// src/routes/menu.routes.js
const { Router } = require('express');
const { getMenu } = require('../controllers/menu.controller');

const router = Router();

// Ruta pública - no requiere JWT
router.get('/:slug', getMenu);

module.exports = router;