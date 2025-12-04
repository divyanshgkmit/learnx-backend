import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const dbURI =
      process.env.NODE_ENV === "test"
        ? "mongodb+srv://divyansh_db_user:divyanshgkmit123@cluster0.a9icdkv.mongodb.net/learnx_test"
        : process.env.MONGODB_URI;

    await mongoose.connect(dbURI);
    console.log(
      process.env.NODE_ENV === "test"
        ? "Connected to Atlas test DB"
        : "MongoDB Connected Successfully"
    );
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

export default connectDB;