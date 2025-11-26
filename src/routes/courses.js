import express from 'express';
import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  getInstructorCourses,
  deleteCourse
} from '../controllers/course.controller.js';
import { authenticateUser } from '../middlewares/auth.js';
import { requireInstructor } from '../middlewares/role.js';

const router = express.Router();

router.get('/', getCourses);
router.get('/:id', getCourseById);

router.post('/', authenticateUser, requireInstructor, createCourse);
router.get('/instructor/:instructorId', authenticateUser, getInstructorCourses);
router.put('/:id', authenticateUser, requireInstructor, updateCourse);
router.delete('/:id', authenticateUser, requireInstructor, deleteCourse);

export default router;