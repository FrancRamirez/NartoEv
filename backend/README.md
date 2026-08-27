# NartoEV — Backend

API en Node.js + Express para autenticación, gestión de usuarios y publicaciones (catálogo de cargadores con imágenes/videos).

## Stack

- **Base de datos:** TiDB Cloud (MySQL-compatible), base `narto_db`
- **Almacenamiento de media:** Cloudinary (imágenes y videos de las publicaciones)
- **Hosting:** Vercel (el backend corre como función serverless vía `api/server.js`, que exporta la app de Express directamente)
- **Auth:** JWT + bcrypt

## Endpoints

### Autenticación (sin token)
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/verify`

### Usuarios (con token)
- `GET /api/users` — Listar todos (solo admin)
- `GET /api/users/:id`
- `PUT /api/users/:id`
- `PATCH /api/users/:id/role` — Cambiar rol (solo admin)
- `DELETE /api/users/:id` (solo admin)

### Publicaciones
- `GET /api/publications/public` — Listado público, sin autenticación
- `POST /api/publications` — Crear (admin), incluyendo archivos `media` (hasta 12)
- `GET /api/publications` — Listar publicaciones del usuario (admin)
- `GET /api/publications/:id` (admin)
- `PUT /api/publications/:id` — Editar, incluyendo archivos `media` (admin)
- `DELETE /api/publications/:id` (admin)

Los archivos de las publicaciones se suben a Cloudinary; no se guardan en disco (en Vercel el filesystem no persiste entre despliegues).

### Visitas
- `POST /api/visits/track` — Sumar una visita (sin autenticación)
- `GET /api/visits/monthly` — Conteo del mes en curso (solo admin)

## Desarrollo local

```bash
cd backend
npm install
npm run dev
```

El backend local usa `backend/.env` (ignorado por Git; no afecta las variables configuradas en Vercel). Completar antes de iniciar:

```env
DB_HOST=
DB_PORT=3306
DB_NAME=narto_db
DB_USER=
DB_PASSWORD=
DB_SSL=true

JWT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

NODE_ENV=development
API_PORT=5000
CORS_ORIGIN=http://localhost:3000,http://127.0.0.1:3000
```

Para ver el sitio en local, desde la raíz del proyecto ejecutar `python -m http.server 3000`; el frontend detecta `localhost` y se conecta automáticamente al backend en `http://localhost:5000` (ver `js/api-config.js`).

## Producción

Configurado en Vercel con las variables de entorno equivalentes (DB de TiDB Cloud con SSL, credenciales de Cloudinary, `JWT_SECRET`). El CORS acepta automáticamente cualquier subdominio `*.vercel.app` además de los orígenes configurados en `CORS_ORIGIN`.
