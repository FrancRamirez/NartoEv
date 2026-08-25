# ⚡ INICIO RÁPIDO (5 minutos)

## 1️⃣ Verificar Requisitos

```bash
# Verificar Node.js instalado
node --version      # Debería ser v14+

# Verificar npm instalado
npm --version       # Debería ser v6+

# Verificar MySQL corriendo
mysql -u root       # Si entra sin error, está bien
```

Si alguno falta, descargá:
- Node.js: https://nodejs.org
- MySQL: https://mysql.com/downloads

## 2️⃣ Crear Base de Datos

**Opción A: MySQL Workbench (recomendado)**
1. Abre MySQL Workbench
2. Haz doble clic en "Local instance MySQL80"
3. En el editor, copia y pega:
```sql
CREATE DATABASE narto_db;
```
4. Presiona Ctrl+Enter (o click en el rayo ⚡)
5. Deberías ver: "Query executed successfully"

**Opción B: Terminal**
```bash
mysql -u root -e "CREATE DATABASE narto_db;"
```

## 3️⃣ Instalar Backend

```bash
# Navega a la carpeta backend
cd backend

# Instala todas las dependencias (~200MB)
npm install

# Esto descargará:
# - express, mysql2, jwt, bcrypt, cors, etc.
```

Espera a que termine (~2-3 minutos).

## 4️⃣ Verificar `.env`

Abre `backend/.env` en VS Code y verifica:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=narto_db
DB_USER=root
DB_PASSWORD=        ← Si MySQL tiene contraseña, ponla aquí

JWT_SECRET=tu_clave_jwt_muy_segura_y_larga_aqui

NODE_ENV=development
API_PORT=5000
CORS_ORIGIN=http://localhost:3000,http://127.0.0.1:3000
```

**Si los datos de MySQL son diferentes, cámbialo aquí.**

## 5️⃣ Iniciar Servidor Backend

```bash
# Desde la carpeta backend/
npm run dev
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

**¡NO cierres esta terminal!**

## 6️⃣ Iniciar Frontend (NUEVA TERMINAL)

```bash
# Abre OTRA terminal (sin cerrar la anterior)
# Navega a la raíz del proyecto
cd c:\Users\franc\OneDrive\Escritorio\Proyectos\narto-ev

# Inicia el servidor del frontend
python -m http.server 3000
```

o si usas npm:
```bash
npx http-server -p 3000
```

Deberías ver:
```
Serving HTTP on 0.0.0.0 port 3000 (http://0.0.0.0:3000/)
```

## 7️⃣ Abrir en el Navegador

1. Ve a: `http://localhost:3000`
2. Deberías ver la landing page de NartoEV
3. Haz clic en el ícono de login (arriba a la derecha)

## 8️⃣ Probar Registro

1. Haz clic en "Regístrate aquí"
2. Llena el formulario:
   - **Nombre:** Juan Pérez
   - **Email:** juan@test.com
   - **Contraseña:** Prueba123456
   - **Confirmar:** Prueba123456
3. Haz clic en "Registrarse"

Deberías ver: **"✓ Cuenta creada correctamente. Por favor inicia sesión."**

## 9️⃣ Probar Login

1. Llena con los datos que registraste:
   - **Email:** juan@test.com
   - **Contraseña:** Prueba123456
2. Haz clic en "Iniciar Sesión"
3. Deberías ver el **dashboard** 🎉

### Convertir la cuenta del dueño en Admin

Las cuentas nuevas empiezan como usuarios comunes. Después de registrar la
cuenta del dueño, detén el backend y ejecuta:

```bash
cd backend
npm run promote-admin -- tu-email@dominio.com
npm run dev
```

El dueño deberá iniciar sesión nuevamente para recibir un token actualizado.

## 🔟 Probar Dashboard

En el dashboard deberías ver:
- ✅ Tu email en la esquina superior derecha
- ✅ Secciones: Resumen, Productos, Galería, Configuración
- ✅ Botón "Cerrar Sesión" funcional

---

## ✅ Checklist

- [ ] Node.js instalado
- [ ] MySQL corriendo
- [ ] Base de datos creada (`narto_db`)
- [ ] `npm install` completado en `backend/`
- [ ] `.env` configurado correctamente
- [ ] Backend corriendo en puerto 5000
- [ ] Frontend corriendo en puerto 3000
- [ ] Página carga en http://localhost:3000
- [ ] Puedo registrar usuario
- [ ] Puedo iniciar sesión
- [ ] Accedo al dashboard

---

## 🆘 Si algo falla

### "Error: Cannot find module 'express'"
```bash
cd backend
npm install
```

### "Error: ECONNREFUSED 127.0.0.1:3306"
MySQL no está corriendo:
- Windows: Services → busca MySQL → Start
- Terminal: `mysql -u root` (si funciona, está bien)

### "Error: Unknown database 'narto_db'"
```bash
mysql -u root -e "CREATE DATABASE narto_db;"
```

### "POST http://localhost:5000/api/auth/login 404"
El backend no está corriendo:
```bash
cd backend
npm run dev
```

### "Access denied for user 'root'"
La contraseña en MySQL es diferente:
1. Edita `backend/.env`
2. Cambia `DB_PASSWORD` a tu contraseña
3. Reinicia: `npm run dev`

---

## 📞 Comprobar que todo está ok

### Terminal 1 (Backend)
```bash
cd backend && npm run dev
```
Debería ver: "✓ Servidor iniciado en http://localhost:5000"

### Terminal 2 (Frontend)
```bash
python -m http.server 3000
```
Debería ver: "Serving HTTP on 0.0.0.0 port 3000"

### Navegador
```
http://localhost:3000
```
Debería cargar la landing page

### Browser Console
```javascript
// En la consola del navegador, cuando haces login:
console.log(localStorage.getItem('authToken'))
// Debería mostrar un token JWT largo
```

---

## 🎉 ¡Listo!

Ahora tienes un sistema completo de:
- ✅ Registro de usuarios
- ✅ Login con JWT
- ✅ Dashboard protegido
- ✅ Base de datos MySQL
- ✅ API REST

**Próximos pasos:**
1. Panel de gestión de usuarios (admin)
2. CRUD de productos
3. Subida de imágenes/videos
4. Publicar en producción

---

**Ver documentación completa:** [`GUIA_COMPLETA.md`](./GUIA_COMPLETA.md)