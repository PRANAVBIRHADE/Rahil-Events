import React from 'react';
import Link from 'next/link';
import BrutalButton from '@/components/ui/BrutalButton';
import CountdownTimer from '@/components/marketing/CountdownTimer';

const Hero = () => {
  return (
    <section className="relative px-6 py-20 md:py-32 max-w-[1440px] mx-auto overflow-hidden">
      <div className="flex flex-col md:flex-row items-start gap-12">
        <div className="w-full md:w-2/3">
          <span className="inline-block px-3 py-1 bg-primary-container brutal-border text-on-primary-container font-display font-bold uppercase text-xs mb-6 tracking-widest">
            Largest Tech Festival at Matoshri
          </span>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-[0.85] mb-8">
            KRATOS<br /><span className="text-primary-container">2026</span>
          </h1>
          <p className="text-xl md:text-2xl font-sans max-w-xl mb-6 border-l-4 border-on-surface pl-6">
            Welcome to the ultimate tech celebration. Experience innovation, compete in exciting events, and build the future with us.
          </p>
          
          <div className="mb-10 w-fit">
            <CountdownTimer />
          </div>
 
          <div className="flex flex-wrap gap-4">
            <Link href="/auth/register">
              <BrutalButton size="lg">Start Registering</BrutalButton>
            </Link>
            <Link href="/events">
              <BrutalButton size="lg" variant="outline">View All Events</BrutalButton>
            </Link>
          </div>
        </div>
        <div className="w-full md:w-1/3 relative">
          <div className="brutal-border p-2 hard-shadow-gold bg-on-surface rotate-3 aspect-square flex items-center justify-center overflow-hidden">
            <img 
              className="w-full h-full object-cover grayscale contrast-125 hover:scale-110 transition-transform duration-500" 
              alt="Technical machinery blueprint and engineering parts close up" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqzdYyF2iEmrG87Zwmc_cylxrpguxn6c7VOcGdZlZiBxK4b2YqBgJpXmQq455XvUk9A856skAmSt3AP9jUWZn8cZRZg9DsZKrESjJoaSePY2A1y_3JztG18AhWUUci7w0IeYKsMTWPIZx_OrsVGMtRtfvoUtvRTwxxd6cSdb-3_RazjewrbN5lwPrYJu5NkkEwN2k6whoLpL_LvIOuceCo1MnpE4aeIlKJJIeNPa_yj2Vr_aFVbTdXFZ55Qz2DDJu46Vxl_VNlBgg" 
            />
          </div>
          <div className="absolute -bottom-8 -left-8 brutal-border bg-primary-container p-6 hidden md:block">
            <p className="font-display font-black text-4xl leading-none">02<br />DAYS</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
