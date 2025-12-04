import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  difficultyLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  primaryLanguage: {
    type: String,
    default: 'English'
  },
  description: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String,
    default: ''
  },
  thumbnailPublicId: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    default: 0,
    min: 0
  },
  isPublished: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Course', courseSchema);