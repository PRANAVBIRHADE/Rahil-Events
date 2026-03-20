import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { users, registrations, events } from '@/db/schema';
import { eq } from 'drizzle-orm';
import BrutalCard from '@/components/ui/BrutalCard';
import BrutalButton from '@/components/ui/BrutalButton';
import BrutalQRCode from '@/components/ui/BrutalQRCode';
import LogoutButton from '@/components/dashboard/LogoutButton';

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    APPROVED: 'bg-green-100 text-green-800 border-green-800',
    PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-800',
    REJECTED: 'bg-red-100 text-red-800 border-red-800',
  };
  return (
    <span className={`px-2 py-0.5 border-2 text-[10px] font-black uppercase tracking-tighter ${styles[status] || styles['PENDING']}`}>
      {status}
    </span>
  );
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect('/auth/login');
  }

  // Fetch actual user data
  const [dbUser] = await db.select().from(users).where(eq(users.email, session.user.email));

  if (!dbUser) {
    redirect('/auth/login');
  }

  if (!dbUser.college || !dbUser.branch || !dbUser.phone) {
    redirect('/profile/complete');
  }

  // Fetch active registrations joined with event info
  const dbRegistrations = await db.select({
    id: registrations.id,
    status: registrations.status,
    teamName: registrations.teamName,
    eventName: events.name,
    isTeam: events.isTeam,
  })
  .from(registrations)
  .innerJoin(events, eq(registrations.eventId, events.id))
  .where(eq(registrations.userId, dbUser.id));

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-12">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-2 italic">Dashboard</h1>
          <p className="font-display font-bold uppercase text-primary tracking-widest text-sm">Participant: {dbUser.name.toUpperCase()}</p>
        </div>
        <div className="flex gap-4">
          <BrutalButton variant="outline" size="sm">Edit Profile</BrutalButton>
          <LogoutButton />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Summary */}
        <BrutalCard className="lg:col-span-1 h-fit" shadowColor="gold">
          <h2 className="text-2xl font-black uppercase mb-6 border-b-2 border-on-surface pb-2">Profile Intel</h2>
          <div className="space-y-4 font-sans">
            <div>
              <p className="text-[10px] font-black uppercase opacity-60">Institute</p>
              <p className="font-bold">{dbUser.college || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase opacity-60">Branch</p>
              <p className="font-bold">{dbUser.branch || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase opacity-60">Participant ID</p>
              <p className="font-bold font-mono text-xs overflow-hidden text-ellipsis">{dbUser.id}</p>
            </div>
          </div>
        </BrutalCard>

        {/* Registered Events */}
        <div className="lg:col-span-2 space-y-8">
          <BrutalCard>
            <div className="flex justify-between items-center mb-8 border-b-2 border-on-surface pb-4">
              <h2 className="text-2xl font-black uppercase italic">Registered Modules</h2>
              <p className="text-xs font-bold uppercase opacity-60">{dbRegistrations.length} Active</p>
            </div>

            <div className="space-y-6">
              {dbRegistrations.map((reg) => (
                <div key={reg.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 brutal-border bg-surface-container-low gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-black uppercase">{reg.eventName}</h3>
                      <StatusBadge status={reg.status || 'PENDING'} />
                    </div>
                    <p className="text-xs font-sans opacity-70 italic">
                      FORMAT: {reg.isTeam ? `TEAM (${reg.teamName || 'NO NAME'})` : 'SOLO'} | REF: <span className="font-mono">{reg.id.substring(0,8)}</span>
                    </p>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                    {reg.status === 'APPROVED' ? (
                      <div className="flex flex-col md:flex-row items-center gap-4">
                        <BrutalQRCode data={reg.id} size={60} className="hidden md:block" />
                        <BrutalButton size="sm" className="w-full md:w-auto">Download ID Card</BrutalButton>
                      </div>
                    ) : (
                       <BrutalButton size="sm" variant="outline" className="w-full md:w-auto" disabled={reg.status === 'REJECTED'}>
                          {reg.status === 'REJECTED' ? 'REJECTED' : 'Proof Processing...'}
                       </BrutalButton>
                    )}
                  </div>
                </div>
              ))}
              {dbRegistrations.length === 0 && (
                 <div className="text-center py-12 border-2 border-dashed border-on-surface/20">
                    <p className="font-display font-black tracking-widest uppercase opacity-40">NO MODULES REGISTERED YET</p>
                 </div>
              )}
            </div>

            <div className="mt-8">
              <BrutalButton variant="outline" className="w-full">Browse More Events</BrutalButton>
            </div>
          </BrutalCard>

          {/* Verification Status Notice */}
          <div className="p-6 border-2 border-on-surface bg-primary-container/10 italic">
            <p className="text-sm font-bold uppercase">
              Note: Technical verification takes 6-12 hours. Ensure your UPI payment proof is clear for instant approval.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
