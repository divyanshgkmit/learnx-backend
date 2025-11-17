import mongoose from 'mongoose';

const runMigration = async () => {
  console.log('Running migration: Create user_roles table');
  await mongoose.connect(process.env.MONGODB_URI);
  await mongoose.connection.db.createCollection('userroles');
  await mongoose.connection.db.collection('userroles').createIndex(
    { userId: 1, roleId: 1 }, 
    { unique: true, name: 'userroles_user_role_unique' }
  );
  await mongoose.disconnect();
  console.log('UserRoles table migration completed');
};

runMigration();