import { MigrationUtils } from './migration.utils.js';
import * as migration1 from '../migrations/001_create_roles.js';
import * as migration2 from '../migrations/002_create_users.js';
import * as migration3 from '../migrations/003_create_user_roles.js';
import { RoleSeeder } from '../seeders/Role.seeder.js';
import { UserSeeder } from '../seeders/User.seeder.js';

class MigrationRunner {
  static migrations = [
    { name: '001_create_roles', ...migration1 },
    { name: '002_create_users', ...migration2 },
    { name: '003_create_user_roles', ...migration3 }
  ];

  static async runAll() {
    console.log('Starting database migrations...');
    
    try {
      await MigrationUtils.connectDB();

      for (const migration of this.migrations) {
        console.log(`Running migration: ${migration.name}`);
        await migration.up();
      }

      console.log('All migrations completed successfully!');
      await this.runSeeders();
      
    } catch (error) {
      console.error('Migration failed:', error);
      process.exit(1);
    } finally {
      await MigrationUtils.disconnectDB();
    }
  }

  static async runSeeders() {
    console.log('Starting database seeding...');
    
    try {
      await MigrationUtils.connectDB();
      await RoleSeeder.run();
      await UserSeeder.run();
      console.log('All seeders completed successfully!');
    } catch (error) {
      console.error('Seeding failed:', error);
      process.exit(1);
    }
  }

  static async rollback() {
    console.log('Rolling back migrations...');
    
    try {
      await MigrationUtils.connectDB();

      for (const migration of [...this.migrations].reverse()) {
        console.log(`Rolling back: ${migration.name}`);
        await migration.down();
      }

      console.log('All migrations rolled back successfully!');
    } catch (error) {
      console.error('Rollback failed:', error);
      process.exit(1);
    } finally {
      await MigrationUtils.disconnectDB();
    }
  }
}

if (process.argv[2] === 'run') {
  MigrationRunner.runAll();
} else if (process.argv[2] === 'rollback') {
  MigrationRunner.rollback();
}

export default MigrationRunner;