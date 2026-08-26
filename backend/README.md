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

## Desarrollo local con MySQL Workbench

El backend local usa el archivo `backend/.env`, que está ignorado por Git y no
afecta las variables configuradas en Vercel. Antes de iniciarlo, completá
`DB_PASSWORD` con la contraseña de tu usuario MySQL (y, si no usás `root`,
actualizá también `DB_USER`).

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=narto_db
DB_USER=root
DB_PASSWORD=tu_contrasena_de_mysql
DB_SSL=false
```

Luego iniciá el backend con `npm run dev`. Para ver el sitio en local, desde la
raíz del proyecto ejecutá `python -m http.server 3000`; el frontend detecta
`localhost` y se conecta automáticamente al backend en `http://localhost:5000`.
