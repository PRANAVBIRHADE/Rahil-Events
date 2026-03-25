import React from 'react';
import { cn } from '@/lib/utils';

interface BrutalCardProps {
  children: React.ReactNode;
  className?: string;
  shadow?: boolean;
  shadowColor?: 'black' | 'gold';
  onClick?: () => void;
}

import { motion } from 'framer-motion';

const BrutalCard = ({ 
  children, 
  className, 
  shadow = true, 
  shadowColor = 'black',
  onClick 
}: BrutalCardProps) => {
  return (
    <motion.div 
      onClick={onClick}
      whileHover={onClick ? { scale: 1.02, rotateX: -5, rotateY: 5 } : { scale: 1.01 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "bg-surface brutal-border p-8",
        shadow && shadowColor === 'black' && "hard-shadow",
        shadow && shadowColor === 'gold' && "hard-shadow-gold",
        onClick && "cursor-pointer transition-all tactile-click",
        className
      )}
      style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
    >
      {children}
    </motion.div>
  );
};

export default BrutalCard;
