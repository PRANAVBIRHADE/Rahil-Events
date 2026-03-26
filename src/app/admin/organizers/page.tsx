import React from 'react';
import Link from 'next/link';
import { db } from '@/db';
import { organizers } from '@/db/schema';
import { desc } from 'drizzle-orm';
import BrutalCard from '@/components/ui/BrutalCard';
import BrutalButton from '@/components/ui/BrutalButton';
import { createOrganizer, deleteOrganizer } from '@/lib/actions';

export const dynamic = 'force-dynamic';

export default async function AdminOrganizersPage() {
  const allOrganizers = await db.select().from(organizers).orderBy(desc(organizers.createdAt));

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-12">
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-2 italic">Organizer Management</h1>
          <p className="font-display font-bold uppercase text-primary tracking-widest text-sm">Create &amp; publish organizer details</p>
        </div>
        <Link href="/admin/dashboard" className="border-b-2 border-on-surface font-black uppercase text-xs hover:text-primary hover:border-primary transition-colors">
          &larr; Return to Command Center
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <BrutalCard shadowColor="gold" className="p-8">
            <h2 className="text-2xl font-black uppercase italic mb-6 border-b-2 border-on-surface pb-4">Add Organizer</h2>
            <form action={createOrganizer} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest opacity-60">Organizer name</label>
                <input
                  name="organizerName"
                  className="w-full p-3 brutal-border bg-surface text-sm font-mono font-bold uppercase outline-none focus:border-primary"
                  placeholder="e.g. Matoshri Core Team"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest opacity-60">Role</label>
                <input
                  name="role"
                  className="w-full p-3 brutal-border bg-surface text-sm font-mono font-bold uppercase outline-none focus:border-primary"
                  placeholder="e.g. Coordinator / Lead"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest opacity-60">Contact</label>
                <input
                  name="contact"
                  className="w-full p-3 brutal-border bg-surface text-sm font-mono font-bold uppercase outline-none focus:border-primary"
                  placeholder="Email / Phone"
                />
              </div>
              <BrutalButton type="submit" size="lg" className="w-full">
                ADD ORGANIZER
              </BrutalButton>
            </form>
          </BrutalCard>
        </div>

        <div className="lg:col-span-7">
          <BrutalCard shadowColor="black" className="p-0 overflow-hidden">
            <div className="p-6 border-b-2 border-on-surface bg-surface-container-low flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase italic">Published Organizers</h2>
              <div className="text-xs font-black uppercase opacity-60">{allOrganizers.length} total</div>
            </div>

            <div className="overflow-x-auto max-h-[70vh]">
              <table className="w-full text-left font-sans">
                <thead className="bg-surface-container-low border-b-2 border-on-surface text-[10px] font-black uppercase tracking-widest sticky top-0 z-10">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-on-surface/10">
                  {allOrganizers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-16 text-center opacity-40">
                        NO ORGANIZERS CREATED
                      </td>
                    </tr>
                  ) : (
                    allOrganizers.map((organizer) => (
                      <tr key={organizer.id} className="hover:bg-primary-container/10 transition-colors">
                        <td className="p-4 font-bold uppercase">{organizer.organizerName}</td>
                        <td className="p-4 text-xs opacity-70 uppercase">{organizer.role || 'TBA'}</td>
                        <td className="p-4 font-mono text-xs opacity-70">{organizer.contact || 'TBA'}</td>
                        <td className="p-4 text-center">
                          <form action={deleteOrganizer}>
                            <input type="hidden" name="id" value={organizer.id} />
                            <BrutalButton type="submit" size="sm" variant="secondary" className="bg-red-100 border-red-800 text-red-800">
                              DELETE
                            </BrutalButton>
                          </form>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </BrutalCard>
        </div>
      </div>
    </div>
  );
}
