import React from 'react';
import { db } from '@/db';
import { events } from '@/db/schema';
import { desc } from 'drizzle-orm';
import BrutalCard from '@/components/ui/BrutalCard';
import BrutalButton from '@/components/ui/BrutalButton';
import { updateEvent, deleteEvent } from '@/lib/actions';
import Link from 'next/link';

export default async function EventManagementPage() {
  const allEvents = await db.select().from(events).orderBy(desc(events.createdAt));

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-12">
      <div className="mb-12 flex justify-between items-end">
        <div>
          <span className="inline-block bg-primary-container px-3 py-1 brutal-border mb-4 font-display font-bold text-xs uppercase tracking-widest">
            Event Registry
          </span>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-2 italic">Event Management</h1>
          <Link href="/admin/dashboard" className="font-display font-bold uppercase text-primary tracking-widest text-sm hover:underline">
            &larr; Return to Dashboard
          </Link>
        </div>
      </div>

      <BrutalCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans">
            <thead className="bg-surface-container-low border-b-2 border-on-surface text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="p-4">Event Details</th>
                <th className="p-4">Structural Parameters</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-on-surface/10">
              {allEvents.map((event) => (
                <tr key={event.id} className="hover:bg-primary-container/5 transition-colors">
                  <td className="p-4 w-1/3">
                    <p className="font-black uppercase text-lg">{event.name}</p>
                    <p className="text-xs font-mono opacity-60">ID: {event.id}</p>
                    <div className="mt-2 flex gap-2">
                       <span className="text-[10px] uppercase font-bold bg-primary/20 px-2 rounded-sm">{event.category || 'EVENT'}</span>
                    </div>
                  </td>
                  <td className="p-4 w-1/3">
                    <form action={async (formData) => {
                      'use server';
                      await updateEvent(formData);
                    }} id={`update-event-${event.id}`} className="space-y-4">
                       <input type="hidden" name="id" value={event.id} />
                       
                       <div className="flex items-center gap-4">
                         <label className="text-xs font-bold uppercase tracking-widest w-24 opacity-60">FEE (₹)</label>
                         <input 
                           name="fee" 
                           type="number"
                           defaultValue={event.fee} 
                           className="bg-transparent font-mono text-sm w-24 outline-none focus:border-b-2 border-primary"
                         />
                       </div>

                   <div className="flex items-center gap-4">
                     <label className="text-xs font-bold uppercase tracking-widest w-24 opacity-60">MIN TEAM</label>
                     <input
                       name="teamSizeMin"
                       type="number"
                       min="1"
                       max="4"
                       defaultValue={event.teamSizeMin || 1}
                       className="bg-transparent font-mono text-sm w-24 outline-none focus:border-b-2 border-primary"
                     />
                   </div>

                       <div className="flex items-center gap-4">
                         <label className="text-xs font-bold uppercase tracking-widest w-24 opacity-60">MAX TEAM</label>
                         <input 
                           name="teamSize" 
                           type="number"
                           min="1"
                           max="4"
                           defaultValue={event.teamSize || 1} 
                           className="bg-transparent font-mono text-sm w-24 outline-none focus:border-b-2 border-primary"
                         />
                       </div>
                    </form>
                  </td>
                  <td className="p-4 flex gap-4 items-center h-full pt-8">
                    <div className="flex gap-2">
                         <BrutalButton form={`update-event-${event.id}`} type="submit" variant="secondary" size="sm" className="bg-blue-100 text-blue-800 border-blue-800">
                           Overwrite Data
                         </BrutalButton>
                         <form action={deleteEvent}>
                           <input type="hidden" name="id" value={event.id} />
                           <BrutalButton type="submit" variant="secondary" size="sm" className="bg-red-100 text-red-800 border-red-800">
                             Delete Event
                           </BrutalButton>
                         </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </BrutalCard>
    </div>
  );
}
