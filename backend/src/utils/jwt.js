import jwt from 'jsonwebtoken';

export const createToken = (user) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '8h';
  return jwt.sign({ id: user._id.toString(), role: user.role }, secret, { expiresIn });
};

export default { createToken };
