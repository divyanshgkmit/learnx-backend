import UserRole from '../models/UserRole.js';
import Role from '../models/Role.js';

export const requireRole = (roleName) => {
  return async (req, res, next) => {
    try {
      const role = await Role.findOne({ name: roleName, deletedAt: null });
      
      if (!role) {
        return res.status(500).json({
          success: false,
          message: 'Role configuration error'
        });
      }

      const userRole = await UserRole.findOne({
        userId: req.user._id,
        roleId: role._id,
        deletedAt: null
      });

      if (!userRole) {
        return res.status(403).json({
          success: false,
          message: `Access denied. ${roleName} role required.`
        });
      }

      req.userRole = roleName;
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Role verification failed'
      });
    }
  };
};

// Convenience middleware for common roles
export const requireInstructor = requireRole('Instructor');
export const requireStudent = requireRole('Student');