import React from 'react';
import { cn } from '@/lib/utils'; // I'll need to create this helper

interface BrutalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const BrutalButton = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: BrutalButtonProps) => {
  const variants = {
    primary: 'bg-primary-container text-on-primary-container hard-shadow-gold hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
    secondary: 'bg-secondary-container text-foreground hard-shadow hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
    outline: 'bg-surface text-foreground hover:bg-surface-container-low',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-10 py-4 text-xl',
    xl: 'px-16 py-6 text-2xl',
  };

  return (
    <button
      className={cn(
        'brutal-border font-display font-black uppercase tracking-tight transition-all tactile-click',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default BrutalButton;
