'use server';

import { db } from '@/db';
import { users, events, announcements, registrations, systemSettings, teams, teamMembers, scheduleSlots, organizers, squadPosts, teamMessages } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { awardXP, XP_PER_REGISTRATION } from './xp';

export async function createEvent(formData: FormData) {
  const name = formData.get('name') as string;
  const tagline = formData.get('tagline') as string;
  const description = formData.get('description') as string;
  const fee = parseInt(formData.get('fee') as string);
  const category = (formData.get('category') as string) || null;
  const venue = formData.get('venue') as string;
  const format = formData.get('format') as string || 'SOLO';
  const isCommon = formData.get('isCommon') === 'on';
  const teamSize = parseInt(formData.get('teamSize') as string) || 1;
  const teamSizeMin = parseInt(formData.get('teamSizeMin') as string) || 1;
  const expectedParticipantsRaw = (formData.get('expectedParticipants') as string) || null;
  const expectedParticipants = expectedParticipantsRaw ? parseInt(expectedParticipantsRaw) : null;
  const prizeDetails = (formData.get('prizeDetails') as string) || null;

  if (!name.trim()) {
    return { error: 'Event name is required.' };
  }

  if (Number.isNaN(fee) || fee < 0) {
    return { error: 'Fee must be zero or greater.' };
  }

  if (teamSizeMin > teamSize) {
    return { error: 'Min team size cannot be greater than max team size.' };
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  try {
    await db.insert(events).values({
      name,
      slug,
      tagline,
      description,
      category,
      fee,
      venue,
      format,
      isCommon,
      teamSize,
      teamSizeMin,
      expectedParticipants,
      prizeDetails,
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
      xp: 50, // Welcome Bonus
      level: 1,
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

export async function updateScheduleSlots(formData: FormData) {
  const slotDefs = [
    { sortIndex: 1, timeSlot: '10:30 AM - 11:00 AM' },
    { sortIndex: 2, timeSlot: '11:00 AM - 01:00 PM' },
    { sortIndex: 3, timeSlot: '01:00 PM - 01:30 PM' },
    { sortIndex: 4, timeSlot: '01:30 PM - 04:00 PM' },
    { sortIndex: 5, timeSlot: '04:00 PM - 05:30 PM' },
  ];

  try {
    await db.transaction(async (tx) => {
      for (const day of [1, 2] as const) {
        for (const slot of slotDefs) {
          const isBreak = slot.sortIndex === 3;
          const linkedEventIdRaw = formData.get(`day${day}_event_${slot.sortIndex}`) as string | null;
          const linkedEventId = !linkedEventIdRaw || linkedEventIdRaw === 'null' ? null : linkedEventIdRaw;
          const venueRaw = formData.get(`day${day}_venue_${slot.sortIndex}`) as string | null;
          const venue = venueRaw && venueRaw.trim().length > 0 ? venueRaw.trim() : null;

          const existing = await tx
            .select()
            .from(scheduleSlots)
            .where(
              and(
                eq(scheduleSlots.day, day),
                eq(scheduleSlots.sortIndex, slot.sortIndex),
              ),
            )
            .limit(1);

          if (existing.length === 0) {
            await tx.insert(scheduleSlots).values({
              day,
              sortIndex: slot.sortIndex,
              timeSlot: slot.timeSlot,
              venue,
              linkedEventId: isBreak ? null : linkedEventId,
              isBreak,
            });
          } else {
            await tx.update(scheduleSlots).set({
              timeSlot: slot.timeSlot,
              venue,
              linkedEventId: isBreak ? null : linkedEventId,
              isBreak,
            }).where(eq(scheduleSlots.id, existing[0].id));
          }
        }
      }
    });

    revalidatePath('/admin/schedule');
    revalidatePath('/');
    revalidatePath('/admin/dashboard');
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
  const teamSizeMinRaw = (formData.get('teamSizeMin') as string) || null;
  const teamSizeMin = teamSizeMinRaw ? parseInt(teamSizeMinRaw) : undefined;

  if (Number.isNaN(fee) || Number.isNaN(teamSize) || (teamSizeMin !== undefined && Number.isNaN(teamSizeMin))) {
    return { error: 'Fee and team sizes must be valid numbers.' };
  }

  if (teamSizeMin !== undefined && teamSizeMin > teamSize) {
    return { error: 'Min team size cannot be greater than max team size.' };
  }

  try {
    await db
      .update(events)
      .set({ fee, teamSize, ...(teamSizeMin !== undefined ? { teamSizeMin } : {}) })
      .where(eq(events.id, id));
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
  const yearRaw = (formData.get('year') as string) || null;
  const year = yearRaw ? parseInt(yearRaw) : null;
  const phone = formData.get('phone') as string;
  try {
    await db.update(users).set({ name, college, branch, year, phone }).where(eq(users.id, id));
    revalidatePath('/admin/users');
  } catch (e) { console.error(e); }
}

import { redirect } from 'next/navigation';

export async function completeProfile(formData: FormData) {
  const email = formData.get('email') as string;
  const college = formData.get('college') as string;
  const branch = formData.get('branch') as string;
  const yearRaw = (formData.get('year') as string) || null;
  const year = yearRaw ? parseInt(yearRaw) : null;
  const phone = formData.get('phone') as string;
  
  if (!email || !college || !branch || !phone || !year) {
    return;
  }

  try {
    await db.update(users).set({ college, branch, year, phone }).where(eq(users.email, email));
    revalidatePath('/dashboard');
  } catch (e) {
    console.error(e);
  }
  
  redirect('/dashboard');
}

export async function createRegistration(formData: FormData) {
  const eventId = formData.get('eventId') as string;
  const paymentScreenshot = (formData.get('paymentScreenshot') as string) || null;
  const teamName = formData.get('teamName') as string || null;
  const transactionId = formData.get('transactionId') as string || null;
  const paymentNotes = (formData.get('paymentNotes') as string) || null;

  const additionalMembers: Array<{
    name: string;
    phone: string;
    college: string | null;
    branch: string | null;
    year: number | null;
  }> = [];

  // Additional operators (excluding the primary logged-in user).
  for (const [key, value] of formData.entries()) {
    if (!key.startsWith('member_') || !key.endsWith('_name')) continue;
    const index = key.split('_')[1];

    const name = value as string;
    const phone = (formData.get(`member_${index}_phone`) as string) || '';
    const college = (formData.get(`member_${index}_college`) as string) || null;
    const branch = (formData.get(`member_${index}_branch`) as string) || null;
    const yearRaw = (formData.get(`member_${index}_year`) as string) || null;
    const year = yearRaw ? parseInt(yearRaw) : null;

    if (!name || !phone) continue;
    additionalMembers.push({ name, phone, college, branch, year });
  }

  const session = await auth();
  if (!session?.user?.email) return { error: 'Unauthorized Protocol.' };

  const [dbUser] = await db.select().from(users).where(eq(users.email, session.user.email));
  if (!dbUser) return { error: 'Identity not found in global registry.' };

  if (!dbUser.college || !dbUser.branch || !dbUser.phone || !dbUser.year) {
    return { error: 'Identity incomplete. Please complete profile (college, branch, year, phone).' };
  }

  try {
    const feeSettings = await db.select().from(systemSettings).where(eq(systemSettings.id, 1));
    const feePerPerson = feeSettings.length > 0 && feeSettings[0].feePerPerson ? feeSettings[0].feePerPerson : 0;

    const [event] = await db.select().from(events).where(eq(events.id, eventId));
    if (!event) return { error: 'Event not found.' };

    const allMembers = [
      {
        name: dbUser.name,
        phone: dbUser.phone as string,
        college: dbUser.college,
        branch: dbUser.branch,
        year: dbUser.year ?? null,
      },
      ...additionalMembers,
    ];

    const memberCount = allMembers.length;
    const teamSizeMin = event.teamSizeMin ?? 1;
    const teamSizeMax = event.teamSize ?? 1;
    if (memberCount < teamSizeMin || memberCount > teamSizeMax) {
      return { error: `Invalid team size. Allowed: ${teamSizeMin}-${teamSizeMax}.` };
    }

    const resolvedTeamName = teamName || `${dbUser.name}'s Team`;
    const resolvedFeePerPerson =
      event.fee === 0
        ? 0
        : feePerPerson && feePerPerson > 0
          ? feePerPerson
          : event.fee;
    const totalFee = resolvedFeePerPerson * memberCount;
    const requiresPayment = totalFee > 0;

    if (requiresPayment && (!paymentScreenshot || !transactionId)) {
      return { error: 'Payment screenshot and transaction ID are required for paid events.' };
    }

    // Check existing registration
    const existing = await db.select().from(registrations).where(and(eq(registrations.eventId, eventId), eq(registrations.userId, dbUser.id)));
    
    if (existing.length > 0) {
      if (existing[0].status === 'REJECTED') {
        // OVERWRITE PROTOCOL: Delete the rejected packet so they can retry smoothly.
        const existingTeamId = existing[0].teamId;
        await db.delete(registrations).where(eq(registrations.id, existing[0].id));
        if (existingTeamId) {
          await db.delete(teamMembers).where(eq(teamMembers.teamId, existingTeamId as string));
          await db.delete(teams).where(eq(teams.id, existingTeamId as string));
        }
      } else {
        return { error: 'You have already deployed a packet for this module.' };
      }
    }

    await db.transaction(async (tx) => {
      const [insertedTeam] = await tx
        .insert(teams)
        .values({ eventId, name: resolvedTeamName })
        .returning({ id: teams.id });

      if (!insertedTeam) {
        throw new Error('Failed to create team record');
      }

      await tx.insert(teamMembers).values(
        allMembers.map((m) => ({
          teamId: insertedTeam.id,
          name: m.name,
          college: m.college,
          branch: m.branch,
          year: m.year ?? null,
          phone: m.phone,
        })),
      );

      // Persist legacy JSON `members` for backward compatibility with existing admin UI.
      const legacyAdditionalMembers =
        additionalMembers.length > 0 ? additionalMembers.map((m) => ({ name: m.name, phone: m.phone })) : null;

      await tx.insert(registrations).values({
        userId: dbUser.id,
        eventId,
        teamId: insertedTeam.id,
        teamName: resolvedTeamName,
        members: legacyAdditionalMembers,
        transactionId: requiresPayment ? transactionId : null,
        paymentScreenshot: requiresPayment ? paymentScreenshot : null,
        paymentNotes,
        totalFee,
        status: requiresPayment ? 'PENDING' : 'APPROVED',
      });

      // Award XP for deployment within the transaction
      await awardXP(dbUser.id, XP_PER_REGISTRATION, tx);
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('REGISTRATION_FLOW_ERROR:', error);
    const message = error instanceof Error ? error.message : 'Unknown database fault';
    return { error: `CRITICAL ERROR: Registration injection failed (${message}). Please contact support if this persists.` };
  }
}

export async function updateRegistrationStatus(formData: FormData) {
  const id = formData.get('id') as string;
  const status = formData.get('status') as 'PENDING' | 'APPROVED' | 'REJECTED';
  const paymentNotes = (formData.get('paymentNotes') as string) || null;
  try {
    await db.update(registrations).set({ status, paymentNotes }).where(eq(registrations.id, id));
    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/registrations');
    revalidatePath(`/admin/verify/${id}`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to update transmission status.' };
  }
}

export async function markRegistrationCheckedIn(formData: FormData) {
  const id = formData.get('id') as string;
  try {
    await db
      .update(registrations)
      .set({ checkedIn: true, checkedInAt: new Date() })
      .where(and(eq(registrations.id, id), eq(registrations.status, 'APPROVED')));

    revalidatePath('/admin/checkin');
    revalidatePath('/admin/checkin/' + id);
  } catch (error) {
    console.error(error);
  }
}

import { galleryPhotos } from '@/db/schema';

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

export async function updateResultsSettings(formData: FormData) {
  const revealTimeStr = formData.get('revealTime') as string;
  const videoUrl = formData.get('videoUrl') as string;
  
  const revealTime = revealTimeStr ? new Date(revealTimeStr) : null;

  try {
    const existing = await db.select().from(systemSettings).where(eq(systemSettings.id, 1));
    if (existing.length === 0) {
      await db.insert(systemSettings).values({ 
        id: 1, 
        resultsRevealTime: revealTime, 
        resultsVideoUrl: videoUrl 
      });
    } else {
      await db.update(systemSettings)
        .set({ resultsRevealTime: revealTime, resultsVideoUrl: videoUrl })
        .where(eq(systemSettings.id, 1));
    }
    revalidatePath('/admin/results');
    revalidatePath('/leaderboard');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to reprogram timeline.' };
  }
}

export async function updateRegistrationSettings(formData: FormData) {
  const registrationOpen = formData.get('registrationOpen') === 'on';
  const upiId = (formData.get('upiId') as string) || null;
  const feePerPersonRaw = formData.get('feePerPerson') as string;
  const feePerPerson = feePerPersonRaw ? parseInt(feePerPersonRaw) : 0;
  const deadlineRaw = (formData.get('deadline') as string) || '';
  const deadline = deadlineRaw ? new Date(deadlineRaw) : null;

  if (Number.isNaN(feePerPerson) || feePerPerson < 0) {
    return { error: 'Fee per person must be zero or greater.' };
  }

  try {
    const existing = await db.select().from(systemSettings).where(eq(systemSettings.id, 1));
    if (existing.length === 0) {
      await db.insert(systemSettings).values({
        id: 1,
        registrationOpen,
        upiId,
        feePerPerson,
        deadline,
      });
    } else {
      await db.update(systemSettings).set({
        registrationOpen,
        upiId,
        feePerPerson,
        deadline,
      }).where(eq(systemSettings.id, 1));
    }

    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/settings');
    revalidatePath('/');
  } catch (error) {
    console.error(error);
  }
}

export async function createOrganizer(formData: FormData) {
  const organizerName = (formData.get('organizerName') as string) || '';
  const role = (formData.get('role') as string) || null;
  const contact = (formData.get('contact') as string) || null;

  if (!organizerName.trim()) {
    return;
  }

  try {
    await db.insert(organizers).values({
      organizerName: organizerName.trim(),
      role: role ? role.trim() : null,
      contact: contact ? contact.trim() : null,
    });
    revalidatePath('/admin/organizers');
  } catch (error) {
    console.error(error);
  }
}

export async function deleteOrganizer(formData: FormData) {
  const id = formData.get('id') as string;
  try {
    await db.delete(organizers).where(eq(organizers.id, id));
    revalidatePath('/admin/organizers');
  } catch (error) {
    console.error(error);
  }
}

export async function updateEventWinners(eventId: string, winners: unknown) {
  try {
    await db.update(events).set({ winners }).where(eq(events.id, eventId));
    revalidatePath('/admin/results');
    revalidatePath('/leaderboard');
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to inject winner data.' };
  }
}

export async function createSquadPost(formData: FormData) {
  const eventId = formData.get('eventId') as string;
  const bio = formData.get('bio') as string;

  const session = await auth();
  if (!session?.user?.id) return { error: 'Unauthorized sequence.' };

  try {
    await db.insert(squadPosts).values({
      userId: session.user.id,
      eventId,
      bio,
    });
    revalidatePath('/squads');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to broadcast recruitment signal.' };
  }
}

export async function deleteSquadPost(postId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: 'Unauthorized sequence.' };

  try {
    await db.delete(squadPosts).where(and(eq(squadPosts.id, postId), eq(squadPosts.userId, session.user.id)));
    revalidatePath('/squads');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to purge recruitment signal.' };
  }
}

export async function sendTeamMessage(registrationId: string, content: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: 'Unauthorized sequence.' };

  try {
    // Verify membership
    const [reg] = await db.select().from(registrations).where(eq(registrations.id, registrationId));
    if (!reg) return { error: 'Team module not found.' };

    await db.insert(teamMessages).values({
      registrationId,
      senderId: session.user.id,
      content,
    });
    
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to transmit team comms.' };
  }
}

