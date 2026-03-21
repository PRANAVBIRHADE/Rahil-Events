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
          backgroundColor: '#F9F9F9',
          scale: 2
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
  const verifyUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/admin/verify/${reg.id}` 
    : `https://kratos2026.vercel.app/admin/verify/${reg.id}`;

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
        <div ref={ticketRef} className="w-[800px] h-[300px] bg-[#F9F9F9] border-4 border-black p-0 flex relative overflow-hidden font-sans">
          {/* Left Tear Section */}
          <div className="w-16 border-r-4 border-black border-dashed flex items-center justify-center relative bg-primary-container">
             <p className="transform -rotate-90 whitespace-nowrap font-black uppercase text-xl font-display tracking-widest">
               KRATOS 2026 OFFICIAL
             </p>
          </div>
          
          {/* Main Info */}
          <div className="flex-1 p-8 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                 <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">{reg.eventName}</h2>
                 <span className="bg-black text-white px-2 py-1 font-black text-xs uppercase tracking-widest">ADMIT ONE</span>
              </div>
              <p className="font-display font-bold uppercase text-primary text-sm tracking-widest">{isTeam ? 'Squadron Command Pass' : 'Solo Operative Pass'}</p>
            </div>
            
            <div className="mt-6 flex justify-between items-end">
              <div className="space-y-2">
                <div>
                  <p className="text-[10px] font-bold uppercase opacity-50">OPERATOR NAME</p>
                  <p className="text-lg font-black uppercase">{userName}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase opacity-50">AFFILIATION</p>
                  <p className="text-sm font-bold uppercase">{college || 'UNKNOWN'}</p>
                </div>
                {isTeam && (
                  <div>
                    <p className="text-[10px] font-bold uppercase opacity-50">SQUADRON</p>
                    <p className="text-sm font-bold uppercase text-primary-container bg-black px-1 inline-block">{reg.teamName}</p>
                  </div>
                )}
              </div>
              <div className="text-right">
                  <p className="text-[10px] font-bold uppercase opacity-50 mb-1">VERIFICATION CODE</p>
                  <p className="font-mono text-sm font-bold bg-gray-200 px-2 py-1">{reg.id.substring(0,18)}</p>
              </div>
            </div>
          </div>
          
          {/* Right QR Section */}
          <div className="w-[250px] border-l-4 border-black p-6 flex flex-col items-center justify-center bg-white relative">
            <div className="absolute top-2 left-2 right-2 flex justify-between">
               <span className="w-2 h-2 bg-black rounded-full block"></span>
               <span className="w-2 h-2 bg-black rounded-full block"></span>
            </div>
            <div className="absolute bottom-2 left-2 right-2 flex justify-between">
               <span className="w-2 h-2 bg-black rounded-full block"></span>
               <span className="w-2 h-2 bg-black rounded-full block"></span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest mb-4">MANDATORY SCAN</p>
            <BrutalQRCode data={verifyUrl} size={150} />
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
