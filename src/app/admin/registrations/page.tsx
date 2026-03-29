import React from 'react';
import { db } from '@/db';
import { registrations, users, events, teamMembers } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import BrutalCard from '@/components/ui/BrutalCard';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminRegistrationsPage() {
  const allRegistrations = await db.select({
    id: registrations.id,
    participantName: users.name,
    participantEmail: users.email,
    moduleName: events.name,
    amount: registrations.totalFee,
    status: registrations.status,
    createdAt: registrations.createdAt,
    transactionId: registrations.transactionId,
    teamName: registrations.teamName,
    teamId: registrations.teamId,
  })
  .from(registrations)
  .innerJoin(users, eq(registrations.userId, users.id))
  .innerJoin(events, eq(registrations.eventId, events.id))
  .orderBy(desc(registrations.createdAt));

  const memberData = await db.select({
    id: teamMembers.id,
    teamId: teamMembers.teamId,
    name: teamMembers.name,
  })
  .from(teamMembers);

  const countsMap: Record<string, number> = {};
  const namesMap: Record<string, string[]> = {};

  memberData.forEach(m => {
    const tid = m.teamId as string;
    countsMap[tid] = (countsMap[tid] || 0) + 1;
    if (!namesMap[tid]) namesMap[tid] = [];
    namesMap[tid].push(m.name);
  });

  // Grouping by event
  const eventsGrouped = allRegistrations.reduce((acc, reg) => {
    if (!acc[reg.moduleName]) acc[reg.moduleName] = [];
    acc[reg.moduleName].push(reg);
    return acc;
  }, {} as Record<string, typeof allRegistrations>);

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-12 text-on-surface">
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-2 italic">Traffic Registry</h1>
          <p className="font-display font-bold uppercase text-primary tracking-widest text-sm">Master Transmission Oversight</p>
        </div>
        <Link href="/admin/dashboard" className="border-b-2 border-on-surface font-black uppercase text-xs hover:text-primary hover:border-primary transition-colors">
          &larr; Return to Command Center
        </Link>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="brutal-border p-6 bg-primary-container text-on-primary-container hard-shadow-gold">
            <p className="text-[10px] font-black uppercase mb-1">Total Packets</p>
            <p className="text-4xl font-black">{allRegistrations.length}</p>
          </div>
          <div className="brutal-border p-6 bg-surface-container text-on-surface hard-shadow-gold">
            <p className="text-[10px] font-black uppercase mb-1">Active Modules</p>
            <p className="text-4xl font-black">{Object.keys(eventsGrouped).length}</p>
          </div>
      </div>

      <div className="space-y-16">
        {Object.entries(eventsGrouped).map(([moduleName, regs]) => (
          <section key={moduleName} className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-3xl font-black uppercase italic bg-on-surface text-surface px-4 py-1">{moduleName}</h2>
              <div className="h-[2px] flex-1 bg-on-surface/20"></div>
              <span className="font-mono text-sm font-bold opacity-60">{regs.length} Deployments</span>
            </div>

            <BrutalCard className="p-0 overflow-hidden shadow-none" shadowColor="black">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans">
                  <thead className="bg-surface-container-low border-b-2 border-on-surface text-[10px] font-black uppercase tracking-widest">
                    <tr>
                      <th className="p-4">Timestamp</th>
                      <th className="p-4">Team / Members</th>
                      <th className="p-4 text-center">Size</th>
                      <th className="p-4">Transaction ID</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-on-surface/10">
                    {regs.map((reg) => (
                      <tr key={reg.id} className="hover:bg-primary-container/10 transition-colors">
                        <td className="p-4 text-xs font-bold opacity-60 uppercase whitespace-nowrap">
                          {reg.createdAt?.toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }) || ''}
                        </td>
                        <td className="p-4">
                          {reg.teamId && namesMap[reg.teamId] ? (
                            <>
                              <div className="font-black uppercase text-sm truncate max-w-[300px] text-primary">{reg.teamName || 'Squadron'}</div>
                              <div className="text-[10px] font-bold opacity-60 uppercase mt-1">
                                {namesMap[reg.teamId].join(' • ')}
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="font-bold uppercase text-sm truncate max-w-[300px]">{reg.participantName}</div>
                              <div className="text-[10px] opacity-60 truncate max-w-[300px]">{reg.participantEmail}</div>
                            </>
                          )}
                        </td>
                        <td className="p-4 text-center">
                            <span className="font-mono font-bold bg-surface-container px-2 py-0.5 brutal-border-sm text-xs">
                              {countsMap[reg.teamId as string] || 1}
                            </span>
                        </td>
                        <td className="p-4 font-mono text-xs opacity-70 truncate max-w-[150px]">{reg.transactionId}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 border-2 text-[10px] font-black uppercase ${
                            reg.status === 'APPROVED' ? 'bg-green-100 text-green-800 border-green-800' :
                            reg.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 border-yellow-800' :
                            'bg-red-100 text-red-800 border-red-800'
                          }`}>
                            {reg.status}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <Link href={`/admin/verify/${reg.id}`} className="text-[10px] font-black uppercase border-b-2 border-on-surface hover:text-primary hover:border-primary transition-all p-1">
                            Inspect Trace
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </BrutalCard>
          </section>
        ))}

        {allRegistrations.length === 0 && (
          <div className="text-center py-32 brutal-border bg-surface-container-low italic">
              <p className="text-3xl font-display font-black uppercase tracking-widest opacity-20 italic">Empty Terminal: No Data</p>
          </div>
        )}
      </div>
    </div>
  );
}
