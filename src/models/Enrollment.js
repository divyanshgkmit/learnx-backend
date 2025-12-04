import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  amountPaid: {
    type: Number,
    default: 0
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Prevent duplicate enrollments
enrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

export default mongoose.model('Enrollment', enrollmentSchema);