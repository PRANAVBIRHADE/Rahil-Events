import React from 'react';
import { cn } from '@/lib/utils';

interface BrutalCardProps {
  children: React.ReactNode;
  className?: string;
  shadow?: boolean;
  shadowColor?: 'black' | 'gold';
  onClick?: () => void;
}

const BrutalCard = ({ 
  children, 
  className, 
  shadow = true, 
  shadowColor = 'black',
  onClick 
}: BrutalCardProps) => {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "bg-surface brutal-border p-8",
        shadow && shadowColor === 'black' && "hard-shadow",
        shadow && shadowColor === 'gold' && "hard-shadow-gold",
        onClick && "cursor-pointer hover:-translate-y-1 hover:-translate-x-1 transition-all tactile-click",
        className
      )}
    >
      {children}
    </div>
  );
};

export default BrutalCard;
