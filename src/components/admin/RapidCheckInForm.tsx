'use client';

import React, { useMemo, useState } from 'react';
import BrutalCard from '@/components/ui/BrutalCard';
import BrutalButton from '@/components/ui/BrutalButton';
import { rapidCheckIn } from '@/lib/actions';

type EventOption = {
  id: string;
  name: string;
};

export default function RapidCheckInForm({ events }: { events: EventOption[] }) {
  const eventOptions = useMemo(() => [...events].sort((a, b) => a.name.localeCompare(b.name)), [events]);
  const [selectedEventId, setSelectedEventId] = useState(eventOptions[0]?.id ?? '');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage(null);

    const result = await rapidCheckIn(formData);

    if ('error' in result) {
      setMessage(result.error || 'Check-in failed');
    } else {
      const unresolvedPart =
        result.unresolved.length > 0 ? ` | Unresolved: ${result.unresolved.join(', ')}` : '';
      setMessage(
        `Checked in: ${result.checkedInCount} | Already marked: ${result.alreadyCheckedInCount} | Blocked: ${result.blockedCount}${unresolvedPart}`,
      );
    }

    setLoading(false);
  }

  return (
    <BrutalCard shadowColor="gold" className="p-6">
      <div className="mb-4 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black uppercase italic">Rapid Event Check-In</h2>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
            Paste participant IDs, registration IDs, member IDs, or full QR links
          </p>
        </div>
      </div>

      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-black uppercase mb-1">Event Desk</label>
          <select
            name="eventId"
            value={selectedEventId}
            onChange={(event) => setSelectedEventId(event.target.value)}
            className="w-full px-4 py-3 brutal-border bg-surface text-sm font-bold uppercase outline-none focus:border-primary"
          >
            {eventOptions.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase mb-1">Codes</label>
          <textarea
            name="codes"
            rows={6}
            placeholder="One code per line"
            className="w-full px-4 py-3 brutal-border bg-surface text-sm font-mono font-bold outline-none focus:border-primary"
            required
          />
        </div>

        {message ? (
          <div className="p-3 border-2 border-on-surface bg-surface-container-low text-[10px] font-black uppercase tracking-wide">
            {message}
          </div>
        ) : null}

        <BrutalButton type="submit" className="w-full" size="sm" disabled={loading}>
          {loading ? 'CHECKING IN...' : 'RUN RAPID CHECK-IN'}
        </BrutalButton>
      </form>
    </BrutalCard>
  );
}
