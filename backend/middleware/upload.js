const multer = require('multer');

// Guardamos el archivo en memoria (buffer) en vez de en disco:
// desde acá lo subimos directo a Cloudinary, sin depender del
// sistema de archivos del servidor (que en Vercel es de solo lectura).
const storage = multer.memoryStorage();

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
