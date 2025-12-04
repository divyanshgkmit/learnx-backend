import { EnrollmentService } from '../services/enrollment.service.js';

export const enrollInCourse = async (req, res) => {
  try {
    const enrollment = await EnrollmentService.enrollInCourse(req.user.userId, req.params.courseId);
    res.status(201).json({
      success: true,
      message: 'Enrolled in course successfully',
      data: enrollment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getStudentEnrollments = async (req, res) => {
  try {
    const studentId = req.params.studentId || req.user.userId;
    const enrollments = await EnrollmentService.getStudentEnrollments(studentId);
    res.status(200).json({
      success: true,
      data: enrollments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getEnrollmentStatus = async (req, res) => {
  try {
    const enrollment = await EnrollmentService.getEnrollmentStatus(req.user.userId, req.params.courseId);
    res.status(200).json({
      success: true,
      data: enrollment
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

export const markAsCompleted = async (req, res) => {
  try {
    const enrollment = await EnrollmentService.markAsCompleted(req.user.userId, req.params.courseId);
    res.status(200).json({
      success: true,
      message: 'Course marked as completed',
      data: enrollment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getCourseEnrollments = async (req, res) => {
  try {
    const enrollments = await EnrollmentService.getCourseEnrollments(req.params.courseId, req.user.userId);
    res.status(200).json({
      success: true,
      data: enrollments
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};