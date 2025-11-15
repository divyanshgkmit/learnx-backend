import UserRole from '../models/UserRole.js';
import Role from '../models/Role.js';

export const requireRole = (roleName) => {
  return async (req, res, next) => {
    try {
      const role = await Role.findOne({ name: roleName });
      
      if (!role) {
        return res.status(404).json({
          success: false,
          message: `Role '${roleName}' not found in system`
        });
      }

      const userRole = await UserRole.findOne({
        userId: req.user.userId,
        roleId: role._id
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
      console.error('Role verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during role verification'
      });
    }
  };
};

// Convenience middleware for common roles
export const requireInstructor = requireRole('Instructor');
export const requireStudent = requireRole('Student');