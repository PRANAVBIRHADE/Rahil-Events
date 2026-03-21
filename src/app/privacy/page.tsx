import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Privacy Policy | Kratos 2026',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-surface selection:bg-primary selection:text-on-primary font-sans flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-32 pb-24 px-6 max-w-[800px] mx-auto w-full">
        <div className="mb-16">
          <span className="text-sm font-display font-bold uppercase tracking-widest text-primary mb-2 block">Legal Directives</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8">Privacy Policy</h1>
        </div>

        <div className="space-y-8 font-sans opacity-80 leading-relaxed">
          <p>
            At KRATOS 2026, accessible from our official domain, one of our main priorities is the privacy of our visitors and participants. This Privacy Policy document contains types of information that is collected and recorded by KRATOS 2026 and how we use it.
          </p>
          
          <h2 className="text-2xl font-black uppercase text-on-surface opacity-100">Log Files & Data Collection</h2>
          <p>
            KRATOS 2026 follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
          </p>

          <h2 className="text-2xl font-black uppercase text-on-surface opacity-100">Registration Information</h2>
          <p>
            When you register for our event modules or the dashboard, we collect necessary telemetry including your name, institutional affiliation, contact numbers, and email addresses. This data is strictly utilized for Command Center logistics, identity verification during the festival, and dispatching crucial updates regarding your registered modules.
          </p>

          <h2 className="text-2xl font-black uppercase text-on-surface opacity-100">Consent</h2>
          <p>
            By utilizing our platform and navigating through our digital infrastructure, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
