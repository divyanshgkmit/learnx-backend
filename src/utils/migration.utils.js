import mongoose from 'mongoose';

export class MigrationUtils {
  static async connectDB() {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
  }

  static async disconnectDB() {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
}