// src/middlewares/auth.middleware.js
// Issue #10 - Middleware que protege rutas privadas validando el JWT

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  // Leer token desde cookie httpOnly o desde Authorization header
  const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Acceso no autorizado. Token no provisto' });
  }

  try {
    // Verificar firma y expiración
    const decoded = jwt.verify(token, JWT_SECRET);

    // Inyectar datos del usuario en el request para uso posterior
    req.usuario = {
      usuario_id:     decoded.usuario_id,
      restaurante_id: decoded.restaurante_id,
      rol:            decoded.rol,
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

module.exports = { verifyToken };