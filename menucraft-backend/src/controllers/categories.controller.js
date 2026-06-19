// src/controllers/categories.controller.js
// Issue #11 - CRUD de Categorías con restricción multi-tenant

const pool = require('../config/db');

// ─── POST /api/categories ─────────────────────────────────────
const createCategory = async (req, res) => {
  const { nombre, orden } = req.body;
  const { restaurante_id } = req.usuario; // extraído del JWT por el middleware

  if (!nombre) {
    return res.status(400).json({ error: 'El nombre de la categoría es requerido' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO categorias (restaurante_id, nombre, orden)
       VALUES ($1, $2, $3) RETURNING *`,
      [restaurante_id, nombre, orden || 0]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('[Categories] Error en createCategory:', err.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ─── PUT /api/categories/:id ──────────────────────────────────
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { nombre, orden } = req.body;
  const { restaurante_id } = req.usuario;

  try {
    // La cláusula WHERE incluye restaurante_id → aislamiento multi-tenant
    const result = await pool.query(
      `UPDATE categorias
       SET nombre = COALESCE($1, nombre),
           orden  = COALESCE($2, orden)
       WHERE id = $3 AND restaurante_id = $4
       RETURNING *`,
      [nombre, orden, id, restaurante_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('[Categories] Error en updateCategory:', err.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ─── DELETE /api/categories/:id ───────────────────────────────
const deleteCategory = async (req, res) => {
  const { id } = req.params;
  const { restaurante_id } = req.usuario;

  try {
    const result = await pool.query(
      `DELETE FROM categorias
       WHERE id = $1 AND restaurante_id = $2
       RETURNING id`,
      [id, restaurante_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    return res.status(200).json({ message: 'Categoría eliminada exitosamente' });
  } catch (err) {
    console.error('[Categories] Error en deleteCategory:', err.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ─── GET /api/categories ──────────────────────────────────────
const getCategories = async (req, res) => {
  const { restaurante_id } = req.usuario;

  try {
    const result = await pool.query(
      `SELECT id, nombre, orden
       FROM categorias
       WHERE restaurante_id = $1
       ORDER BY orden ASC, nombre ASC`,
      [restaurante_id]
    );

    return res.status(200).json(result.rows);
  } catch (err) {
    console.error('[Categories] Error en getCategories:', err.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };