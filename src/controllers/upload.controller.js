import { CloudinaryService } from '../utils/cloudinary.js';
import Course from '../models/Course.js';
import Module from '../models/Module.js';

export const uploadThumbnail = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { courseId } = req.params;
    
    const course = await Course.findOne({ _id: courseId, instructorId: req.user.userId });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or access denied'
      });
    }

    if (course.thumbnailPublicId) {
      await CloudinaryService.deleteFile(course.thumbnailPublicId);
    }

    const result = await CloudinaryService.uploadImage(req.file.buffer, 'learnx/courses');

    course.thumbnailUrl = result.secure_url;
    course.thumbnailPublicId = result.public_id;
    await course.save();

    res.status(200).json({
      success: true,
      message: 'Thumbnail uploaded successfully',
      data: {
        thumbnailUrl: result.secure_url,
        publicId: result.public_id
      }
    });
  } catch (error) {
    console.error('Upload thumbnail error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload thumbnail'
    });
  }
};

export const uploadModuleVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { moduleId } = req.params;

    const module = await Module.findById(moduleId).populate('courseId');
    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    const course = await Course.findOne({ _id: module.courseId, instructorId: req.user.userId });
    if (!course) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (module.videoPublicId) {
      await CloudinaryService.deleteFile(module.videoPublicId, 'video');
    }

    const result = await CloudinaryService.uploadVideo(req.file.buffer, 'learnx/modules');

    module.videoUrl = result.secure_url;
    module.videoPublicId = result.public_id;
    await module.save();

    res.status(200).json({
      success: true,
      message: 'Video uploaded successfully',
      data: {
        videoUrl: result.secure_url,
        publicId: result.public_id,
        duration: result.duration
      }
    });
  } catch (error) {
    console.error('Upload video error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload video'
    });
  }
};

export const deleteThumbnail = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findOne({ _id: courseId, instructorId: req.user.userId });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or access denied'
      });
    }

    if (course.thumbnailPublicId) {
      await CloudinaryService.deleteFile(course.thumbnailPublicId);
      course.thumbnailUrl = '';
      course.thumbnailPublicId = '';
      await course.save();
    }

    res.status(200).json({
      success: true,
      message: 'Thumbnail deleted successfully'
    });
  } catch (error) {
    console.error('Delete thumbnail error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete thumbnail'
    });
  }
};