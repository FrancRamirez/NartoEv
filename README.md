# NartoEV — Sistema de Gestión de Cargadores Eléctricos

Landing page + Panel de administración para gestionar cargadores eléctricos.

## 📋 Estado del Proyecto

```
✅ Landing page (HTML + CSS + JavaScript)
✅ Sistema de autenticación (Login/Registro)
✅ API REST (Node.js + Express)
✅ Base de datos (MySQL)
✅ Dashboard de administración
🚧 Panel de usuarios (en desarrollo)
🚧 Panel de productos (en desarrollo)
🚧 Galería de imágenes (en desarrollo)
```

---

## 🚀 Inicio Rápido

### Requisitos
- Node.js v14+
- MySQL 5.7+
- npm v6+

### Instalación (3 pasos)

**1. Backend**
```bash
cd backend
npm install
npm run dev
```

**2. Frontend** (en otra terminal)
```bash
python -m http.server 3000
```

**3. Acceder**
```
http://localhost:3000
```

---

## 📚 Documentación

| Archivo | Descripción |
|---------|-------------|
| [INICIO_RAPIDO.md](./INICIO_RAPIDO.md) | Setup en 5 minutos |
| [GUIA_COMPLETA.md](./GUIA_COMPLETA.md) | Instalación paso a paso |
| [VISUAL_SUMMARY.txt](./VISUAL_SUMMARY.txt) | Resumen visual del proyecto |
| [PROXIMOS_PASOS.md](./PROXIMOS_PASOS.md) | Tareas pendientes |
| [backend/README.md](./backend/README.md) | Documentación técnica |

---

## 🏗️ Estructura del Proyecto

```
narto-ev/
├── 📄 index.html                    (Landing page)
├── 📄 auth.html                     (Login/Registro)
├── 📄 dashboard.html                (Panel admin)
├── 📁 backend/                      (API REST)
│   ├── server.js
│   ├── config/db.js
│   ├── controllers/
│   ├── routes/
│   └── middleware/
├── 📁 css/
├── 📁 js/
└── 📁 assets/
```

---

## 🔐 Autenticación

- **Registro:** Email + contraseña (mínimo 8 caracteres)
- **Login:** Email + contraseña
- **Seguridad:** Contraseñas hasheadas con bcrypt, JWT tokens
- **Sesión:** 7 días de expiración

---

## 📡 API Endpoints

### Auth (sin token)
- `POST /api/auth/signup` — Registrar
- `POST /api/auth/login` — Iniciar sesión
- `GET /api/auth/verify` — Verificar token

### Usuarios (con token)
- `GET /api/users` — Listar (admin)
- `GET /api/users/:id` — Obtener
- `PUT /api/users/:id` — Editar
- `DELETE /api/users/:id` — Eliminar (admin)

### Productos (con token)
- `POST /api/products` — Crear
- `GET /api/products` — Listar mis productos
- `GET /api/products/:id` — Obtener
- `PUT /api/products/:id` — Editar
- `DELETE /api/products/:id` — Eliminar

---

## 🎯 Próximas Tareas

1. **Panel de usuarios** — Gestionar cuentas (2-3h)
2. **Panel de productos** — Crear/editar/eliminar cargadores (2-3h)
3. **Galería** — Subir imágenes y videos (3-4h)
4. **Publicación** — Deploy en producción (2-3h)

Ver [PROXIMOS_PASOS.md](./PROXIMOS_PASOS.md) para detalles.

---

## 🔧 Tecnologías

| Capa | Tecnología |
|------|-----------|
| Frontend | HTML5, CSS3, JavaScript ES6 |
| Backend | Node.js, Express.js |
| Database | MySQL |
| Auth | JWT + Bcrypt |
| Hosting | Local (desarrollo) / VPS (producción) |

---

## 📝 Variables de Entorno

Ver `backend/.env.example` para plantilla.

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=narto_db
DB_USER=root
DB_PASSWORD=

JWT_SECRET=tu_clave_segura

NODE_ENV=development
API_PORT=5000
CORS_ORIGIN=http://localhost:3000
```

---

## 🐛 Solución de Problemas

### MySQL no conecta
```bash
# Verificar que MySQL está corriendo
mysql -u root
```

### Backend no inicia
```bash
# Verificar dependencias
npm install

# Ver errores
npm run dev
```

### Frontend no carga
```bash
# Verificar que el servidor está corriendo
python -m http.server 3000
```

Ver [GUIA_COMPLETA.md](./GUIA_COMPLETA.md#-troubleshooting) para más.

---

## 📞 Comandos Útiles

```bash
# Backend
cd backend
npm install        # Instalar dependencias
npm run dev        # Modo desarrollo (nodemon)
npm start          # Modo producción

# Frontend (otra terminal)
python -m http.server 3000
# o
npx http-server -p 3000

# Base de datos
mysql -u root
CREATE DATABASE narto_db;
```

---

## 🔒 Seguridad

✅ Contraseñas hasheadas (bcrypt)
✅ JWT tokens con expiración
✅ Middleware de autenticación
✅ CORS habilitado
✅ Variables sensibles en `.env`
✅ `.gitignore` configurado

---

## 📦 Dependencias

### Backend
- express
- mysql2
- bcryptjs
- jsonwebtoken
- cors
- dotenv
- nodemon (dev)

### Frontend
- Vanilla JavaScript (sin dependencias)

---

## 📄 Licencia

Proyecto personal para NartoEV.

---

## 📞 Documentación Completa

Consulta los archivos de documentación para más información:
- **Instalación:** [INICIO_RAPIDO.md](./INICIO_RAPIDO.md)
- **Configuración:** [GUIA_COMPLETA.md](./GUIA_COMPLETA.md)
- **API:** [backend/README.md](./backend/README.md)
- **Próximos pasos:** [PROXIMOS_PASOS.md](./PROXIMOS_PASOS.md)
