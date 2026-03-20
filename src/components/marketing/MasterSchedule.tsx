import React from 'react';
import { db } from '@/db';
import { events as eventsTable } from '@/db/schema';
import { isNotNull, desc } from 'drizzle-orm';

const DaySchedule = ({ date, slots }: { date: string; slots: { time: string; title: string; desc: string }[] }) => (
  <div className="bg-surface brutal-border p-8 hard-shadow flex flex-col h-full">
    <div className="flex justify-between items-center mb-10 pb-4 border-b-2 border-on-surface">
      <h3 className="text-3xl font-black uppercase tracking-tighter">{date}</h3>
    </div>
    <div className="space-y-8 flex-grow">
      {slots.map((slot, i) => (
        <div key={i} className="flex gap-6 items-start">
          <span className="font-display font-bold text-xl min-w-[80px]">{slot.time}</span>
          <div>
            <h4 className="font-display font-bold uppercase text-lg leading-tight">{slot.title}</h4>
            <p className="text-sm opacity-60 mt-1">{slot.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MasterSchedule = async () => {
  const dbEvents = await db.select().from(eventsTable)
    .where(isNotNull(eventsTable.schedule))
    .orderBy(desc(eventsTable.createdAt));

  // Dynamic Grouping
  const groupedEvents = dbEvents.reduce((acc, event) => {
    const rawSchedule = event.schedule || 'TBD, TBD';
    const splitIndex = rawSchedule.indexOf(',');
    let date = 'TBD';
    let time = 'TBD';
    
    if (splitIndex !== -1) {
      date = rawSchedule.substring(0, splitIndex).trim();
      time = rawSchedule.substring(splitIndex + 1).trim();
    } else {
      date = rawSchedule.trim() || 'TBD';
    }

    if (!acc[date]) acc[date] = [];
    acc[date].push({
      time,
      title: event.name,
      desc: event.tagline || 'Module details pending...',
    });
    return acc;
  }, {} as Record<string, { time: string; title: string; desc: string }[]>);

  const dates = Object.keys(groupedEvents).sort();

  return (
    <section id="schedule" className="py-24 bg-surface-container-low">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-5xl font-black uppercase italic mb-4">Master Schedule</h2>
          <div className="h-1 w-32 bg-primary-container"></div>
        </div>

        {dates.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-on-surface/20">
            <p className="text-xl font-display font-bold uppercase tracking-widest opacity-50">TIMELINE PENDING...</p>
            <p className="text-sm font-sans mt-2 opacity-40">No modules have been scheduled by Command Center yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {dates.map(date => (
              <DaySchedule key={date} date={date} slots={groupedEvents[date]} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MasterSchedule;
