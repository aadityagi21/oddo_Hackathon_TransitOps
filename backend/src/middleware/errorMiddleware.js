import { ApiError } from '../utils/ApiError.js';

/**
 * Global 404 handler – catches unmatched routes.
 */
export const notFoundMiddleware = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

/**
 * Global error handler – formats all errors into consistent JSON responses.
 */
export const errorMiddleware = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
