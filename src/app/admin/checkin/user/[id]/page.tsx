import React from 'react';
import Link from 'next/link';
import { and, eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { db } from '@/db';
import { events, registrations, users } from '@/db/schema';
import BrutalCard from '@/components/ui/BrutalCard';
import BrutalButton from '@/components/ui/BrutalButton';
import { markRegistrationCheckedIn } from '@/lib/actions';
import { requireStaffPageAccess } from '@/lib/authz';

export const dynamic = 'force-dynamic';

export default async function UserCheckInPage({ params }: { params: Promise<{ id: string }> }) {
  await requireStaffPageAccess();

  const { id } = await params;

  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);

  if (!user) {
    notFound();
  }

  const userRegistrations = await db
    .select({
      id: registrations.id,
      status: registrations.status,
      checkedIn: registrations.checkedIn,
      checkedInAt: registrations.checkedInAt,
      teamName: registrations.teamName,
      eventName: events.name,
      venue: events.venue,
      schedule: events.schedule,
    })
    .from(registrations)
    .innerJoin(events, eq(registrations.eventId, events.id))
    .where(eq(registrations.userId, id));

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-12">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-2 italic">Participant Entry Card</h1>
          <p className="font-display font-bold uppercase text-primary tracking-widest text-sm">
            {user.name} · {user.phone || 'No phone'}
          </p>
        </div>
        <Link href="/admin/scanner" className="border-b-2 border-on-surface font-black uppercase text-xs hover:text-primary hover:border-primary transition-colors">
          &larr; Return to Scanner
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
          <BrutalCard shadowColor="gold" className="p-6">
            <h2 className="text-2xl font-black uppercase italic mb-4">Student Identity</h2>
            <div className="space-y-3 text-sm font-bold uppercase">
              <p>Name: {user.name}</p>
              <p>College: {user.college || 'Not provided'}</p>
              <p>Phone: {user.phone || 'Not provided'}</p>
              <p className="font-mono text-[10px] break-all opacity-60">User ID: {user.id}</p>
            </div>
          </BrutalCard>
        </div>

        <div className="lg:col-span-8">
          <BrutalCard className="p-0 overflow-hidden" shadowColor="black">
            <div className="p-6 border-b-2 border-on-surface bg-surface-container-low">
              <h2 className="text-2xl font-black uppercase italic">Registered Events</h2>
            </div>

            <div className="divide-y-2 divide-on-surface/10">
              {userRegistrations.length === 0 ? (
                <div className="p-8 text-center text-sm font-black uppercase opacity-40">No event registrations found</div>
              ) : (
                userRegistrations.map((registration) => {
                  const canCheckIn = registration.status === 'APPROVED' && !registration.checkedIn;

                  return (
                    <div key={registration.id} className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <p className="text-xl font-black uppercase">{registration.eventName}</p>
                        <p className="text-[10px] font-black uppercase opacity-60">
                          {registration.schedule || 'Schedule TBA'} · {registration.venue || 'Venue TBA'}
                        </p>
                        {registration.teamName ? (
                          <p className="text-[10px] font-black uppercase opacity-50">Team: {registration.teamName}</p>
                        ) : null}
                      </div>

                      <div className="flex flex-col md:items-end gap-2">
                        <span
                          className={`px-2 py-1 border-2 text-[10px] font-black uppercase ${
                            registration.checkedIn
                              ? 'bg-green-100 text-green-800 border-green-800'
                              : registration.status === 'APPROVED'
                                ? 'bg-yellow-100 text-yellow-900 border-yellow-900'
                                : 'bg-red-100 text-red-800 border-red-800'
                          }`}
                        >
                          {registration.checkedIn ? 'Present' : registration.status}
                        </span>

                        <form action={async (formData) => {
                          'use server';
                          await markRegistrationCheckedIn(formData);
                        }}>
                          <input type="hidden" name="id" value={registration.id} />
                          <BrutalButton type="submit" size="sm" variant="outline" disabled={!canCheckIn}>
                            {registration.checkedIn ? 'Already Marked' : 'Mark Present'}
                          </BrutalButton>
                        </form>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </BrutalCard>
        </div>
      </div>
    </div>
  );
}
