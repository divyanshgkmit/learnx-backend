import mongoose from 'mongoose';

const runMigration = async () => {
  console.log('Running migration: Create roles table');
  await mongoose.connect(process.env.MONGODB_URI);
  await mongoose.connection.db.createCollection('roles');
  await mongoose.connection.db.collection('roles').createIndex(
    { name: 1 }, 
    { unique: true, name: 'roles_name_unique' }
  );
  await mongoose.disconnect();
  console.log('Roles table migration completed');
};

runMigration();