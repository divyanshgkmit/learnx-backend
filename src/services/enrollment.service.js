import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import UserRole from '../models/UserRole.js';
import Role from '../models/Role.js';

export class EnrollmentService {
  static async enrollInCourse(studentId, courseId) {
    const studentRole = await Role.findOne({ name: 'Student' });
    const userRole = await UserRole.findOne({ 
      userId: studentId, 
      roleId: studentRole._id 
    });

    if (!userRole) {
      throw new Error('Only students can enroll in courses');
    }

    const course = await Course.findOne({ _id: courseId, isPublished: true });
    if (!course) {
      throw new Error('Course not found or not published');
    }

    const existingEnrollment = await Enrollment.findOne({ studentId, courseId });
    if (existingEnrollment) {
      throw new Error('Already enrolled in this course');
    }

    return await Enrollment.create({
      studentId,
      courseId,
      amountPaid: course.price
    });
  }

  static async getStudentEnrollments(studentId) {
    return await Enrollment.find({ studentId })
      .populate({
        path: 'courseId',
        populate: {
          path: 'instructorId',
          select: 'fullName email'
        }
      })
      .sort({ createdAt: -1 });
  }

  static async getEnrollmentStatus(studentId, courseId) {
    const enrollment = await Enrollment.findOne({ studentId, courseId })
      .populate({
        path: 'courseId',
        populate: {
          path: 'instructorId',
          select: 'fullName email'
        }
      });

    return {isEnrolled:!!enrollment}
  }

  static async markAsCompleted(studentId, courseId) {
    const enrollment = await Enrollment.findOne({ studentId, courseId });
    
    if (!enrollment) {
      throw new Error('Enrollment not found');
    }

    enrollment.isCompleted = true;
    return await enrollment.save();
  }

  static async getCourseEnrollments(courseId, instructorId) {
    const course = await Course.findOne({ _id: courseId, instructorId });
    if (!course) {
      throw new Error('Course not found or access denied');
    }

    return await Enrollment.find({ courseId })
      .populate('studentId', 'fullName email')
      .sort({ createdAt: -1 });
  }
}