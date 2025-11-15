import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { MigrationUtils } from '../utils/migration.utils.js';
import User from '../models/User.js';
import Role from '../models/Role.js';
import UserRole from '../models/UserRole.js';

export class UserSeeder {
  static async run() {
    console.log('Seeding demo users...');
    await MigrationUtils.connectDB();

    const studentRole = await Role.findOne({ name: 'Student' });
    const instructorRole = await Role.findOne({ name: 'Instructor' });

    const users = [
      {
        fullName: 'John Student',
        email: 'student@learnx.com',
        password: await bcrypt.hash('password123', 10)
      },
      {
        fullName: 'Jane Instructor', 
        email: 'instructor@learnx.com',
        password: await bcrypt.hash('password123', 10)
      }
    ];

    for (const userData of users) {
      const user = await User.findOneAndUpdate(
        { email: userData.email },
        userData,
        { upsert: true, new: true }
      );

      let roleId;
      if (userData.email.includes('student')) {
        roleId = studentRole._id;
      } else {
        roleId = instructorRole._id;
      }

      await UserRole.findOneAndUpdate(
        { userId: user._id, roleId },
        { userId: user._id, roleId },
        { upsert: true }
      );
    }

    console.log('Seeded 2 demo users with roles');
    console.log('Student: student@learnx.com / password123');
    console.log('Instructor: instructor@learnx.com / password123');
  }

  static async clear() {
    console.log('Clearing demo users...');
    await MigrationUtils.connectDB();
    await mongoose.connection.db.collection('users').deleteMany({});
    await mongoose.connection.db.collection('userroles').deleteMany({});
    console.log('Demo users and roles cleared');
  }
}