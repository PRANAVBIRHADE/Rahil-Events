import React from 'react';
import BrutalCard from '@/components/ui/BrutalCard';

const Gallery = () => {
  const visuals = [
    { title: 'Neural Overlay', type: 'DATA' },
    { title: 'Steel Frame', type: 'MECH' },
    { title: 'Signal Burst', type: 'CORE' },
    { title: 'Logic Gates', type: 'COMP' },
  ];

  return (
    <section id="gallery" className="py-24 px-6 max-w-[1440px] mx-auto border-t-2 border-on-surface">
      <div className="mb-16">
        <h2 className="text-5xl font-black uppercase italic mb-4">Operational Visuals</h2>
        <p className="font-display font-bold text-primary tracking-widest uppercase text-xs">Captured Frequency // 2026</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {visuals.map((vis, i) => (
          <BrutalCard key={i} className="flex flex-col gap-4 aspect-square group overflow-hidden" shadowColor="black">
            <div className="bg-on-surface/10 w-full h-full flex items-center justify-center relative">
               <span className="material-symbols-outlined text-6xl opacity-20 group-hover:scale-110 transition-transform duration-300">image</span>
               <div className="absolute top-4 left-4 border-l-2 border-primary pl-2">
                 <span className="text-[10px] font-black uppercase tracking-widest">{vis.type}</span>
               </div>
            </div>
            <div className="p-2 border-t border-on-surface/10">
              <h3 className="font-display font-black uppercase text-sm italic">{vis.title}</h3>
            </div>
          </BrutalCard>
        ))}
      </div>
    </section>
  );
};

export default Gallery;
