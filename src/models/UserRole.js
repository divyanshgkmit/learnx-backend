import mongoose from 'mongoose';

const userRoleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: [true, 'Role ID is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  deletedAt: {
    type: Date,
    default: null
  }
});

userRoleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

userRoleSchema.index({ userId: 1, roleId: 1, deletedAt: 1 }, { 
  unique: true, 
  partialFilterExpression: { deletedAt: null } 
});

export default mongoose.model('UserRole', userRoleSchema);