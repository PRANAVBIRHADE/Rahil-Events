import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import * as dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seed() {
  console.log('Initiating Absolute Data Purge...');
  
  console.log('Wiping registrations...');
  await db.delete(schema.registrations);
  
  console.log('Wiping users...');
  await db.delete(schema.users);
  
  console.log('Wiping events...');
  await db.delete(schema.events);
  
  console.log('Seeding Master Admin...');
  const hashedPassword = await bcrypt.hash('admin100', 10);
  
  await db.insert(schema.users).values({
    name: 'Master Admin',
    email: 'admin100@gmail.com',
    password: hashedPassword,
    role: 'ADMIN',
  });
  
  console.log('Database operation complete. Absolute purity achieved.');
}

seed();
