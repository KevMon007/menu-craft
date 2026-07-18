// src/controllers/menu.controller.js
//
// HU-PF-01 – Optimización de la consulta del menú público
//   Antes: 1 query para el restaurante + N queries (una por categoría) = N+1 queries
//   Ahora: 1 query con JOIN que trae todo en una sola ida a la BD (RN-06)
//
// HU-PF-02 – Caché en memoria
//   Se integra el cache.service para evitar consultas repetitivas (CA-01, CA-02, CA-07, CA-08)
//   La estructura de respuesta NO cambia (RN-01, CA-02, CA-03)

const pool        = require('../config/db');
const cache       = require('../services/cache.service');
const asyncHandler = require('../utils/asyncHandler');
const AppError    = require('../utils/AppError');

// ─── GET /api/menu/:slug ──────────────────────────────────────────────────────
const getMenu = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  // ── HU-PF-02: intentar responder desde caché (CA-02) ─────────────────────
  const cached = cache.get(slug);
  if (cached) {
    console.log(`[Cache] HIT: ${slug}`);
    return res.status(200).json(cached);
  }
  console.log(`[Cache] MISS: ${slug} — consultando BD`);

  // ── HU-PF-01: una sola query con JOIN en lugar de N+1 queries (RN-06) ────
  // La query:
  //   1. Verifica que el restaurante exista
  //   2. Trae todas las categorías del restaurante ordenadas
  //   3. Por cada categoría trae sus platillos disponibles (RN-03)
  //   4. Respeta el aislamiento multi-tenant vía restaurante_id (RN-02)
  //   5. Excluye platillos con disponible = false (RN-03)
  const { rows } = await pool.query(
    `SELECT
       r.id            AS restaurante_id,
       r.nombre        AS restaurante_nombre,
       r.slug          AS restaurante_slug,
       c.id            AS categoria_id,
       c.nombre        AS categoria_nombre,
       c.orden         AS categoria_orden,
       p.id            AS platillo_id,
       p.nombre        AS platillo_nombre,
       p.descripcion   AS platillo_descripcion,
       p.precio        AS platillo_precio,
       p.url_foto      AS platillo_url_foto,
       p.disponible    AS platillo_disponible
     FROM restaurantes r
     LEFT JOIN categorias c
       ON c.restaurante_id = r.id
     LEFT JOIN platillos p
       ON p.categoria_id = c.id
      AND p.restaurante_id = r.id
      AND p.disponible = TRUE
     WHERE r.slug = $1
     ORDER BY c.orden ASC, c.nombre ASC, p.nombre ASC`,
    [slug]
  );

  // CA-05 (TC-05): slug inexistente → 404
  if (rows.length === 0 || rows[0].restaurante_id === null) {
    throw new AppError('Restaurante no encontrado', 404);
  }

  // ── Construir la estructura de respuesta (RN-01: misma forma que antes) ───
  const restaurante = {
    nombre: rows[0].restaurante_nombre,
    slug:   rows[0].restaurante_slug,
  };

  // Agrupar filas por categoría usando un Map para O(1) lookup
  const categoriasMap = new Map();

  for (const row of rows) {
    if (!row.categoria_id) continue; // restaurante sin categorías

    if (!categoriasMap.has(row.categoria_id)) {
      categoriasMap.set(row.categoria_id, {
        id:       row.categoria_id,
        nombre:   row.categoria_nombre,
        orden:    row.categoria_orden,
        platillos: [],
      });
    }

    if (row.platillo_id) {
      categoriasMap.get(row.categoria_id).platillos.push({
        id:          row.platillo_id,
        nombre:      row.platillo_nombre,
        descripcion: row.platillo_descripcion,
        precio:      row.platillo_precio,
        url_foto:    row.platillo_url_foto,
      });
    }
  }

  const response = {
    restaurante,
    categorias: Array.from(categoriasMap.values()),
  };

  // ── HU-PF-02: guardar en caché antes de responder (CA-01, CA-07) ─────────
  cache.set(slug, response);

  return res.status(200).json(response);
});

module.exports = { getMenu };