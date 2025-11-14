import express from 'express';
import multer from 'multer';
import { register, login, getMe } from '../controllers/auth.controller.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);

export default router;