import React from 'react';
import BrutalCard from '@/components/ui/BrutalCard';

const AboutSection = () => {
  return (
    <section className="py-24 px-6 max-w-[1440px] mx-auto bg-surface relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/10 rounded-full blur-3xl -z-10 animate-pulse" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <span className="text-xs font-display font-black uppercase tracking-[0.3em] text-primary mb-4 block">Festival Genesis</span>
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic mb-8 leading-none">
            Welcome to <br />
            <span className="text-primary-container">KRATOS 2026</span>
          </h2>
          
          <div className="space-y-6 font-sans text-lg opacity-80 border-l-4 border-on-surface pl-8 leading-relaxed">
            <p>
              <span className="font-bold underline italic">KRATOS 2026</span> is the annual flagship technical festival of <span className="font-black underline">Matoshri Pratishthan Group of Institutions, Nanded</span>. 
              Designed to be more than just a competition, it is a melting pot of ideas, innovation, and engineering excellence.
            </p>
            <p>
              From coding challenges and hardware builds to design, gaming, and problem-solving events, this is where engineers come to test their skills, collaborate, and compete.
            </p>
            <p className="font-bold text-on-surface">
              On <span className="font-black bg-primary-container/20 px-2 italic">20th & 21st April 2026</span>, our campus transforms into a high-octane 
              battleground open to all engineering branches. 
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <BrutalCard className="p-8 flex flex-col items-center justify-center text-center" shadowColor="gold">
            <span className="text-4xl font-black mb-2">10+</span>
            <p className="text-[10px] font-black uppercase tracking-widest">Technical Events</p>
          </BrutalCard>
          <BrutalCard className="p-8 flex flex-col items-center justify-center text-center" shadowColor="black">
            <span className="text-4xl font-black mb-2">₹25K+</span>
            <p className="text-[10px] font-black uppercase tracking-widest">Total Prize Pool</p>
          </BrutalCard>
          <BrutalCard className="p-8 flex flex-col items-center justify-center text-center border-primary bg-primary-container" shadowColor="gold">
            <span className="text-4xl font-black mb-2">200+</span>
            <p className="text-[10px] font-black uppercase tracking-widest text-on-primary-container">Participants</p>
          </BrutalCard>
          <BrutalCard className="p-8 flex flex-col items-center justify-center text-center" shadowColor="black">
            <span className="text-4xl font-black mb-2">02</span>
            <p className="text-[10px] font-black uppercase tracking-widest">Days of Hype</p>
          </BrutalCard>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
