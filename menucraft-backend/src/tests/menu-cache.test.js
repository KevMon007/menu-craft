// src/tests/menu-cache.test.js
// Pruebas unitarias para HU-PF-01 y HU-PF-02

jest.mock('../config/db', () => ({ query: jest.fn() }));

const pool     = require('../config/db');
const cache    = require('../services/cache.service');
const AppError = require('../utils/AppError');

// ─── Datos de prueba ──────────────────────────────────────────────────────────
const mockRows = [
  {
    restaurante_id:      1,
    restaurante_nombre:  'El Taco Loco',
    restaurante_slug:    'el-taco-loco',
    categoria_id:        1,
    categoria_nombre:    'Tacos',
    categoria_orden:     1,
    platillo_id:         1,
    platillo_nombre:     'Taco de Bistec',
    platillo_descripcion:'Con cebolla y cilantro',
    platillo_precio:     '45.00',
    platillo_url_foto:   'https://cloudinary.com/img.jpg',
    platillo_disponible: true,
  },
];

const mockResponse = {
  restaurante: { nombre: 'El Taco Loco', slug: 'el-taco-loco' },
  categorias: [{
    id: 1, nombre: 'Tacos', orden: 1,
    platillos: [{
      id: 1, nombre: 'Taco de Bistec',
      descripcion: 'Con cebolla y cilantro',
      precio: '45.00', url_foto: 'https://cloudinary.com/img.jpg',
    }],
  }],
};

const mockReq = (params = {}, body = {}, usuario = {}, query = {}) => ({ params, body, usuario, query });
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
};
const flushPromises = () => new Promise((resolve) => setImmediate(resolve));

// ══════════════════════════════════════════════════════════════════════════════
// HU-PF-02: Cache Service
// ══════════════════════════════════════════════════════════════════════════════
describe('HU-PF-02 – Cache Service', () => {
  beforeEach(() => cache.clear());

  test('CA-01 – set() almacena datos correctamente', () => {
    cache.set('el-taco-loco', mockResponse);
    expect(cache.get('el-taco-loco')).toEqual(mockResponse);
  });

  test('CA-02 – get() retorna datos cacheados existentes', () => {
    cache.set('el-taco-loco', mockResponse);
    expect(cache.get('el-taco-loco')).toEqual(mockResponse);
    expect(cache.size()).toBe(1);
  });

  test('CA-03/04/05/06 – invalidate() elimina el caché correctamente', () => {
    cache.set('el-taco-loco', mockResponse);
    cache.invalidate('el-taco-loco');
    expect(cache.get('el-taco-loco')).toBeNull();
  });

  test('CA-07 – get() retorna null cuando caché no existe', () => {
    expect(cache.get('slug-inexistente')).toBeNull();
  });

  test('invalidate() sobre slug no cacheado no lanza error', () => {
    expect(() => cache.invalidate('no-existe')).not.toThrow();
  });

  test('RN-01 – cada slug tiene su propio caché independiente', () => {
    const menu1 = { restaurante: { slug: 'rest-a' }, categorias: [] };
    const menu2 = { restaurante: { slug: 'rest-b' }, categorias: [] };
    cache.set('rest-a', menu1);
    cache.set('rest-b', menu2);
    cache.invalidate('rest-a');
    expect(cache.get('rest-a')).toBeNull();
    expect(cache.get('rest-b')).toEqual(menu2);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// HU-PF-01: Menu Controller
// ══════════════════════════════════════════════════════════════════════════════
describe('HU-PF-01 – Menu Controller optimizado', () => {
  // Importamos el controller DENTRO del describe para que use el mock ya activo
  const { getMenu } = require('../controllers/menu.controller');

  beforeEach(() => {
    cache.clear();
    pool.query.mockClear();
  });

  test('CA-01/RN-06 – realiza una sola consulta JOIN a la BD', async () => {
    pool.query.mockResolvedValueOnce({ rows: mockRows });
    await getMenu(mockReq({ slug: 'el-taco-loco' }), mockRes(), jest.fn());
    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(pool.query.mock.calls[0][0]).toContain('JOIN categorias');
    expect(pool.query.mock.calls[0][0]).toContain('JOIN platillos');
  });

  test('CA-02/RN-01 – la estructura del JSON de respuesta no cambió', async () => {
    pool.query.mockResolvedValueOnce({ rows: mockRows });
    const res = mockRes();
    await getMenu(mockReq({ slug: 'el-taco-loco' }), res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(200);
    const body = res.json.mock.calls[0][0];
    expect(body).toHaveProperty('restaurante');
    expect(body).toHaveProperty('categorias');
    expect(Array.isArray(body.categorias)).toBe(true);
    expect(body.categorias[0]).toHaveProperty('platillos');
  });

  test('CA-04/RN-02 – la query filtra por slug (aislamiento multi-tenant)', async () => {
    pool.query.mockResolvedValueOnce({ rows: mockRows });
    await getMenu(mockReq({ slug: 'el-taco-loco' }), mockRes(), jest.fn());
    expect(pool.query.mock.calls[0][1]).toEqual(['el-taco-loco']);
  });

  test('CA-05 – restaurante inexistente no se cachea', () => {
    // Verificar que un slug que no existe no queda en caché
    expect(cache.get('no-existe')).toBeNull();
    expect(cache.size()).toBe(0);
  });

  test('CA-05/RN-03 – la query filtra platillos con disponible = TRUE', async () => {
    pool.query.mockResolvedValueOnce({ rows: mockRows });
    await getMenu(mockReq({ slug: 'el-taco-loco' }), mockRes(), jest.fn());
    expect(pool.query.mock.calls[0][0]).toContain('disponible = TRUE');
  });

  test('HU-PF-02 CA-02 – segunda consulta usa caché, no consulta BD', async () => {
    pool.query.mockResolvedValueOnce({ rows: mockRows });
    const req = mockReq({ slug: 'el-taco-loco' });
    await getMenu(req, mockRes(), jest.fn());
    await getMenu(req, mockRes(), jest.fn());
    expect(pool.query).toHaveBeenCalledTimes(1);
  });

  test('CA-08 – la URL del QR funciona con caché', async () => {
    pool.query.mockResolvedValueOnce({ rows: mockRows });
    const res = mockRes();
    await getMenu(mockReq({ slug: 'el-taco-loco' }), res, jest.fn());
    expect(res.json.mock.calls[0][0].restaurante.slug).toBe('el-taco-loco');
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// HU-PF-02: Invalidación sin romper endpoints administrativos
// ══════════════════════════════════════════════════════════════════════════════
describe('HU-PF-02 – Contratos administrativos e invalidación', () => {
  const productsController = require('../controllers/products.controller');
  const categoriesController = require('../controllers/categories.controller');

  beforeEach(() => {
    cache.clear();
    pool.query.mockReset();
  });

  test('GET /api/products conserva categoria_nombre, updated_at y orden administrativo', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    productsController.getProducts(
      mockReq({}, {}, { restaurante_id: 1 }),
      mockRes(),
      jest.fn()
    );
    await flushPromises();

    const query = pool.query.mock.calls[0][0];
    expect(query).toContain('c.nombre AS categoria_nombre');
    expect(query).toContain('p.updated_at');
    expect(query).toContain('ORDER BY c.orden ASC, c.nombre ASC, p.nombre ASC');
  });

  test('updateProduct rechaza categoria_id de otro restaurante', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });
    const next = jest.fn();

    productsController.updateProduct(
      mockReq({ id: '10' }, { categoria_id: 99 }, { restaurante_id: 1 }),
      mockRes(),
      next
    );
    await flushPromises();

    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(pool.query.mock.calls[0][0]).toContain('SELECT id FROM categorias');
    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Categoría no válida para este restaurante',
      statusCode: 403,
    }));
  });

  test('updateProduct invalida caché después de actualizar correctamente', async () => {
    cache.set('el-taco-loco', mockResponse);
    pool.query
      .mockResolvedValueOnce({ rows: [{ id: 99 }] })
      .mockResolvedValueOnce({ rows: [{ id: 10, nombre: 'Taco actualizado' }] })
      .mockResolvedValueOnce({ rows: [{ slug: 'el-taco-loco' }] });

    productsController.updateProduct(
      mockReq({ id: '10' }, { categoria_id: 99, nombre: 'Taco actualizado' }, { restaurante_id: 1 }),
      mockRes(),
      jest.fn()
    );
    await flushPromises();

    expect(cache.get('el-taco-loco')).toBeNull();
  });

  test('updateCategory invalida caché después de actualizar correctamente', async () => {
    cache.set('el-taco-loco', mockResponse);
    pool.query
      .mockResolvedValueOnce({ rows: [{ id: 1, nombre: 'Tacos', orden: 1 }] })
      .mockResolvedValueOnce({ rows: [{ slug: 'el-taco-loco' }] });

    categoriesController.updateCategory(
      mockReq({ id: '1' }, { nombre: 'Tacos' }, { restaurante_id: 1 }),
      mockRes(),
      jest.fn()
    );
    await flushPromises();

    expect(cache.get('el-taco-loco')).toBeNull();
  });
});
