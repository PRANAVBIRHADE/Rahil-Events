'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import BrutalButton from '@/components/ui/BrutalButton';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="w-full bg-surface border-b-2 border-on-surface shadow-[4px_4px_0px_0px_var(--primary-container)] relative z-50">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-[1440px] mx-auto">
        <Link href="/" onClick={closeMenu} className="text-3xl font-black tracking-tighter text-on-surface uppercase font-display italic z-50">
          KRATOS 2026
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 font-display uppercase tracking-tighter font-bold items-center">
          <Link href="/#events" className="text-on-surface/60 hover:text-on-surface border-b-4 border-transparent hover:border-primary-container pb-1 transition-all duration-150 py-4">Events</Link>
          <Link href="/#schedule" className="text-on-surface/60 hover:text-on-surface border-b-4 border-transparent hover:border-primary-container pb-1 transition-all duration-150 py-4">Schedule</Link>
          <Link href="/squads" className="text-primary hover:text-on-surface border-b-4 border-transparent hover:border-primary pb-1 transition-all duration-150 py-4 font-black italic">Find a Team</Link>
          <Link href="/#workshops" className="text-on-surface/60 hover:text-on-surface border-b-4 border-transparent hover:border-primary-container pb-1 transition-all duration-150 py-4">Workshops</Link>
          <Link href="/leaderboard" className="text-on-surface/60 hover:text-on-surface border-b-4 border-transparent hover:border-primary-container pb-1 transition-all duration-150 py-4 font-black">Leaderboard</Link>
          <Link href="/about" className="text-on-surface/60 hover:text-on-surface border-b-4 border-transparent hover:border-primary-container pb-1 transition-all duration-150 py-4">About</Link>
          <Link href="/#gallery" className="text-on-surface/60 hover:text-on-surface border-b-4 border-transparent hover:border-primary-container pb-1 transition-all duration-150 py-4">Gallery</Link>
        </div>

        {/* Dashboard Align */}
        <div className="flex gap-4 z-50">
          <Link href="/dashboard" className="hidden md:block">
            <BrutalButton size="md" variant="outline" className="px-6 py-2">
              Dashboard
            </BrutalButton>
          </Link>
          
          {/* Mobile Menu Toggle */}
          <button 
            onClick={toggleMenu} 
            className="md:hidden flex items-center justify-center w-10 h-10 brutal-border bg-primary-container text-on-primary-container"
          >
            <span className="material-symbols-outlined font-black">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full h-[calc(100vh-74px)] bg-surface flex flex-col items-center justify-center border-b-4 border-on-surface animate-in slide-in-from-top-4 duration-300 md:hidden pb-20 z-40">
          <div className="flex flex-col gap-10 font-display uppercase tracking-tighter font-black text-4xl text-center w-full px-8 overflow-y-auto">
            <Link href="/#events" onClick={closeMenu} className="hover:text-primary transition-colors border-b-4 border-on-surface/10 pb-4 mt-8">Events</Link>
            <Link href="/#schedule" onClick={closeMenu} className="hover:text-primary transition-colors border-b-4 border-on-surface/10 pb-4">Schedule</Link>
            <Link href="/#workshops" onClick={closeMenu} className="hover:text-primary transition-colors border-b-4 border-on-surface/10 pb-4">Workshops</Link>
            <Link href="/leaderboard" onClick={closeMenu} className="hover:text-primary transition-colors border-b-4 border-on-surface/10 pb-4">Leaderboard</Link>
            <Link href="/about" onClick={closeMenu} className="hover:text-primary transition-colors border-b-4 border-on-surface/10 pb-4">About Us</Link>
            <Link href="/#gallery" onClick={closeMenu} className="hover:text-primary transition-colors border-b-4 border-on-surface/10 pb-4">Gallery</Link>
            
            <Link href="/dashboard" onClick={closeMenu} className="mt-8 w-full">
              <BrutalButton size="xl" className="w-full">
                Dashboard
              </BrutalButton>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
