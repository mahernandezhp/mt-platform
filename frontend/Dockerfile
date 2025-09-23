# syntax=docker.io/docker/dockerfile:1

# Usamos una imagen de Node.js que incluye herramientas de compilación.
# La versión Alpine es ligera.
FROM node:22-alpine AS base

# Instala dependencias del sistema operativo que podrían ser necesarias.
RUN apk add --no-cache libc6-compat

# Establecemos el directorio de trabajo.
WORKDIR /app

# Copiamos los archivos de definición de dependencias.
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./

# Instalamos TODAS las dependencias, incluyendo las de desarrollo
RUN \
  if [ -f yarn.lock ]; then yarn; \
  elif [ -f package-lock.json ]; then npm install; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i; \
  else npm install; \
  fi

# Copiamos el resto del código fuente.
# Esto es útil para que la imagen se pueda construir, pero en desarrollo lo sobreescribiremos con un volumen.
COPY . .

# Exponemos el puerto 3000, que es el que usa 'next dev' por defecto.
EXPOSE 3000

# El comando para iniciar el servidor de desarrollo.
CMD ["npm", "run", "dev"]