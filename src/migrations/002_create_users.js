import mongoose from 'mongoose';
import { MigrationUtils } from '../utils/migration.utils.js';

export const up = async () => {
  console.log('Running migration: Create users table');
  await MigrationUtils.connectDB();
  
  await mongoose.connection.db.createCollection('users');
  await mongoose.connection.db.collection('users').createIndex(
    { email: 1 }, 
    { unique: true, name: 'users_email_unique' }
  );

  console.log('Users table migration completed');
};

export const down = async () => {
  console.log('Rolling back users table migration');
  await MigrationUtils.connectDB();
  await mongoose.connection.db.dropCollection('users');
  console.log('Users table rollback completed');
};