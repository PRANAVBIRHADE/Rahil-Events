import React from 'react';

export const metadata = {
  title: 'Contact Us | Kratos 2026',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-surface selection:bg-primary selection:text-on-primary font-sans">
      <div className="pt-12 pb-24 px-6 max-w-[1440px] mx-auto w-full">
        <div className="mb-16">
          <span className="text-sm font-display font-bold uppercase tracking-widest text-primary mb-2 block">Communication Channel</span>
          <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-8">Contact Command</h1>
          <p className="text-xl opacity-70 max-w-2xl font-sans">
            Have questions regarding the events, registration, or logistics? Access our direct communication lines below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 brutal-border overflow-hidden">
          <div className="p-8 border-b-2 md:border-b-0 md:border-r-2 border-on-surface hover:bg-primary-container transition-colors group">
            <span className="material-symbols-outlined text-4xl mb-6 block">email</span>
            <h3 className="text-3xl font-black uppercase mb-4">Digital Comm</h3>
            <a href="mailto:kratos2026@mpgi.ac.in" className="font-display font-bold text-lg md:text-xl hover:text-primary transition-colors block mb-2 break-words">
              kratos2026@mpgi.ac.in
            </a>
            <a href="mailto:studentdept@mpgi.ac.in" className="font-display font-bold text-lg md:text-xl hover:text-primary transition-colors block break-words">
              studentdept@mpgi.ac.in
            </a>
          </div>

          <div className="p-8 hover:bg-primary-container transition-colors group">
            <span className="material-symbols-outlined text-4xl mb-6 block">call</span>
            <h3 className="text-3xl font-black uppercase mb-4">Voice Links</h3>
            <a href="tel:+919834147160" className="font-display font-bold text-xl hover:text-primary transition-colors block mb-2">
              Registration Help: +91 98341 47160
            </a>
            <a href="https://mpgi.ac.in/school-of-engineering/" target="_blank" rel="noreferrer" className="font-display font-bold text-xl hover:text-primary transition-colors block">
              MPGI School of Engineering
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
