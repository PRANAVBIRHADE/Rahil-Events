import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { users, registrations, events } from '@/db/schema';
import { eq } from 'drizzle-orm';
import BrutalCard from '@/components/ui/BrutalCard';
import BrutalButton from '@/components/ui/BrutalButton';
import LogoutButton from '@/components/dashboard/LogoutButton';
import TicketCard from '@/components/dashboard/TicketCard';
import GalleryUploadClient from '@/components/dashboard/GalleryUploadClient';
import { systemSettings, galleryPhotos } from '@/db/schema';
import { getPlayerRank } from '@/lib/xp';
import { ShieldCheck, Zap } from 'lucide-react';


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
    eventSlug: events.slug,
    format: events.format,
  })
  .from(registrations)
  .innerJoin(events, eq(registrations.eventId, events.id))
  .where(eq(registrations.userId, dbUser.id));

  const dbSettings = await db.select().from(systemSettings).where(eq(systemSettings.id, 1));
  const isGalleryLocked = dbSettings.length > 0 ? dbSettings[0].isGalleryLocked ?? true : true;

  const userPhotos = await db.select({
    id: galleryPhotos.id,
    imageUrl: galleryPhotos.imageUrl
  }).from(galleryPhotos).where(eq(galleryPhotos.userId, dbUser.id));

  const rank = getPlayerRank(dbUser.xp || 0);


  return (
    <div className="max-w-[1440px] mx-auto px-6 py-12">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-2 italic">Dashboard</h1>
          <div className="flex items-center gap-3">
             <p className="font-display font-bold uppercase text-primary tracking-widest text-sm">Participant: {dbUser.name.toUpperCase()}</p>
             <div className="bg-on-surface text-surface px-2 py-0.5 text-[10px] font-black uppercase italic rounded-sm">
                LVL {rank.level}
             </div>
          </div>
        </div>
        <div className="flex gap-4">
          <BrutalButton variant="outline" size="sm">Edit Profile</BrutalButton>
          <LogoutButton />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Summary */}
        <BrutalCard className="lg:col-span-1 h-fit" shadowColor="gold">
          <h2 className="text-2xl font-black uppercase mb-6 border-b-2 border-on-surface pb-2">Your Profile</h2>
          
          {/* XP Progress Bar */}
          <div className="mb-8 p-4 bg-on-surface text-surface rounded-sm">
             <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-2">
                   <Zap className="w-4 h-4 text-primary-container fill-primary-container" />
                   <span className="text-[10px] font-black uppercase">Tech Progress</span>
                </div>
                <span className="text-[10px] font-mono tracking-tighter">LVL {rank.level}</span>
             </div>
             <div className="h-4 bg-surface/20 brutal-border p-0.5 overflow-hidden">
                <div 
                  className="h-full bg-primary-container transition-all duration-1000" 
                  style={{ width: `${rank.progressPercent}%` }}
                />
             </div>
             <div className="flex justify-between mt-1">
                <span className="text-[9px] font-bold opacity-60 uppercase">{rank.xpInLevel} XP</span>
                <span className="text-[9px] font-bold opacity-60 uppercase">Next: {rank.xpToNextLevel} XP</span>
             </div>
          </div>

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
              <h2 className="text-2xl font-black uppercase italic">My Events</h2>
              <p className="text-xs font-bold uppercase opacity-60">{dbRegistrations.length} Active</p>
            </div>

            <div className="space-y-6">
              {dbRegistrations.map((reg) => (
                <TicketCard key={reg.id} reg={reg} userName={dbUser.name} college={dbUser.college} currentUserId={dbUser.id} />
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

          {/* User Gallery Photos Module */}
          <GalleryUploadClient isLocked={isGalleryLocked} photos={userPhotos} />

          {/* Verification Status Notice */}
          <div className="p-6 border-2 border-on-surface bg-primary-container/10 italic">
            <p className="text-sm font-bold uppercase">
              Note: Payment verification usually takes 6-12 hours. Please wait while we process your registration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
