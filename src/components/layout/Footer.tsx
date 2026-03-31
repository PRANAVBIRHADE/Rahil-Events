import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="w-full border-t-2 border-on-surface bg-on-surface text-surface mt-auto">
      <div className="max-w-[1440px] mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <h3 className="text-3xl font-black uppercase tracking-tighter italic mb-4">KRATOS 2026</h3>
          <p className="font-sans text-sm opacity-60 max-w-xs mb-6">
            Jijau Nagar, Latur Nanded Highway, Vishnupuri, Nanded, Maharashtra 431606.
          </p>
          <div className="flex gap-4">
             <Link href="https://instagram.com" className="w-10 h-10 brutal-border bg-surface text-on-surface flex items-center justify-center hover:bg-primary-container transition-colors">
                <span className="material-symbols-outlined text-xl">share</span>
             </Link>
             <Link href="https://github.com/Rahil-dope" className="w-10 h-10 brutal-border bg-surface text-on-surface flex items-center justify-center hover:bg-primary-container transition-colors">
                <span className="material-symbols-outlined text-xl">code</span>
             </Link>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-display font-black uppercase tracking-widest text-xs opacity-40">Navigation</h4>
          <nav className="flex flex-col gap-2 font-display font-bold uppercase text-sm">
            <Link href="/events" className="hover:text-primary transition-colors italic">- Browse Events</Link>
            <Link href="/schedule" className="hover:text-primary transition-colors italic">- Main Schedule</Link>
            <Link href="/squads" className="hover:text-primary transition-colors italic">- Find Squads</Link>
            <Link href="/dashboard" className="hover:text-primary transition-colors italic">- My Dashboard</Link>
          </nav>
        </div>

        <div className="space-y-4 text-right md:text-left">
          <h4 className="font-display font-black uppercase tracking-widest text-xs opacity-40">Contact Support</h4>
          <p className="font-mono text-sm">9834147160</p>
          <p className="font-mono text-sm">kratos2026@mpgi.ac.in</p>
          <div className="pt-4 border-t border-surface/20">
             <p className="text-[10px] font-black uppercase tracking-widest opacity-40">© 2026 KRATOS | Student Department | Matoshri Pratishthan Group of Institutions, Nanded</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
