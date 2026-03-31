'use client';

import React from 'react';
import { motion } from 'framer-motion';

const OrganizersSection = () => {
  return (
    <section id="organizers" className="py-24 bg-[#FEFCE8] relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6">
        
        {/* ── HEADER ── */}
        <div className="mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none mb-4"
          >
            ORGANIZERS <span className="text-[#D4AF37]">KRATOS 2026</span>
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4"
          >
            <div className="w-1.5 h-6 bg-[#D4AF37]"></div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D4AF37]">
              MEET THE PEOPLE HELPING RUN THE FESTIVAL
            </p>
          </motion.div>
        </div>

        {/* ── CARDS GRID ── */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { 
              opacity: 1,
              transition: { staggerChildren: 0.2 }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          
          {/* Card 1: Faculty Coordinator */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="p-8 brutal-border bg-white hard-shadow-gold flex flex-col h-full min-h-[350px]"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-6 block">
              FACULTY COORDINATOR
            </span>
            <div className="mb-auto">
              <h3 className="text-2xl font-black uppercase mb-1 tracking-tight">DR L WAGHMARE</h3>
              <p className="text-xs font-bold opacity-60 uppercase mb-6 italic">HEAD OF THE INSTITUTE</p>
              
              <div className="space-y-1 pt-6 border-t border-on-surface/10 font-mono text-[11px] font-bold opacity-70 leading-relaxed uppercase">
                <p>lmwaghmare@yahoo.com</p>
                <p>+91 9822663185</p>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Head Organizer */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="p-8 brutal-border bg-white hard-shadow-gold flex flex-col h-full min-h-[350px]"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-6 block">
              HEAD ORGANIZER
            </span>
            <div className="mb-auto">
              <h3 className="text-2xl font-black uppercase mb-1 tracking-tight">MR LAKHAN RATHOD</h3>
              <p className="text-xs font-bold opacity-60 uppercase mb-6 italic">OUTREACH COORDINATOR</p>
              
              <div className="space-y-1 pt-6 border-t border-on-surface/10 font-mono text-[11px] font-bold opacity-70 leading-relaxed uppercase">
                <p>lakhan180689@gmail.com</p>
                <p>+91 9763433187</p>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Team Members */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="p-8 brutal-border bg-white hard-shadow flex flex-col h-full min-h-[350px]"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-6 block">
              TEAM MEMBERS
            </span>
            
            <div className="space-y-8">
              <div>
                <h4 className="text-lg font-black uppercase leading-none">MR AZHAR AHMED</h4>
                <p className="text-[10px] font-bold opacity-50 uppercase tracking-tighter">NODAL COORDINATOR</p>
                <p className="text-[10px] font-mono opacity-80 mt-1">azhar.ahmed.eep@gmail.com | +91 9272579279</p>
              </div>

              <div className="pt-4 border-t border-on-surface/10">
                <h4 className="text-lg font-black uppercase leading-none">RAHIL HUSSAIN</h4>
                <p className="text-[10px] font-bold opacity-50 uppercase tracking-tighter">FRONTEND DEVELOPER</p>
                <p className="text-[10px] font-mono opacity-80 mt-1 lowercase">https://github.com/Rahil-dope</p>
              </div>

              <div className="pt-4 border-t border-on-surface/10">
                <h4 className="text-lg font-black uppercase leading-none">PRANAV BIRADE</h4>
                <p className="text-[10px] font-bold opacity-50 uppercase tracking-tighter">BACKEND DEVELOPER</p>
                <p className="text-[10px] font-mono opacity-80 mt-1 lowercase">https://github.com/PRANAVBIRHADE</p>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default OrganizersSection;
