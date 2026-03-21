import React from 'react';
import BrutalCard from '@/components/ui/BrutalCard';
import BrutalInput from '@/components/ui/BrutalInput';
import BrutalButton from '@/components/ui/BrutalButton';
import BrutalQRCode from '@/components/ui/BrutalQRCode';

const StepHeader = ({ number, title }: { number: string; title: string }) => (
  <div className="relative mb-8">
    <div className="absolute -top-4 -left-4 bg-on-surface text-surface px-4 py-1 font-display font-black text-xl">
      {number}
    </div>
    <h2 className="text-3xl font-black uppercase tracking-tighter ml-4">{title}</h2>
  </div>
);

import { db } from '@/db';
import { events, registrations, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';

export default async function RegistrationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const session = await auth();
  if (!session?.user?.email) redirect('/auth/login');

  const [dbUser] = await db.select().from(users).where(eq(users.email, session.user.email));
  if (!dbUser) redirect('/auth/login');

  if (!dbUser.college || !dbUser.branch || !dbUser.phone) {
    redirect('/profile/complete');
  }

  const [event] = await db.select().from(events).where(eq(events.slug, slug));

  if (!event) {
    notFound();
  }

  const dbRegistrations = await db.select({ id: registrations.id }).from(registrations).where(eq(registrations.eventId, event.id));
  const activeCount = dbRegistrations.length;

  const eventData = {
    name: event.name,
    fee: event.fee,
    upiId: '9834147160@kotak811',
    upiURI: `upi://pay?pa=9834147160@kotak811&pn=Kratos%202026&cu=INR&am=${event.fee}`,
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-12">
      <header className="mb-16">
        <div className="inline-block bg-primary-container px-4 py-1 brutal-border mb-4">
          <span className="font-display font-bold text-sm tracking-widest uppercase">Engineering Protocol 01</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9] text-on-surface italic">
          Event<br />Registration
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Form Steps */}
        <div className="lg:col-span-7 space-y-16">
          
          {/* STEP 1: Details */}
          <BrutalCard shadow={true}>
            <StepHeader number="01" title={event.isTeam ? "Team Roster Specification" : "User Specification"} />
            <form className="space-y-6">
              <div className="bg-primary/10 border-2 border-primary p-6 mb-8">
                <h3 className="font-display font-black tracking-tighter uppercase mb-2">Primary Commander</h3>
                <p className="text-xs font-bold font-sans opacity-70 mb-4">Your core user identity is already verified for this transmission.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-60 pointer-events-none">
                  <BrutalInput label="Verified Name" defaultValue={dbUser.name} required />
                  <BrutalInput label="Verified Contact" defaultValue={dbUser.phone || ''} required />
                </div>
              </div>

              {event.isTeam && (
                <div className="space-y-6 mt-8 pt-8 border-t-2 border-on-surface">
                  <h3 className="font-display text-2xl font-black tracking-tighter uppercase mb-4">Platoon Configuration</h3>
                  <BrutalInput label="Squadron / Team Name" name="teamName" placeholder="e.g. NEURAL SYNDICATE" required />
                  
                  <div className="space-y-6 mt-4">
                    {Array.from({ length: Math.max(0, (event.teamSize || 1) - 1) }).map((_, i) => (
                      <div key={i} className="p-6 border-2 border-on-surface bg-surface-container-low relative">
                        <div className="absolute -top-3 left-4 bg-on-surface text-surface px-3 py-1 text-[10px] font-black tracking-widest uppercase">
                          Operator 0{i + 2}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                           <BrutalInput name={`member_${i}_name`} label="Full Name" placeholder={`Operator ${i + 2} Name`} required />
                           <BrutalInput name={`member_${i}_phone`} label="Contact Sequence" placeholder="+91 00000 00000" required />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </form>
          </BrutalCard>

          {/* STEP 2: Payment */}
          <BrutalCard shadow={true}>
            <StepHeader number="02" title="Payment Terminal" />
            <div className="flex flex-col md:flex-row gap-8 items-center bg-surface-container-low p-6 brutal-border">
              <div className="w-48 h-48 bg-white p-2 border-2 border-on-surface flex items-center justify-center relative overflow-hidden">
                <BrutalQRCode data={eventData.upiURI} size={160} className="w-full h-full" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <p className="text-[10px] font-display font-bold uppercase tracking-widest opacity-60">Official UPI ID</p>
                  <p className="text-2xl font-black tracking-tighter uppercase">{eventData.upiId}</p>
                </div>
                <div>
                  <p className="text-[10px] font-display font-bold uppercase tracking-widest opacity-60">Amount Required</p>
                  <p className="text-4xl font-black text-primary" style={{ textShadow: '2px 2px 0px #F9F9F9' }}>₹ {eventData.fee}.00</p>
                </div>
              </div>
            </div>
          </BrutalCard>

          {/* STEP 3: Upload */}
          <BrutalCard shadow={true} shadowColor="gold">
            <StepHeader number="03" title="Validation & Evidence" />
            <div className="border-2 border-dashed border-on-surface/30 p-12 text-center hover:border-primary transition-colors group cursor-pointer bg-surface-container-low">
              <span className="material-symbols-outlined text-6xl text-on-surface/20 group-hover:text-primary mb-4 transition-colors">cloud_upload</span>
              <p className="font-display font-bold uppercase tracking-tighter text-lg">Upload Payment Screenshot</p>
              <p className="text-sm opacity-40 mt-1">JPEG, PNG or PDF (Max 5MB)</p>
              <input className="hidden" type="file" />
            </div>
            
            <div className="mt-8 flex items-start gap-4 p-4 brutal-border bg-surface-container-low">
              <input className="mt-1 w-5 h-5 brutal-border rounded-none checked:bg-primary accent-primary focus:ring-0" id="terms" type="checkbox" />
              <label className="text-sm font-bold leading-tight opacity-70 uppercase tracking-tight" htmlFor="terms">
                I verify that all technical details provided are accurate and the payment proof is authentic. I agree to the <span className="underline border-b-2 border-primary-container">Precision Code of Conduct</span>.
              </label>
            </div>

            <BrutalButton className="w-full mt-10" size="xl">
              Complete Registration
            </BrutalButton>
          </BrutalCard>
        </div>

        {/* Right Column: Status & Sidebar */}
        <div className="lg:col-span-5 space-y-8 h-fit sticky top-32">
          {/* Status Dashboard */}
          <div className="bg-on-surface text-surface p-8 hard-shadow-gold italic">
            <h3 className="font-display text-xs font-bold uppercase tracking-[0.3em] mb-6 text-primary-container">Transmission Status</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-surface/20 pb-4">
                <span className="font-display text-sm uppercase opacity-60">Validation State</span>
                <span className="bg-primary-container text-on-primary-container px-3 py-1 font-bold text-xs uppercase not-italic">Initial Phase</span>
              </div>
              <div className="flex items-center justify-between border-b border-surface/20 pb-4">
                <span className="font-display text-sm uppercase opacity-60">Max Capacity</span>
                <span className="font-bold">{event.teamSize || 1} Members</span>
              </div>
              <div className="flex items-center justify-between border-b border-surface/20 pb-4">
                <span className="font-display text-sm uppercase opacity-60">Registration Fee</span>
                <span className="font-black text-primary-container">₹ {eventData.fee}</span>
              </div>
              <div className="pt-4 flex items-center justify-between">
                 <span className="font-display font-bold text-xs uppercase text-primary-container tracking-widest">Active Fleet Formations</span>
                 <span className="font-black text-lg">{activeCount} TEAMS</span>
              </div>
            </div>
          </div>

          {/* Critical Instructions */}
          <BrutalCard className="bg-secondary-container/20">
            <h3 className="text-xl font-black uppercase tracking-tighter mb-6 underline">Critical Instructions</h3>
            <ul className="space-y-4">
              <li className="flex gap-4 items-start">
                <span className="material-symbols-outlined text-primary font-bold">verified</span>
                <p className="text-xs font-bold uppercase leading-relaxed tracking-tight">Ensure Transaction ID is visible in the uploaded screenshot for rapid verification.</p>
              </li>
              <li className="flex gap-4 items-start">
                <span className="material-symbols-outlined text-primary font-bold">verified</span>
                <p className="text-xs font-bold uppercase leading-relaxed tracking-tight">Cross-check College ID number before submission. Incorrect data leads to rejection.</p>
              </li>
            </ul>
          </BrutalCard>
        </div>
      </div>
    </div>
  );
}
