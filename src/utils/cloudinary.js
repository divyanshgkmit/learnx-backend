import cloudinary from '../config/cloudinary.js';

export class CloudinaryService {
  static async uploadImage(fileBuffer, folder = 'learnx/images') {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          format: 'webp',
          quality: 'auto'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      
      uploadStream.end(fileBuffer);
    });
  }

  static async uploadVideo(fileBuffer, folder = 'learnx/videos') {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'video',
          format: 'mp4',
          quality: 'auto'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      
      uploadStream.end(fileBuffer);
    });
  }

  static async deleteFile(publicId, resourceType = 'image') {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType
      });
      return result;
    } catch (error) {
      console.error('Error deleting file from Cloudinary:', error);
      throw error;
    }
  }

  static extractPublicId(url) {
    const matches = url.match(/\/v\d+\/(.+)\.\w+$/);
    return matches ? matches[1] : null;
  }
}