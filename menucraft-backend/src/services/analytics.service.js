const pool = require('../config/db');

const VALID_EVENT_TYPES = new Set([
  'qr_scan',
  'menu_view',
  'category_view',
  'product_view',
  'product_sold_out',
]);

async function recordAnalyticsEvent({
  restaurante_id,
  event_type,
  categoria_id = null,
  platillo_id = null,
  metadata = {},
}) {
  if (!restaurante_id || !VALID_EVENT_TYPES.has(event_type)) return null;

  const { rows } = await pool.query(
    `INSERT INTO analytics_events
       (restaurante_id, event_type, categoria_id, platillo_id, metadata)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id`,
    [restaurante_id, event_type, categoria_id, platillo_id, metadata]
  );

  return rows[0];
}

module.exports = {
  VALID_EVENT_TYPES,
  recordAnalyticsEvent,
};
