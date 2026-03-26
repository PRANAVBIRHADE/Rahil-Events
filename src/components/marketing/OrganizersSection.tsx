import React from 'react';
import { db } from '@/db';
import { organizers } from '@/db/schema';
import { desc } from 'drizzle-orm';
import BrutalCard from '@/components/ui/BrutalCard';

export const dynamic = 'force-dynamic';

export default async function OrganizersSection() {
  const all = await db.select().from(organizers).orderBy(desc(organizers.createdAt));

  if (all.length === 0) return null;

  return (
    <section className="py-24 bg-surface relative">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-5xl md:text-7xl font-black uppercase italic mb-4 tracking-tighter">
            Organizers <span className="text-primary-container">KRATOS 2026</span>
          </h2>
          <p className="font-display font-bold uppercase tracking-widest text-primary text-sm border-l-4 border-primary pl-4">
            Public contact directory
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {all.map((organizer) => (
            <BrutalCard key={organizer.id} className="p-8" shadowColor="gold">
              <div className="space-y-3">
                <div className="font-black uppercase text-2xl">{organizer.organizerName}</div>
                <div className="text-xs font-bold uppercase opacity-70">{organizer.role || 'TBA'}</div>
                <div className="font-mono text-sm opacity-80">{organizer.contact || 'TBA'}</div>
              </div>
            </BrutalCard>
          ))}
        </div>
      </div>
    </section>
  );
}
