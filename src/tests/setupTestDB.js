import mongoose from "mongoose";
import connectDB from "../config/db.js";
import { seedTestUsers } from "../seeders/Test.seeder.js";

export const setupTestDB = async () => {
  process.env.NODE_ENV = "test";
  await connectDB();
  await seedTestUsers();
};

export const cleanupTestDB = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  console.log("Test DB connection closed");
};
