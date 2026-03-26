import React from 'react';
import BrutalButton from '@/components/ui/BrutalButton';
import BrutalCard from '@/components/ui/BrutalCard';

import { db } from '@/db';
import { events, systemSettings, scheduleSlots } from '@/db/schema';
import { asc, eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const [dbEvent] = await db.select().from(events).where(eq(events.slug, slug));
  const [settings] = await db.select().from(systemSettings).where(eq(systemSettings.id, 1));

  if (!dbEvent) {
    notFound();
  }

  const feePerPersonResolved =
    settings?.feePerPerson && settings.feePerPerson > 0 ? settings.feePerPerson : dbEvent.fee;

  const scheduleForEvent = await db
    .select()
    .from(scheduleSlots)
    .where(eq(scheduleSlots.linkedEventId, dbEvent.id))
    .orderBy(asc(scheduleSlots.day), asc(scheduleSlots.sortIndex));

  const scheduleText =
    scheduleForEvent.length > 0
      ? scheduleForEvent
          .map((s) => `D${s.day} ${s.timeSlot}${s.venue ? ` @ ${s.venue}` : ''}`)
          .join(' | ')
      : dbEvent.schedule || 'TBA';

  const event = {
    name: dbEvent.name,
    tagline: dbEvent.tagline || 'Engineering the next infrastructure layer.',
    description: dbEvent.description || 'Module details pending initialization...',
    rules: [
      `Team size allowed: ${dbEvent.teamSizeMin ?? 1}-${dbEvent.teamSize ?? 1} members.`,
      'Participants must bring their own hardware.',
      'Software must be original and built during the event.',
      'Judgment will be based on innovation and structural logic.',
    ],
    fee: `₹${feePerPersonResolved} per person`,
    schedule: scheduleText,
    venue: dbEvent.venue || 'COMPUTING LAB 01',
  };

  const deadlineText = settings?.deadline
    ? settings.deadline.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
    : 'Deadline not configured';

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Header Section */}
        <div className="lg:col-span-8">
          <span className="text-sm font-display font-bold uppercase text-primary tracking-[0.2em] mb-4 block">Event Module // 01</span>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-6 leading-tight italic">
            {event.name}
          </h1>
          <p className="text-2xl font-sans italic border-l-8 border-primary-container pl-6 mb-12">
            {event.tagline}
          </p>
          
          <div className="prose prose-xl font-sans opacity-80 mb-16">
            <p>{event.description}</p>
          </div>

          <div className="space-y-12">
            <section>
              <h2 className="text-3xl font-black uppercase italic mb-6 border-b-4 border-on-surface w-fit">Standard Protocol</h2>
              <ul className="space-y-4">
                {event.rules.map((rule, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <span className="font-display font-black text-primary-container text-2xl" style={{ WebkitTextStroke: '1px #1A1C1C' }}>{i + 1}</span>
                    <p className="font-sans font-bold uppercase text-sm tracking-wide pt-1">{rule}</p>
                  </li>
                ))}
              </ul>

              {dbEvent.prizeDetails ? (
                <div className="mt-10">
                  <h3 className="text-2xl font-black uppercase italic mb-4 border-b-2 border-on-surface w-fit">Prize Details</h3>
                  <p className="font-sans font-bold uppercase text-sm opacity-80">{dbEvent.prizeDetails}</p>
                </div>
              ) : null}
            </section>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="lg:col-span-4 h-fit sticky top-32">
          <BrutalCard shadowColor="gold" className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between border-b-2 border-on-surface pb-2">
                <span className="text-[10px] font-black uppercase opacity-60">Access Fee</span>
                <span className="font-display font-black uppercase text-xl">{event.fee}</span>
              </div>
              <div className="flex justify-between border-b-2 border-on-surface pb-2">
                <span className="text-[10px] font-black uppercase opacity-60">Schedule Slot</span>
                <span className="font-display font-black uppercase">{event.schedule}</span>
              </div>
              <div className="flex justify-between border-b-2 border-on-surface pb-2">
                <span className="text-[10px] font-black uppercase opacity-60">Module Venue</span>
                <span className="font-display font-black uppercase">{event.venue}</span>
              </div>
              {dbEvent.category ? (
                <div className="flex justify-between border-b-2 border-on-surface pb-2">
                  <span className="text-[10px] font-black uppercase opacity-60">Category</span>
                  <span className="font-display font-black uppercase">{dbEvent.category}</span>
                </div>
              ) : null}
              {dbEvent.expectedParticipants ? (
                <div className="flex justify-between border-b-2 border-on-surface pb-2">
                  <span className="text-[10px] font-black uppercase opacity-60">Expected Participants</span>
                  <span className="font-display font-black uppercase">{dbEvent.expectedParticipants}</span>
                </div>
              ) : null}
            </div>

            <div className="space-y-4 pt-4">
              <BrutalButton className="w-full" size="lg">Initialize Registration</BrutalButton>
              <BrutalButton className="w-full" variant="outline">Consult Rules PDF</BrutalButton>
            </div>
            
            <p className="text-[10px] font-sans italic text-center opacity-60 uppercase">
              Deadline for registration: {deadlineText}
            </p>
          </BrutalCard>
        </div>
      </div>
    </div>
  );
}
