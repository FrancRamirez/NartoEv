# Guía de Instalación - Backend NartoEV

## 📋 Requisitos Previos

- **Node.js** (v14 o superior) - Descargá de [nodejs.org](https://nodejs.org)
- **MySQL** (v5.7 o superior) - Descargá de [mysql.com](https://www.mysql.com/downloads)
- **npm** (viene con Node.js)

---

## 🚀 Pasos de Instalación

### 1️⃣ Instalar dependencias

```bash
cd backend
npm install
```

Esto instalará:
- **express** - Framework web
- **mysql2** - Driver para MySQL
- **bcryptjs** - Para hashear contraseñas
- **jsonwebtoken** - Para generar JWT
- **dotenv** - Para cargar variables de entorno
- **cors** - Para permitir requests desde el frontend
- **nodemon** - Para desarrollo (reinicia servidor automáticamente)

### 2️⃣ Configurar base de datos

#### Opción A: Crear base de datos manualmente

Abre MySQL Workbench y ejecuta:

```sql
CREATE DATABASE narto_db;
CREATE USER 'narto_user'@'localhost' IDENTIFIED BY 'tu_contraseña_segura';
GRANT ALL PRIVILEGES ON narto_db.* TO 'narto_user'@'localhost';
FLUSH PRIVILEGES;
```

#### Opción B: Usar usuario root (desarrollo local)

En este caso, solo necesitas que MySQL esté corriendo.

### 3️⃣ Configurar variables de entorno

Copia `.env.example` a `.env`:

```bash
cp .env.example .env
```

Edita el archivo `.env` y configura:

```env
# Base de Datos
DB_HOST=localhost
DB_PORT=3306
DB_NAME=narto_db
DB_USER=root              # o 'narto_user' si creaste usuario
DB_PASSWORD=              # Tu contraseña de MySQL (vacío si es root)

# JWT
JWT_SECRET=una_clave_muy_larga_y_segura_cambiar_en_produccion

# Servidor
NODE_ENV=development
API_PORT=5000
CORS_ORIGIN=http://localhost:3000,http://127.0.0.1:3000
```

### 4️⃣ Iniciar servidor

```bash
# Desarrollo (con nodemon - auto-reinicia)
npm run dev

# Producción
npm start
```

Deberías ver:
```
✓ Conexión a MySQL exitosa
✓ Tabla "users" creada/verificada
✓ Tabla "products" creada/verificada
✓ Tabla "images" creada/verificada
✓ Tabla "videos" creada/verificada
✅ Base de datos inicializada correctamente
✓ Servidor iniciado en http://localhost:5000
✓ API disponible en http://localhost:5000/api
```

---

## 🧪 Probar la API

### Health Check

```bash
curl http://localhost:5000/api/health
```

Respuesta esperada:
```json
{
  "status": "OK",
  "message": "Servidor funcionando correctamente"
}
```

### Registrar usuario

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "password": "contraseña123",
    "password_confirm": "contraseña123"
  }'
```

### Iniciar sesión

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "contraseña123"
  }'
```

Copía el `token` de la respuesta para usarlo en otras solicitudes.

### Crear producto

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "nombre": "Cargador Domiciliario",
    "tipo": "Domiciliario",
    "potencia": "7,4 kW",
    "precio": 45000
  }'
```

---

## 📚 Estructura de la API

### Autenticación (`/api/auth`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/signup` | Registrar usuario |
| POST | `/login` | Iniciar sesión |
| GET | `/verify` | Verificar token |

### Usuarios (`/api/users`) - Requiere autenticación

| Método | Ruta | Descripción | Permisos |
|--------|------|-------------|----------|
| GET | `/` | Listar todos los usuarios | Admin |
| GET | `/:id` | Obtener usuario por ID | Usuario o Admin |
| PUT | `/:id` | Actualizar usuario | Usuario o Admin |
| DELETE | `/:id` | Eliminar usuario | Admin |

### Productos (`/api/products`) - Requiere autenticación

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/` | Crear producto |
| GET | `/` | Obtener mis productos |
| GET | `/:id` | Obtener producto por ID |
| PUT | `/:id` | Actualizar producto |
| DELETE | `/:id` | Eliminar producto |

---

## 🔐 Seguridad

### Headers requeridos en requests protegidas:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Tokens JWT expiran en: **7 días**

Si el token expira, el usuario debe iniciar sesión nuevamente.

---

## 🛠️ Troubleshooting

### Error: "ECONNREFUSED 127.0.0.1:3306"
→ MySQL no está corriendo. Inicia MySQL Workbench o MySQL Server.

### Error: "Access denied for user 'root'@'localhost'"
→ La contraseña es incorrecta. Verifica en `.env` o reinicia MySQL sin contraseña.

### Error: "Unknown database 'narto_db'"
→ El servidor creará la base de datos automáticamente, pero asegúrate de que MySQL esté corriendo.

### Puerto 5000 ya está en uso
→ Cambia `API_PORT` en `.env` a otro puerto (ej: 5001)

---

## 📦 Variables de entorno disponibles

| Variable | Descripción | Por defecto |
|----------|-------------|-------------|
| `DB_HOST` | Host de MySQL | localhost |
| `DB_PORT` | Puerto de MySQL | 3306 |
| `DB_NAME` | Nombre de la base de datos | narto_db |
| `DB_USER` | Usuario de MySQL | root |
| `DB_PASSWORD` | Contraseña de MySQL | (vacío) |
| `JWT_SECRET` | Clave para firmar tokens | (requerido) |
| `NODE_ENV` | Ambiente (development/production) | development |
| `API_PORT` | Puerto del servidor | 5000 |
| `CORS_ORIGIN` | Orígenes permitidos | localhost:3000 |

---

## ✅ Próximos pasos

1. **Conectar Frontend:** Actualizar `js/auth.js` para hacer requests al backend
2. **Panel de Usuarios:** Crear interfaz para gestionar usuarios (admin)
3. **Galería:** Implementar subida de imágenes y videos
4. **Producción:** Publicar en servidor/VPS

---

¿Necesitas ayuda con algo? Revisa los logs del servidor para detalles de errores. 🚀