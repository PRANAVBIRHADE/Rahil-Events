import React from 'react';
import Link from 'next/link';
import { db } from '@/db';
import { events as eventsTable } from '@/db/schema';
import { desc } from 'drizzle-orm';

const ICON_MAP: Record<string, string> = {
  'Civil Engineering': 'architecture',
  'Computer Science Engineering': 'terminal',
  'Electrical Engineering': 'electric_bolt',
  'Mechanical & Automation': 'precision_manufacturing',
  'Electronics & Telecom': 'cell_tower',
  'AI & Data Science': 'memory',
  'CSE (AIML)': 'smart_toy',
  'Other': 'settings_input_component',
};

const getFormatLabel = (format: string | null) => {
  switch(format) {
    case 'TEAM': return 'TEAM FORMAT';
    case 'SOLO_TEAM': return 'SOLO/TEAM FORMAT';
    case 'SOLO_TEAM_ASSIGNED': return 'SOLO (TEAM ASSIGNED)';
    case 'SOLO':
    default: return 'SOLO FORMAT';
  }
};

const EventsGrid = async () => {
  const dbEvents = await db.select().from(eventsTable).orderBy(desc(eventsTable.createdAt));
  
  const commonEvents = dbEvents.filter(e => e.isCommon);
  const branchEvents = dbEvents.filter(e => !e.isCommon);

  // Dynamic Grouping by Branch
  const groupedEvents = branchEvents.reduce((acc, event) => {
    const branch = event.branch || 'Other';
    if (!acc[branch]) acc[branch] = [];
    acc[branch].push(event);
    return acc;
  }, {} as Record<string, typeof dbEvents>);

  return (
    <section id="events" className="py-24 px-6 max-w-[1440px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div>
          <span className="text-sm font-display font-bold uppercase tracking-widest text-primary mb-2 block">Catalog 2026</span>
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">Event Modules</h2>
        </div>
        <p className="max-w-md text-right font-sans italic">Selection of dynamic modules synchronized from the Command Center. Precision is mandatory.</p>
      </div>

      {dbEvents.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed border-on-surface/20">
          <p className="text-xl font-display font-bold uppercase tracking-widest opacity-50">INITIALIZING CATALOG...</p>
          <p className="text-sm font-sans mt-2 opacity-40">No modules have been broadcasted by Command Center yet.</p>
        </div>
      )}

      {commonEvents.length > 0 && (
        <div className="mb-16">
          <h3 className="text-3xl font-black uppercase mb-8 pb-4 border-full border-b-2 border-on-surface inline-block pr-12">Universal Modules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 brutal-border overflow-hidden">
            {commonEvents.map((event, i) => (
              <div key={event.id} className="p-8 border-b-2 border-r-2 last:border-b-0 md:last:border-b-2 lg:[&:nth-child(3n)]:border-r-0 border-on-surface flex flex-col justify-between hover:bg-primary-container transition-colors group">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="material-symbols-outlined text-4xl">
                      public
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest border-2 border-on-surface px-2 py-1">
                      {getFormatLabel(event.format)}
                    </span>
                  </div>
                  <h3 className="text-3xl font-black uppercase mb-4 leading-none">{event.name}</h3>
                  <p className="mb-8 opacity-70 font-sans group-hover:text-on-primary-container">
                    {event.description || event.tagline || 'Module details pending initialization...'}
                  </p>
                </div>
                <Link 
                  href={`/events/${event.slug}/register`} 
                  className="font-display font-bold uppercase border-b-2 border-on-surface w-fit hover:border-primary transition-colors block mt-8"
                >
                  Register module [₹{event.fee}]
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {Object.entries(groupedEvents).map(([branch, events]) => (
        <div key={branch} className="mb-16 last:mb-0">
          <h3 className="text-3xl font-black uppercase mb-8 pb-4 border-full border-b-2 border-on-surface inline-block pr-12">{branch}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 brutal-border overflow-hidden">
            {events.map((event, i) => (
              <div key={event.id} className="p-8 border-b-2 border-r-2 last:border-b-0 md:last:border-b-2 lg:[&:nth-child(3n)]:border-r-0 border-on-surface flex flex-col justify-between hover:bg-primary-container transition-colors group">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="material-symbols-outlined text-4xl">
                      {ICON_MAP[branch] || 'settings_input_component'}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest border-2 border-on-surface px-2 py-1">
                      {getFormatLabel(event.format)}
                    </span>
                  </div>
                  <h3 className="text-3xl font-black uppercase mb-4 leading-none">{event.name}</h3>
                  <p className="mb-8 opacity-70 font-sans group-hover:text-on-primary-container">
                    {event.description || event.tagline || 'Module details pending initialization...'}
                  </p>
                </div>
                <Link 
                  href={`/events/${event.slug}/register`} 
                  className="font-display font-bold uppercase border-b-2 border-on-surface w-fit hover:border-primary transition-colors block mt-8"
                >
                  Register module [₹{event.fee}]
                </Link>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default EventsGrid;
