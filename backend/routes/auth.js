import express from 'express';
import { login, me, validateLogin } from '../controllers/authController.js';
import { validate } from '../middlewares/validation.js';
import { requireAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.post('/login', validateLogin, validate, login);
router.get('/me', requireAdmin, me);

export default router;

