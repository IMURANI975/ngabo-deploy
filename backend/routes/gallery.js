import express from 'express';
import {
  createGalleryItem,
  deleteGalleryItem,
  getGalleryItem,
  getGalleryItems,
  updateGalleryItem,
  validateGallery,
  incrementLikes,
  bulkDeleteGalleryItems
} from '../controllers/galleryController.js';
import { validate } from '../middlewares/validation.js';
import { requireAdmin } from '../middlewares/auth.js';
import { upload, handleMulterError } from '../middlewares/uploads.js';

const router = express.Router();

/**
 * @route   GET /api/gallery
 * @desc    Get all gallery items (with optional filtering and pagination)
 * @query   category, limit, page
 * @access  Public
 */
router.get('/', getGalleryItems);

/**
 * @route   POST /api/gallery
 * @desc    Create new gallery item
 * @access  Admin only
 */
router.post(
  '/',
  requireAdmin,
  upload.single('image'), // Multer middleware for single file upload with field name 'image'
  handleMulterError,
  validateGallery,
  validate,
  createGalleryItem
);

/**
 * @route   GET /api/gallery/:id
 * @desc    Get single gallery item
 * @access  Public
 */
router.get('/:id', getGalleryItem);

/**
 * @route   PUT /api/gallery/:id
 * @desc    Update gallery item
 * @access  Admin only
 */
router.put(
  '/:id',
  requireAdmin,
  upload.single('image'), // Allow optional image update
  handleMulterError,
  validateGallery,
  validate,
  updateGalleryItem
);

/**
 * @route   DELETE /api/gallery/:id
 * @desc    Delete gallery item
 * @access  Admin only
 */
router.delete('/:id', requireAdmin, deleteGalleryItem);

/**
 * @route   POST /api/gallery/:id/like
 * @desc    Increment likes for a gallery item
 * @access  Public
 */
router.post('/:id/like', incrementLikes);

/**
 * @route   POST /api/gallery/bulk-delete
 * @desc    Delete multiple gallery items
 * @access  Admin only
 */
router.post('/bulk-delete', requireAdmin, bulkDeleteGalleryItems);

export default router;