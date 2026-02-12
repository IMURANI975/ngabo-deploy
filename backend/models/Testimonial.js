import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  service: {
  type: String,
  required: false,
  trim: true
}
,
  comment: {
    type: String,
    required: [true, 'Comment is required'],
    trim: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  date: {
    type: String,
    trim: true
  },
  approved: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

export default Testimonial;
