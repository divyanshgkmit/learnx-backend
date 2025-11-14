import User from '../models/User.js';
import Role from '../models/Role.js';
import UserRole from '../models/UserRole.js';
import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const initializeRoles = async () => {
  if (process.env.NODE_ENV === 'test') return;
  
  try {
    const roles = ['Student', 'Instructor'];
    for (const roleName of roles) {
      await Role.findOneAndUpdate(
        { name: roleName },
        { name: roleName },
        { upsert: true, new: true }
      );
    }
    console.log('Default roles initialized');
  } catch (error) {
    console.error('Error initializing roles:', error);
  }
};

initializeRoles();

export const register = async (req, res) => {
  try {
    const { fullName, email, password, role = 'Student' } = req.body;

    if (!['Student', 'Instructor'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be Student or Instructor.'
      });
    }

    const userExists = await User.findOne({ email, deletedAt: null });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email.'
      });
    }

    const user = await User.create({
      fullName,
      email,
      password
    });

    const userRole = await Role.findOne({ name: role, deletedAt: null });
    if (!userRole) {
      await User.findByIdAndDelete(user._id);
      return res.status(500).json({
        success: false,
        message: 'Role configuration error.'
      });
    }

    await UserRole.create({
      userId: user._id,
      roleId: userRole._id
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email
      },
      role: role
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.'
      });
    }

    const user = await User.findOne({ email, deletedAt: null });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials.'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials.'
      });
    }

    const userRoles = await UserRole.find({ 
      userId: user._id, 
      deletedAt: null 
    }).populate('roleId');

    const roles = userRoles.map(ur => ur.roleId.name);

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email
      },
      roles: roles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const userRoles = await UserRole.find({ 
      userId: req.user._id, 
      deletedAt: null 
    }).populate('roleId');

    const roles = userRoles.map(ur => ur.roleId.name);

    res.json({
      success: true,
      user: {
        id: req.user._id,
        fullName: req.user.fullName,
        email: req.user.email,
        createdAt: req.user.createdAt
      },
      roles: roles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile',
      error: error.message
    });
  }
};

