/**
 * Restricts access to users with verified ADMIN role.
 */
export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({
      code: 'FORBIDDEN',
      message: 'Access denied: Admin authorization required.'
    });
  }
  next();
}

export default requireAdmin;
