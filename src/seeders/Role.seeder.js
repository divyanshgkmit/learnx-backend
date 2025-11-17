import mongoose from 'mongoose';
import Role from '../models/Role.js';

const seedRoles = async () => {
  console.log('Seeding roles...');
  await mongoose.connect(process.env.MONGODB_URI);
  
  // Use findOneAndUpdate to handle duplicates
  await Role.findOneAndUpdate(
    { name: 'Student' },
    { name: 'Student' },
    { upsert: true }
  );
  
  await Role.findOneAndUpdate(
    { name: 'Instructor' },
    { name: 'Instructor' },
    { upsert: true }
  );

  console.log('Seeded 2 roles: Student, Instructor');
  await mongoose.disconnect();
};

seedRoles();