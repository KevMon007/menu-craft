// src/routes/upload.routes.js

const { Router } = require('express');
const { verifyToken } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const { uploadPlatilloImage } = require('../controllers/upload.controller');

const router = Router();

// Requiere sesión — solo usuarios autenticados del restaurante suben imágenes
router.use(verifyToken);

// El campo del form-data debe llamarse "imagen"
router.post('/platillo', upload.single('imagen'), uploadPlatilloImage);

module.exports = router;