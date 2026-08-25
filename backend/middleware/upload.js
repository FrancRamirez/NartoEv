const multer = require('multer');
const path = require('path');
const fs = require('fs');
const os = require('os');

// En Vercel (y en cualquier entorno serverless) el sistema de archivos
// es de solo lectura salvo /tmp. En local seguimos usando backend/uploads.
const uploadDirectory = process.env.VERCEL
  ? path.join(os.tmpdir(), 'uploads')
  : path.join(__dirname, '..', 'uploads');

try {
  fs.mkdirSync(uploadDirectory, { recursive: true });
} catch (err) {
  console.error('No se pudo crear el directorio de subida:', err.message);
}

const storage = multer.diskStorage({
  destination: uploadDirectory,
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const baseName = path.basename(file.originalname, extension)
      .replace(/[^a-z0-9-_]/gi, '-')
      .toLowerCase();
    callback(null, `${Date.now()}-${baseName || 'archivo'}${extension}`);
  }
});

const fileFilter = (req, file, callback) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    return callback(null, true);
  }

  callback(new Error('Solo se permiten imágenes y videos'));
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { files: 12, fileSize: 100 * 1024 * 1024 }
});