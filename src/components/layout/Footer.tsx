import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="w-full border-t-2 border-on-surface bg-surface-container-low mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center w-full px-4 md:px-8 py-8 md:py-12 gap-4 md:gap-6 max-w-[1440px] mx-auto">
        <div className="font-display font-bold text-lg text-on-surface italic">
          KRATOS 2026
        </div>
        <div className="flex flex-wrap justify-center gap-8 font-sans text-sm tracking-wide">
          <Link href="/contact" className="text-on-surface/70 hover:text-primary transition-colors duration-200">Contact Us</Link>
          <Link href="/privacy" className="text-on-surface/70 hover:text-primary transition-colors duration-200">Privacy Policy</Link>
          <Link href="/terms" className="text-on-surface/70 hover:text-primary transition-colors duration-200">Terms of Service</Link>
          <Link href="/sponsorships" className="text-on-surface/70 hover:text-primary transition-colors duration-200">Sponsorships</Link>
        </div>
        <div className="text-on-surface/70 text-xs font-sans uppercase tracking-widest text-center md:text-right">
          Copyright 2026 KRATOS | Student Department | Matoshri Pratishthan Group of Institutions, Nanded
        </div>
      </div>
    </footer>
  );
};

export default Footer;
