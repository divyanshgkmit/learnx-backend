import express from 'express';
import {
  uploadThumbnail,
  uploadModuleVideo,
  deleteThumbnail
} from '../controllers/upload.controller.js';
import { authenticateUser } from '../middlewares/auth.js';
import { requireInstructor } from '../middlewares/role.js';
import { uploadThumbnail as thumbnailUpload, uploadVideo as videoUpload, handleUploadError } from '../middlewares/upload.js';

const router = express.Router();

router.post('/course/:courseId/thumbnail', 
  authenticateUser, 
  requireInstructor, 
  thumbnailUpload, 
  handleUploadError, 
  uploadThumbnail
);

router.delete('/course/:courseId/thumbnail', 
  authenticateUser, 
  requireInstructor, 
  deleteThumbnail
);

router.post('/module/:moduleId/video', 
  authenticateUser, 
  requireInstructor, 
  videoUpload, 
  handleUploadError, 
  uploadModuleVideo
);

export default router;