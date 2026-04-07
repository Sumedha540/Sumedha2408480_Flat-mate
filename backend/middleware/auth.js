import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('🔐 Verifying token for user...');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('✅ Token decoded:', decoded);
      req.user = await User.findById(decoded.id).select('-password');
      console.log('👤 User found:', req.user?.email, 'Role:', req.user?.role);
      next();
    } catch (error) {
      console.error('❌ Token verification failed:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.error('❌ No token provided');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};
