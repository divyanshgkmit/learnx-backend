import User from '../models/User.js';
import Role from '../models/Role.js';
import UserRole from '../models/UserRole.js';
import jwt from 'jsonwebtoken';

export class AuthService {
  static async registerUser(userData) {
    const { fullName, email, password, role = 'Student' } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw { type: 'USER_EXISTS', message: 'User already exists with this email' };
    }

    const existingRole = await Role.findOne({ name: role });
    if (!existingRole) {
      throw { type: 'INVALID_ROLE', message: 'Invalid role specified' };
    }

    const user = await User.create({ fullName, email, password });
    await UserRole.create({ userId: user._id, roleId: existingRole._id });

    const token = this.generateToken(user._id);

    return {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email
      },
      token,
      role
    };
  }

  static async loginUser(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      throw { type: 'INVALID_CREDENTIALS', message: 'Invalid email or password' };
    }

    const isPasswordValid = await user.verifyPassword(password);
    if (!isPasswordValid) {
      throw { type: 'INVALID_CREDENTIALS', message: 'Invalid email or password' };
    }

    const userRoles = await UserRole.find({ userId: user._id }).populate('roleId');
    const roles = userRoles.map(userRole => userRole.roleId.name);

    const token = this.generateToken(user._id);

    return {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email
      },
      token,
      roles
    };
  }

  static async getCurrentUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw { type: 'USER_NOT_FOUND', message: 'User not found' };
    }

    const userRoles = await UserRole.find({ userId: user._id }).populate('roleId');
    const roles = userRoles.map(userRole => userRole.roleId.name);

    return {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        createdAt: user.createdAt
      },
      roles
    };
  }

  static generateToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
  }
}