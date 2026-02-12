import express from 'express';
import {
  createAppointment,
  deleteAppointment,
  getAppointment,
  getAppointments,
  updateAppointment,
  validateAppointment
} from '../controllers/appointmentController.js';
import { validate } from '../middlewares/validation.js';
import { requireAdmin } from '../middlewares/auth.js';

const router = express.Router();

router
  .route('/')
  .get(requireAdmin, getAppointments)
  .post(validateAppointment, validate, createAppointment);

router
  .route('/:id')
  .get(requireAdmin, getAppointment)
  .put(requireAdmin, validateAppointment, validate, updateAppointment)
  .delete(requireAdmin, deleteAppointment);

export default router;
