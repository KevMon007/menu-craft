// src/middlewares/validators.middleware.js
//
// Middlewares de validación que corren ANTES del controller.
// Normalizan (trim, cast numérico) y rechazan payloads inválidos
// con un AppError 400, en vez de dejar que el controller o la BD
// descubran el problema más tarde.

const AppError = require('../utils/AppError');

// ─── Categorías ─────────────────────────────────────────────────
const validateCategory = (req, res, next) => {
  const { nombre, orden, activa } = req.body;
  const isCreate = req.method === 'POST';

  if (isCreate || nombre !== undefined) {
    if (typeof nombre !== 'string' || nombre.trim().length === 0) {
      return next(new AppError('El nombre de la categoría es requerido y debe ser texto', 400));
    }
    if (nombre.trim().length > 100) {
      return next(new AppError('El nombre de la categoría no puede superar 100 caracteres', 400));
    }
    req.body.nombre = nombre.trim();
  }

  if (orden !== undefined) {
    const ordenNum = Number(orden);
    if (!Number.isInteger(ordenNum) || ordenNum < 0) {
      return next(new AppError('El campo orden debe ser un entero mayor o igual a 0', 400));
    }
    req.body.orden = ordenNum;
  }

  if (activa !== undefined && typeof activa !== 'boolean') {
    if (activa === 'true' || activa === 'false') {
      req.body.activa = activa === 'true';
    } else {
      return next(new AppError('El campo activa debe ser booleano', 400));
    }
  }

  next();
};

// ─── Platillos ──────────────────────────────────────────────────
const validateProduct = (req, res, next) => {
  const { nombre, descripcion, precio, categoria_id, disponible } = req.body;
  const isCreate = req.method === 'POST';

  if (isCreate || nombre !== undefined) {
    if (typeof nombre !== 'string' || nombre.trim().length === 0) {
      return next(new AppError('El nombre del platillo es requerido y debe ser texto', 400));
    }
    if (nombre.trim().length > 200) {
      return next(new AppError('El nombre del platillo no puede superar 200 caracteres', 400));
    }
    req.body.nombre = nombre.trim();
  }

  if (isCreate || precio !== undefined) {
    const precioNum = Number(precio);
    if (precio === undefined || precio === null || precio === '' || Number.isNaN(precioNum)) {
      return next(new AppError('El precio debe ser un número válido', 400));
    }
    if (precioNum < 0) {
      return next(new AppError('El precio debe ser un valor positivo', 400));
    }
    if (precioNum > 999999.99) {
      return next(new AppError('El precio excede el máximo permitido', 400));
    }
    // Normalizamos a 2 decimales, consistente con DECIMAL(10,2) en la BD
    req.body.precio = precioNum.toFixed(2);
  }

  if (isCreate) {
    if (!categoria_id || Number.isNaN(Number(categoria_id))) {
      return next(new AppError('La categoría es requerida y debe ser un ID válido', 400));
    }
  } else if (categoria_id !== undefined && Number.isNaN(Number(categoria_id))) {
    return next(new AppError('La categoría debe ser un ID válido', 400));
  }

  if (descripcion !== undefined && descripcion !== null) {
    if (typeof descripcion !== 'string') {
      return next(new AppError('La descripción debe ser texto', 400));
    }
    if (descripcion.length > 1000) {
      return next(new AppError('La descripción no puede superar 1000 caracteres', 400));
    }
    req.body.descripcion = descripcion.trim();
  }

  if (disponible !== undefined && typeof disponible !== 'boolean') {
    if (disponible === 'true' || disponible === 'false') {
      req.body.disponible = disponible === 'true'; // normaliza strings de form-data
    } else {
      return next(new AppError('El campo disponible debe ser booleano', 400));
    }
  }

  next();
};

module.exports = { validateCategory, validateProduct };
