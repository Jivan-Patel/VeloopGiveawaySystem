import { verifyToken } from '../services/authService.js';

/**
 * Validates JWT in Authorization: Bearer <token> header.
 * Attaches req.user on success; rejects with LOGIN_REQUIRED if missing or invalid.
 */
export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      code: 'LOGIN_REQUIRED',
      message: 'Please login to participate.'
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({
      code: 'LOGIN_REQUIRED',
      message: 'Session expired or invalid. Please login again.'
    });
  }
}

/**
 * Optional authentication: if valid token present, attaches req.user; otherwise proceeds as visitor.
 */
export function optionalAuthMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyToken(token);
    req.user = payload;
  } catch (err) {
    req.user = null;
  }
  next();
}

export default authMiddleware;
