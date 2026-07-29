-- ============================================================
-- MenuCraft SaaS - Inicialización de Base de Datos
-- ============================================================
-- Este script se ejecuta automáticamente al crear el
-- contenedor de PostgreSQL por primera vez.
-- ============================================================

-- ─── Tabla: Restaurantes ────────────────────────────────────
CREATE TABLE IF NOT EXISTS restaurantes (
    id          SERIAL PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL,
    slug        VARCHAR(100) UNIQUE NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── Tabla: Usuarios ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS usuarios (
    id              SERIAL PRIMARY KEY,
    restaurante_id  INTEGER NOT NULL REFERENCES restaurantes(id) ON DELETE CASCADE,
    nombre          VARCHAR(100) NOT NULL,
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    rol             VARCHAR(20) NOT NULL DEFAULT 'admin',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── Tabla: Categorías ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS categorias (
    id              SERIAL PRIMARY KEY,
    restaurante_id  INTEGER NOT NULL REFERENCES restaurantes(id) ON DELETE CASCADE,
    nombre          VARCHAR(100) NOT NULL,
    orden           INTEGER DEFAULT 0,
    activa          BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE categorias
ADD COLUMN IF NOT EXISTS activa BOOLEAN DEFAULT TRUE;

UPDATE categorias
SET activa = TRUE
WHERE activa IS NULL;

-- ─── Tabla: Platillos ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS platillos (
    id              SERIAL PRIMARY KEY,
    categoria_id    INTEGER NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
    restaurante_id  INTEGER NOT NULL REFERENCES restaurantes(id) ON DELETE CASCADE,
    nombre          VARCHAR(200) NOT NULL,
    descripcion     TEXT,
    precio          DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
    url_foto        VARCHAR(500),
    disponible      BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── Tabla: Eventos de Analíticas ───────────────────────────
CREATE TABLE IF NOT EXISTS analytics_events (
    id              SERIAL PRIMARY KEY,
    restaurante_id  INTEGER NOT NULL REFERENCES restaurantes(id) ON DELETE CASCADE,
    event_type      VARCHAR(40) NOT NULL,
    categoria_id    INTEGER REFERENCES categorias(id) ON DELETE SET NULL,
    platillo_id     INTEGER REFERENCES platillos(id) ON DELETE SET NULL,
    metadata        JSONB DEFAULT '{}'::jsonb,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── Índices ────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_restaurante ON usuarios(restaurante_id);
CREATE INDEX IF NOT EXISTS idx_categorias_restaurante ON categorias(restaurante_id);
CREATE INDEX IF NOT EXISTS idx_platillos_categoria ON platillos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_platillos_restaurante ON platillos(restaurante_id);
CREATE INDEX IF NOT EXISTS idx_platillos_disponibles ON platillos(restaurante_id, disponible);
CREATE INDEX IF NOT EXISTS idx_analytics_restaurante_fecha ON analytics_events(restaurante_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_tipo_fecha ON analytics_events(event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_categoria ON analytics_events(categoria_id);
CREATE INDEX IF NOT EXISTS idx_analytics_platillo ON analytics_events(platillo_id);
