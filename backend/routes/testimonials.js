import express from 'express';
import {
  createTestimonial,
  deleteTestimonial,
  getAllTestimonials,
  getTestimonial,
  getTestimonials,
  updateTestimonial,
  validateTestimonial
} from '../controllers/testimonialController.js';
import { validate } from '../middlewares/validation.js';
import { requireAdmin } from '../middlewares/auth.js';

const router = express.Router();

router
  .route('/')
  .get(getTestimonials)
  .post(validateTestimonial, validate, createTestimonial);

router
  .route('/all')
  .get(requireAdmin, getAllTestimonials);

router
  .route('/:id')
  .get(requireAdmin, getTestimonial)
  .put(requireAdmin, validateTestimonial, validate, updateTestimonial)
  .delete(requireAdmin, deleteTestimonial);

export default router;
