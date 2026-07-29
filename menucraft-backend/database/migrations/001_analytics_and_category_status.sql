ALTER TABLE categorias
ADD COLUMN IF NOT EXISTS activa BOOLEAN DEFAULT TRUE;

UPDATE categorias
SET activa = TRUE
WHERE activa IS NULL;

CREATE TABLE IF NOT EXISTS analytics_events (
    id              SERIAL PRIMARY KEY,
    restaurante_id  INTEGER NOT NULL REFERENCES restaurantes(id) ON DELETE CASCADE,
    event_type      VARCHAR(40) NOT NULL,
    categoria_id    INTEGER REFERENCES categorias(id) ON DELETE SET NULL,
    platillo_id     INTEGER REFERENCES platillos(id) ON DELETE SET NULL,
    metadata        JSONB DEFAULT '{}'::jsonb,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_analytics_restaurante_fecha
ON analytics_events(restaurante_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_tipo_fecha
ON analytics_events(event_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_categoria
ON analytics_events(categoria_id);

CREATE INDEX IF NOT EXISTS idx_analytics_platillo
ON analytics_events(platillo_id);
