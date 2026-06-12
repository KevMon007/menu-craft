# MenuCraft SaaS — Backend API

Backend RESTful en Node.js + Express para la plataforma MenuCraft SaaS.

---

## Requisitos

- **Node.js** v18+
- **Docker** y **Docker Compose** v2+

---

## Setup Local (Issues #5 y #6)

### 1. Clonar y entrar a la rama
```bash
git checkout -b feature/backend-base
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
# Edita .env con tus valores reales
```

### 3a. Levantar con Docker (recomendado — Issue #6)
```bash
docker compose up --build
```
Esto levanta dos servicios:
| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| `api`    | 3000   | Backend Express con hot reload |
| `db`     | 5432   | PostgreSQL 16 |

### 3b. Levantar sin Docker (solo backend)
```bash
npm install
npm run dev
```

---

## Verificar que todo funciona

```bash
# Health check (Issue #5 - Subtarea 1)
curl http://localhost:3000/health

# Respuesta esperada:
# { "status": "ok", "service": "MenuCraft API", "timestamp": "..." }
```

---

## Estructura del proyecto

```
menucraft-backend/
├── src/
│   ├── index.js        # Entry point — inicia el servidor
│   └── app.js          # Configuración de Express (middlewares, rutas)
├── .env.example        # Plantilla de variables (Issue #5 - Subtarea 2)
├── .env                # Variables reales — NO subir al repo
├── .gitignore          # .env ignorado (Issue #5 - Subtarea 2)
├── Dockerfile          # Imagen Docker del backend (Issue #6)
├── docker-compose.yml  # Servicios api + db (Issue #6)
└── package.json
```

---

## Issues completados

| Issue | Subtarea | Estado |
|-------|----------|--------|
| #5 | Inicializar Node.js + Express + endpoint `/health` | ✅ |
| #5 | `.env.example` con variables + `.env` en `.gitignore` | ✅ |
| #6 | `Dockerfile` multietapa (dev/prod) | ✅ |
| #6 | `docker-compose.yml` con servicios `api` y `db` | ✅ |