import { db } from './index';
import { users } from './schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function seedAdmin() {
  const adminEmail = 'admin@kratos.fest';
  const hashedPassword = await bcrypt.hash('KratosAdmin2026!', 10);

  const existing = await db.select().from(users).where(eq(users.email, adminEmail));

  if (existing.length > 0) {
    console.log('Admin already exists.');
    return;
  }

  await db.insert(users).values({
    name: 'Kratos Administrator',
    email: adminEmail,
    password: hashedPassword,
    role: 'ADMIN',
  });

  console.log('✅ Admin account created: admin@kratos.fest / KratosAdmin2026!');
}

seedAdmin().catch(console.error);
