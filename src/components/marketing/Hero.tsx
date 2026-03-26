'use client';

import React from 'react';
import Link from 'next/link';
import BrutalButton from '@/components/ui/BrutalButton';
import CountdownTimer from '@/components/marketing/CountdownTimer';
import Floating3D from '@/components/ui/Floating3D';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative px-6 py-10 md:py-16 max-w-[1440px] mx-auto overflow-hidden">
      {/* 3D Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Floating3D type="grid" className="absolute bottom-0 left-0 w-full h-1/2 opacity-40" />
        <Floating3D type="cube" size={120} className="absolute top-20 right-[10%] opacity-30" delay={2} />
        <Floating3D type="cube" size={60} className="absolute bottom-40 left-[5%] opacity-20" delay={5} />
      </div>

      <div className="flex flex-col md:flex-row items-start gap-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-2/3"
        >
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-3 py-1 bg-primary-container brutal-border text-on-primary-container font-display font-bold uppercase text-xs mb-6 tracking-widest"
          >
            Annual Technical Festival of MPGI Engineering
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
            className="text-5xl md:text-9xl font-black tracking-tighter uppercase leading-[0.85] mb-4 md:mb-8"
          >
            KRATOS<br /><span className="text-primary-container">2026</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-lg md:text-2xl font-sans max-w-xl mb-4 md:mb-6 border-l-4 border-on-surface pl-4 md:pl-6"
          >
            Experience two days of innovation and competition at KRATOS 2026. Engineers test skills, collaborate, and compete across coding, hardware, design, and gaming events.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-6 md:mb-10 w-fit"
          >
            <CountdownTimer />
          </motion.div>
 
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap gap-4"
          >
            <Link href="/auth/register">
              <BrutalButton size="lg">Register Now</BrutalButton>
            </Link>
            <Link href="/#events">
              <BrutalButton size="lg" variant="outline">View All Events</BrutalButton>
            </Link>
          </motion.div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 3 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="w-full md:w-1/3 relative flex justify-center md:justify-end"
        >
          <div className="brutal-border p-1 hard-shadow-gold bg-on-surface w-full md:w-80 h-48 md:h-80 flex items-center justify-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              className="w-full h-full object-contain grayscale contrast-125 hover:scale-105 transition-transform duration-500" 
              alt="Technical machinery blueprint" 
              src="/event-card.png" 
            />
          </div>
          <div className="absolute -bottom-6 -left-6 brutal-border bg-primary-container p-4 md:p-6 hidden md:block">
            <p className="font-display font-black text-3xl md:text-4xl leading-none underline decoration-4">02<br />DAYS</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
