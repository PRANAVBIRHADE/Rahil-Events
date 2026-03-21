import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Contact Us | Kratos 2026',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-surface selection:bg-primary selection:text-on-primary font-sans flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-32 pb-24 px-6 max-w-[1440px] mx-auto w-full">
        <div className="mb-16">
          <span className="text-sm font-display font-bold uppercase tracking-widest text-primary mb-2 block">Communication Channel</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8">Contact Command</h1>
          <p className="text-xl opacity-70 max-w-2xl font-sans">
            Have questions regarding the modules, registration, or logistics? Access our direct communication lines below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 brutal-border overflow-hidden">
           <div className="p-8 border-b-2 md:border-b-0 md:border-r-2 border-on-surface hover:bg-primary-container transition-colors group">
             <span className="material-symbols-outlined text-4xl mb-6 block">email</span>
             <h3 className="text-3xl font-black uppercase mb-4">Digital Comm</h3>
             <a href="mailto:support@kratos2026.com" className="font-display font-bold text-xl hover:text-primary transition-colors block mb-2">
               support@kratos2026.com
             </a>
             <a href="mailto:events@kratos2026.com" className="font-display font-bold text-xl hover:text-primary transition-colors block">
               events@kratos2026.com
             </a>
           </div>

           <div className="p-8 hover:bg-primary-container transition-colors group">
             <span className="material-symbols-outlined text-4xl mb-6 block">call</span>
             <h3 className="text-3xl font-black uppercase mb-4">Voice Links</h3>
             <p className="font-display font-bold text-xl block mb-2">
               +91 98765 43210 (Logistics)
             </p>
             <p className="font-display font-bold text-xl block">
               +91 99887 76655 (Command Center)
             </p>
           </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
