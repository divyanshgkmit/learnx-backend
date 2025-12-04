import { CourseService } from '../services/course.service.js';

export const createCourse = async (req, res) => {
  try {
    const courseData = { ...req.body, instructorId: req.user.userId };
    const course = await CourseService.createCourse(courseData);
    
    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getCourses = async (req, res) => {
  try {
    const courses = await CourseService.getCourses(req.query);
    res.status(200).json({
      success: true,
      data: courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await CourseService.getCourseById(req.params.id);
    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const course = await CourseService.updateCourse(req.params.id, req.user.userId, req.body);
    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: course
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getInstructorCourses = async (req, res) => {
  try {
    const instructorId = req.params.instructorId || req.user.userId;
    const courses = await CourseService.getInstructorCourses(instructorId);
    res.status(200).json({
      success: true,
      data: courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    await CourseService.deleteCourse(req.params.id, req.user.userId);
    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};