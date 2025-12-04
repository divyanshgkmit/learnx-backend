import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Role from "../models/Role.js";
import UserRole from "../models/UserRole.js";

export const seedTestUsers = async () => {
  try {
    const studentRole =
      (await Role.findOne({ name: "Student" })) ||
      (await Role.create({ name: "Student" }));
    const instructorRole =
      (await Role.findOne({ name: "Instructor" })) ||
      (await Role.create({ name: "Instructor" }));

    const users = [
      {
        fullName: "John Student",
        email: "student@learnx.com",
        password: await bcrypt.hash("password123", 10),
      },
      {
        fullName: "Jane Instructor",
        email: "instructor@learnx.com",
        password: await bcrypt.hash("password123", 10),
      },
    ];

    for (const userData of users) {
      const user = await User.findOneAndUpdate(
        { email: userData.email },
        userData,
        { upsert: true, new: true }
      );

      const roleId = userData.email.includes("student")
        ? studentRole._id
        : instructorRole._id;

      await UserRole.findOneAndUpdate(
        { userId: user._id, roleId },
        { userId: user._id, roleId },
        { upsert: true }
      );
    }

    console.log("Seeded test users with roles successfully");
  } catch (err) {
    console.error("Error seeding test users:", err.message);
    throw err;
  }
};
