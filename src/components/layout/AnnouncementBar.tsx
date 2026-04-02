import React from 'react';
import { db } from '@/db';
import { announcements } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

const AnnouncementBar = async () => {
  const activeAnnouncements = await db.select()
    .from(announcements)
    .where(eq(announcements.isActive, true))
    .orderBy(desc(announcements.updatedAt))
    .limit(1);

  const message = activeAnnouncements.length > 0
    ? activeAnnouncements[0].content
    : '🚀 REGISTRATIONS OPEN — KRATOS 2026 ON 20-21 APRIL | REGISTER BEFORE 18 APRIL | MATOSHRI PRATISHTHAN GROUP OF INSTITUTIONS';

  return (
    <div className="bg-on-surface text-primary-container py-1 overflow-hidden border-b-2 border-primary-container relative z-40">
      <div className="flex whitespace-nowrap animate-marquee px-6">
        <span className="text-sm font-display font-black uppercase tracking-widest inline-block mr-12">
          {message} &bull; {message} &bull; {message}
        </span>
        <span className="text-sm font-display font-black uppercase tracking-widest inline-block mr-12">
          {message} &bull; {message} &bull; {message}
        </span>
      </div>
    </div>
  );
};

export default AnnouncementBar;
