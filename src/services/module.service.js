import Module from '../models/Module.js';
import Course from '../models/Course.js';

export class ModuleService {
  static async createModule(moduleData) {
    const course = await Course.findById(moduleData.courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    const lastModule = await Module.findOne({ courseId: moduleData.courseId })
      .sort({ order: -1 });
    
    moduleData.order = lastModule ? lastModule.order + 1 : 1;

    return await Module.create(moduleData);
  }

  static async getCourseModules(courseId) {
    return await Module.find({ courseId })
      .sort({ order: 1 })
      .populate('courseId', 'title instructorId');
  }

  static async updateModule(moduleId, updateData) {
    const module = await Module.findById(moduleId);
    
    if (!module) {
      throw new Error('Module not found');
    }

    Object.assign(module, updateData);
    return await module.save();
  }

  static async deleteModule(moduleId) {
    const module = await Module.findByIdAndDelete(moduleId);
    
    if (!module) {
      throw new Error('Module not found');
    }

    return module;
  }
}