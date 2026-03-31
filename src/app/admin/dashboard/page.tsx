import React from 'react';
import Link from 'next/link';
import BrutalCard from '@/components/ui/BrutalCard';
import BrutalButton from '@/components/ui/BrutalButton';
import CreateEventForm from '@/components/admin/CreateEventForm';
import BroadcastForm from '@/components/admin/BroadcastForm';
import GalleryAdminToggle from '@/components/admin/GalleryAdminToggle';
import LogoutButton from '@/components/dashboard/LogoutButton';
import { db } from '@/db';
import { registrations, users, events, systemSettings, teamMembers } from '@/db/schema';
import { eq, desc, count, sum } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

const StatCard = ({ label, value, trend }: { label: string; value: string; trend?: string }) => (
  <BrutalCard className="flex flex-col justify-between py-6 px-4" shadowColor="gold">
    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">{label}</p>
    <p className="text-4xl font-black font-display tracking-tighter">{value}</p>
    {trend && <p className="text-[10px] font-bold text-green-600 mt-2 uppercase">+{trend} Today</p>}
  </BrutalCard>
);

export default async function AdminDashboard() {
  const [participantsCount] = await db
    .select({ value: count() })
    .from(teamMembers)
    .innerJoin(registrations, eq(teamMembers.teamId, registrations.teamId))
    .where(eq(registrations.status, 'APPROVED'));

  const [teamsCount] = await db.select({ value: count() }).from(registrations).where(eq(registrations.status, 'APPROVED'));

  const [pendingPaymentsCount] = await db
    .select({ value: count() })
    .from(registrations)
    .where(eq(registrations.status, 'PENDING'));

  const [revTotal] = await db
    .select({ value: sum(registrations.totalFee) })
    .from(registrations)
    .where(eq(registrations.status, 'APPROVED'));

  // Count ALL user accounts (including those with no registrations)
  const { users: usersTable } = await import('@/db/schema');
  const [totalAccountsRow] = await db.select({ value: count() }).from(usersTable);
  const totalAccounts = totalAccountsRow?.value ?? 0;

  const stats = [
    { label: 'Registered Accounts', value: totalAccounts.toString(), href: '/admin/users' },
    { label: 'Total Participants', value: participantsCount.value.toString() },
    { label: 'Total Teams', value: teamsCount.value.toString() },
    { label: 'Pending Payments', value: pendingPaymentsCount.value.toString() },
    { label: 'Revenue Estimate', value: `INR ${revTotal.value || 0}` },
  ];

  const dbSettings = await db.select().from(systemSettings).where(eq(systemSettings.id, 1));
  const isGalleryLocked = dbSettings.length > 0 ? dbSettings[0].isGalleryLocked ?? true : true;

  const recentRegistrations = await db.select({
    id: registrations.id,
    name: users.name,
    event: events.name,
    fee: events.fee,
    amount: registrations.totalFee,
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
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-2 italic">Admin Panel</h1>
          <p className="font-display font-bold uppercase text-primary tracking-widest text-sm">Manage Kratos 2026</p>
        </div>
        <div className="flex gap-4">
          <Link href="/api/admin/export" target="_blank">
            <BrutalButton variant="outline" size="sm">Export Master Excel</BrutalButton>
          </Link>
          <LogoutButton />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
        {stats.map((stat) =>
          stat.href ? (
            <Link key={stat.label} href={stat.href}>
              <StatCard label={stat.label} value={stat.value} />
            </Link>
          ) : (
            <StatCard key={stat.label} label={stat.label} value={stat.value} />
          )
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <BrutalCard className="p-0 overflow-hidden">
            <div className="p-6 border-b-2 border-on-surface bg-surface-container-low flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase italic">Recent Registrations</h2>
              <Link href="/admin/registrations" className="text-[10px] font-black uppercase border-b-2 border-on-surface hover:text-primary hover:border-primary transition-colors">
                View Full Logs
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans">
                <thead className="bg-surface-container-low border-b-2 border-on-surface text-[10px] font-black uppercase tracking-widest">
                  <tr>
                    <th className="p-4">Participant</th>
                    <th className="p-4">Event</th>
                    <th className="p-4">Fee Paid</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-on-surface/10">
                  {recentRegistrations.map((registration) => (
                    <tr key={registration.id} className="hover:bg-primary-container/5 transition-colors">
                      <td className="p-4 font-bold uppercase text-sm w-1/3 truncate max-w-[150px]">{registration.name}</td>
                      <td className="p-4 text-xs font-bold opacity-60 uppercase w-1/4 truncate max-w-[120px]">{registration.event}</td>
                      <td className="p-4 font-mono text-sm">INR {registration.amount ?? registration.fee}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 border-2 text-[10px] font-black uppercase ${
                          registration.status === 'APPROVED' ? 'bg-green-100 text-green-800 border-green-800' :
                          registration.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 border-yellow-800' :
                            'bg-red-100 text-red-800 border-red-800'
                        }`}>
                          {registration.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <Link href={`/admin/verify/${registration.id}`} className="text-[10px] font-black uppercase border-b-2 border-on-surface hover:text-primary hover:border-primary transition-colors">Review</Link>
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
              <Link href="/admin/settings" className="w-full">
                <BrutalButton className="w-full justify-start" variant="outline">
                  <span className="material-symbols-outlined mr-3">settings</span>
                  Registration Settings
                </BrutalButton>
              </Link>
              <Link href="/admin/scanner" className="w-full">
                <BrutalButton className="w-full justify-start bg-primary text-on-primary border-on-surface" variant="outline">
                  <span className="material-symbols-outlined mr-3">qr_code_scanner</span>
                  Entry Scanner Terminal
                </BrutalButton>
              </Link>
              <Link href="/admin/organizers" className="w-full">
                <BrutalButton className="w-full justify-start" variant="outline">
                  <span className="material-symbols-outlined mr-3">people</span>
                  Organizer Management
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
              <Link href="/admin/results" className="w-full">
                <BrutalButton className="w-full justify-start text-purple-800 border-purple-800 bg-purple-100" variant="secondary">
                  <span className="material-symbols-outlined mr-3">emoji_events</span>
                  Manage Winner Data
                </BrutalButton>
              </Link>
              <Link href="/admin/events" className="w-full">
                <BrutalButton className="w-full justify-start text-red-800 border-red-800 bg-red-100" variant="secondary">
                  <span className="material-symbols-outlined mr-3">dangerous</span>
                  Manage Events
                </BrutalButton>
              </Link>
              <Link href="/admin/scanner" className="w-full">
                <BrutalButton className="w-full justify-start text-white border-black bg-black hover:bg-zinc-800">
                  <span className="material-symbols-outlined mr-3 text-primary">qr_code_scanner</span>
                  Entry Scanner Terminal
                </BrutalButton>
              </Link>
            </div>
          </BrutalCard>

          <BroadcastForm />

          <GalleryAdminToggle isLocked={isGalleryLocked} />

          <div className="p-6 border-2 border-on-surface bg-primary-container italic">
            <p className="text-sm font-bold uppercase leading-tight">
              System Health: Optimized
              <br />
              Active Admins: 02
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
