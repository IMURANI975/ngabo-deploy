import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const requireAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'replace-with-secure-secret');
    const admin = await Admin.findById(decoded.id).select('-password');

    if (!admin) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Not authorized' });
  }
};

