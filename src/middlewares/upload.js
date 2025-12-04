import multer from 'multer';
import { CloudinaryService } from '../utils/cloudinary.js';

// Configure multer for memory storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image and video files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  }
});

// Middleware for course thumbnail upload
export const uploadThumbnail = upload.single('thumbnail');

// Middleware for module video upload
export const uploadVideo = upload.single('video');

// Error handling middleware
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 50MB'
      });
    }
  }
  
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  next();
};

// Cloudinary upload utility (ADD THIS)
export const uploadToCloudinary = async (fileBuffer, type = 'image', folder = 'learnx') => {
  try {
    if (type === 'image') {
      return await CloudinaryService.uploadImage(fileBuffer, `${folder}/images`);
    } else if (type === 'video') {
      return await CloudinaryService.uploadVideo(fileBuffer, `${folder}/videos`);
    }
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};