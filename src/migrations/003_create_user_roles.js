import mongoose from 'mongoose';
import { MigrationUtils } from '../utils/migration.utils.js';

export const up = async () => {
  console.log('Running migration: Create user_roles table');
  await MigrationUtils.connectDB();
  
  await mongoose.connection.db.createCollection('userroles');
  await mongoose.connection.db.collection('userroles').createIndex(
    { userId: 1, roleId: 1 }, 
    { unique: true, name: 'userroles_user_role_unique' }
  );

  console.log('UserRoles table migration completed');
};

export const down = async () => {
  console.log('Rolling back user_roles table migration');
  await MigrationUtils.connectDB();
  await mongoose.connection.db.dropCollection('userroles');
  console.log('UserRoles table rollback completed');
};