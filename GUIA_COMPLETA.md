# Guía Completa - NartoEV (Backend Local MySQL)

## 📋 Resumen

Este proyecto usa:
- **Frontend:** HTML + CSS + JavaScript (en raíz del proyecto)
- **Backend:** Node.js + Express (en carpeta `backend/`)
- **Base de Datos:** MySQL (local)
- **Autenticación:** JWT + Bcrypt
- **Control de Versiones:** GitHub (con `.gitignore`)

---

## 🔧 PASO 1: Instalar Dependencias

### 1.1 Node.js

Descargá de [nodejs.org](https://nodejs.org)
- Elegí la versión LTS (recomendada)
- Durante la instalación, selecciona: ✓ npm, ✓ Add to PATH

Verificá la instalación:
```bash
node --version
npm --version
```

### 1.2 MySQL

Descargá de [mysql.com](https://www.mysql.com/downloads)

**Opción recomendada:** MySQL Community Server + MySQL Workbench

Después de instalar, verifica que MySQL esté corriendo:
- **Windows:** Services → busca "MySQL" → debe decir "Running"
- **Terminal:** `mysql -u root` (si funciona, está bien)

---

## 🗄️ PASO 2: Crear Base de Datos

Abre **MySQL Workbench** y ejecuta:

```sql
CREATE DATABASE narto_db;
```

**Nota:** El backend creará las tablas automáticamente al iniciar.

---

## 📁 PASO 3: Configurar Backend

### 3.1 Instalar dependencias del backend

```bash
cd backend
npm install
```

Esto descargará todos los paquetes necesarios (~200MB).

### 3.2 Configurar archivo `.env`

El archivo `.env` ya existe en `backend/`, pero verifica que esté correcto:

```bash
# Abre backend/.env en VS Code
# Debería verse así:

DB_HOST=localhost
DB_PORT=3306
DB_NAME=narto_db
DB_USER=root
DB_PASSWORD=

JWT_SECRET=tu_clave_jwt_muy_segura_y_larga_aqui

NODE_ENV=development
API_PORT=5000
CORS_ORIGIN=http://localhost:3000,http://127.0.0.1:3000
```

**Si usaste usuario diferente en MySQL:**
```env
DB_USER=narto_user
DB_PASSWORD=tu_contraseña_aqui
```

---

## 🚀 PASO 4: Iniciar el Servidor

```bash
cd backend
npm run dev
```

**Deberías ver algo como:**
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

Si hay errores, ve a la sección **Troubleshooting** abajo.

---

## 💻 PASO 5: Abrir el Frontend

En **otra ventana de terminal** (sin cerrar el servidor):

```bash
# En la raíz del proyecto (narto-ev/)
# Abre index.html con un servidor local

# Opción A: Python (si lo tienes)
python -m http.server 3000

# Opción B: Node (instala http-server)
npx http-server -p 3000

# Opción C: Abrí directamente en el navegador
# Click derecho en index.html → "Open with Live Server"
```

Visita: `http://localhost:3000` (o la URL que te muestre)

---

## ✅ PASO 6: Probar el Sistema

### 6.1 Acceder a la página
1. Abre `http://localhost:3000` en el navegador
2. Haz clic en el ícono de login (arriba a la derecha)

### 6.2 Registrar cuenta
1. Haz clic en "Regístrate aquí"
2. Completa el formulario:
   - **Nombre:** Tu nombre
   - **Email:** prueba@ejemplo.com
   - **Contraseña:** Contraseña123
3. Haz clic en "Registrarse"

Si funciona, verás: **"✓ Cuenta creada correctamente. Por favor inicia sesión."**

### 6.3 Iniciar sesión
1. Llena los campos con el email y contraseña que registraste
2. Haz clic en "Iniciar Sesión"
3. Deberías ser redirigido al dashboard

---

## 🎯 Estructura de Carpetas

```
narto-ev/
├── index.html                 ← Página principal (landing)
├── auth.html                  ← Página de login/registro
├── dashboard.html             ← Panel de administración
├── css/
│   ├── style.css
│   ├── auth.css
│   └── dashboard.css
├── js/
│   ├── main.js               ← Lógica de la landing
│   ├── auth.js               ← Conecta con backend (login/registro)
│   └── dashboard.js          ← Conecta con backend (admin)
├── assets/
│   ├── logo.jpg
│   └── registro_inicio_sesion.svg
├── backend/                   ← API REST (Node.js + Express)
│   ├── server.js
│   ├── package.json
│   ├── .env                  ← Variables de entorno (NO subir a GitHub)
│   ├── .gitignore
│   ├── config/
│   │   ├── db.js             ← Conexión MySQL
│   │   └── init-db.js        ← Script de inicialización
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── usersController.js
│   │   └── productsController.js
│   ├── middleware/
│   │   └── auth.js           ← Validación JWT
│   └── routes/
│       ├── auth.js
│       ├── users.js
│       └── products.js
└── README.md                 ← Este archivo
```

---

## 📡 API Endpoints

### Autenticación (sin token requerido)

**Registrar:**
```bash
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "contraseña123",
  "password_confirm": "contraseña123"
}
```

**Iniciar Sesión:**
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "contraseña123"
}
```

Respuesta:
```json
{
  "message": "Sesión iniciada correctamente",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "role": "user"
  }
}
```

### Usuarios (requiere token)

```bash
# Listar usuarios (solo admin)
GET http://localhost:5000/api/users
Authorization: Bearer <token>

# Obtener usuario
GET http://localhost:5000/api/users/1
Authorization: Bearer <token>

# Actualizar usuario
PUT http://localhost:5000/api/users/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre": "Nuevo Nombre",
  "email": "nuevo@example.com"
}

# Eliminar usuario (solo admin)
DELETE http://localhost:5000/api/users/1
Authorization: Bearer <token>
```

### Productos (requiere token)

```bash
# Crear producto
POST http://localhost:5000/api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre": "Cargador Domiciliario",
  "tipo": "Domiciliario",
  "potencia": "7,4 kW",
  "precio": 45000,
  "descripcion": "Cargador para uso residencial"
}

# Obtener mis productos
GET http://localhost:5000/api/products
Authorization: Bearer <token>

# Obtener producto
GET http://localhost:5000/api/products/1
Authorization: Bearer <token>

# Actualizar producto
PUT http://localhost:5000/api/products/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre": "Nuevo nombre",
  "precio": 50000
}

# Eliminar producto
DELETE http://localhost:5000/api/products/1
Authorization: Bearer <token>
```

---

## 🐛 Troubleshooting

### Error: "ECONNREFUSED 127.0.0.1:3306"
**Problema:** MySQL no está corriendo

**Solución:**
- **Windows:** Abre Services (`services.msc`) y busca "MySQL" → Click derecho → Start
- **Terminal:** `mysql -u root` (si funciona, está bien)

---

### Error: "Access denied for user 'root'@'localhost' (using password: NO)"
**Problema:** MySQL tiene contraseña y no la pusiste en `.env`

**Solución:**
1. Edita `backend/.env`
2. Agrega tu contraseña:
```env
DB_PASSWORD=tu_contraseña_aqui
```
3. Reinicia el servidor: `npm run dev`

---

### Error: "Unknown database 'narto_db'"
**Problema:** La base de datos no existe

**Solución:**
1. Abre MySQL Workbench
2. Ejecuta: `CREATE DATABASE narto_db;`
3. Reinicia el servidor

---

### Error: "POST http://localhost:5000/api/auth/login 404"
**Problema:** El backend no está corriendo

**Solución:**
1. Abre terminal en la carpeta `backend/`
2. Ejecuta: `npm run dev`
3. Verifica que veas el mensaje "✓ Servidor iniciado en http://localhost:5000"

---

### Error: "Token inválido" en el dashboard
**Problema:** El token expiró (7 días) o está corrupto

**Solución:**
1. Ve a `auth.html`
2. Inicia sesión nuevamente

---

### Puedo ver la landing pero no puedo hacer login
**Problema:** Probablemente el frontend y backend están en puertos diferentes

**Verificá:**
1. Frontend: `http://localhost:3000`
2. Backend: `http://localhost:5000`
3. Ambos deben estar corriendo

---

## 📝 Variables de Entorno (`.env`)

| Variable | Uso | Valor por defecto |
|----------|-----|-------------------|
| `DB_HOST` | Host de MySQL | localhost |
| `DB_PORT` | Puerto de MySQL | 3306 |
| `DB_NAME` | Nombre de la BD | narto_db |
| `DB_USER` | Usuario de MySQL | root |
| `DB_PASSWORD` | Contraseña de MySQL | (vacío) |
| `JWT_SECRET` | Clave para firmar tokens | (DEBE cambiar en producción) |
| `NODE_ENV` | Ambiente | development |
| `API_PORT` | Puerto del servidor | 5000 |
| `CORS_ORIGIN` | Orígenes permitidos | localhost:3000 |

---

## 🔒 Seguridad

### Importante: No subir a GitHub

Asegúrate de que `.gitignore` incluya:
```
.env
node_modules/
```

**Verificá:** `git status` (no debería mostrar `.env` ni `node_modules/`)

### Producción (cuando publiques)

1. Cambia `JWT_SECRET` a un valor aleatorio muy largo
2. Cambia `NODE_ENV=production`
3. Usa una contraseña fuerte en MySQL
4. Usa HTTPS (Cloudflare lo hace automático)

---

## 🚀 Próximos Pasos

1. **Panel de gestión de usuarios:** Crear interfaz para listar/editar/eliminar usuarios
2. **CRUD de productos:** Conectar el dashboard con las APIs
3. **Galería de imágenes:** Subida de fotos y videos
4. **Publicar en producción:** VPS + dominio + Cloudflare

---

## 📞 Resumen de Comandos

```bash
# Instalar dependencias
cd backend && npm install

# Iniciar servidor de desarrollo
cd backend && npm run dev

# Iniciar servidor de producción
cd backend && npm start

# Iniciar frontend (en otra terminal)
python -m http.server 3000
# o
npx http-server -p 3000
```

---

**¡Listo! Ahora tienes un sistema de autenticación completo con MySQL y JWT.** 🎉

Cualquier duda, revisa los logs en la terminal. 🚀