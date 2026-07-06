// src/controllers/menu.controller.js
// Endpoint público para el comensal - GET /api/menu/:slug

const pool = require('../config/db');

const getMenu = async (req, res) => {
  const { slug } = req.params;

  try {
    // TC-05: Verificar que el restaurante con ese slug existe
    const restoResult = await pool.query(
      'SELECT id, nombre, slug FROM restaurantes WHERE slug = $1',
      [slug]
    );

    if (restoResult.rows.length === 0) {
      return res.status(404).json({ error: 'Restaurante no encontrado' });
    }

    const restaurante = restoResult.rows[0];

    // Obtener categorías con sus platillos disponibles (TC-06)
    const categoriasResult = await pool.query(
      `SELECT c.id, c.nombre, c.orden
       FROM categorias c
       WHERE c.restaurante_id = $1
       ORDER BY c.orden ASC, c.nombre ASC`,
      [restaurante.id]
    );

    // Para cada categoría, traer sus platillos disponibles
    const categorias = await Promise.all(
      categoriasResult.rows.map(async (cat) => {
        const platillosResult = await pool.query(
          `SELECT id, nombre, descripcion, precio, url_foto
           FROM platillos
           WHERE categoria_id = $1
             AND restaurante_id = $2
             AND disponible = TRUE
           ORDER BY nombre ASC`,
          [cat.id, restaurante.id]
        );
        return {
          ...cat,
          platillos: platillosResult.rows,
        };
      })
    );

    return res.status(200).json({
      restaurante: {
        nombre: restaurante.nombre,
        slug:   restaurante.slug,
      },
      categorias,
    });
  } catch (err) {
    console.error('[Menu] Error en getMenu:', err.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { getMenu };