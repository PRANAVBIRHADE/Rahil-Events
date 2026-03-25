import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Terms of Service | Kratos 2026',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-surface selection:bg-primary selection:text-on-primary font-sans flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-32 pb-24 px-6 max-w-[800px] mx-auto w-full">
        <div className="mb-16">
          <span className="text-sm font-display font-bold uppercase tracking-widest text-primary mb-2 block">Legal Directives</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8">Terms of Service</h1>
        </div>

        <div className="space-y-8 font-sans opacity-80 leading-relaxed">
          <p>
            Welcome to KRATOS 2026. These terms and conditions outline the rules and regulations for engaging with the KRATOS TECHNICAL FESTIVAL infrastructure and operational modules.
          </p>
          
          <h2 className="text-2xl font-black uppercase text-on-surface opacity-100">1. Acceptance of Protocol</h2>
          <p>
            By accessing this digital platform, we assume you accept these terms and conditions. Do not continue to use KRATOS 2026 if you do not agree to take all of the terms and conditions stated on this page.
          </p>

          <h2 className="text-2xl font-black uppercase text-on-surface opacity-100">2. Module Registration & Verification</h2>
          <p>
            Participation in KRATOS 2026 events requires official registration via our dashboard. All provided identities and institutional affiliations must be accurate. The Command Center reserves the right to terminate access or disqualify participants found bypassing verification protocols or submitting falsified intel.
          </p>

          <h2 className="text-2xl font-black uppercase text-on-surface opacity-100">3. Operational Conduct</h2>
          <p>
            All operatives (participants) are expected to maintain professional conduct during both physical and digital events. Any attempts to sabotage the technical infrastructure, manipulate leaderboards, or disrupt the festival&apos;s network will result in immediate extraction from the premises and severe academic penalties.
          </p>

          <h2 className="text-2xl font-black uppercase text-on-surface opacity-100">4. Modifications</h2>
          <p>
            The Command Center holds absolute authority to modify, inject, or extract rules pertaining to individual event modules at any given timeframe prior to execution. Participants will be notified via their registered communication channels.
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
