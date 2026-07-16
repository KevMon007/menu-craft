// src/controllers/products.controller.js
//
// HU-PF-02 – Invalidación del caché al modificar platillos (RN-02, CA-03, CA-05, CA-06)
// Cada operación de escritura exitosa invalida el caché del restaurante afectado.

const pool         = require('../config/db');
const cache        = require('../services/cache.service');
const asyncHandler = require('../utils/asyncHandler');
const AppError     = require('../utils/AppError');

// ─── Helper: obtener slug del restaurante ─────────────────────────────────────
const getSlug = async (restaurante_id) => {
  const { rows } = await pool.query(
    'SELECT slug FROM restaurantes WHERE id = $1',
    [restaurante_id]
  );
  return rows[0]?.slug || null;
};

// ─── GET /api/products ────────────────────────────────────────────────────────
const getProducts = asyncHandler(async (req, res) => {
  const { restaurante_id } = req.usuario;
  const { categoria_id } = req.query;

  let query = `SELECT id, categoria_id, nombre, descripcion, precio, url_foto, disponible
               FROM platillos
               WHERE restaurante_id = $1`;
  const params = [restaurante_id];

  if (categoria_id) {
    query += ` AND categoria_id = $2`;
    params.push(categoria_id);
  }

  query += ` ORDER BY nombre ASC`;

  const { rows } = await pool.query(query, params);
  return res.status(200).json(rows);
});

// ─── POST /api/products ───────────────────────────────────────────────────────
// CA-05: al crear platillo, se invalida el caché
const createProduct = asyncHandler(async (req, res) => {
  const { categoria_id, nombre, descripcion, precio, url_foto, disponible } = req.body;
  const { restaurante_id } = req.usuario;

  // Verificar que la categoría pertenece al restaurante (multi-tenant)
  const catCheck = await pool.query(
    'SELECT id FROM categorias WHERE id = $1 AND restaurante_id = $2',
    [categoria_id, restaurante_id]
  );
  if (catCheck.rows.length === 0) {
    throw new AppError('Categoría no válida para este restaurante', 403);
  }

  const { rows } = await pool.query(
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

  // HU-PF-02: invalidar caché (CA-05)
  const slug = await getSlug(restaurante_id);
  cache.invalidate(slug);

  return res.status(201).json(rows[0]);
});

// ─── PUT /api/products/:id ────────────────────────────────────────────────────
// CA-03: al editar platillo (incluido cambiar disponibilidad), se invalida el caché
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, url_foto, disponible, categoria_id } = req.body;
  const { restaurante_id } = req.usuario;

  const { rows } = await pool.query(
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

  if (rows.length === 0) throw new AppError('Platillo no encontrado', 404);

  // HU-PF-02: invalidar caché (CA-03)
  const slug = await getSlug(restaurante_id);
  cache.invalidate(slug);

  return res.status(200).json(rows[0]);
});

// ─── DELETE /api/products/:id ─────────────────────────────────────────────────
// CA-06: al eliminar platillo, se invalida el caché
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { restaurante_id } = req.usuario;

  const slug = await getSlug(restaurante_id);

  const { rows } = await pool.query(
    `DELETE FROM platillos
     WHERE id = $1 AND restaurante_id = $2
     RETURNING id`,
    [id, restaurante_id]
  );

  if (rows.length === 0) throw new AppError('Platillo no encontrado', 404);

  // HU-PF-02: invalidar caché (CA-06)
  cache.invalidate(slug);

  return res.status(200).json({ message: 'Platillo eliminado exitosamente' });
});

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };