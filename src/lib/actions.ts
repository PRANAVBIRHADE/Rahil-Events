'use server';

import { db } from '@/db';
import { users, events, announcements, registrations } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

export async function createEvent(formData: FormData) {
  const name = formData.get('name') as string;
  const tagline = formData.get('tagline') as string;
  const description = formData.get('description') as string;
  const fee = parseInt(formData.get('fee') as string);
  const venue = formData.get('venue') as string;
  const branch = formData.get('branch') as string;
  const isTeam = formData.get('isTeam') === 'true';
  const isCommon = formData.get('isCommon') === 'on';
  const teamSize = parseInt(formData.get('teamSize') as string) || 1;

  const slug = name.toLowerCase().replace(/\s+/g, '-');

  try {
    await db.insert(events).values({
      name,
      slug,
      tagline,
      description,
      fee,
      venue,
      branch,
      isTeam,
      isCommon,
      teamSize,
    });
    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to initialize event module.' };
  }
}

export async function registerUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const college = formData.get('college') as string;
  const branch = formData.get('branch') as string;
  const phone = formData.get('phone') as string;

  if (!name || !email || !password) {
    return { error: 'Missing required fields.' };
  }

  try {
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) {
      return { error: 'Email already registered.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      college,
      branch,
      phone,
      role: 'PARTICIPANT',
    });

    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: 'Database synchronization failed.' };
  }
}

export async function registerAdmin(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!name || !email || !password) {
    return { error: 'Missing required credentials.' };
  }

  try {
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) {
      return { error: 'Module Identifier already registered.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      role: 'ADMIN',
    });

    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: 'Database synchronization failed.' };
  }
}

export async function updateAnnouncement(formData: FormData) {
  const content = formData.get('content') as string;
  const isActive = formData.get('isActive') === 'on';

  try {
    const existing = await db.select().from(announcements).limit(1);
    
    if (existing.length > 0) {
      await db.update(announcements)
        .set({ content, isActive, updatedAt: new Date() })
        .where(eq(announcements.id, existing[0].id));
    } else {
      await db.insert(announcements).values({ content, isActive });
    }
    
    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to update broadcast signal.' };
  }
}

export async function updateSchedules(formData: FormData) {
  try {
    const entries = Array.from(formData.entries());
    
    for (const [id, schedule] of entries) {
      if (id.startsWith('$ACTION')) continue;
      
      await db.update(events)
        .set({ schedule: schedule as string })
        .where(eq(events.id, id));
    }
    
    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/schedule');
  } catch (e) {
    console.error(e);
  }
}

export async function deleteEvent(formData: FormData) {
  const id = formData.get('id') as string;
  try {
    await db.delete(registrations).where(eq(registrations.eventId, id));
    await db.delete(events).where(eq(events.id, id));
    revalidatePath('/admin/events');
    revalidatePath('/admin/dashboard');
  } catch(e) { console.error(e); }
}

export async function updateEvent(formData: FormData) {
  const id = formData.get('id') as string;
  const fee = parseInt(formData.get('fee') as string);
  const teamSize = parseInt(formData.get('teamSize') as string);
  try {
    await db.update(events).set({ fee, teamSize }).where(eq(events.id, id));
    revalidatePath('/admin/events');
    revalidatePath('/admin/dashboard');
  } catch (e) { console.error(e); }
}

export async function deleteUser(formData: FormData) {
  const id = formData.get('id') as string;
  try {
    await db.delete(registrations).where(eq(registrations.userId, id));
    await db.delete(users).where(eq(users.id, id));
    revalidatePath('/admin/users');
  } catch(e) { console.error(e); }
}

export async function updateUser(formData: FormData) {
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const college = formData.get('college') as string;
  const branch = formData.get('branch') as string;
  const phone = formData.get('phone') as string;
  try {
    await db.update(users).set({ name, college, branch, phone }).where(eq(users.id, id));
    revalidatePath('/admin/users');
  } catch (e) { console.error(e); }
}
