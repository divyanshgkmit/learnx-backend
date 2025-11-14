import mongoose from 'mongoose';

const connectDB = async () => {

  if (process.env.NODE_ENV === 'test') {
    return;
  }
  
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected Successfully!`);
  } catch (error) {
    console.error('MongoDB connection Failed!');
    process.exit(1);
  }
};

export default connectDB;