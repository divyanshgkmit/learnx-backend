import express from 'express';
import {
  enrollInCourse,
  getStudentEnrollments,
  getEnrollmentStatus,
  markAsCompleted,
  getCourseEnrollments
} from '../controllers/enrollment.controller.js';
import { authenticateUser } from '../middlewares/auth.js';
import { requireStudent, requireInstructor } from '../middlewares/role.js';

const router = express.Router();

router.post('/course/:courseId', authenticateUser, requireStudent, enrollInCourse);
router.get('/student/:studentId', authenticateUser, getStudentEnrollments);
router.get('/course/:courseId/status', authenticateUser, requireStudent, getEnrollmentStatus);
router.patch('/course/:courseId/complete', authenticateUser, requireStudent, markAsCompleted);

router.get('/course/:courseId', authenticateUser, requireInstructor, getCourseEnrollments);

export default router;