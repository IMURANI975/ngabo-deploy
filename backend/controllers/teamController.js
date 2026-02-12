import TeamMember from '../models/TeamMember.js';
import { body, validationResult } from 'express-validator';

// Validation rules
export const validateTeamMember = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('role').trim().notEmpty().withMessage('Role is required'),
  body('experience').trim().notEmpty().withMessage('Experience is required'),
  body('specialty').trim().notEmpty().withMessage('Specialty is required'),
  body('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5')
];

// Get all team members
export const getTeamMembers = async (req, res, next) => {
  try {
    const teamMembers = await TeamMember.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: teamMembers.length,
      data: teamMembers
    });
  } catch (error) {
    next(error);
  }
};

// Get single team member
export const getTeamMember = async (req, res, next) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);
    
    if (!teamMember) {
      return res.status(404).json({
        success: false,
        error: 'Team member not found'
      });
    }

    res.status(200).json({
      success: true,
      data: teamMember
    });
  } catch (error) {
    next(error);
  }
};

// Create team member
export const createTeamMember = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const teamMember = await TeamMember.create(req.body);
    res.status(201).json({
      success: true,
      data: teamMember
    });
  } catch (error) {
    next(error);
  }
};

// Update team member
export const updateTeamMember = async (req, res, next) => {
  try {
    const teamMember = await TeamMember.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        error: 'Team member not found'
      });
    }

    res.status(200).json({
      success: true,
      data: teamMember
    });
  } catch (error) {
    next(error);
  }
};

// Delete team member
export const deleteTeamMember = async (req, res, next) => {
  try {
    const teamMember = await TeamMember.findByIdAndDelete(req.params.id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        error: 'Team member not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
