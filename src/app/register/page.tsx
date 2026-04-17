import React from 'react';
import { db } from '@/db';
import { events as eventsTable, systemSettings } from '@/db/schema';
import { asc, eq } from 'drizzle-orm';
import UnifiedRegistrationForm from './UnifiedRegistrationForm';
import { isRegistrationKillSwitchEnabled, getRegistrationKillSwitchMessage } from '@/lib/env';
import { resolvePerParticipantFee } from '@/lib/registration';

export default async function RegistrationPage(props: { searchParams: Promise<{ event?: string }> }) {
  const searchParams = await props.searchParams;
  const requestedEvent = searchParams.event?.trim() || '';

  const allEventsRaw = await db.select().from(eventsTable).orderBy(asc(eventsTable.sortOrder), asc(eventsTable.name));
  const [settings] = await db.select().from(systemSettings).where(eq(systemSettings.id, 1));

  const allEvents = allEventsRaw.map((event) => ({
    ...event,
    fee: resolvePerParticipantFee(event.fee, settings?.feePerPerson),
  }));

  const preselectedEventId =
    allEvents.find((event) => event.id === requestedEvent || event.slug === requestedEvent)?.id ?? '';

  const registrationOpen = settings?.registrationOpen ?? true;
  const deadline = settings?.deadline ?? null;
  const now = new Date();

  const isKilled = isRegistrationKillSwitchEnabled();
  const killMessage = getRegistrationKillSwitchMessage();
  let isRegistrationClosed = !registrationOpen || (deadline && now > deadline);

  if (isKilled) {
    isRegistrationClosed = true;
  }

  const upiId = settings?.upiId || '9834147160@kotak811';

  return (
    <div className="max-w-[1000px] mx-auto px-4 md:px-6 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] text-on-surface italic mb-4">
          Register Fast
        </h1>
        <p className="text-lg font-sans font-medium opacity-80">
          Complete the form below to confirm your spot in KRATOS 2026. Fast. Simple. Direct.
        </p>
      </header>

      {isRegistrationClosed ? (
        <div className="bg-surface-container-low brutal-border p-8 border-l-8 border-l-red-500 max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-4">Registrations Closed</h2>
          {isKilled ? (
            <p className="font-sans font-bold uppercase text-red-600 bg-red-100 p-4 border border-red-200 inline-block">
              {killMessage || 'Registrations are currently paused.'}
            </p>
          ) : (
            <p className="font-sans opacity-70 uppercase tracking-widest text-sm">
              Please contact the event organizers for further instructions or queries.
            </p>
          )}
        </div>
      ) : (
        <UnifiedRegistrationForm events={allEvents} initialEventId={preselectedEventId} upiId={upiId} />
      )}
    </div>
  );
}
