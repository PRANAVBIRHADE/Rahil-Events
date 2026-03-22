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
          <div className="relative group h-full flex items-center py-4">
            <Link href="/#events" className="text-on-surface/60 group-hover:text-on-surface border-b-4 border-transparent group-hover:border-primary-container pb-1 transition-all duration-150">
              Events <span className="text-[10px] opacity-60 inline-block ml-1">▼</span>
            </Link>
            <div className="absolute top-14 -left-4 bg-surface brutal-border shadow-[4px_4px_0px_0px_var(--primary-container)] w-64 flex-col hidden group-hover:flex z-50">
              <Link href="/#events?branch=All" className="px-4 py-3 border-b-2 border-on-surface hover:bg-primary-container hover:text-on-primary-container transition-colors">All Modules</Link>
              <Link href="/#events?branch=Civil%20Engineering" className="px-4 py-3 border-b-2 border-on-surface hover:bg-primary-container hover:text-on-primary-container transition-colors">Civil Engg.</Link>
              <Link href="/#events?branch=Computer%20Science%20Engineering" className="px-4 py-3 border-b-2 border-on-surface hover:bg-primary-container hover:text-on-primary-container transition-colors">CS Engg.</Link>
              <Link href="/#events?branch=Electrical%20Engineering" className="px-4 py-3 border-b-2 border-on-surface hover:bg-primary-container hover:text-on-primary-container transition-colors">Electrical</Link>
              <Link href="/#events?branch=Mechanical%20%26%20Automation" className="px-4 py-3 border-b-2 border-on-surface hover:bg-primary-container hover:text-on-primary-container transition-colors">Mechanical</Link>
              <Link href="/#events?branch=Electronics%20%26%20Telecom" className="px-4 py-3 border-b-2 border-on-surface hover:bg-primary-container hover:text-on-primary-container transition-colors">Electronics</Link>
              <Link href="/#events?branch=AI%20%26%20Data%20Science" className="px-4 py-3 hover:bg-primary-container border-b-2 border-on-surface hover:text-on-primary-container transition-colors">AI & DS</Link>
              <Link href="/#events?branch=CSE%20(AIML)" className="px-4 py-3 border-b-2 border-on-surface hover:bg-primary-container hover:text-on-primary-container transition-colors">CSE (AIML)</Link>
              <Link href="/#events?branch=Other" className="px-4 py-3 hover:bg-primary-container hover:text-on-primary-container transition-colors">Other</Link>
            </div>
          </div>
          <Link href="/#schedule" className="text-on-surface/60 hover:text-on-surface border-b-4 border-transparent hover:border-primary-container pb-1 transition-all duration-150 py-4">Schedule</Link>
          <Link href="/#workshops" className="text-on-surface/60 hover:text-on-surface border-b-4 border-transparent hover:border-primary-container pb-1 transition-all duration-150 py-4">Workshops</Link>
          <Link href="/leaderboard" className="text-on-surface/60 hover:text-on-surface border-b-4 border-transparent hover:border-primary-container pb-1 transition-all duration-150 py-4 font-black">Leaderboard</Link>
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
            <div className="grid grid-cols-2 gap-4 text-base font-bold text-left px-4 border-l-4 border-primary ml-4">
              <Link href="/#events?branch=Civil%20Engineering" onClick={closeMenu} className="hover:text-primary">Civil Engg.</Link>
              <Link href="/#events?branch=Computer%20Science%20Engineering" onClick={closeMenu} className="hover:text-primary">CS Engg.</Link>
              <Link href="/#events?branch=Electrical%20Engineering" onClick={closeMenu} className="hover:text-primary">Electrical</Link>
              <Link href="/#events?branch=Mechanical%20%26%20Automation" onClick={closeMenu} className="hover:text-primary">Mechanical</Link>
              <Link href="/#events?branch=Electronics%20%26%20Telecom" onClick={closeMenu} className="hover:text-primary">Electronics</Link>
              <Link href="/#events?branch=AI%20%26%20Data%20Science" onClick={closeMenu} className="hover:text-primary">AI & DS</Link>
            </div>
            <Link href="/#schedule" onClick={closeMenu} className="hover:text-primary transition-colors border-b-4 border-on-surface/10 pb-4">Schedule</Link>
            <Link href="/#workshops" onClick={closeMenu} className="hover:text-primary transition-colors border-b-4 border-on-surface/10 pb-4">Workshops</Link>
            <Link href="/leaderboard" onClick={closeMenu} className="hover:text-primary transition-colors border-b-4 border-on-surface/10 pb-4">Leaderboard</Link>
            <Link href="/#gallery" onClick={closeMenu} className="hover:text-primary transition-colors border-b-4 border-on-surface/10 pb-4">Gallery</Link>
            
            <Link href="/dashboard" onClick={closeMenu} className="mt-8 w-full">
              <BrutalButton size="xl" className="w-full">
                Dashboard Access
              </BrutalButton>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
