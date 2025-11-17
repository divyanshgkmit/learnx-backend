import mongoose from 'mongoose';

const runMigration = async () => {
  console.log('Running migration: Create users table');
  await mongoose.connect(process.env.MONGODB_URI);
  await mongoose.connection.db.createCollection('users');
  await mongoose.connection.db.collection('users').createIndex(
    { email: 1 }, 
    { unique: true, name: 'users_email_unique' }
  );
  await mongoose.disconnect();
  console.log('Users table migration completed');
};

runMigration();