// src/controllers/categories.controller.js
//
// HU-PF-02 – Invalidación del caché al modificar categorías (RN-03, CA-04, CA-05, CA-06)
// Cada operación de escritura exitosa invalida el caché del restaurante afectado.

const pool         = require('../config/db');
const cache        = require('../services/cache.service');
const asyncHandler = require('../utils/asyncHandler');
const AppError     = require('../utils/AppError');

// ─── Helper: obtener el slug del restaurante para invalidar caché ─────────────
const getSlug = async (restaurante_id) => {
  const { rows } = await pool.query(
    'SELECT slug FROM restaurantes WHERE id = $1',
    [restaurante_id]
  );
  return rows[0]?.slug || null;
};

// ─── GET /api/categories ──────────────────────────────────────────────────────
const getCategories = asyncHandler(async (req, res) => {
  const { restaurante_id } = req.usuario;

  const { rows } = await pool.query(
    `SELECT id, nombre, orden, activa
     FROM categorias
     WHERE restaurante_id = $1
     ORDER BY orden ASC, nombre ASC`,
    [restaurante_id]
  );

  return res.status(200).json(rows);
});

// ─── POST /api/categories ─────────────────────────────────────────────────────
// CA-05: al crear, se invalida el caché del restaurante
const createCategory = asyncHandler(async (req, res) => {
  const { nombre, orden, activa } = req.body;
  const { restaurante_id } = req.usuario;

  const { rows } = await pool.query(
    `INSERT INTO categorias (restaurante_id, nombre, orden, activa)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [restaurante_id, nombre, orden ?? 0, activa !== undefined ? activa : true]
  );

  // HU-PF-02: invalidar caché (CA-05)
  const slug = await getSlug(restaurante_id);
  cache.invalidate(slug);

  return res.status(201).json(rows[0]);
});

// ─── PUT /api/categories/:id ──────────────────────────────────────────────────
// CA-04: al editar, se invalida el caché del restaurante
const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { nombre, orden, activa } = req.body;
  const { restaurante_id } = req.usuario;

  if (Number.isNaN(Number(id))) {
    throw new AppError('El ID de categoría no es válido', 400);
  }

  const { rows } = await pool.query(
    `UPDATE categorias
     SET nombre = COALESCE($1, nombre),
         orden  = COALESCE($2, orden),
         activa = COALESCE($3, activa)
     WHERE id = $4 AND restaurante_id = $5
     RETURNING *`,
    [nombre, orden, activa, id, restaurante_id]
  );

  if (rows.length === 0) throw new AppError('Categoría no encontrada', 404);

  // HU-PF-02: invalidar caché (CA-04)
  const slug = await getSlug(restaurante_id);
  cache.invalidate(slug);

  return res.status(200).json(rows[0]);
});

// ─── DELETE /api/categories/:id ───────────────────────────────────────────────
// CA-06: al eliminar, se invalida el caché del restaurante
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { restaurante_id } = req.usuario;

  if (Number.isNaN(Number(id))) {
    throw new AppError('El ID de categoría no es válido', 400);
  }

  // Obtenemos slug ANTES de eliminar (después el restaurante sigue existiendo,
  // pero lo hacemos antes por consistencia)
  const slug = await getSlug(restaurante_id);

  try {
    const { rows } = await pool.query(
      `DELETE FROM categorias
       WHERE id = $1 AND restaurante_id = $2
       RETURNING id`,
      [id, restaurante_id]
    );

    if (rows.length === 0) throw new AppError('Categoría no encontrada', 404);
  } catch (err) {
    // FK violation: conserva la respuesta controlada previa si cambia la constraint.
    if (err.code === '23503') {
      throw new AppError('No se puede eliminar: la categoría tiene platillos asociados', 409);
    }
    throw err;
  }

  // HU-PF-02: invalidar caché (CA-06)
  cache.invalidate(slug);

  return res.status(200).json({ message: 'Categoría eliminada exitosamente' });
});

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
