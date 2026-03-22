'use server';

import { db } from '@/db';
import { users, events, announcements, registrations } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

export async function createEvent(formData: FormData) {
  const name = formData.get('name') as string;
  const tagline = formData.get('tagline') as string;
  const description = formData.get('description') as string;
  const fee = parseInt(formData.get('fee') as string);
  const venue = formData.get('venue') as string;
  const branch = formData.get('branch') as string;
  const format = formData.get('format') as string || 'SOLO';
  const isCommon = formData.get('isCommon') === 'on';
  const teamSize = parseInt(formData.get('teamSize') as string) || 1;

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  try {
    await db.insert(events).values({
      name,
      slug,
      tagline,
      description,
      fee,
      venue,
      branch,
      format,
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
    revalidatePath('/');
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
    revalidatePath('/');
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

import { redirect } from 'next/navigation';

export async function completeProfile(formData: FormData) {
  const email = formData.get('email') as string;
  const college = formData.get('college') as string;
  const branch = formData.get('branch') as string;
  const phone = formData.get('phone') as string;
  
  if (!email || !college || !branch || !phone) {
    return;
  }

  try {
    await db.update(users).set({ college, branch, phone }).where(eq(users.email, email));
    revalidatePath('/dashboard');
  } catch (e) {
    console.error(e);
  }
  
  redirect('/dashboard');
}

export async function createRegistration(formData: FormData) {
  const eventId = formData.get('eventId') as string;
  const paymentScreenshot = formData.get('paymentScreenshot') as string;
  const teamName = formData.get('teamName') as string || null;
  const transactionId = formData.get('transactionId') as string || null;
  
  const members = [];
  for (const [key, value] of formData.entries()) {
    if (key.startsWith('member_') && key.endsWith('_name')) {
      const index = key.split('_')[1];
      const phone = formData.get(`member_${index}_phone`) as string;
      members.push({ name: value as string, phone });
    }
  }

  const session = await auth();
  if (!session?.user?.email) return { error: 'Unauthorized Protocol.' };

  const [dbUser] = await db.select().from(users).where(eq(users.email, session.user.email));
  if (!dbUser) return { error: 'Identity not found in global registry.' };

  // Check existing registration
  const existing = await db.select().from(registrations).where(and(eq(registrations.eventId, eventId), eq(registrations.userId, dbUser.id)));
  
  if (existing.length > 0) {
    if (existing[0].status === 'REJECTED') {
      // OVERWRITE PROTOCOL: Delete the rejected packet so they can retry smoothly.
      await db.delete(registrations).where(eq(registrations.id, existing[0].id));
    } else {
      return { error: 'You have already deployed a packet for this module.' };
    }
  }

  try {
    await db.insert(registrations).values({
      userId: dbUser.id,
      eventId,
      teamName,
      transactionId,
      members: members.length > 0 ? members : null,
      paymentScreenshot,
      status: 'PENDING',
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Registration injection failed due to backend database timeout.' };
  }
}

export async function updateRegistrationStatus(formData: FormData) {
  const id = formData.get('id') as string;
  const status = formData.get('status') as 'PENDING' | 'APPROVED' | 'REJECTED';
  try {
    await db.update(registrations).set({ status }).where(eq(registrations.id, id));
    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/registrations');
    revalidatePath(`/admin/verify/${id}`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to update transmission status.' };
  }
}

import { systemSettings, galleryPhotos } from '@/db/schema';

export async function updateGalleryLock(isGalleryLocked: boolean) {
  try {
    const existing = await db.select().from(systemSettings).where(eq(systemSettings.id, 1));
    if (existing.length === 0) {
      await db.insert(systemSettings).values({ id: 1, isGalleryLocked });
    } else {
      await db.update(systemSettings).set({ isGalleryLocked }).where(eq(systemSettings.id, 1));
    }
    revalidatePath('/admin/dashboard');
    revalidatePath('/dashboard');
    revalidatePath('/gallery');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to flip master gallery lock.' };
  }
}

export async function uploadGalleryPhoto(imageUrl: string) {
  const session = await auth();
  if (!session?.user?.email) return { error: 'Unauthorized sequence.' };

  const [dbUser] = await db.select().from(users).where(eq(users.email, session.user.email));
  if (!dbUser) return { error: 'Identity fragmented.' };

  const [settings] = await db.select().from(systemSettings).where(eq(systemSettings.id, 1));
  if (settings && settings.isGalleryLocked) {
    return { error: 'Central Command has locked the Memory Core.' };
  }

  const existingPhotos = await db.select().from(galleryPhotos).where(eq(galleryPhotos.userId, dbUser.id));
  if (existingPhotos.length >= 4) {
    return { error: 'Maximum optical capacity reached (4 photos limit).' };
  }

  try {
    await db.insert(galleryPhotos).values({
      userId: dbUser.id,
      imageUrl,
    });
    revalidatePath('/dashboard');
    revalidatePath('/gallery');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to upload photo.' };
  }
}

export async function deleteGalleryPhoto(id: string) {
  const session = await auth();
  if (!session?.user?.email) return { error: 'Unauthorized sequence.' };

  const [dbUser] = await db.select().from(users).where(eq(users.email, session.user.email));
  if (!dbUser) return { error: 'Identity fragmented.' };

  try {
    // Safety check - Can only delete if user owns the photo
    await db.delete(galleryPhotos).where(and(eq(galleryPhotos.id, id), eq(galleryPhotos.userId, dbUser.id)));
    revalidatePath('/dashboard');
    revalidatePath('/gallery');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Data purge failed.' };
  }
}
