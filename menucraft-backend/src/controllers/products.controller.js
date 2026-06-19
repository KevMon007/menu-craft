// src/controllers/products.controller.js
// Issue #11 - CRUD de Platillos con restricción multi-tenant

const pool = require('../config/db');

// ─── POST /api/products ───────────────────────────────────────
const createProduct = async (req, res) => {
  const { categoria_id, nombre, descripcion, precio, url_foto, disponible } = req.body;
  const { restaurante_id } = req.usuario;

  // TC-01: Validar campo obligatorio nombre
  if (!nombre) {
    return res.status(400).json({ error: 'El nombre del platillo es requerido' });
  }

  // TC-02: Validar precio positivo
  if (!precio || parseFloat(precio) < 0) {
    return res.status(400).json({ error: 'El precio debe ser un valor positivo' });
  }

  if (!categoria_id) {
    return res.status(400).json({ error: 'La categoría es requerida' });
  }

  try {
    // Verificar que la categoría pertenece al restaurante (multi-tenant)
    const catCheck = await pool.query(
      'SELECT id FROM categorias WHERE id = $1 AND restaurante_id = $2',
      [categoria_id, restaurante_id]
    );
    if (catCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Categoría no válida para este restaurante' });
    }

    const result = await pool.query(
      `INSERT INTO platillos
         (categoria_id, restaurante_id, nombre, descripcion, precio, url_foto, disponible)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        categoria_id,
        restaurante_id,
        nombre,
        descripcion || null,
        precio,
        url_foto || null,
        disponible !== undefined ? disponible : true,
      ]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('[Products] Error en createProduct:', err.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ─── PUT /api/products/:id ────────────────────────────────────
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, url_foto, disponible, categoria_id } = req.body;
  const { restaurante_id } = req.usuario;

  // TC-02: Validar precio si se envía
  if (precio !== undefined && parseFloat(precio) < 0) {
    return res.status(400).json({ error: 'El precio debe ser un valor positivo' });
  }

  try {
    // WHERE incluye restaurante_id → aislamiento multi-tenant (TC-04)
    const result = await pool.query(
      `UPDATE platillos
       SET nombre       = COALESCE($1, nombre),
           descripcion  = COALESCE($2, descripcion),
           precio       = COALESCE($3, precio),
           url_foto     = COALESCE($4, url_foto),
           disponible   = COALESCE($5, disponible),
           categoria_id = COALESCE($6, categoria_id),
           updated_at   = CURRENT_TIMESTAMP
       WHERE id = $7 AND restaurante_id = $8
       RETURNING *`,
      [nombre, descripcion, precio, url_foto, disponible, categoria_id, id, restaurante_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Platillo no encontrado' });
    }
    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('[Products] Error en updateProduct:', err.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ─── DELETE /api/products/:id ─────────────────────────────────
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const { restaurante_id } = req.usuario;

  try {
    const result = await pool.query(
      `DELETE FROM platillos
       WHERE id = $1 AND restaurante_id = $2
       RETURNING id`,
      [id, restaurante_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Platillo no encontrado' });
    }
    return res.status(200).json({ message: 'Platillo eliminado exitosamente' });
  } catch (err) {
    console.error('[Products] Error en deleteProduct:', err.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ─── GET /api/products ────────────────────────────────────────
const getProducts = async (req, res) => {
  const { restaurante_id } = req.usuario;
  const { categoria_id } = req.query;

  try {
    let query = `
      SELECT p.id, p.categoria_id, c.nombre AS categoria_nombre,
             p.nombre, p.descripcion, p.precio, p.url_foto, p.disponible, p.updated_at
      FROM platillos p
      JOIN categorias c ON c.id = p.categoria_id
      WHERE p.restaurante_id = $1
    `;
    const params = [restaurante_id];

    if (categoria_id) {
      query += ' AND p.categoria_id = $2';
      params.push(categoria_id);
    }

    query += ' ORDER BY c.orden ASC, c.nombre ASC, p.nombre ASC';

    const result = await pool.query(query, params);
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error('[Products] Error en getProducts:', err.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };