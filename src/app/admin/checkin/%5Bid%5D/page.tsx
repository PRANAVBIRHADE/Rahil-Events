import React from 'react';
import { db } from '@/db';
import { registrations, users, events, teamMembers, teams } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { notFound, redirect } from 'next/navigation';
import BrutalCard from '@/components/ui/BrutalCard';
import Link from 'next/link';
import { markRegistrationCheckedIn, markMemberCheckedIn } from '@/lib/actions';

export default async function CheckinConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Try finding as Registration (Leader)
  const [regData] = await db.select({
    reg: registrations,
    user: users,
    event: events,
  })
  .from(registrations)
  .innerJoin(users, eq(registrations.userId, users.id))
  .innerJoin(events, eq(registrations.eventId, events.id))
  .where(eq(registrations.id, id))
  .limit(1);

  let participantInfo = null;

  if (regData) {
    participantInfo = {
      type: 'LEADER',
      id: regData.reg.id,
      name: regData.user.name,
      email: regData.user.email,
      eventName: regData.event.name,
      teamName: regData.reg.teamName,
      status: regData.reg.status,
      checkedIn: regData.reg.checkedIn,
      checkedInAt: regData.reg.checkedInAt,
    };
  } else {
    // Try finding as Team Member
    const [memberData] = await db.select({
      member: teamMembers,
      team: teams,
      event: events,
    })
    .from(teamMembers)
    .innerJoin(teams, eq(teamMembers.teamId, teams.id))
    .innerJoin(events, eq(teams.eventId, events.id))
    .where(eq(teamMembers.id, id))
    .limit(1);

    if (memberData) {
      participantInfo = {
        type: 'MEMBER',
        id: memberData.member.id,
        name: memberData.member.name,
        email: null,
        eventName: memberData.event.name,
        teamName: memberData.team.name,
        status: 'APPROVED', // Team members inherit approval from team/registration, but for now we assume they are valid if they have a ticket
        checkedIn: memberData.member.checkedIn,
        checkedInAt: memberData.member.checkedInAt,
      };
    }
  }

  if (!participantInfo) return notFound();

  const isApproved = participantInfo.status === 'APPROVED';

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-12 text-on-surface">
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-2 italic">Entry Authorization</h1>
          <p className="font-display font-bold uppercase text-primary tracking-widest text-sm">Target ID: {id.substring(0,18)}</p>
        </div>
        <Link href="/admin/scanner" className="border-b-2 border-on-surface font-black uppercase text-xs hover:text-primary hover:border-primary transition-colors">
          &larr; Return to Scanner
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-12">
            <BrutalCard shadow={true} className={participantInfo.checkedIn ? 'bg-green-50 border-green-600' : ''}>
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 p-4">
                  <div className="space-y-4 flex-1">
                     <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 text-[10px] font-black uppercase border-2 ${participantInfo.type === 'LEADER' ? 'bg-primary-container text-on-primary-container border-on-primary-container' : 'bg-surface-container-highest text-on-surface border-on-surface'}`}>
                           {participantInfo.type} PASS
                        </span>
                        {!isApproved && (
                           <span className="px-3 py-1 text-[10px] font-black uppercase border-2 bg-red-600 text-white border-black animate-pulse">
                              UNAUTHORIZED / PENDING
                           </span>
                        )}
                        {participantInfo.checkedIn && (
                            <span className="px-3 py-1 text-[10px] font-black uppercase border-2 bg-green-600 text-white border-black">
                                ALREADY IN TERMINAL
                            </span>
                        )}
                     </div>

                     <h2 className="text-6xl font-black uppercase tracking-tighter leading-none italic">{participantInfo.name}</h2>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                        <div>
                           <p className="text-[10px] font-black uppercase opacity-60 mb-1">Assigned Module</p>
                           <p className="text-2xl font-black uppercase text-primary tracking-tight">{participantInfo.eventName}</p>
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase opacity-60 mb-1">Deployment Squadron (Team)</p>
                           <p className="text-2xl font-black uppercase tracking-tight">{participantInfo.teamName || 'SOLO OP'}</p>
                        </div>
                     </div>
                  </div>

                  <div className="w-full md:w-80 space-y-4">
                     {participantInfo.checkedIn ? (
                        <div className="bg-green-100 p-8 border-4 border-green-600 hard-shadow-green text-green-900 text-center italic">
                           <span className="material-symbols-outlined text-6xl mb-4 block">verified</span>
                           <h3 className="text-2xl font-black uppercase mb-1">Access Granted</h3>
                           <p className="text-xs font-bold uppercase opacity-70">
                              Logged: {participantInfo.checkedInAt?.toLocaleString()}
                           </p>
                        </div>
                     ) : (
                        <form action={async (formData) => {
                          'use server';
                          const checkinId = formData.get('id') as string;
                          const type = formData.get('type') as string;
                          
                          if (type === 'LEADER') {
                            await markRegistrationCheckedIn(formData);
                          } else {
                            await markMemberCheckedIn(formData);
                          }
                          redirect(`/admin/checkin/${checkinId}`);
                        }} className="space-y-4">
                           <input type="hidden" name="id" value={participantInfo.id} />
                           <input type="hidden" name="type" value={participantInfo.type} />
                           
                           <button 
                            disabled={!isApproved}
                            className={`w-full py-8 font-black uppercase tracking-widest text-2xl border-4 transition-all flex items-center justify-center gap-3 ${
                              isApproved 
                                ? 'bg-primary text-on-primary border-on-surface hover:translate-x-2 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_black] active:translate-x-0 active:translate-y-0 active:shadow-none' 
                                : 'bg-surface-container-highest text-on-surface/30 border-on-surface opacity-50 cursor-not-allowed shadow-none'
                            }`}
                           >
                              {isApproved ? (
                                <>
                                  <span className="material-symbols-outlined text-4xl">stadium</span>
                                  GRANT ENTRY
                                </>
                              ) : (
                                'RESTRICTED ACCESS'
                              )}
                           </button>
                           {!isApproved && (
                             <p className="text-[10px] font-bold uppercase text-red-600 text-center italic">
                               Payment verification required before entry authorization.
                             </p>
                           )}
                        </form>
                     )}
                     
                     <div className="pt-4 border-t-2 border-on-surface/10">
                        <p className="text-[10px] font-bold uppercase opacity-40 mb-2">Technical Identification</p>
                        <p className="font-mono text-[9px] break-all opacity-50">{id}</p>
                     </div>
                  </div>
               </div>
            </BrutalCard>
        </div>
      </div>
    </div>
  );
}
