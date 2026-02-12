import express from 'express';
import {
  createContact,
  deleteContact,
  getContact,
  getContacts,
  updateContact,
  validateContact
} from '../controllers/contactController.js';
import { validate } from '../middlewares/validation.js';
import { requireAdmin } from '../middlewares/auth.js';

const router = express.Router();

router
  .route('/')
  .get(requireAdmin, getContacts)
  .post(validateContact, validate, createContact);

router
  .route('/:id')
  .get(requireAdmin, getContact)
  .put(requireAdmin, updateContact)
  .delete(requireAdmin, deleteContact);

export default router;
