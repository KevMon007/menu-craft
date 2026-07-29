const pool = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { VALID_EVENT_TYPES, recordAnalyticsEvent } = require('../services/analytics.service');

const getRestaurantIdBySlug = async (slug) => {
  const { rows } = await pool.query(
    'SELECT id FROM restaurantes WHERE slug = $1',
    [slug]
  );

  return rows[0]?.id || null;
};

const recordEvent = asyncHandler(async (req, res) => {
  const {
    slug,
    event_type,
    categoria_id = null,
    platillo_id = null,
    metadata = {},
  } = req.body;

  if (!slug) throw new AppError('El slug del restaurante es requerido', 400);
  if (!VALID_EVENT_TYPES.has(event_type)) throw new AppError('Tipo de evento no válido', 400);

  const restaurante_id = await getRestaurantIdBySlug(slug);
  if (!restaurante_id) throw new AppError('Restaurante no encontrado', 404);

  if (categoria_id) {
    const { rows } = await pool.query(
      'SELECT id FROM categorias WHERE id = $1 AND restaurante_id = $2',
      [categoria_id, restaurante_id]
    );
    if (rows.length === 0) throw new AppError('Categoría no válida para este restaurante', 403);
  }

  if (platillo_id) {
    const { rows } = await pool.query(
      'SELECT id FROM platillos WHERE id = $1 AND restaurante_id = $2',
      [platillo_id, restaurante_id]
    );
    if (rows.length === 0) throw new AppError('Platillo no válido para este restaurante', 403);
  }

  await recordAnalyticsEvent({
    restaurante_id,
    event_type,
    categoria_id,
    platillo_id,
    metadata,
  });

  return res.status(201).json({ message: 'Evento registrado' });
});

const getDashboardAnalytics = asyncHandler(async (req, res) => {
  const { restaurante_id } = req.usuario;

  const [summary, visitsByDay, menuStatus, topSoldOutProducts, recentEvents] = await Promise.all([
    pool.query(
      `SELECT
         COUNT(*) FILTER (WHERE event_type = 'qr_scan' AND created_at >= CURRENT_DATE) AS qr_scans_today,
         COUNT(*) FILTER (WHERE event_type = 'menu_view' AND created_at >= CURRENT_DATE) AS menu_views_today,
         COUNT(*) FILTER (WHERE event_type = 'menu_view' AND created_at >= CURRENT_DATE - INTERVAL '6 days') AS menu_views_last_7_days,
         COUNT(*) FILTER (WHERE event_type = 'product_sold_out' AND date_trunc('month', created_at) = date_trunc('month', CURRENT_DATE)) AS sold_out_this_month
       FROM analytics_events
       WHERE restaurante_id = $1`,
      [restaurante_id]
    ),
    pool.query(
      `SELECT to_char(day::date, 'YYYY-MM-DD') AS date,
              COALESCE(COUNT(ae.id), 0)::int AS views
       FROM generate_series(CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE, INTERVAL '1 day') AS day
       LEFT JOIN analytics_events ae
         ON ae.restaurante_id = $1
        AND ae.event_type = 'menu_view'
        AND ae.created_at::date = day::date
       GROUP BY day
       ORDER BY day ASC`,
      [restaurante_id]
    ),
    pool.query(
      `SELECT
         (SELECT COUNT(*) FROM categorias WHERE restaurante_id = $1 AND activa = TRUE)::int AS active_categories,
         (SELECT COUNT(*) FROM categorias WHERE restaurante_id = $1 AND activa = FALSE)::int AS inactive_categories,
         (SELECT COUNT(*) FROM platillos WHERE restaurante_id = $1 AND disponible = TRUE)::int AS available_products,
         (SELECT COUNT(*) FROM platillos WHERE restaurante_id = $1 AND disponible = FALSE)::int AS unavailable_products`,
      [restaurante_id]
    ),
    pool.query(
      `SELECT p.id, p.nombre, COUNT(ae.id)::int AS times
       FROM analytics_events ae
       JOIN platillos p ON p.id = ae.platillo_id
       WHERE ae.restaurante_id = $1
         AND ae.event_type = 'product_sold_out'
         AND ae.created_at >= CURRENT_DATE - INTERVAL '30 days'
       GROUP BY p.id, p.nombre
       ORDER BY times DESC, p.nombre ASC
       LIMIT 5`,
      [restaurante_id]
    ),
    pool.query(
      `SELECT ae.event_type,
              ae.created_at,
              c.nombre AS categoria_nombre,
              p.nombre AS platillo_nombre
       FROM analytics_events ae
       LEFT JOIN categorias c ON c.id = ae.categoria_id
       LEFT JOIN platillos p ON p.id = ae.platillo_id
       WHERE ae.restaurante_id = $1
         AND ae.event_type IN ('qr_scan', 'menu_view', 'product_sold_out')
       ORDER BY ae.created_at DESC
       LIMIT 8`,
      [restaurante_id]
    ),
  ]);

  const row = summary.rows[0] || {};
  const status = menuStatus.rows[0] || {};

  return res.status(200).json({
    qrScansToday: Number(row.qr_scans_today || 0),
    menuViewsToday: Number(row.menu_views_today || 0),
    menuViewsLast7Days: Number(row.menu_views_last_7_days || 0),
    soldOutThisMonth: Number(row.sold_out_this_month || 0),
    activeCategories: Number(status.active_categories || 0),
    inactiveCategories: Number(status.inactive_categories || 0),
    availableProducts: Number(status.available_products || 0),
    unavailableProducts: Number(status.unavailable_products || 0),
    visitsByDay: visitsByDay.rows,
    topSoldOutProducts: topSoldOutProducts.rows,
    recentEvents: recentEvents.rows,
  });
});

module.exports = {
  recordEvent,
  getDashboardAnalytics,
};
