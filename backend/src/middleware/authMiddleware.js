import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import User from '../models/User.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return next(new ApiError(401, 'Authorization token missing'));
    }

    const token = header.split(' ')[1];
    if (!token) {
      return next(new ApiError(401, 'Authorization token missing'));
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return next(new ApiError(500, 'JWT secret not configured'));
    }

    let payload;
    try {
      payload = jwt.verify(token, secret);
    } catch (err) {
      return next(new ApiError(401, 'Invalid or expired token'));
    }

    const user = await User.findById(payload.id).select('-password');
    if (!user) {
      return next(new ApiError(401, 'User not found'));
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export default authMiddleware;
