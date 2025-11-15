import mongoose from 'mongoose';
import { MigrationUtils } from '../utils/migration.utils.js';
import Role from '../models/Role.js';

export class RoleSeeder {
  static async run() {
    console.log('Seeding roles...');
    await MigrationUtils.connectDB();
    
    const roles = [
      { name: 'Student' },
      { name: 'Instructor' }
    ];

    for (const roleData of roles) {
      await Role.findOneAndUpdate(
        { name: roleData.name },
        roleData,
        { upsert: true, new: true }
      );
    }

    console.log('Seeded 2 roles: Student, Instructor');
  }

  static async clear() {
    console.log('Clearing roles...');
    await MigrationUtils.connectDB();
    await mongoose.connection.db.collection('roles').deleteMany({});
    console.log('Roles cleared');
  }
}