import React from 'react';
import { db } from '@/db';
import { events } from '@/db/schema';
import BrutalCard from '@/components/ui/BrutalCard';
import BrutalButton from '@/components/ui/BrutalButton';
import Link from 'next/link';
import { desc } from 'drizzle-orm';
import { updateSchedules } from '@/lib/actions';

export const dynamic = 'force-dynamic';

export default async function AdminSchedulePage() {
  const allEvents = await db.select().from(events).orderBy(desc(events.createdAt));

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-12">
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-2 italic">Timeline Editor</h1>
          <p className="font-display font-bold uppercase text-primary tracking-widest text-sm">Master Schedule Configuration</p>
        </div>
        <Link href="/admin/dashboard" className="border-b-2 border-on-surface font-black uppercase text-xs hover:text-primary hover:border-primary transition-colors">
          &larr; Return to Command Center
        </Link>
      </div>

      <BrutalCard shadowColor="black">
        <form action={updateSchedules} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allEvents.map(event => (
              <div key={event.id} className="p-4 border-2 border-on-surface bg-surface-container-low flex flex-col justify-between">
                <div className="mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-primary-container px-2 py-1 mb-2 inline-block">
                    {event.branch}
                  </span>
                  <h3 className="text-xl font-black uppercase leading-tight truncate">{event.name}</h3>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Timestamp Configuration</label>
                  <input 
                    type="text" 
                    name={event.id} 
                    defaultValue={event.schedule || ''} 
                    placeholder="E.g. April 12, 10:00 AM"
                    className="p-2 border-2 border-on-surface bg-surface text-sm font-mono font-bold uppercase outline-none focus:border-primary"
                  />
                </div>
              </div>
            ))}
            {allEvents.length === 0 && (
              <div className="col-span-full py-12 text-center opacity-50">
                <p className="font-display font-black text-xl tracking-widest uppercase">NO MODULES DETECTED</p>
              </div>
            )}
          </div>

          {allEvents.length > 0 && (
            <div className="pt-8 border-t-2 border-on-surface flex justify-end">
              <BrutalButton type="submit" size="lg">
                BROADCAST TIMELINE UPDATES
              </BrutalButton>
            </div>
          )}
        </form>
      </BrutalCard>
    </div>
  );
}
