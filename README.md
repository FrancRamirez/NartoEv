# NartoEV

Landing page + panel de administración para NartoEV, instalación de cargadores de autos eléctricos.

## Estado del proyecto

- ✅ Landing page (HTML + CSS + JavaScript)
- ✅ Autenticación (login/registro con JWT)
- ✅ API REST (Node.js + Express)
- ✅ Base de datos en TiDB Cloud
- ✅ Almacenamiento de imágenes/videos en Cloudinary
- ✅ Dashboard de administración (gestión de publicaciones y usuarios)
- ✅ Desplegado en Vercel (frontend + backend juntos)
- 🚧 Dominio propio (nartoev.com.ar) comprado y con DNS en Cloudflare, pendiente de publicar

## Estructura del proyecto

```
narto-ev/
├── index.html          (Landing page)
├── auth.html            (Login / registro)
├── dashboard.html        (Panel admin)
├── api/server.js         (Entry point serverless para Vercel)
├── backend/
│   ├── app.js            (Configuración de Express)
│   ├── config/           (Conexión a DB y Cloudinary)
│   ├── controllers/
│   ├── middleware/
│   └── routes/
├── bd/                   (Dumps / scripts SQL)
├── css/
├── js/
└── assets/
```

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | HTML5, CSS3, JavaScript (vanilla) |
| Backend | Node.js, Express |
| Base de datos | TiDB Cloud (MySQL-compatible) |
| Almacenamiento de media | Cloudinary |
| Auth | JWT + bcrypt |
| Hosting | Vercel |
| DNS / dominio | Cloudflare |

## Desarrollo local

**1. Backend**
```bash
cd backend
npm install
npm run dev
```

**2. Frontend** (en otra terminal, desde la raíz)
```bash
python -m http.server 3000
```

**3. Acceder**
```
http://localhost:3000
```

Ver [backend/README.md](./backend/README.md) para el detalle de endpoints y variables de entorno.

## Producción

El proyecto se despliega en Vercel a partir del repositorio. El dominio actual de producción es el que asigna Vercel; el dominio propio `nartoev.com.ar` ya está comprado y con registros DNS en Cloudflare, pendiente de habilitarse públicamente.
