import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['hair', 'beard', 'bridal', 'spa'],
        message: 'Category must be one of: hair, beard, bridal, spa'
      },
      lowercase: true
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
      trim: true
    },
    imagePublicId: {
      type: String,
      trim: true,
      // Store Cloudinary public ID for deletion
    },
    beforeAfter: {
      before: { 
        type: String, 
        trim: true 
      },
      after: { 
        type: String, 
        trim: true 
      },
      beforePublicId: {
        type: String,
        trim: true
      },
      afterPublicId: {
        type: String,
        trim: true
      }
    },
    likes: {
      type: Number,
      default: 0,
      min: [0, 'Likes cannot be negative']
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index for faster queries
gallerySchema.index({ category: 1, createdAt: -1 });
gallerySchema.index({ isActive: 1 });

// Virtual for formatted date
gallerySchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

const Gallery = mongoose.model('Gallery', gallerySchema);
export default Gallery;