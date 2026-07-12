import ApiError from '../utils/ApiError.js';

export const rbacMiddleware = (allowedRoles = []) => (req, res, next) => {
  try {
    if (!req.user) return next(new ApiError(401, 'Authentication required'));
    if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) return next(new ApiError(500, 'RBAC misconfigured'));
    if (!allowedRoles.includes(req.user.role)) return next(new ApiError(403, 'Forbidden'));
    next();
  } catch (err) {
    next(err);
  }
};

export default rbacMiddleware;
