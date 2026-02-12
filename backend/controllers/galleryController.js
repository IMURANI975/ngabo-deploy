import Gallery from '../models/Gallery.js';
import { body, validationResult } from 'express-validator';
import { io } from '../server.js';
import { uploadToCloudinary, deleteFromCloudinary, extractPublicId } from '../config/cloudinary.js';
import { deleteTempFile } from '../middlewares/uploads.js';

/**
 * ===============================
 * VALIDATION RULES
 * ===============================
 */
export const validateGallery = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title must not exceed 100 characters'),

  body('category')
    .isIn(['hair', 'beard', 'bridal', 'spa'])
    .withMessage('Invalid category. Must be one of: hair, beard, bridal, spa')
    .toLowerCase(),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),

  body('likes')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Likes must be greater than or equal to 0')
];

/**
 * ===============================
 * CREATE GALLERY ITEM
 * (Live emit: gallery:new)
 * ===============================
 */
export const createGalleryItem = async (req, res, next) => {
  let tempFilePath = null;
  
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Clean up temp file if validation fails
      if (req.file) {
        deleteTempFile(req.file.path);
      }
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Check if image file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Image file is required'
      });
    }

    tempFilePath = req.file.path;

    // Upload to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(tempFilePath, 'salon-gallery');

    // Create gallery item in database
    const item = await Gallery.create({
      title: req.body.title,
      category: req.body.category.toLowerCase(),
      description: req.body.description || '',
      image: cloudinaryResult.url,
      imagePublicId: cloudinaryResult.publicId,
      likes: req.body.likes || 0
    });

    // Delete temporary file
    deleteTempFile(tempFilePath);

    // 🔥 SOCKET EVENT — image appears instantly on all clients
    io.emit('gallery:new', item);

    res.status(201).json({
      success: true,
      message: 'Gallery image uploaded successfully',
      data: item
    });
  } catch (error) {
    // Clean up temp file on error
    if (tempFilePath) {
      deleteTempFile(tempFilePath);
    }
    
    console.error('Create gallery item error:', error);
    next(error);
  }
};

/**
 * ===============================
 * GET ALL GALLERY ITEMS
 * ===============================
 */
export const getGalleryItems = async (req, res, next) => {
  try {
    const { category, limit, page } = req.query;
    
    // Build query
    const query = { isActive: true };
    if (category && category !== 'all') {
      query.category = category.toLowerCase();
    }

    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 100;
    const skip = (pageNum - 1) * limitNum;

    // Fetch items
    const items = await Gallery.find(query)
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skip)
      .lean();

    // Get total count for pagination
    const total = await Gallery.countDocuments(query);

    res.status(200).json({
      success: true,
      count: items.length,
      total: total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: items
    });
  } catch (error) {
    console.error('Get gallery items error:', error);
    next(error);
  }
};

/**
 * ===============================
 * GET SINGLE GALLERY ITEM
 * ===============================
 */
export const getGalleryItem = async (req, res, next) => {
  try {
    const item = await Gallery.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Gallery item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Get gallery item error:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid gallery item ID'
      });
    }
    
    next(error);
  }
};

/**
 * ===============================
 * UPDATE GALLERY ITEM
 * (Live emit: gallery:update)
 * ===============================
 */
export const updateGalleryItem = async (req, res, next) => {
  let tempFilePath = null;
  let oldPublicId = null;
  
  try {
    // Find existing item
    const existingItem = await Gallery.findById(req.params.id);
    
    if (!existingItem) {
      // Clean up temp file if item not found
      if (req.file) {
        deleteTempFile(req.file.path);
      }
      return res.status(404).json({
        success: false,
        error: 'Gallery item not found'
      });
    }

    // Prepare update data
    const updateData = {
      title: req.body.title || existingItem.title,
      category: (req.body.category || existingItem.category).toLowerCase(),
      description: req.body.description !== undefined ? req.body.description : existingItem.description,
      likes: req.body.likes !== undefined ? req.body.likes : existingItem.likes
    };

    // Handle image update if new file provided
    if (req.file) {
      tempFilePath = req.file.path;
      oldPublicId = existingItem.imagePublicId;

      // Upload new image to Cloudinary
      const cloudinaryResult = await uploadToCloudinary(tempFilePath, 'salon-gallery');
      
      updateData.image = cloudinaryResult.url;
      updateData.imagePublicId = cloudinaryResult.publicId;

      // Delete old image from Cloudinary
      if (oldPublicId) {
        try {
          await deleteFromCloudinary(oldPublicId);
        } catch (deleteError) {
          console.error('Error deleting old image from Cloudinary:', deleteError);
          // Continue even if old image deletion fails
        }
      }

      // Delete temporary file
      deleteTempFile(tempFilePath);
    }

    // Update item in database
    const item = await Gallery.findByIdAndUpdate(
      req.params.id,
      updateData,
      { 
        new: true, 
        runValidators: true 
      }
    );

    // 🔥 SOCKET EVENT — image updated live on all clients
    io.emit('gallery:update', item);

    res.status(200).json({
      success: true,
      message: 'Gallery image updated successfully',
      data: item
    });
  } catch (error) {
    // Clean up temp file on error
    if (tempFilePath) {
      deleteTempFile(tempFilePath);
    }
    
    console.error('Update gallery item error:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid gallery item ID'
      });
    }
    
    next(error);
  }
};

/**
 * ===============================
 * DELETE GALLERY ITEM
 * (Live emit: gallery:delete)
 * ===============================
 */
export const deleteGalleryItem = async (req, res, next) => {
  try {
    const item = await Gallery.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Gallery item not found'
      });
    }

    // Delete image from Cloudinary
    if (item.imagePublicId) {
      try {
        await deleteFromCloudinary(item.imagePublicId);
      } catch (cloudinaryError) {
        console.error('Error deleting image from Cloudinary:', cloudinaryError);
        // Continue with database deletion even if Cloudinary deletion fails
      }
    }

    // Delete before/after images if they exist
    if (item.beforeAfter) {
      if (item.beforeAfter.beforePublicId) {
        try {
          await deleteFromCloudinary(item.beforeAfter.beforePublicId);
        } catch (error) {
          console.error('Error deleting before image:', error);
        }
      }
      if (item.beforeAfter.afterPublicId) {
        try {
          await deleteFromCloudinary(item.beforeAfter.afterPublicId);
        } catch (error) {
          console.error('Error deleting after image:', error);
        }
      }
    }

    // Delete from database
    await Gallery.findByIdAndDelete(req.params.id);

    // 🔥 SOCKET EVENT — image removed instantly on all clients
    io.emit('gallery:delete', item._id.toString());

    res.status(200).json({
      success: true,
      message: 'Gallery image deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('Delete gallery item error:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid gallery item ID'
      });
    }
    
    next(error);
  }
};

/**
 * ===============================
 * INCREMENT LIKES
 * (Optional feature for user engagement)
 * ===============================
 */
export const incrementLikes = async (req, res, next) => {
  try {
    const item = await Gallery.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Gallery item not found'
      });
    }

    // 🔥 SOCKET EVENT — likes updated live
    io.emit('gallery:update', item);

    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Increment likes error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid gallery item ID'
      });
    }
    
    next(error);
  }
};

/**
 * ===============================
 * BULK DELETE GALLERY ITEMS
 * (Admin feature)
 * ===============================
 */
export const bulkDeleteGalleryItems = async (req, res, next) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an array of IDs to delete'
      });
    }

    // Find all items to get their Cloudinary public IDs
    const items = await Gallery.find({ _id: { $in: ids } });

    // Delete images from Cloudinary
    const deletePromises = items.map(async (item) => {
      if (item.imagePublicId) {
        try {
          await deleteFromCloudinary(item.imagePublicId);
        } catch (error) {
          console.error(`Error deleting image ${item.imagePublicId}:`, error);
        }
      }
    });

    await Promise.all(deletePromises);

    // Delete from database
    const result = await Gallery.deleteMany({ _id: { $in: ids } });

    // 🔥 SOCKET EVENT — emit delete for each item
    ids.forEach(id => {
      io.emit('gallery:delete', id.toString());
    });

    res.status(200).json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} gallery items`,
      data: {
        deletedCount: result.deletedCount
      }
    });
  } catch (error) {
    console.error('Bulk delete gallery items error:', error);
    next(error);
  }
};