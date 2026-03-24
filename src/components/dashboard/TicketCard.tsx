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
        <div ref={ticketRef} className="w-[1000px] h-[400px] bg-[#FFFFFF] border-[5px] border-[#000000] p-0 flex relative overflow-hidden font-sans text-[#1A1C1C]">
          
          {/* 1. Yellow Sidebar */}
          <div className="w-24 bg-[#FFD100] border-r-[3px] border-[#000000] border-dashed flex items-center justify-center relative">
             <div className="absolute inset-0 border-r-[8px] border-[#FFD100] z-10"></div>
             <div className="flex items-center justify-center transform -rotate-90 whitespace-nowrap z-20">
               <p className="font-black uppercase text-[38px] tracking-tight text-[#000000] font-sans italic" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}>
                 OFFICIAL 2026 KRATOS
               </p>
             </div>
          </div>
          
          {/* 2. Main Module Info with Background */}
          <div className="flex-1 relative flex flex-col justify-between overflow-hidden bg-white">
            {/* Background Building Graphic */}
            <div className="absolute inset-0 z-0">
              <img 
                src="/ticket-bg.png" 
                className="w-full h-full object-cover" 
                alt="bg"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)' }}></div>
            </div>

            <div className="relative z-10 p-10 flex flex-col h-full justify-between">
              <div>
                <div className="flex justify-between items-start">
                   <div className="max-w-[65%]">
                      <h2 className="text-[68px] font-black uppercase italic tracking-tighter leading-[0.85] text-[#1A1C1C]" style={{ letterSpacing: '-0.02em' }}>
                        {reg.eventName}
                      </h2>
                      <p className="font-sans font-black uppercase text-[#854D00] text-2xl tracking-[0.1em] mt-8 opacity-90 italic">
                        {isTeam ? 'SQUADRON COMMAND PASS' : 'SOLO OPERATIVE PASS'}
                      </p>
                   </div>
                   <div className="text-right flex flex-col items-end">
                      <div className="relative">
                        <h3 className="text-[64px] font-black uppercase italic tracking-tighter text-[#1A1C1C] leading-none">
                          KRATOS
                        </h3>
                      </div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.15em] mt-2 text-[#000000]">Technical B.Tech College Event</p>
                   </div>
                </div>
              </div>
              
              <div className="flex justify-between items-end mb-2">
                <div className="space-y-8">
                  <div className="flex flex-col">
                    <span className="text-[12px] font-bold uppercase tracking-[0.1em] mb-1" style={{ color: '#94a3b8' }}>OPERATOR NAME</span>
                    <span className="text-[42px] font-black uppercase leading-none tracking-tighter" style={{ color: '#1A1C1C' }}>{userName}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12px] font-bold uppercase tracking-[0.1em] mb-1" style={{ color: '#94a3b8' }}>AFFILIATION</span>
                    <span className="text-2xl font-black uppercase leading-none" style={{ color: '#1A1C1C' }}>{college || 'MPGI SOE'}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-[11px] font-bold uppercase text-white tracking-[0.1em] mb-1 drop-shadow-md">VERIFICATIONCODE</span>
                    <div className="bg-[#FFFFFF] px-6 py-2 border-2 border-[#000000] shadow-[0px_0px_0px_2px_white]">
                      <p className="font-mono text-xl font-bold tracking-tight">{reg.id.substring(0,20)}</p>
                    </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 3. QR Authentication Block */}
          <div className="w-[320px] border-l-[4px] border-[#000000] p-10 flex flex-col items-center justify-between bg-[#FFFFFF] relative">
            {/* Corner Rivets */}
            <div className="absolute top-4 left-4 w-4 h-4 bg-[#1A1C1C] rounded-full border" style={{ borderColor: '#9ca3af' }}></div>
            <div className="absolute top-4 right-4 w-4 h-4 bg-[#1A1C1C] rounded-full border" style={{ borderColor: '#9ca3af' }}></div>
            <div className="absolute bottom-4 left-4 w-4 h-4 bg-[#1A1C1C] rounded-full border" style={{ borderColor: '#9ca3af' }}></div>
            <div className="absolute bottom-4 right-4 w-4 h-4 bg-[#1A1C1C] rounded-full border" style={{ borderColor: '#9ca3af' }}></div>

            <div className="text-center w-full mt-4">
              <p className="text-[13px] font-black uppercase tracking-[0.4em] mb-8">MANDATORYSCAN</p>
              <div className="p-4 border-[3px] border-[#1A1C1C] bg-white inline-block">
                <img 
                   src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(verifyUrl)}&color=000000&bgcolor=FFFFFF&format=png&margin=1`}
                   alt="verify-qr"
                   width={180}
                   height={180}
                   className="block"
                />
              </div>
            </div>

            <div className="text-center w-full">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] mb-1 leading-none">AUTH TOKEN</p>
              <p className="text-[8px] font-mono opacity-30 break-all max-w-[200px] mx-auto mb-6">{verifyUrl.replace('https://', '')}</p>
              <div className="w-full flex justify-end pr-2">
                 <p className="text-[16px] font-black uppercase italic opacity-80 font-sans tracking-tight">screws</p>
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
