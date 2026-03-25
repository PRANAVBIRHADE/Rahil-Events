'use client';

import React from 'react';
import Floating3D from './Floating3D';
import { motion } from 'framer-motion';

const GlobalMotionLayer = () => {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden opacity-30">
      {/* Scattered background elements */}
      <Floating3D 
        type="cube" 
        size={40} 
        className="absolute top-[15%] left-[5%]" 
        delay={1} 
      />
      <Floating3D 
        type="pyramid" 
        size={60} 
        className="absolute top-[25%] right-[8%]" 
        delay={4} 
      />
      <Floating3D 
        type="cube" 
        size={30} 
        className="absolute bottom-[20%] left-[12%]" 
        delay={2} 
      />
      <Floating3D 
        type="pyramid" 
        size={50} 
        className="absolute bottom-[10%] right-[15%]" 
        delay={7} 
      />
      
      {/* Abstract floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-primary rounded-full"
          initial={{ 
            x: Math.random() * 100 + '%', 
            y: Math.random() * 100 + '%',
            opacity: 0.2
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, 50, 0],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 10 + Math.random() * 20,
            repeat: Infinity,
            ease: "linear",
            delay: i * 2
          }}
        />
      ))}
    </div>
  );
};

export default GlobalMotionLayer;
