# Sistema de Autenticación NartoEV — Guía de Configuración

## 🎯 Resumen

Se ha creado un sistema completo de **Login/Registro** con Supabase que permite:
- ✅ Registro de nuevos usuarios
- ✅ Login seguro con email y contraseña
- ✅ Verificación de email (automática)
- ✅ Dashboard de administración
- ✅ Panel para gestionar productos, galería y configuración

---

## 📋 Archivos Creados

### Frontend
- **`auth.html`** — Página de Login/Registro con dos formularios intercambiables
- **`dashboard.html`** — Panel de administración principal (placeholder para futuras funcionalidades)
- **`css/auth.css`** — Estilos de la página de autenticación
- **`css/dashboard.css`** — Estilos del dashboard
- **`js/config.js`** — Configuración de Supabase (REQUIERE TUS CREDENCIALES)
- **`js/auth.js`** — Lógica de registro, login y verificación
- **`js/dashboard.js`** — Lógica del dashboard (navegación, logout)

### Cambios en archivos existentes
- **`index.html`** — Agregado ícono de login en el header
- **`css/style.css`** — Agregados estilos para `.header-actions` y `.btn-login`

---

## 🔧 Paso 1: Configurar Supabase

### 1.1 Crear cuenta en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Haz clic en "Sign Up" y crea una cuenta (con GitHub es más rápido)
3. Crea un nuevo proyecto:
   - **Nombre:** `narto-ev` (o el que prefieras)
   - **Región:** São Paulo (Sudamérica, más rápido para Argentina)
   - **Contraseña:** Crea una contraseña segura

### 1.2 Obtener tus credenciales
1. Una vez creado el proyecto, ve a **Settings** (rueda de engranaje ⚙️)
2. Haz clic en **"API"** en el menú izquierdo
3. Verás dos valores importantes:
   - **Project URL** — Copia esta URL
   - **anon public** — Copia esta clave (está bajo "Project API keys")

---

## 🔐 Paso 2: Actualizar `js/config.js`

Abre el archivo `js/config.js` y reemplaza los valores:

```javascript
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
```

Con los valores que copiaste de Supabase.

**Ejemplo:**
```javascript
const SUPABASE_URL = 'https://abcdefgh123456.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

---

## 🚀 Paso 3: Probar el Sistema

### 3.1 Abrir la página
1. Abre `index.html` en el navegador
2. Haz clic en el ícono de login (arriba a la derecha)

### 3.2 Crear una cuenta de prueba
1. Haz clic en "Regístrate aquí"
2. Completa el formulario:
   - **Nombre:** Tu nombre
   - **Email:** tu-email@ejemplo.com
   - **Contraseña:** Mínimo 8 caracteres
3. Haz clic en "Registrarse"
4. **Importante:** Supabase te enviará un email de confirmación. Debes hacer clic en el enlace para confirmar tu cuenta.

### 3.3 Iniciar sesión
1. Después de confirmar el email, vuelve a `auth.html`
2. Haz clic en "Inicia sesión"
3. Usa el email y contraseña que registraste
4. Si todo funciona, serás redirigido al dashboard

---

## 📊 Estructura del Dashboard

El dashboard es un placeholder con 4 secciones:

1. **Resumen** — Estadísticas generales (productos, imágenes, videos)
2. **Productos** — Aquí irán tus cargadores/grids con CRUD (crear, editar, eliminar)
3. **Galería** — Subida de imágenes y videos con drag-drop
4. **Configuración** — Ajustes de cuenta y preferencias

---

## 🛠️ Próximos Pasos (En tu lista de desarrollo)

1. **Crear tabla de Productos en Supabase**
   - Campos: id, nombre, descripción, precio, características, etc.
   - Agregar Row-Level Security para que cada usuario vea solo sus productos

2. **Implementar CRUD de Productos**
   - Formulario para crear/editar productos
   - Lista de productos con botones para editar/eliminar
   - Validaciones de formulario

3. **Implementar Galería**
   - Subida de imágenes (drag-drop)
   - Subida de videos (YouTube, Vimeo, archivo local)
   - Organización por producto

4. **Mejorar Dashboard**
   - Mostrar datos reales desde Supabase
   - Analytics básicos (visitantes, contactos)

5. **Publicar**
   - Desplegar frontend en Vercel o GitHub Pages
   - Asegurar que las variables de Supabase estén seguras

---

## 🔒 Seguridad

### ¿Cómo protegemos los datos?

✅ **Email verificado:** Solo usuarios con emails confirmados pueden acceder
✅ **Contraseñas hasheadas:** Supabase usa bcrypt (no se guardan en texto plano)
✅ **JWT tokens:** Las sesiones se manejan con tokens seguros
✅ **HTTPS:** Todas las comunicaciones están encriptadas

### Notas de seguridad importantes:

- **No compartas `config.js`** — Las credenciales de Supabase deben estar en `.gitignore` si usas Git
- **Row-Level Security (RLS):** Activaremos en el siguiente paso para que cada usuario vea solo sus datos
- **Validaciones:** El backend de Supabase valida todos los datos

---

## 📞 Solución de Problemas

### "Error: SUPABASE_URL is not defined"
→ Verificá que `config.js` esté correctamente enlazado en `auth.html` y `dashboard.html`

### "Error de autenticación: invalid_credentials"
→ El email o contraseña son incorrectos. Intenta de nuevo.

### "Email no recibido"
→ Revisa la carpeta de spam. Si no aparece, ve al panel de Supabase:
1. Auth → Email Templates → Verificar que esté activado

### "No puedo acceder al dashboard"
→ Debes confirmar tu email primero. Revisa tu bandeja de entrada.

---

## 📚 Recursos

- [Documentación de Supabase](https://supabase.com/docs)
- [Guía de autenticación](https://supabase.com/docs/guides/auth)
- [Supabase JavaScript client](https://supabase.com/docs/reference/javascript/introduction)

---

## ✅ Checklist de Configuración

- [ ] Cree cuenta en Supabase
- [ ] Creé un proyecto en Supabase
- [ ] Copié SUPABASE_URL
- [ ] Copié SUPABASE_ANON_KEY
- [ ] Actualicé `js/config.js` con mis credenciales
- [ ] Probé el registro con un email de prueba
- [ ] Confirmé mi email en la bandeja de entrada
- [ ] Inicié sesión correctamente
- [ ] Accedí al dashboard

---

¡Listo! Tu sistema de autenticación está configurado. Ahora podemos trabajar en el CRUD de productos. 🎉