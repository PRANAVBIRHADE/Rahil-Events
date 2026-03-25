import React from 'react';
import { cn } from '@/lib/utils';

interface BrutalQRCodeProps {
  data: string;
  size?: number;
  className?: string;
}

const BrutalQRCode = ({ data, size = 200, className }: BrutalQRCodeProps) => {
  // Using a public QR generation API for the demonstration
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}&color=1A1C1C&bgcolor=F9F9F9&format=png&margin=1`;

  return (
    <div className={cn(
      "brutal-border p-3 bg-white hard-shadow-gold inline-block",
      className
    )}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src={qrUrl} 
        alt={`QR Code for ${data}`} 
        width={size} 
        height={size}
        className="grayscale contrast-125"
      />
      <div className="mt-2 text-center">
        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Auth Token</p>
        <p className="text-[8px] font-mono truncate max-w-[150px] mx-auto opacity-40">{data}</p>
      </div>
    </div>
  );
};

export default BrutalQRCode;
