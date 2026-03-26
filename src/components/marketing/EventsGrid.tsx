import React from 'react';
import { db } from '@/db';
import { events as eventsTable } from '@/db/schema';
import { desc } from 'drizzle-orm';
import EventsClientFilter from './EventsClientFilter';

const EventsGrid = async () => {
  const dbEvents = await db.select().from(eventsTable).orderBy(desc(eventsTable.createdAt));

  return (
    <section id="events" className="py-24 px-6 max-w-[1440px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div>
          <span className="text-sm font-display font-bold uppercase tracking-widest text-primary mb-2 block">Events 2026</span>
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">Our Events</h2>
        </div>
        <p className="max-w-md text-right font-sans italic">Explore our events, participate with your friends, and showcase your skills.</p>
      </div>

      {dbEvents.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed border-on-surface/20">
          <p className="text-xl font-display font-bold uppercase tracking-widest opacity-50">LOADING EVENTS...</p>
          <p className="text-sm font-sans mt-2 opacity-40">No events have been added yet. Check back soon!</p>
        </div>
      )}

      {dbEvents.length > 0 && <EventsClientFilter allEvents={dbEvents} />}
    </section>
  );
};

export default EventsGrid;
