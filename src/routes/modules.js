import express from 'express';
import {
  createModule,
  getCourseModules,
  updateModule,
  deleteModule,
  getModuleById
} from '../controllers/module.controller.js';
import { authenticateUser } from '../middlewares/auth.js';
import { requireInstructor } from '../middlewares/role.js';

const router = express.Router();

router.get('/course/:courseId', getCourseModules);
router.get('/:id', getModuleById);

router.post('/', authenticateUser, requireInstructor, createModule);
router.put('/:id', authenticateUser, requireInstructor, updateModule);
router.delete('/:id', authenticateUser, requireInstructor, deleteModule);

export default router;