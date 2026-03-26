import React from 'react';
import { db } from '@/db';
import { registrations, users, events } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import BrutalCard from '@/components/ui/BrutalCard';
import Link from 'next/link';
import { updateRegistrationStatus } from '@/lib/actions';
import { teamMembers } from '@/db/schema';

export default async function VerifyRegistrationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const [data] = await db.select({
    reg: registrations,
    user: users,
    event: events,
  })
  .from(registrations)
  .innerJoin(users, eq(registrations.userId, users.id))
  .innerJoin(events, eq(registrations.eventId, events.id))
  .where(eq(registrations.id, id));

  if (!data) return notFound();

  const { reg, user, event } = data;

  const teamMemberRows = reg.teamId
    ? await db.select().from(teamMembers).where(eq(teamMembers.teamId, reg.teamId))
    : [];

  const resolvedTotalFee = reg.totalFee ?? null;

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-12">
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-2 italic">Inspect Transmission</h1>
          <p className="font-display font-bold uppercase text-primary tracking-widest text-sm">Protocol ID: {reg.id}</p>
        </div>
        <Link href="/admin/registrations" className="border-b-2 border-on-surface font-black uppercase text-xs hover:text-primary hover:border-primary transition-colors">
          &larr; Return to Master Logs
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Metadata */}
        <div className="lg:col-span-5 space-y-8">
          <BrutalCard shadow={true}>
            <h2 className="text-2xl font-black uppercase italic mb-6 border-b-2 border-on-surface pb-2">Target Module</h2>
            <div className="space-y-4 font-mono text-sm">
              <div className="flex justify-between border-b border-on-surface/10 pb-2">
                <span className="opacity-60 uppercase font-sans font-bold">Event Name</span>
                <span className="font-bold">{event.name}</span>
              </div>
              <div className="flex justify-between border-b border-on-surface/10 pb-2">
                <span className="opacity-60 uppercase font-sans font-bold">Base Fee</span>
                <span className="font-black text-primary">₹ {event.fee}</span>
              </div>
              <div className="flex justify-between border-b border-on-surface/10 pb-2">
                <span className="opacity-60 uppercase font-sans font-bold">Category</span>
                <span className="font-bold">{event.branch}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="opacity-60 uppercase font-sans font-bold">Registered Format</span>
                <span className="bg-primary-container text-on-primary-container px-2 py-0.5 font-bold uppercase">{event.format}</span>
              </div>
            </div>
          </BrutalCard>

          <BrutalCard shadow={true}>
            <h2 className="text-2xl font-black uppercase italic mb-6 border-b-2 border-on-surface pb-2">Primary Commander</h2>
            <div className="space-y-4 font-mono text-sm">
              <div className="flex justify-between border-b border-on-surface/10 pb-2">
                <span className="opacity-60 uppercase font-sans font-bold">Name</span>
                <span className="font-bold truncate max-w-[200px]">{user.name}</span>
              </div>
              <div className="flex justify-between border-b border-on-surface/10 pb-2">
                <span className="opacity-60 uppercase font-sans font-bold">Email</span>
                <span className="font-bold truncate max-w-[200px] text-xs">{user.email}</span>
              </div>
              <div className="flex justify-between border-b border-on-surface/10 pb-2">
                <span className="opacity-60 uppercase font-sans font-bold">Phone</span>
                <span className="font-bold">{user.phone}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="opacity-60 uppercase font-sans font-bold">Institution</span>
                <span className="font-bold truncate max-w-[200px] text-xs">{user.college} ({user.branch})</span>
              </div>
            </div>
          </BrutalCard>

          {reg.teamName && (
            <BrutalCard shadow={true}>
               <h2 className="text-2xl font-black uppercase italic mb-6 border-b-2 border-on-surface pb-2">Squadron Details</h2>
               <div className="mb-4">
                 <p className="opacity-60 uppercase font-sans font-bold text-xs uppercase mb-1">Squadron / Team Name</p>
                 <p className="font-display font-black text-2xl uppercase tracking-tighter text-primary-container">{reg.teamName}</p>
               </div>

               {teamMemberRows.length > 0 && (
                 <div className="space-y-4 mt-6">
                   <p className="opacity-60 uppercase font-sans font-bold text-xs">Team Members:</p>
                   {teamMemberRows.map((member, i) => (
                     <div key={i} className="bg-surface-container-low p-3 brutal-border flex justify-between items-center text-sm font-mono gap-4">
                       <div className="min-w-0">
                         <p className="font-bold uppercase truncate">{member.name}</p>
                         <p className="text-[10px] opacity-60 uppercase truncate">{member.college || 'N/A'}{member.branch ? ` (${member.branch})` : ''}</p>
                       </div>
                       <div className="text-right">
                         <p className="opacity-60 text-xs uppercase">{member.phone}</p>
                         {member.year ? <p className="opacity-60 text-[10px] uppercase">Year {member.year}</p> : null}
                       </div>
                     </div>
                   ))}
                 </div>
               )}
            </BrutalCard>
          )}

          {/* Decision Terminal */}
          <div className="bg-on-surface text-surface p-8 hard-shadow-gold italic">
            <h3 className="font-display text-sm font-bold uppercase tracking-[0.3em] mb-6 text-primary-container">Transmission Decision</h3>
            <div className="mb-6 border-b border-surface/20 pb-4 flex justify-between items-center">
              <span className="font-sans text-sm uppercase font-bold opacity-60">Current State:</span>
              <span className={`px-3 py-1 font-black uppercase text-xs not-italic ${
                  reg.status === 'APPROVED' ? 'bg-green-500 text-black' :
                  reg.status === 'PENDING' ? 'bg-yellow-500 text-black' :
                  'bg-red-500 text-black'
              }`}>
                {reg.status}
              </span>
            </div>

            <div className="mb-6 border-b border-surface/20 pb-4 flex justify-between items-center">
              <span className="font-sans text-sm uppercase font-bold opacity-60">Total Fee:</span>
              <span className="font-black uppercase text-xl">₹ {resolvedTotalFee ?? event.fee}</span>
            </div>
            
            <form action={async (formData) => {
              'use server';
              await updateRegistrationStatus(formData);
            }} className="space-y-4">
              <input type="hidden" name="id" value={reg.id} />
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-80">Admin Notes</label>
                <textarea
                  name="paymentNotes"
                  defaultValue={reg.paymentNotes ?? ''}
                  className="w-full p-3 border-2 border-surface bg-surface-container-low text-black outline-none"
                  rows={3}
                  placeholder="Add verification notes..."
                />
              </div>
              <button type="submit" name="status" value="APPROVED" className="w-full bg-green-500 hover:bg-green-400 text-black font-black uppercase tracking-widest py-4 border-2 border-surface transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined mr-2">verified</span> APPROVE TRANSMISSION
              </button>
              <button type="submit" name="status" value="REJECTED" className="w-full bg-red-500 hover:bg-red-400 text-white font-black uppercase tracking-widest py-4 border-2 border-surface transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined mr-2">dangerous</span> REJECT TRANSMISSION
              </button>
              {reg.status !== 'PENDING' && (
                <button type="submit" name="status" value="PENDING" className="w-full bg-surface-container-low hover:bg-white text-surface font-black uppercase tracking-widest py-3 border-2 border-surface transition-colors">
                  RESET TO PENDING
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Right Column: Screenshot & Financials */}
        <div className="lg:col-span-7 space-y-8">
          <BrutalCard shadow={true}>
            <div className="flex justify-between items-end mb-6 border-b-2 border-on-surface pb-4">
              <div>
                <h2 className="text-2xl font-black uppercase italic mb-1">Payment Evidence</h2>
                <p className="font-display font-bold uppercase text-primary tracking-widest text-xs">Verify the transaction thoroughly.</p>
              </div>
              <div className="text-right">
                <p className="font-sans font-bold text-[10px] uppercase opacity-60">Submitted Transaction ID</p>
                <p className="font-mono font-black text-xl tracking-tighter uppercase">{reg.transactionId}</p>
              </div>
            </div>

            <div className="w-full bg-surface-container-low min-h-[60vh] border-2 border-on-surface flex items-center justify-center p-2 relative">
               {reg.paymentScreenshot ? (
                  <a href={reg.paymentScreenshot} target="_blank" rel="noopener noreferrer" className="w-full block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={reg.paymentScreenshot} 
                      alt="Payment Receipt" 
                      className="w-full h-auto object-contain brutal-border hover:opacity-80 transition-opacity cursor-zoom-in"
                      style={{ maxHeight: '70vh' }}
                    />
                  </a>
               ) : (
                  <div className="text-center opacity-30">
                    <span className="material-symbols-outlined text-6xl mb-4 block">image_not_supported</span>
                    <p className="font-display font-black uppercase tracking-widest">No Evidence Attached</p>
                  </div>
               )}
            </div>
            <p className="text-center font-bold font-sans opacity-40 uppercase text-[10px] mt-4">Click image to inspect securely in full resolution.</p>
          </BrutalCard>
        </div>
        
      </div>
    </div>
  );
}
