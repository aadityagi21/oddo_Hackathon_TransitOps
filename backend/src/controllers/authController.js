import bcrypt from 'bcryptjs';
import ApiError from '../utils/ApiError.js';
import User from '../models/User.js';
import { createToken } from '../utils/jwt.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!email || !password) {
      return next(new ApiError(400, 'Email and password are required'));
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return next(new ApiError(409, 'Email already in use'));
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hash, role: role || 'user' });

    const token = createToken(user);

    res.status(201).json({
      success: true,
      data: {
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ApiError(400, 'Email and password are required'));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(new ApiError(401, 'Invalid credentials'));
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return next(new ApiError(401, 'Invalid credentials'));
    }

    const token = createToken(user);

    res.status(200).json({
      success: true,
      data: { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token },
    });
  } catch (err) {
    next(err);
  }
};

export default { register, login };
