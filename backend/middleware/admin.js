/**
 * Middleware de autorización para administradores.
 */

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Se requieren permisos de administrador' });
  }

  next();
};

module.exports = requireAdmin;