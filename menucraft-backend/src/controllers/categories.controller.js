// src/controllers/categories.controller.js
// Issue #11 - CRUD de Categorías con restricción multi-tenant
// Refactor: manejo global de errores (asyncHandler + AppError) en vez de try/catch manual.
// La validación de payload ahora vive en validators.middleware.js (validateCategory).

const pool         = require('../config/db');
const AppError     = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// ─── GET /api/categories ──────────────────────────────────────
const getCategories = asyncHandler(async (req, res) => {
  const { restaurante_id } = req.usuario;

  const result = await pool.query(
    `SELECT id, nombre, orden
     FROM categorias
     WHERE restaurante_id = $1
     ORDER BY orden ASC, nombre ASC`,
    [restaurante_id]
  );

  return res.status(200).json(result.rows);
});

// ─── POST /api/categories ─────────────────────────────────────
const createCategory = asyncHandler(async (req, res) => {
  const { nombre, orden } = req.body; // ya validado/normalizado por el middleware
  const { restaurante_id } = req.usuario;

  const result = await pool.query(
    `INSERT INTO categorias (restaurante_id, nombre, orden)
     VALUES ($1, $2, $3) RETURNING *`,
    [restaurante_id, nombre, orden || 0]
  );

  return res.status(201).json(result.rows[0]);
});

// ─── PUT /api/categories/:id ──────────────────────────────────
const updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { nombre, orden } = req.body;
  const { restaurante_id } = req.usuario;

  if (Number.isNaN(Number(id))) {
    return next(new AppError('El ID de categoría no es válido', 400));
  }

  // WHERE incluye restaurante_id -> aislamiento multi-tenant
  const result = await pool.query(
    `UPDATE categorias
     SET nombre = COALESCE($1, nombre),
         orden  = COALESCE($2, orden)
     WHERE id = $3 AND restaurante_id = $4
     RETURNING *`,
    [nombre, orden, id, restaurante_id]
  );

  if (result.rows.length === 0) {
    return next(new AppError('Categoría no encontrada', 404));
  }
  return res.status(200).json(result.rows[0]);
});

// ─── DELETE /api/categories/:id ───────────────────────────────
const deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { restaurante_id } = req.usuario;

  if (Number.isNaN(Number(id))) {
    return next(new AppError('El ID de categoría no es válido', 400));
  }

  try {
    const result = await pool.query(
      `DELETE FROM categorias
       WHERE id = $1 AND restaurante_id = $2
       RETURNING id`,
      [id, restaurante_id]
    );

    if (result.rows.length === 0) {
      return next(new AppError('Categoría no encontrada', 404));
    }
    return res.status(200).json({ message: 'Categoría eliminada exitosamente' });
  } catch (err) {
    // FK violation: la categoría tiene platillos asociados (ON DELETE CASCADE los borraría,
    // pero si en el futuro se cambia la constraint, devolvemos un 409 claro en vez de 500)
    if (err.code === '23503') {
      return next(new AppError('No se puede eliminar: la categoría tiene platillos asociados', 409));
    }
    throw err;
  }
});

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };