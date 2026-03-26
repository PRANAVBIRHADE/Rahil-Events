import React from 'react';
import BrutalCard from '@/components/ui/BrutalCard';
import RegistrationClientForm from '@/components/marketing/RegistrationClientForm';

import { db } from '@/db';
import { events, registrations, users, systemSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';

export default async function RegistrationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const session = await auth();
  if (!session?.user?.email) redirect('/auth/login');

  const [dbUser] = await db.select().from(users).where(eq(users.email, session.user.email));
  if (!dbUser) redirect('/auth/login');

  if (!dbUser.college || !dbUser.branch || !dbUser.phone || !dbUser.year) {
    redirect('/profile/complete');
  }

  const [event] = await db.select().from(events).where(eq(events.slug, slug));

  if (!event) {
    notFound();
  }

  const dbRegistrations = await db.select({ id: registrations.id }).from(registrations).where(eq(registrations.eventId, event.id));
  const activeCount = dbRegistrations.length;

  const [settings] = await db.select().from(systemSettings).where(eq(systemSettings.id, 1));
  const registrationOpen = settings?.registrationOpen ?? true;
  const deadline = settings?.deadline ?? null;
  const now = new Date();
  const isRegistrationClosed = !registrationOpen || (deadline ? now > deadline : false);

  const upiId = settings?.upiId || '9834147160@kotak811';
  const feePerPerson =
    event.fee === 0
      ? 0
      : settings?.feePerPerson && settings.feePerPerson > 0
        ? settings.feePerPerson
        : event.fee;

  const eventData = {
    upiId,
    feePerPerson,
    requiresPayment: feePerPerson > 0,
  };

  const isTeamFormat = event.format === 'TEAM' || event.format === 'SOLO_TEAM' || event.format === 'SOLO_PAIR';
  const isTeamRequired = event.format === 'TEAM';

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-12">
      <header className="mb-16">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9] text-on-surface italic mb-6">
          {event.name}
        </h1>
        {(event.description || event.tagline) && (
          <p className="text-xl md:text-2xl font-sans font-medium opacity-80 max-w-3xl border-l-4 border-primary pl-6">
            {event.description || event.tagline}
          </p>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-16">
          {isRegistrationClosed ? (
            <div className="bg-surface-container-low brutal-border p-8">
              <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-4">Registration Closed</h2>
              <p className="font-sans opacity-70 uppercase text-xs tracking-widest">
                Please contact the Admin Command Center for further instructions.
              </p>
              {deadline && (
                <p className="mt-4 font-mono opacity-60 text-xs uppercase">
                  Deadline was: {deadline.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              )}
            </div>
          ) : (
            <RegistrationClientForm
              eventId={event.id}
              eventFormat={event.format || 'SOLO'}
              isTeamFormat={isTeamFormat}
              isTeamRequired={isTeamRequired}
              teamSizeMin={event.teamSizeMin || 1}
              teamSizeMax={event.teamSize || 1}
              eventData={eventData}
              dbUser={{
                name: dbUser.name,
                phone: dbUser.phone || null,
                college: dbUser.college || null,
                branch: dbUser.branch || null,
                year: dbUser.year ?? null,
              }}
            />
          )}
        </div>

        <div className="lg:col-span-5 space-y-8 h-fit sticky top-32">
          <div className="bg-on-surface text-surface p-8 hard-shadow-gold italic">
            <h3 className="font-display text-xs font-bold uppercase tracking-[0.3em] mb-6 text-primary-container">Registration Status</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-surface/20 pb-4">
                <span className="font-display text-sm uppercase opacity-60">Validation State</span>
                <span className={`px-3 py-1 font-bold text-xs uppercase not-italic ${
                  isRegistrationClosed
                    ? 'bg-red-200 text-red-900'
                    : 'bg-primary-container text-on-primary-container'
                }`}>
                  {isRegistrationClosed ? 'Closed' : 'Open'}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-surface/20 pb-4">
                <span className="font-display text-sm uppercase opacity-60">Max Capacity</span>
                <span className="font-bold">{event.teamSize || 1} Members</span>
              </div>
              <div className="flex items-center justify-between border-b border-surface/20 pb-4">
                <span className="font-display text-sm uppercase opacity-60">Registrations Received</span>
                <span className="font-bold">{activeCount}</span>
              </div>
              <div className="flex items-center justify-between border-b border-surface/20 pb-4">
                <span className="font-display text-sm uppercase opacity-60">Registration Fee</span>
                <span className="font-black text-primary-container">
                  {feePerPerson > 0 ? `INR ${feePerPerson}` : 'FREE'}
                </span>
              </div>
            </div>
          </div>

          <BrutalCard className="bg-secondary-container/20">
            <h3 className="text-xl font-black uppercase tracking-tighter mb-6 underline">Critical Instructions</h3>
            <ul className="space-y-4">
              <li className="flex gap-4 items-start">
                <span className="material-symbols-outlined text-primary font-bold">verified</span>
                <p className="text-xs font-bold uppercase leading-relaxed tracking-tight">
                  {eventData.requiresPayment
                    ? 'Ensure the transaction ID is visible in the uploaded screenshot for rapid verification.'
                    : 'No payment is required for this event, but team details must still be accurate.'}
                </p>
              </li>
              <li className="flex gap-4 items-start">
                <span className="material-symbols-outlined text-primary font-bold">verified</span>
                <p className="text-xs font-bold uppercase leading-relaxed tracking-tight">
                  Double-check your college name and branch before submission. Incorrect data may lead to rejection.
                </p>
              </li>
            </ul>
          </BrutalCard>
        </div>
      </div>
    </div>
  );
}
