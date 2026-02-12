import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  price: {
    type: String,
    required:false,
    trim: true
  },
  duration: {
    type: String,
    required: [true, 'Duration is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['hair', 'beard', 'spa', 'nails', 'bridal', 'kids'],
    trim: true
  },
  features: [{
    type: String,
    trim: true
  }],
  image: {
    type: String,
    trim: true
  },
  popular: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Service = mongoose.model('Service', serviceSchema);

export default Service;
