// src/routes/auth.routes.js
const { Router } = require('express');
const { register, login, logout, me } = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

const router = Router();

router.post('/register', register);
router.post('/login',    login);
router.post('/logout',   logout);
router.get('/me',        verifyToken, me);

module.exports = router;