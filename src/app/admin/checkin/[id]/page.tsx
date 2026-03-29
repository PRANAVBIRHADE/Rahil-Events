import React from 'react';
import Link from 'next/link';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { events, registrations, teamMembers, users } from '@/db/schema';
import BrutalCard from '@/components/ui/BrutalCard';
import BrutalButton from '@/components/ui/BrutalButton';
import { markRegistrationCheckedIn } from '@/lib/actions';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function CheckInDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [data] = await db
    .select({
      reg: registrations,
      user: users,
      event: events,
    })
    .from(registrations)
    .innerJoin(users, eq(registrations.userId, users.id))
    .innerJoin(events, eq(registrations.eventId, events.id))
    .where(eq(registrations.id, id));

  if (!data) return notFound();

  const { reg, user, event } = data;

  const teamMemberRows = reg.teamId
    ? await db.select().from(teamMembers).where(eq(teamMembers.teamId, reg.teamId))
    : [];

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-12">
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-2 italic">QR Check-In</h1>
          <p className="font-display font-bold uppercase text-primary tracking-widest text-sm">
            Ref ID: {reg.id.substring(0, 18)}
          </p>
        </div>
        <Link href="/admin/checkin" className="border-b-2 border-on-surface font-black uppercase text-xs hover:text-primary hover:border-primary transition-colors">
          &larr; Back to Search
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5 space-y-8">
          <BrutalCard shadow={true}>
            <h2 className="text-2xl font-black uppercase italic mb-6 border-b-2 border-on-surface pb-2">Registration Details</h2>
            <div className="space-y-4 font-mono text-sm">
              <div className="flex justify-between border-b border-on-surface/10 pb-2">
                <span className="opacity-60 uppercase font-sans font-bold">Event</span>
                <span className="font-bold">{event.name}</span>
              </div>
              <div className="flex justify-between border-b border-on-surface/10 pb-2">
                <span className="opacity-60 uppercase font-sans font-bold">Payment Status</span>
                <span className="font-bold">{reg.status}</span>
              </div>
              <div className="flex justify-between border-b border-on-surface/10 pb-2">
                <span className="opacity-60 uppercase font-sans font-bold">Check-in</span>
                <span className="font-bold">{reg.checkedIn ? 'CHECKED-IN' : 'NOT CHECKED-IN'}</span>
              </div>
              {reg.checkedInAt ? (
                <div className="flex justify-between pt-2">
                  <span className="opacity-60 uppercase font-sans font-bold">Checked-in At</span>
                  <span className="font-bold">{new Date(reg.checkedInAt).toLocaleString()}</span>
                </div>
              ) : null}
            </div>
          </BrutalCard>

          <BrutalCard shadow={true}>
            <h2 className="text-2xl font-black uppercase italic mb-6 border-b-2 border-on-surface pb-2">Team</h2>
            <div className="space-y-3">
              <div className="font-display font-black text-2xl uppercase tracking-tighter text-primary-container">
                {reg.teamName || user.name}
              </div>
              {teamMemberRows.length > 0 ? (
                <div className="space-y-3">
                  {teamMemberRows.map((m, i) => (
                    <div key={i} className="bg-surface-container-low p-3 brutal-border flex justify-between items-center text-sm font-mono gap-4">
                      <div className="min-w-0">
                        <p className="font-bold uppercase truncate">{m.name}</p>
                        <p className="text-[10px] opacity-60 uppercase truncate">
                          {m.college || 'N/A'} {m.branch ? `(${m.branch})` : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="opacity-60 text-xs uppercase">{m.phone || user.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="opacity-60 text-xs uppercase">No team member rows stored yet.</p>
              )}
            </div>
          </BrutalCard>
        </div>

        <div className="lg:col-span-7 space-y-8">
          <div className="bg-on-surface text-surface p-8 hard-shadow-gold italic">
            <h3 className="font-display text-sm font-bold uppercase tracking-[0.3em] mb-6 text-primary-container">Check-In Terminal</h3>

            {reg.checkedIn ? (
              <div className="border-b border-surface/20 pb-4 mb-6">
                <p className="text-sm uppercase font-bold">Already checked in.</p>
                {reg.checkedInAt ? (
                  <p className="text-[10px] opacity-60 font-mono mt-2">
                    {new Date(reg.checkedInAt).toLocaleString()}
                  </p>
                ) : null}
              </div>
            ) : (
              <div className="border-b border-surface/20 pb-4 mb-6">
                <p className="text-sm uppercase font-bold opacity-80">
                  Payment must be `APPROVED` to check-in.
                </p>
              </div>
            )}

            <form action={markRegistrationCheckedIn} className="space-y-4">
              <input type="hidden" name="id" value={reg.id} />
              <BrutalButton
                type="submit"
                size="lg"
                variant="outline"
                disabled={reg.checkedIn || reg.status !== 'APPROVED'}
                className="w-full"
              >
                Mark as Checked-In
              </BrutalButton>
              {reg.status !== 'APPROVED' ? (
                <p className="text-[10px] opacity-60 uppercase">
                  Payment is not approved yet. This registration cannot be checked-in.
                </p>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

