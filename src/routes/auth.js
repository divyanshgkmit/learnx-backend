import express from 'express';
import {
  register,
  login,
  getCurrentUser
} from '../controllers/auth.controller.js';
import {
  validateRegistration,
  validateLogin
} from '../validators/auth.validator.js';
import { authenticateUser } from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.get('/me', authenticateUser, getCurrentUser);

export default router;