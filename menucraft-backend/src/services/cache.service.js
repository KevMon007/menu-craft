// src/services/cache.service.js
//
// HU-PF-02 – Implementación de caché para el menú público
//
// Caché en memoria (Map) con TTL configurable.
// Clave única por restaurante usando el slug (RN-01).
// Solo aplica al endpoint público del menú (RN-05).
// Se invalida automáticamente al modificar categorías o platillos (RN-02, RN-03).
// Se reconstruye automáticamente en la siguiente consulta (RN-06).

const TTL_MS = parseInt(process.env.CACHE_TTL_MS) || 5 * 60 * 1000; // 5 minutos por defecto

// Estructura: Map<slug, { data: Object, expiresAt: number }>
const store = new Map();

/**
 * Obtiene el menú del caché si existe y no ha expirado.
 * @param {string} slug
 * @returns {Object|null} datos cacheados o null si no existen / expiraron
 */
const get = (slug) => {
  const entry = store.get(slug);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    store.delete(slug);
    return null;
  }

  return entry.data;
};

/**
 * Almacena el menú en caché para el slug indicado (CA-01).
 * @param {string} slug
 * @param {Object} data
 */
const set = (slug, data) => {
  store.set(slug, {
    data,
    expiresAt: Date.now() + TTL_MS,
  });
};

/**
 * Invalida el caché de un restaurante específico por su slug (CA-03, CA-04, CA-05, CA-06).
 * @param {string} slug
 */
const invalidate = (slug) => {
  if (slug && store.has(slug)) {
    store.delete(slug);
    console.log(`[Cache] Invalidado: ${slug}`);
  }
};

/**
 * Limpia todo el caché (útil para testing).
 */
const clear = () => store.clear();

/**
 * Retorna el número de entradas activas en caché (útil para monitoreo).
 */
const size = () => store.size;

module.exports = { get, set, invalidate, clear, size };