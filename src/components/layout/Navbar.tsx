import React from 'react';
import Link from 'next/link';
import BrutalButton from '@/components/ui/BrutalButton';

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-surface border-b-2 border-on-surface shadow-[4px_4px_0px_0px_var(--primary-container)]">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-[1440px] mx-auto">
        <Link href="/" className="text-3xl font-black tracking-tighter text-on-surface uppercase font-display italic">
          KRATOS 2026
        </Link>
        <div className="hidden md:flex gap-8 font-display uppercase tracking-tighter font-bold">
          <Link href="/#events" className="text-on-surface/60 hover:text-on-surface border-b-4 border-transparent hover:border-primary-container pb-1 transition-all duration-150">Events</Link>
          <Link href="/#schedule" className="text-on-surface/60 hover:text-on-surface border-b-4 border-transparent hover:border-primary-container pb-1 transition-all duration-150">Schedule</Link>
          <Link href="/#workshops" className="text-on-surface/60 hover:text-on-surface border-b-4 border-transparent hover:border-primary-container pb-1 transition-all duration-150">Workshops</Link>
          <Link href="/#gallery" className="text-on-surface/60 hover:text-on-surface border-b-4 border-transparent hover:border-primary-container pb-1 transition-all duration-150">Gallery</Link>
        </div>
        <div className="flex gap-4">
          <Link href="/dashboard">
            <BrutalButton size="md" variant="outline" className="px-6 py-2">
              Dashboard
            </BrutalButton>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
