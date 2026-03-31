import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Kratos 2026',
  description: 'Get in touch with the Kratos 2026 team at Matoshri Pratishthan Group of Institutions, Nanded.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#FEFCE8] text-on-surface font-sans selection:bg-primary-container">
      <div className="pt-16 pb-24 px-6 max-w-[1440px] mx-auto">
        
        {/* ── HEADER ── */}
        <div className="mb-16">
          <span className="text-[12px] font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-4 block">
            CONTACT
          </span>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-none">
            GET IN TOUCH
          </h1>
          <p className="text-lg md:text-xl font-medium opacity-60 max-w-2xl leading-relaxed">
            For event help, registration support, or venue guidance, use the official college contact details below.
          </p>
        </div>

        {/* ── TOP SECTION: EMAIL & PHONE ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 brutal-border overflow-hidden mb-8 bg-white">
          {/* Email Box */}
          <div className="p-10 border-b-2 md:border-b-0 md:border-r-2 border-on-surface group hover:bg-[#FEFCE8] transition-colors">
            <span className="material-symbols-outlined text-4xl text-[#D4AF37] mb-8 block transition-transform group-hover:scale-110">
              mail
            </span>
            <h2 className="text-3xl font-black uppercase mb-6 tracking-tight">EMAIL</h2>
            <div className="space-y-2">
              <a href="mailto:info@mpgin.edu.in" className="text-xl font-bold hover:text-[#D4AF37] transition-colors block">
                info@mpgin.edu.in
              </a>
              <a href="https://mpgi.ac.in/school-of-engineering/" target="_blank" rel="noreferrer" className="text-base font-bold opacity-60 hover:opacity-100 hover:text-[#D4AF37] transition-all block">
                School of Engineering Page
              </a>
            </div>
          </div>

          {/* Phone Box */}
          <div className="p-10 group hover:bg-[#FEFCE8] transition-colors">
            <span className="material-symbols-outlined text-4xl text-[#D4AF37] mb-8 block transition-transform group-hover:scale-110">
              call
            </span>
            <h2 className="text-3xl font-black uppercase mb-6 tracking-tight">PHONE</h2>
            <div className="space-y-4">
              <a href="tel:+912462269900" className="text-xl font-bold hover:text-[#D4AF37] transition-colors block">
                +91 2462 269900
              </a>
              <p className="text-sm font-bold opacity-60 leading-relaxed uppercase">
                Jijau Nagar, Off Nanded-Latur Highway, Khupsarwadi, Post Vishnupuri, <br />
                Nanded, Maharashtra 431606
              </p>
            </div>
          </div>
        </div>

        {/* ── BOTTOM SECTION: ORGANIZERS & MAP ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Organizers Contacts */}
          <div className="lg:col-span-5 brutal-border bg-white p-10 flex flex-col h-full">
            <h3 className="text-2xl font-black uppercase mb-10 tracking-tight border-b-2 border-on-surface pb-4">
              ORGANIZER CONTACTS
            </h3>
            
            <div className="space-y-8 flex-1">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] mb-1">FACULTY COORDINATOR</p>
                <p className="text-lg font-black uppercase">Dr L Waghmare</p>
                <p className="text-xs font-mono opacity-70">lmwaghmare@yahoo.com | +91 9822663185</p>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] mb-1">HEAD ORGANIZER</p>
                <p className="text-lg font-black uppercase">Mr Lakhan Rathod</p>
                <p className="text-xs font-mono opacity-70">lakhan180689@gmail.com | +91 9763433187</p>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] mb-1">NODAL COORDINATOR</p>
                <p className="text-lg font-black uppercase">Mr Azhar Ahmed</p>
                <p className="text-xs font-mono opacity-70">azhar.ahmed.eep@gmail.com | +91 9272579279</p>
              </div>

              <div className="pt-4 border-t border-on-surface/10">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] mb-1">FRONTEND DEVELOPER</p>
                <p className="text-lg font-black uppercase leading-none">Rahil Hussain</p>
                <p className="text-xs font-mono opacity-70 mt-1 lowercase">https://github.com/Rahil-dope</p>
              </div>

              <div className="pt-4 border-t border-on-surface/10">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] mb-1">BACKEND DEVELOPER</p>
                <p className="text-lg font-black uppercase leading-none">Pranav Birade</p>
                <p className="text-xs font-mono opacity-70 mt-1 lowercase">https://github.com/PRANAVBIRHADE</p>
              </div>
            </div>
          </div>

          {/* Google Map */}
          <div className="lg:col-span-7 brutal-border bg-white p-4 h-[500px] lg:h-auto overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.756209425121!2d77.291771!3d19.118318!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bce84050484bce3%3A0xe0e3f3bce840504!2sMatoshri%20Pratishthan%20Group%20of%20Institutions!5e0!3m2!1sen!2sin!4v1711882000000!5m2!1sen!2sin"
              className="w-full h-full brutal-border"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

        </div>
      </div>
    </main>
  );
}
