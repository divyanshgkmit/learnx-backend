import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  videoPublicId: {
    type: String,
    default: ''
  },
  duration: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('Module', moduleSchema);