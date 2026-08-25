# NartoEV Backend

API local con Node.js, Express y MySQL para administrar usuarios y productos.

## Endpoints

### Autenticacion
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/verify`

### Usuarios (admin)
- `GET /api/users`
- `GET /api/users/:id`
- `PUT /api/users/:id`
- `PATCH /api/users/:id/role`
- `DELETE /api/users/:id`

### Productos
- `GET /api/products/public` - Catalogo publico sin autenticacion
- `POST /api/products` - Crear, incluyendo archivos `media`
- `GET /api/products` - Listar productos del Admin
- `GET /api/products/:id`
- `PUT /api/products/:id` - Editar, incluyendo archivos `media`
- `DELETE /api/products/:id`

Los archivos se guardan localmente en `backend/uploads` y se sirven mediante
`/uploads`. Cada operacion admite hasta 12 imagenes y videos.

## Instalacion

```bash
cd backend
npm install
npm run dev
```
