# MenuCraft SaaS

Plataforma web multi-inquilino (SaaS) para que restaurantes creen menús digitales interactivos con actualización en tiempo real.

## Stack Tecnológico

- **Frontend:** React.js (Vite) + Tailwind CSS
- **Backend:** Node.js + Express
- **Base de Datos:** PostgreSQL
- **Autenticación:** JWT
- **Infraestructura:** Docker Compose

## Prerrequisitos

- Node.js v18 o superior
- Docker Desktop
- Git
- Cuenta en GitHub

## Clonar repositorio

```bash
git clone https://github.com/KevMon007/menu-craft.git
cd menucraft-saas
```
## Validación de Variables de Entorno

Para evitar fallos silenciosos en el sistema, se ha incorporado un mecanismo de validación automatizado al arranque del backend. Si falta alguna variable crítica (como `JWT_SECRET`), el proceso se detendrá de inmediato mostrando un error explícito por consola.

Dependiendo de cómo levantes el proyecto localmente, asegúrate de configurar tu entorno:

### Opción A: Desarrollo Local con Docker Compose
Si utilizas Docker para levantar la infraestructura completa, el validador inspeccionará las variables mapeadas en tu contenedor. Si falta algún valor obligatorio, el contenedor del backend (`menucraft-backend`) se detendrá automáticamente y verás el error crítico reflejado en los logs de Docker.

### Opción B: Desarrollo Local Nativo (Sin Docker / Node.js directo)
Si prefieres correr el servidor de manera directa desde tu terminal:
1. Dirígete a la carpeta `menucraft-backend/`.
2. Copia el archivo `.env.example` y renombralo como `.env`.
3. Rellena los valores obligatorios. Si ejecutas `npm start` omitiendo alguna variable, la consola bloqueará el inicio del servidor.

*Nota sobre `JWT_SECRET` (RN-02):* Independientemente del método que uses, para generar un string seguro puedes ejecutar el comando sugerido en la plantilla:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

## Convenciones

- **Ramas:** `main` (estable) → `develop` (integración) → `feature/*` (tareas)
- **Commits:** `feat:`, `fix:`, `docs:`, `chore:`
- **PRs:** Mínimo 1 approval antes de mergear a `develop`

## Deploy a Render

### 1. Base de Datos — Render PostgreSQL
- Crear instancia PostgreSQL en Render
- Copiar credenciales (host, puerto, usuario, contraseña, nombre de BD)

### 2. Backend — Web Service
| Config | Valor |
|--------|-------|
| Root Directory | `menucraft-backend/` |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Plan | Free |

**Variables de entorno requeridas:**
```
NODE_ENV=production
JWT_SECRET=<generar: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
JWT_EXPIRES_IN=8h
FRONTEND_URL=<URL_del_Static_Site>
DB_HOST=<Render_PostgreSQL_host>
DB_PORT=5432
DB_USER=<usuario>
DB_PASS=<password>
DB_NAME=<nombre_db>
```

### 3. Frontend — Static Site
| Config | Valor |
|--------|-------|
| Root Directory | `menu-craft/` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist/` |
| Plan | Free |

**Variable de entorno:**
```
VITE_API_URL=https://<nombre-backend>.onrender.com
```

### 4. Trigger del CI
El workflow de GitHub Actions corre automáticamente al hacer push a `main` o `develop`, validando que frontend y backend compilen correctamente.
