// src/controllers/products.controller.js
// Issue #11 - CRUD de Platillos con restricción multi-tenant
// Refactor: manejo global de errores (asyncHandler + AppError) en vez de try/catch manual.
// La validación de payload ahora vive en validators.middleware.js (validateProduct).

const pool         = require('../config/db');
const AppError     = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// ─── GET /api/products ────────────────────────────────────────
const getProducts = asyncHandler(async (req, res) => {
  const { restaurante_id } = req.usuario;
  const { categoria_id } = req.query;

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
});

// ─── POST /api/products ───────────────────────────────────────
const createProduct = asyncHandler(async (req, res, next) => {
  const { categoria_id, nombre, descripcion, precio, url_foto, disponible } = req.body;
  const { restaurante_id } = req.usuario;

  // Verificar que la categoría pertenece al restaurante (multi-tenant)
  const catCheck = await pool.query(
    'SELECT id FROM categorias WHERE id = $1 AND restaurante_id = $2',
    [categoria_id, restaurante_id]
  );
  if (catCheck.rows.length === 0) {
    return next(new AppError('Categoría no válida para este restaurante', 403));
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
});

// ─── PUT /api/products/:id ────────────────────────────────────
const updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, url_foto, disponible, categoria_id } = req.body;
  const { restaurante_id } = req.usuario;

  if (Number.isNaN(Number(id))) {
    return next(new AppError('El ID de platillo no es válido', 400));
  }

  // Si se está cambiando de categoría, revalidar pertenencia al restaurante
  if (categoria_id !== undefined) {
    const catCheck = await pool.query(
      'SELECT id FROM categorias WHERE id = $1 AND restaurante_id = $2',
      [categoria_id, restaurante_id]
    );
    if (catCheck.rows.length === 0) {
      return next(new AppError('Categoría no válida para este restaurante', 403));
    }
  }

  // WHERE incluye restaurante_id -> aislamiento multi-tenant
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
    return next(new AppError('Platillo no encontrado', 404));
  }
  return res.status(200).json(result.rows[0]);
});

// ─── DELETE /api/products/:id ─────────────────────────────────
const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { restaurante_id } = req.usuario;

  if (Number.isNaN(Number(id))) {
    return next(new AppError('El ID de platillo no es válido', 400));
  }

  const result = await pool.query(
    `DELETE FROM platillos
     WHERE id = $1 AND restaurante_id = $2
     RETURNING id`,
    [id, restaurante_id]
  );

  if (result.rows.length === 0) {
    return next(new AppError('Platillo no encontrado', 404));
  }
  return res.status(200).json({ message: 'Platillo eliminado exitosamente' });
});

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };