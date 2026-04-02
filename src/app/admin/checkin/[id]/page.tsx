import React from 'react';
import Link from 'next/link';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { events, registrations, teamMembers, users, teams } from '@/db/schema';
import BrutalCard from '@/components/ui/BrutalCard';
import BrutalButton from '@/components/ui/BrutalButton';
import { markRegistrationCheckedIn, markMemberCheckedIn } from '@/lib/actions';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function CheckInDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // 1. Try to fetch as a main registration (Leader)
  const [regData] = await db
    .select({
      reg: registrations,
      user: users,
      event: events,
      team: teams
    })
    .from(registrations)
    .innerJoin(users, eq(registrations.userId, users.id))
    .innerJoin(events, eq(registrations.eventId, events.id))
    .leftJoin(teams, eq(registrations.teamId, teams.id))
    .where(eq(registrations.id, id));

  let participant: {
    id: string;
    name: string;
    type: 'LEADER' | 'MEMBER';
    checkedIn: boolean;
    checkedInAt: Date | null;
    status: string | null;
    event: typeof events.$inferSelect;
    teamName: string;
    teamId: string | null;
  } | null = regData ? {
    id: regData.reg.id,
    name: regData.user.name,
    type: 'LEADER',
    checkedIn: regData.reg.checkedIn,
    checkedInAt: regData.reg.checkedInAt,
    status: regData.reg.status,
    event: regData.event,
    teamName: regData.reg.teamName || regData.user.name,
    teamId: regData.reg.teamId
  } : null;

  // 2. If not found, try to fetch as a Team Member
  if (!participant) {
    const [memberData] = await db
      .select({
        member: teamMembers,
        team: teams,
        reg: registrations,
        event: events
      })
      .from(teamMembers)
      .innerJoin(teams, eq(teamMembers.teamId, teams.id))
      .innerJoin(registrations, eq(teams.id, registrations.teamId))
      .innerJoin(events, eq(registrations.eventId, events.id))
      .where(eq(teamMembers.id, id));

    if (memberData) {
      participant = {
        id: memberData.member.id,
        name: memberData.member.name,
        type: 'MEMBER',
        checkedIn: memberData.member.checkedIn,
        checkedInAt: memberData.member.checkedInAt,
        status: memberData.reg.status,
        event: memberData.event,
        teamName: memberData.reg.teamName || memberData.member.name,
        teamId: memberData.member.teamId
      };
    }
  }

  if (!participant) return notFound();

  const teamMemberRows = participant.teamId
    ? await db.select().from(teamMembers).where(eq(teamMembers.teamId, participant.teamId))
    : [];

  const isApproved = participant.status === 'APPROVED';

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-12">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-2 italic">Validation Terminal</h1>
          <div className="flex items-center gap-3">
             <span className={`px-2 py-0.5 border-2 text-[10px] font-black uppercase ${participant.type === 'LEADER' ? 'bg-primary-container text-on-primary-container border-on-primary-container' : 'bg-surface-container-highest text-on-surface border-on-surface'}`}>
                {participant.type === 'LEADER' ? 'Squad Leader' : 'Team Member'}
             </span>
             <p className="font-display font-bold uppercase text-primary tracking-widest text-xs">
               Key: {participant.id.substring(0, 18)}
             </p>
          </div>
        </div>
        <Link href="/admin/scanner" className="border-b-2 border-on-surface font-black uppercase text-xs hover:text-primary hover:border-primary transition-colors">
          &larr; Return to Admin Panel
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5 space-y-8">
          <BrutalCard shadow={true}>
            <h2 className="text-2xl font-black uppercase italic mb-6 border-b-2 border-on-surface pb-2">Event Registration Data</h2>
            <div className="space-y-4 font-mono text-sm">
              <div className="flex justify-between border-b border-on-surface/10 pb-2">
                <span className="opacity-60 uppercase font-sans font-bold">Event</span>
                <span className="font-bold">{participant.event.name}</span>
              </div>
              <div className="flex justify-between border-b border-on-surface/10 pb-2">
                <span className="opacity-60 uppercase font-sans font-bold">Finance Status</span>
                <span className={`font-bold ${isApproved ? 'text-green-600' : 'text-red-600'}`}>
                  {participant.status || 'UNKNWN'}
                </span>
              </div>
              <div className="flex justify-between border-b border-on-surface/10 pb-2">
                <span className="opacity-60 uppercase font-sans font-bold">Terminal Entry</span>
                <span className={`font-bold ${participant.checkedIn ? 'text-blue-600' : 'opacity-40'}`}>
                  {participant.checkedIn ? 'AUTHORIZED' : 'WAITING'}
                </span>
              </div>
              {participant.checkedInAt ? (
                <div className="flex justify-between pt-2">
                  <span className="opacity-60 uppercase font-sans font-bold">Entry Logged</span>
                  <span className="font-bold text-[10px]">{new Date(participant.checkedInAt).toLocaleString()}</span>
                </div>
              ) : null}
            </div>
          </BrutalCard>

          <BrutalCard shadow={true} shadowColor="black">
            <h2 className="text-2xl font-black uppercase italic mb-6 border-b-2 border-on-surface pb-2">Squadron Activity</h2>
            <div className="space-y-3">
              <div className="font-display font-black text-2xl uppercase tracking-tighter text-primary truncate mb-4">
                {participant.teamName}
              </div>
              {teamMemberRows.length > 0 ? (
                <div className="space-y-3">
                  {teamMemberRows.map((m, i) => (
                    <div key={i} className={`p-3 brutal-border flex justify-between items-center text-sm font-mono gap-4 ${m.id === participant.id ? 'bg-primary-container/20 border-primary' : 'bg-surface-container-low'}`}>
                      <div className="min-w-0">
                        <p className="font-bold uppercase truncate">{m.name}</p>
                        <p className="text-[10px] opacity-60 uppercase truncate">
                          {m.college || 'N/A'}
                        </p>
                      </div>
                      <div className="text-right flex items-center gap-2">
                         {m.checkedIn ? (
                            <span className="material-symbols-outlined text-green-600 text-sm">check_circle</span>
                         ) : (
                            <span className="material-symbols-outlined opacity-20 text-sm">radio_button_unchecked</span>
                         )}
                         <p className="opacity-60 text-[10px] uppercase font-bold">{m.checkedIn ? 'IN' : 'WAITING'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="opacity-60 text-xs uppercase">No team data detected.</p>
              )}
            </div>
          </BrutalCard>
        </div>

        <div className="lg:col-span-7">
          <div className="bg-on-surface text-surface p-12 hard-shadow-gold relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <span className="material-symbols-outlined text-[120px]">verified_user</span>
            </div>
            
            <h3 className="font-display text-sm font-bold uppercase tracking-[0.4em] mb-12 text-primary">Biometric Authorization</h3>

            <div className="mb-12">
               <p className="text-[10px] font-black uppercase opacity-60 mb-2 tracking-widest">Identified Personnel</p>
               <h2 className="text-6xl font-black uppercase italic tracking-tighter leading-none mb-2">{participant.name}</h2>
               <p className="text-sm font-bold uppercase opacity-80">{participant.type === 'LEADER' ? 'OPERATIVE: SQUAD LEADER' : 'OPERATIVE: TEAM MEMBER'}</p>
            </div>

            {participant.checkedIn ? (
              <div className="border-4 border-primary p-6 mb-8 bg-primary/10">
                <div className="flex items-center gap-3 mb-2">
                   <span className="material-symbols-outlined text-primary text-4xl">task_alt</span>
                   <h4 className="text-2xl font-black uppercase">Identity Verified</h4>
                </div>
                <p className="text-sm font-bold uppercase opacity-80">Access granted to {participant.event.name}. Terminal handshake complete.</p>
                <p className="text-[10px] font-mono mt-4 opacity-50">LOG_TS: {new Date(participant.checkedInAt!).toLocaleString()}</p>
              </div>
            ) : (
              <div className="mb-8">
                 {!isApproved ? (
                   <div className="border-4 border-red-600 p-6 bg-red-600/10 mb-8">
                     <div className="flex items-center gap-3 mb-2 text-red-600">
                        <span className="material-symbols-outlined text-4xl">warning</span>
                        <h4 className="text-2xl font-black uppercase tracking-tighter">Finance Lock Active</h4>
                     </div>
                     <p className="text-sm font-bold uppercase opacity-80">This operative&apos;s packet has not been verified. Entry is strictly prohibited until payment is approved.</p>
                   </div>
                 ) : (
                   <div className="border-4 border-yellow-500 p-6 bg-yellow-500/10 mb-8">
                     <div className="flex items-center gap-3 mb-2 text-yellow-500">
                        <span className="material-symbols-outlined text-4xl">hourglass_empty</span>
                        <h4 className="text-2xl font-black uppercase tracking-tighter">Authorization Pending</h4>
                     </div>
                     <p className="text-sm font-bold uppercase opacity-80">Personnel identified. Finance verified. Ready for terminal check-in.</p>
                   </div>
                 )}
              </div>
            )}

            <form action={async (formData) => {
              "use server";
              if (participant.type === 'LEADER') {
                await markRegistrationCheckedIn(formData);
              } else {
                await markMemberCheckedIn(formData);
              }
            }} className="space-y-4">
              <input type="hidden" name="id" value={participant.id} />
              <BrutalButton
                type="submit"
                size="lg"
                variant="outline"
                disabled={participant.checkedIn || !isApproved}
                className={`w-full h-20 text-2xl font-black uppercase tracking-widest shadow-[8px_8px_0px_0px_var(--gold)] ${participant.checkedIn ? 'opacity-20' : 'hover:bg-primary hover:text-on-primary'}`}
              >
                Grant Entry Access
              </BrutalButton>
              <p className="text-[10px] font-bold uppercase opacity-40 text-center tracking-widest mt-4">
                Encryption Mode: High Altitude
              </p>
            </form>
          </div>
          
          <div className="mt-8 flex justify-center">
             <Link href="/admin/scanner" className="text-xs font-black uppercase border-b-2 border-on-surface hover:text-primary hover:border-primary">
                Return to Scanner Control
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
