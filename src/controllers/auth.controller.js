import { AuthService } from '../services/auth.service.js';
import { getHttpStatusCode } from '../helpers/errorHandlers.js';

export const register = async (req, res) => {
  try {
    const result = await AuthService.registerUser(req.body);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result
    });
  } catch (error) {
    const statusCode = getHttpStatusCode(error.type);
    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.loginUser(email, password);
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const result = await AuthService.getCurrentUser(req.user.userId);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};
