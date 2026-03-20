import React from 'react';
import Link from 'next/link';
import BrutalButton from '@/components/ui/BrutalButton';

const CTA = () => {
  return (
    <section className="py-32 px-6 bg-on-surface text-surface overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
        <div className="w-full h-full brutal-border border-surface transform rotate-12 translate-x-20"></div>
      </div>
      <div className="max-w-[1440px] mx-auto text-center relative z-10">
        <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-none">
          ENGINEERING IS <br /><span className="text-primary-container">ART IN MOTION</span>
        </h2>
        <p className="text-xl md:text-2xl font-sans max-w-2xl mx-auto mb-12 opacity-80">
          Be part of the most precise technical festival of 2026. Registration closes in 72 hours.
        </p>
        <div className="flex justify-center">
          <Link href="/auth/register">
            <BrutalButton size="xl" className="hard-shadow-gold hover:shadow-[10px_10px_0px_0px_var(--primary-container)]">
              Secure Your Spot
            </BrutalButton>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;
