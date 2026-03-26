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

  if (activeAnnouncements.length === 0) return null;

  const message = activeAnnouncements[0].content;

  return (
    <div className="bg-on-surface text-primary-container py-2 overflow-hidden border-b-2 border-primary-container relative z-40">
      <div className="flex whitespace-nowrap animate-marquee px-6">
        <span className="text-sm font-display font-black uppercase tracking-widest inline-block mr-12">
          {message} | SYSTEM BROADCAST | {message} | KRATOS 2026 | {message}
        </span>
        <span className="text-sm font-display font-black uppercase tracking-widest inline-block mr-12">
          {message} | SYSTEM BROADCAST | {message} | KRATOS 2026 | {message}
        </span>
      </div>
    </div>
  );
};

export default AnnouncementBar;
