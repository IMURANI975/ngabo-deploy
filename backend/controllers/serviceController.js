import Service from '../models/Service.js';
import { body, validationResult } from 'express-validator';
import { uploadToCloudinary, deleteFromCloudinary, extractPublicId } from '../config/cloudinary.js';
import { deleteTempFile } from '../middlewares/uploads.js';

// Validation rules
export const validateService = [
  body('name').trim().notEmpty().withMessage('Service name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('duration').trim().notEmpty().withMessage('Duration is required'),
  body('category').isIn(['hair', 'beard', 'spa', 'nails', 'bridal', 'kids']).withMessage('Invalid category')
];

// Get all services
export const getServices = async (req, res, next) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    next(error);
  }
};

// Get single service
export const getService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    next(error);
  }
};

// Create service
export const createService = async (req, res, next) => {
  let uploadedImageUrl = null;
  let tempFilePath = null;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Prepare service data
    const serviceData = {
      name: req.body.name,
      description: req.body.description,
      duration: req.body.duration,
      category: req.body.category,
      features: req.body.features ? JSON.parse(req.body.features) : [],
      popular: req.body.popular === 'true' || req.body.popular === true
    };

    // Upload image to Cloudinary if file was provided
    if (req.file) {
      tempFilePath = req.file.path;
      
      try {
        const uploadResult = await uploadToCloudinary(tempFilePath, 'salon-services');
        serviceData.image = uploadResult.url;
        uploadedImageUrl = uploadResult.url;
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        // Delete temp file
        deleteTempFile(tempFilePath);
        
        return res.status(500).json({
          success: false,
          error: 'Failed to upload image. Please try again.'
        });
      }
      
      // Delete temp file after successful upload
      deleteTempFile(tempFilePath);
    }

    const service = await Service.create(serviceData);
    
    res.status(201).json({
      success: true,
      data: service
    });
  } catch (error) {
    // Clean up: delete uploaded image from Cloudinary if service creation failed
    if (uploadedImageUrl) {
      const publicId = extractPublicId(uploadedImageUrl);
      if (publicId) {
        await deleteFromCloudinary(publicId).catch(err => 
          console.error('Failed to delete image from Cloudinary:', err)
        );
      }
    }
    
    // Clean up temp file if it exists
    if (tempFilePath) {
      deleteTempFile(tempFilePath);
    }
    
    next(error);
  }
};

// Update service
export const updateService = async (req, res, next) => {
  let uploadedImageUrl = null;
  let tempFilePath = null;
  let oldImagePublicId = null;

  try {
    // Find existing service
    const existingService = await Service.findById(req.params.id);
    
    if (!existingService) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      });
    }

    const updateData = {
      name: req.body.name,
      description: req.body.description,
      duration: req.body.duration,
      category: req.body.category,
      popular: req.body.popular === 'true' || req.body.popular === true
    };

    // Parse features if provided
    if (req.body.features) {
      updateData.features = typeof req.body.features === 'string' 
        ? JSON.parse(req.body.features) 
        : req.body.features;
    }

    // Handle image upload if new file was provided
    if (req.file) {
      tempFilePath = req.file.path;
      
      try {
        // Upload new image to Cloudinary
        const uploadResult = await uploadToCloudinary(tempFilePath, 'salon-services');
        updateData.image = uploadResult.url;
        uploadedImageUrl = uploadResult.url;
        
        // Store old image public ID for deletion
        if (existingService.image) {
          oldImagePublicId = extractPublicId(existingService.image);
        }
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        // Delete temp file
        deleteTempFile(tempFilePath);
        
        return res.status(500).json({
          success: false,
          error: 'Failed to upload image. Please try again.'
        });
      }
      
      // Delete temp file after successful upload
      deleteTempFile(tempFilePath);
    }

    // Update service in database
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    // Delete old image from Cloudinary only after successful update
    if (oldImagePublicId && uploadedImageUrl) {
      await deleteFromCloudinary(oldImagePublicId).catch(err => 
        console.error('Failed to delete old image from Cloudinary:', err)
      );
    }

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    // Clean up: delete newly uploaded image from Cloudinary if update failed
    if (uploadedImageUrl) {
      const publicId = extractPublicId(uploadedImageUrl);
      if (publicId) {
        await deleteFromCloudinary(publicId).catch(err => 
          console.error('Failed to delete image from Cloudinary:', err)
        );
      }
    }
    
    // Clean up temp file if it exists
    if (tempFilePath) {
      deleteTempFile(tempFilePath);
    }
    
    next(error);
  }
};

// Delete service
export const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      });
    }

    // Delete image from Cloudinary if exists
    if (service.image) {
      const publicId = extractPublicId(service.image);
      if (publicId) {
        await deleteFromCloudinary(publicId).catch(err => 
          console.error('Failed to delete image from Cloudinary:', err)
        );
      }
    }

    // Delete service from database
    await Service.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};