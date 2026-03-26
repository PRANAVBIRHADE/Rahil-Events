import React from 'react';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { events, scheduleSlots } from '@/db/schema';
import ThreeDScheduleClient from './ThreeDScheduleClient';

export const dynamic = 'force-dynamic';

export default async function ThreeDSchedule() {
  const slotDefs = [
    { sortIndex: 1, time: '9:00 AM – 10:00 AM', day1: 'Registration + Inauguration', day2: 'Briefing + Late Registration' },
    { sortIndex: 2, time: '10:00 AM – 1:00 PM', day1: 'Round 1 of all events (Prelims)', day2: 'Finals of selected events' },
    { sortIndex: 3, time: '1:00 PM – 2:00 PM', day1: 'Lunch Break', day2: 'Lunch Break' },
    { sortIndex: 4, time: '2:00 PM – 5:30 PM', day1: 'Round 2 / Branch events / Common events', day2: 'Finals, Project Expo, Demos' },
    { sortIndex: 5, time: '5:30 PM – 6:00 PM', day1: 'Day 1 wrap-up', day2: 'Prize Distribution + Closing Ceremony' },
  ];

  const scheduleRows = await db
    .select({
      day: scheduleSlots.day,
      sortIndex: scheduleSlots.sortIndex,
      timeSlot: scheduleSlots.timeSlot,
      venue: scheduleSlots.venue,
      isBreak: scheduleSlots.isBreak,
      linkedEventName: events.name,
    })
    .from(scheduleSlots)
    .leftJoin(events, eq(scheduleSlots.linkedEventId, events.id));

  if (!scheduleRows || scheduleRows.length === 0) {
    // Backward-compatible fallback to old hardcoded schedule.
    return (
      <ThreeDScheduleClient
        scheduleData={slotDefs.map((s) => ({
          time: s.time,
          day1: s.day1,
          day2: s.day2,
          day1Venue: 'Main Arena',
          day2Venue: 'Main Arena',
          isBreak: s.sortIndex === 3,
        }))}
      />
    );
  }

  const byKey = new Map<string, (typeof scheduleRows)[number]>();
  for (const r of scheduleRows) {
    byKey.set(`${r.day}-${r.sortIndex}`, r);
  }

  const scheduleData = slotDefs.map((s) => {
    const day1Row = byKey.get(`1-${s.sortIndex}`);
    const day2Row = byKey.get(`2-${s.sortIndex}`);
    const isBreak = s.sortIndex === 3;

    const day1EventLabel = isBreak
      ? 'Lunch Break'
      : day1Row?.linkedEventName || s.day1;

    const day2EventLabel = isBreak
      ? 'Lunch Break'
      : day2Row?.linkedEventName || s.day2;

    return {
      time: s.time,
      day1: day1EventLabel,
      day2: day2EventLabel,
      day1Venue: day1Row?.venue ?? null,
      day2Venue: day2Row?.venue ?? null,
      isBreak,
    };
  });

  return <ThreeDScheduleClient scheduleData={scheduleData} />;
}
