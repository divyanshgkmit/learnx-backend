import mongoose from 'mongoose';
import { MigrationUtils } from '../utils/migration.utils.js';

export const up = async () => {
  console.log('Running migration: Create roles table');
  await MigrationUtils.connectDB();
  
  await mongoose.connection.db.createCollection('roles');
  await mongoose.connection.db.collection('roles').createIndex(
    { name: 1 }, 
    { unique: true, name: 'roles_name_unique' }
  );

  console.log('Roles table migration completed');
};

export const down = async () => {
  console.log('Rolling back roles table migration');
  await MigrationUtils.connectDB();
  await mongoose.connection.db.dropCollection('roles');
  console.log('Roles table rollback completed');
};