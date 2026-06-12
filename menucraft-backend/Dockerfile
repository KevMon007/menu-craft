# ============================================================
# MenuCraft SaaS - Dockerfile
# Issue #6 - Configuración base de Docker
# ============================================================

# ─── Etapa Base ──────────────────────────────────────────────
FROM node:20-alpine AS base

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar manifesto de dependencias primero (aprovecha caché de Docker)
COPY package*.json ./

# ─── Etapa de Desarrollo ─────────────────────────────────────
FROM base AS development

# Instalar TODAS las dependencias (incluye devDependencies: nodemon, jest)
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Exponer el puerto del servidor
EXPOSE 3000

# Iniciar con nodemon para recarga en caliente
CMD ["npm", "run", "dev"]


# ─── Etapa de Producción ─────────────────────────────────────
FROM base AS production

# Instalar solo dependencias de producción
RUN npm install --omit=dev

# Copiar el código fuente
COPY . .

EXPOSE 3000

# Iniciar el servidor directamente con Node
CMD ["npm", "start"]