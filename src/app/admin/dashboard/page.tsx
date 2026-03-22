import React from 'react';
import BrutalCard from '@/components/ui/BrutalCard';
import BrutalButton from '@/components/ui/BrutalButton';
import CreateEventForm from '@/components/admin/CreateEventForm';
import BroadcastForm from '@/components/admin/BroadcastForm';
import GalleryAdminToggle from '@/components/admin/GalleryAdminToggle';
import { db } from '@/db';
import { registrations, users, events, systemSettings } from '@/db/schema';
import { eq, desc, count, sum } from 'drizzle-orm';

const StatCard = ({ label, value, trend }: { label: string; value: string; trend?: string }) => (
  <BrutalCard className="flex flex-col justify-between py-6 px-4" shadowColor="gold">
    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">{label}</p>
    <p className="text-4xl font-black font-display tracking-tighter">{value}</p>
    {trend && <p className="text-[10px] font-bold text-green-600 mt-2 uppercase">+{trend} Today</p>}
  </BrutalCard>
);

export default async function AdminDashboard() {
  const [regCount] = await db.select({ value: count() }).from(registrations);
  const [pendingCount] = await db.select({ value: count() }).from(registrations).where(eq(registrations.status, 'PENDING'));
  const [revTotal] = await db.select({ value: sum(events.fee) })
    .from(registrations)
    .innerJoin(events, eq(registrations.eventId, events.id))
    .where(eq(registrations.status, 'APPROVED'));

  const [moduleCount] = await db.select({ value: count() }).from(events);

  const stats = [
    { label: 'Total Registrations', value: regCount.value.toString() },
    { label: 'Approved Revenue', value: `₹ ${revTotal.value || 0}` },
    { label: 'Pending Verification', value: pendingCount.value.toString() },
    { label: 'Active Modules', value: moduleCount.value.toString() },
  ];

  const dbSettings = await db.select().from(systemSettings).where(eq(systemSettings.id, 1));
  const isGalleryLocked = dbSettings.length > 0 ? dbSettings[0].isGalleryLocked ?? true : true;

  const recentRegistrations = await db.select({
    id: registrations.id,
    name: users.name,
    event: events.name,
    amount: events.fee,
    status: registrations.status,
  })
  .from(registrations)
  .innerJoin(users, eq(registrations.userId, users.id))
  .innerJoin(events, eq(registrations.eventId, events.id))
  .orderBy(desc(registrations.createdAt))
  .limit(5);

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-12">
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-2 italic">Admin Command</h1>
          <p className="font-display font-bold uppercase text-primary tracking-widest text-sm">Center for Operational Control</p>
        </div>
        <Link href="/api/admin/export" target="_blank">
          <BrutalButton variant="outline" size="sm">Export Master Excel</BrutalButton>
        </Link>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Registration Table */}
        <div className="lg:col-span-8">
          <BrutalCard className="p-0 overflow-hidden">
            <div className="p-6 border-b-2 border-on-surface bg-surface-container-low flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase italic">Recent Transmissions</h2>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="SEARCH USR ID..." 
                  className="px-3 py-1 brutal-border text-xs font-bold uppercase outline-none focus:border-primary"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans">
                <thead className="bg-surface-container-low border-b-2 border-on-surface text-[10px] font-black uppercase tracking-widest">
                  <tr>
                    <th className="p-4">Participant</th>
                    <th className="p-4">Event Module</th>
                    <th className="p-4">Fee Paid</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-on-surface/10">
                  {recentRegistrations.map((reg, i) => (
                    <tr key={i} className="hover:bg-primary-container/5 transition-colors">
                      <td className="p-4 font-bold uppercase text-sm w-1/3 truncate max-w-[150px]">{reg.name}</td>
                      <td className="p-4 text-xs font-bold opacity-60 uppercase w-1/4 truncate max-w-[120px]">{reg.event}</td>
                      <td className="p-4 font-mono text-sm">₹ {reg.amount}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 border-2 text-[10px] font-black uppercase ${
                          reg.status === 'APPROVED' ? 'bg-green-100 text-green-800 border-green-800' :
                          reg.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 border-yellow-800' :
                          'bg-red-100 text-red-800 border-red-800'
                        }`}>
                          {reg.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <Link href={`/admin/verify/${reg.id}`} className="text-[10px] font-black uppercase border-b-2 border-on-surface hover:text-primary hover:border-primary transition-colors">Inspect</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 text-center border-t-2 border-on-surface bg-surface-container-low">
              <Link href="/admin/registrations" className="text-xs font-black uppercase hover:underline">View Full Logs &rarr;</Link>
            </div>
          </BrutalCard>
        </div>

        {/* Quick Actions Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <CreateEventForm />
          <BrutalCard shadow={true} shadowColor="black">
            <h3 className="text-xl font-black uppercase mb-6 border-b-2 border-on-surface pb-2">Admin Tools</h3>
            <div className="grid grid-cols-1 gap-4">
              <Link href="/admin/schedule" className="w-full">
                <BrutalButton className="w-full justify-start" variant="outline">
                  <span className="material-symbols-outlined mr-3">event</span>
                  Edit Master Schedule
                </BrutalButton>
              </Link>
              <Link href="/api/admin/proofs" target="_blank" className="w-full">
                <BrutalButton className="w-full justify-start" variant="outline">
                  <span className="material-symbols-outlined mr-3">download</span>
                  Download All Proofs
                </BrutalButton>
              </Link>
              <Link href="/admin/users" className="w-full">
                <BrutalButton className="w-full justify-start text-blue-800 border-blue-800 bg-blue-100" variant="secondary">
                  <span className="material-symbols-outlined mr-3">manage_accounts</span>
                  Manage Personnel
                </BrutalButton>
              </Link>
              <Link href="/admin/events" className="w-full">
                <BrutalButton className="w-full justify-start text-red-800 border-red-800 bg-red-100" variant="secondary">
                  <span className="material-symbols-outlined mr-3">dangerous</span>
                  Manage Modules
                </BrutalButton>
              </Link>
            </div>
          </BrutalCard>
          
          <BroadcastForm />

          <GalleryAdminToggle isLocked={isGalleryLocked} />
          
          <div className="p-6 border-2 border-on-surface bg-primary-container italic">
            <p className="text-sm font-bold uppercase leading-tight">
              System Health: Optimized
              <br/>
              Active Admins: 02
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper: Link component for Next.js
import Link from 'next/link';
