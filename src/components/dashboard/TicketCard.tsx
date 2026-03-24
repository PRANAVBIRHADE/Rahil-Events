'use client';

import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import BrutalButton from '@/components/ui/BrutalButton';
import BrutalQRCode from '@/components/ui/BrutalQRCode';
import Link from 'next/link';

type TicketCardProps = {
  reg: {
    id: string;
    status: string | null;
    teamName: string | null;
    eventName: string;
    eventSlug: string;
    format: string | null;
  };
  userName: string;
  college: string | null;
};

export default function TicketCard({ reg, userName, college }: TicketCardProps) {
  const ticketRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadTicket = async () => {
    if (ticketRef.current && !isDownloading) {
      setIsDownloading(true);
      try {
        const canvas = await html2canvas(ticketRef.current, { 
          backgroundColor: '#FFFFFF',
          scale: 2,
          useCORS: true,
          logging: false
        });
        const image = canvas.toDataURL('image/png', 1.0);
        const link = document.createElement('a');
        link.download = `KRATOS_TICKET_${reg.id.substring(0,8)}.png`;
        link.href = image;
        link.click();
      } catch (e) {
        console.error('Failed to generate pass:', e);
        alert('Ticket pipeline failed. Please retry.');
      } finally {
        setIsDownloading(false);
      }
    }
  };

  // Safe generation of the absolute URL for Admin scanning Verification
  const verifyUrl = `https://kratos2026.vercel.app/admin/verify/${reg.id}`;

  const isTeam = reg.format === 'TEAM' || reg.format === 'SOLO_TEAM' || reg.format === 'SOLO_PAIR';

  if (reg.status === 'REJECTED') {
    return (
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border-4 border-red-600 bg-red-50 relative overflow-hidden gap-4 shadow-[4px_4px_0px_0px_#dc2626]">
        <div className="absolute -top-6 -right-6 opacity-10">
          <span className="material-symbols-outlined text-[150px] text-red-600">block</span>
        </div>
        <div className="relative z-10 w-full md:w-auto">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-2xl font-black uppercase text-red-900">{reg.eventName}</h3>
            <span className="px-2 py-0.5 border-2 bg-red-200 text-red-900 border-red-900 text-[10px] font-black uppercase tracking-tighter">ACCESS DENIED</span>
          </div>
          <p className="text-sm font-sans font-bold text-red-800 mb-2">Transaction Verification Failed / Payment Rejected</p>
          <p className="text-xs font-mono opacity-80 text-red-900">REF: {reg.id.substring(0,8)} | Your payment screenshot was marked invalid by Command.</p>
        </div>
        <div className="w-full md:w-auto mt-4 md:mt-0 relative z-10">
          <Link href={`/events/${reg.eventSlug}/register`}>
            <BrutalButton size="sm" className="w-full bg-red-600 hover:bg-red-500 text-white shadow-[4px_4px_0px_0px_black] border-black">
              Retry Registration
            </BrutalButton>
          </Link>
        </div>
      </div>
    );
  }

  if (reg.status === 'PENDING') {
    return (
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 brutal-border bg-yellow-50 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-xl font-black uppercase">{reg.eventName}</h3>
            <span className="px-2 py-0.5 border-2 bg-yellow-200 text-yellow-900 border-yellow-900 text-[10px] font-black uppercase tracking-tighter">PENDING VERIFICATION</span>
          </div>
          <p className="text-xs font-sans opacity-70 italic">
            FORMAT: {isTeam ? `TEAM/PAIR (${reg.teamName || 'NO NAME'})` : 'SOLO'} | REF: <span className="font-mono">{reg.id.substring(0,8)}</span>
          </p>
        </div>
        <div className="w-full md:w-auto">
          <BrutalButton size="sm" variant="outline" className="w-full md:w-auto" disabled>
            <span className="material-symbols-outlined text-sm mr-2 animate-spin">sync</span>
            Processing...
          </BrutalButton>
        </div>
      </div>
    );
  }

  // APPROVED TICKET VIEW
  return (
    <div className="flex flex-col items-center gap-6">
      
      {/* Hidden printable Ticket element for html2canvas */}
      <div className="absolute opacity-0 pointer-events-none z-[-1]" style={{ top: 0, left: 0 }}>
        <div ref={ticketRef} className="w-[1000px] h-[400px] bg-[#FFFFFF] border-[4px] border-[#000000] p-0 relative overflow-hidden font-sans">
          
          {/* Base Design Layer (The Blank Template) */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/ticket-template.png" 
              className="w-full h-full object-cover" 
              alt="template"
            />
          </div>

          {/* Dynamic Overlay Layer (Z-index 10) */}
          <div className="absolute inset-0 z-10 p-0 text-[#1A1C1C]">
            
            {/* 1. Main Content Overlays (Building Section) */}
            <div className="absolute left-[12%] top-[12%] max-w-[50%]">
              <h2 className="text-[64px] font-black uppercase italic tracking-tighter leading-[0.8] drop-shadow-sm" style={{ fontFamily: 'var(--font-display, sans-serif)', color: '#1A1C1C' }}>
                {reg.eventName}
              </h2>
              <p className="text-[#854D00] text-[20px] font-black uppercase tracking-[0.2em] mt-6 italic" style={{ color: '#854D00' }}>
                {isTeam ? 'SQUADRON COMMAND PASS' : 'SOLO OPERATIVE PASS'}
              </p>
            </div>

            {/* User Info Overlays */}
            <div className="absolute left-[12%] top-[52%] space-y-7">
               <div>
                 <p className="text-[10px] font-bold uppercase tracking-widest leading-none mb-1 opacity-60" style={{ color: '#94a3b8' }}>OPERATOR NAME</p>
                 <p className="text-[44px] font-black uppercase leading-none tracking-tighter" style={{ color: '#1A1C1C' }}>{userName}</p>
               </div>
               <div>
                 <p className="text-[10px] font-bold uppercase tracking-widest leading-none mb-1 opacity-60" style={{ color: '#94a3b8' }}>AFFILIATION</p>
                 <p className="text-[22px] font-black uppercase leading-none" style={{ color: '#1A1C1C' }}>{college || 'MPGI SOE'}</p>
               </div>
            </div>

            {/* Verification Code Box (Bottom Right of Building Area) */}
            <div className="absolute right-[28%] bottom-[35px] text-right">
               <p className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-70" style={{ color: '#FFFFFF' }}>VERIFICATIONCODE</p>
               <div className="bg-white border-2 border-black px-4 py-2 shadow-[2px_2px_0px_0px_#000000]">
                  <p className="font-mono text-[16px] font-bold">{reg.id.substring(0,20)}</p>
               </div>
            </div>

            {/* 2. QR/Auth Section Overlays (Right Side) */}
            <div className="absolute right-0 top-0 w-[24.5%] h-full flex flex-col items-center justify-between py-12">
               <div className="text-center">
                 <p className="text-[12px] font-black uppercase tracking-[0.4em] mb-8" style={{ color: '#1A1C1C' }}>MANDATORYSCAN</p>
                 <div className="p-3 border-[3px] border-black bg-white inline-block">
                   <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(verifyUrl)}&color=000000&bgcolor=FFFFFF&format=png&margin=1`}
                      alt="qr"
                      width={160}
                      height={160}
                      className="block"
                   />
                 </div>
               </div>

               <div className="w-full px-6">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 text-center" style={{ color: '#1A1C1C' }}>AUTH TOKEN</p>
                 <p className="text-[7px] font-mono opacity-40 break-all text-center leading-tight mb-4" style={{ color: '#1A1C1C' }}>{verifyUrl.replace('https://', '')}</p>
                 <div className="w-full flex justify-end pr-2">
                    <p className="text-[14px] font-black uppercase italic opacity-60 tracking-tighter" style={{ color: '#1A1C1C' }}>screws</p>
                 </div>
               </div>
            </div>

          </div>
        </div>
      </div>

      {/* Visible Dashboard UI Form */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 brutal-border bg-surface-container-low gap-4 w-full">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-xl font-black uppercase">{reg.eventName}</h3>
            <span className="px-2 py-0.5 border-2 bg-green-200 text-green-900 border-green-900 text-[10px] font-black uppercase tracking-tighter">APPROVED TICKET</span>
          </div>
          <p className="text-xs font-sans opacity-70 italic">
            FORMAT: {isTeam ? `TEAM/PAIR (${reg.teamName || 'NO NAME'})` : 'SOLO'} | REF: <span className="font-mono">{reg.id.substring(0,8)}</span>
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="flex flex-col md:flex-row items-center gap-4 w-full">
            <button
               onClick={downloadTicket}
               disabled={isDownloading}
               className={`w-full md:w-auto px-6 py-3 bg-primary text-on-primary font-display font-black tracking-widest uppercase border-2 border-on-surface shadow-[4px_4px_0px_0px_var(--on-surface)] transition-all flex items-center justify-center ${isDownloading ? 'opacity-50' : 'hover:translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_var(--on-surface)]'}`}
            >
              <span className={`material-symbols-outlined mr-2 ${isDownloading ? 'animate-spin' : ''}`}>
                 {isDownloading ? 'sync' : 'download'}
              </span>
              {isDownloading ? 'Encoding Image...' : 'Download Pass'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
