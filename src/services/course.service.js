import Course from '../models/Course.js';
import UserRole from '../models/UserRole.js';
import Role from '../models/Role.js';

export class CourseService {
  static async createCourse(courseData) {
    const instructorRole = await Role.findOne({ name: 'Instructor' });
    const userRole = await UserRole.findOne({ 
      userId: courseData.instructorId, 
      roleId: instructorRole._id 
    });

    if (!userRole) {
      throw new Error('Only instructors can create courses');
    }

    return await Course.create(courseData);
  }

  static async getCourses(filters = {}) {
    const { category, difficulty, search, page = 1, limit = 10 } = filters;
    const query = { isPublished: true };
    
    if (category) query.category = new RegExp(category, 'i');
    if (difficulty) query.difficultyLevel = difficulty;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(query)
      .populate('instructorId', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Course.countDocuments(query);

    return {
      courses,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    };
  }

  static async getCourseById(courseId) {
    const course = await Course.findById(courseId)
      .populate('instructorId', 'fullName email');
    
    if (!course) {
      throw new Error('Course not found');
    }

    return course;
  }

  static async updateCourse(courseId, instructorId, updateData) {
    const course = await Course.findOne({ _id: courseId, instructorId });
    
    if (!course) {
      throw new Error('Course not found or access denied');
    }

    Object.assign(course, updateData);
    return await course.save();
  }

  static async getInstructorCourses(instructorId) {
    return await Course.find({ instructorId })
      .sort({ createdAt: -1 })
      .populate('instructorId', 'fullName email');
  }

  static async deleteCourse(courseId, instructorId) {
    const course = await Course.findOne({ _id: courseId, instructorId });
    
    if (!course) {
      throw new Error('Course not found or access denied');
    }

    await Course.findByIdAndDelete(courseId);
    return { message: 'Course deleted successfully' };
  }
}