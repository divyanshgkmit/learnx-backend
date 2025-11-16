import mongoose from 'mongoose';

const runRollback = async () => {
  console.log('Rolling back all migrations...');
  await mongoose.connect(process.env.MONGODB_URI);

  await mongoose.connection.db.dropCollection('userroles');
  console.log('Dropped userroles table');
  
  await mongoose.connection.db.dropCollection('users');
  console.log('Dropped users table');
  
  await mongoose.connection.db.dropCollection('roles');
  console.log('Dropped roles table');
  
  console.log('All migrations rolled back!');
  await mongoose.disconnect();
};

runRollback();