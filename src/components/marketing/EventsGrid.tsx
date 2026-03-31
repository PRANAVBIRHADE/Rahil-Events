import React from 'react';
import { db } from '@/db';
import { events as eventsTable } from '@/db/schema';
import { desc } from 'drizzle-orm';
import EventsClientFilter from './EventsClientFilter';

const EventsGrid = async () => {
  const dbEvents = await db.select().from(eventsTable).orderBy(desc(eventsTable.createdAt));

  return (
    <section id="events" className="py-12 md:py-24 px-4 md:px-6 max-w-[1440px] mx-auto overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4 md:gap-6">
        <div>
          <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-2">Our Events</h2>
        </div>
        <p className="max-w-[300px] md:text-right font-sans italic opacity-70 text-sm leading-tight">
          Choose your event, register quickly, and plan your day with confidence.
        </p>
      </div>

      {/* YELLOW INFO BOX */}
      <div className="w-full brutal-border bg-[#FEFCE8] border-[#D4AF37] p-5 mb-16 shadow-[4px_4px_0px_0px_rgba(212,175,55,0.2)]">
        <p className="text-sm font-black uppercase text-on-surface tracking-tight">
          All events are open to students from all branches.
        </p>
      </div>

      {dbEvents.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-on-surface/20">
          <p className="text-xl font-display font-bold uppercase tracking-widest opacity-50">LOADING EVENTS...</p>
          <p className="text-sm font-sans mt-2 opacity-40">No events have been added yet. Check back soon!</p>
        </div>
      ) : (
        <EventsClientFilter allEvents={dbEvents} />
      )}
    </section>
  );
};

export default EventsGrid;
