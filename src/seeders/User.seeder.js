import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Role from '../models/Role.js';
import UserRole from '../models/UserRole.js';

const seedUsers = async () => {
  console.log('Seeding demo users...');
  await mongoose.connect(process.env.MONGODB_URI);

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
  await mongoose.disconnect();
};

seedUsers();