import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import Admin from '../models/Admin.js';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'replace-with-secure-secret', {
    expiresIn: '7d'
  });
};

export const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').trim().notEmpty().withMessage('Password is required')
];

export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!admin) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

   

    const token = signToken(admin._id);
    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        username: admin.username
      }
    });
  } catch (err) {
    next(err);
  }
};

export const me = async (req, res) => {
  res.json({ success: true, admin: req.admin });
};

