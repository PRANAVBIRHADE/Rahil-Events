import React from 'react';
import { db } from '@/db';
import { registrations, users, events } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import BrutalCard from '@/components/ui/BrutalCard';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
  })
  .from(registrations)
  .innerJoin(users, eq(registrations.userId, users.id))
  .innerJoin(events, eq(registrations.eventId, events.id))
  .orderBy(desc(registrations.createdAt));

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-12">
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-2 italic">Traffic Registry</h1>
          <p className="font-display font-bold uppercase text-primary tracking-widest text-sm">Master Transmission Oversight</p>
        </div>
        <Link href="/admin/dashboard" className="border-b-2 border-on-surface font-black uppercase text-xs hover:text-primary hover:border-primary transition-colors">
          &larr; Return to Command Center
        </Link>
      </div>

      <BrutalCard className="p-0 overflow-hidden shadow-none" shadowColor="black">
        <div className="p-6 border-b-2 border-on-surface bg-surface-container-low flex justify-between items-center">
          <h2 className="text-2xl font-black uppercase italic">Complete Logs: {allRegistrations.length} Records</h2>
        </div>
        <div className="overflow-x-auto max-h-[70vh]">
          <table className="w-full text-left font-sans">
            <thead className="bg-surface-container-low border-b-2 border-on-surface text-[10px] font-black uppercase tracking-widest sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Protocol ID</th>
                <th className="p-4">Participant</th>
                <th className="p-4">Target Module</th>
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-on-surface/10">
              {allRegistrations.map((reg) => (
                <tr key={reg.id} className="hover:bg-primary-container/10 transition-colors">
                  <td className="p-4 text-xs font-bold opacity-60 uppercase whitespace-nowrap">
                    {reg.createdAt?.toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }) || ''}
                  </td>
                  <td className="p-4 font-mono text-xs opacity-50 truncate max-w-[100px]">{reg.id}</td>
                  <td className="p-4">
                    <div className="font-bold uppercase text-sm truncate max-w-[180px]">{reg.participantName}</div>
                    <div className="text-[10px] opacity-60 truncate max-w-[180px]">{reg.participantEmail}</div>
                  </td>
                  <td className="p-4 font-black text-xs uppercase text-primary truncate max-w-[160px]">{reg.moduleName}</td>
                  <td className="p-4 font-mono text-xs opacity-70 truncate max-w-[120px]">{reg.transactionId}</td>
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
                    <Link href={`/admin/verify/${reg.id}`} className="text-[10px] font-black uppercase border-b-2 border-on-surface hover:text-primary hover:border-primary">
                      Inspect
                    </Link>
                  </td>
                </tr>
              ))}
              {allRegistrations.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-16 text-center">
                     <p className="text-xl font-display font-black uppercase tracking-widest opacity-30">NO REGISTRY DATA DETECTED</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </BrutalCard>
    </div>
  );
}
