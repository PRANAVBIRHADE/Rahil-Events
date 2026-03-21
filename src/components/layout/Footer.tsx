import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="w-full border-t-2 border-on-surface bg-surface-container-low mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center w-full px-8 py-12 gap-6 max-w-[1440px] mx-auto">
        <div className="font-display font-bold text-lg text-on-surface italic">
          KRATOS 2026
        </div>
        <div className="flex flex-wrap justify-center gap-8 font-sans text-sm tracking-wide">
          <Link href="#" className="text-on-surface/70 hover:text-primary transition-colors duration-200">Contact Us</Link>
          <Link href="#" className="text-on-surface/70 hover:text-primary transition-colors duration-200">Privacy Policy</Link>
          <Link href="#" className="text-on-surface/70 hover:text-primary transition-colors duration-200">Terms of Service</Link>
          <Link href="#" className="text-on-surface/70 hover:text-primary transition-colors duration-200">Sponsorships</Link>
        </div>
        <div className="text-on-surface/70 text-xs font-sans uppercase tracking-widest text-center md:text-right">
          © 2026 KRATOS TECHNICAL FESTIVAL. ENGINEERED FOR PRECISION.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
