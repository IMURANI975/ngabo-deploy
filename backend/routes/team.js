import express from 'express';
import {
  createTeamMember,
  deleteTeamMember,
  getTeamMember,
  getTeamMembers,
  updateTeamMember,
  validateTeamMember
} from '../controllers/teamController.js';
import { validate } from '../middlewares/validation.js';
import { requireAdmin } from '../middlewares/auth.js';

const router = express.Router();

router
  .route('/')
  .get(getTeamMembers)
  .post(requireAdmin, validateTeamMember, validate, createTeamMember);

router
  .route('/:id')
  .get(getTeamMember)
  .put(requireAdmin, validateTeamMember, validate, updateTeamMember)
  .delete(requireAdmin, deleteTeamMember);

export default router;
