'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import BrutalCard from '@/components/ui/BrutalCard';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminScannerPage() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
        supportedScanTypes: [0] // 0 = Html5QrcodeScanType.SCAN_TYPE_CAMERA
      },
      /* verbose= */ false
    );

    function onScanSuccess(decodedText: string, decodedResult: any) {
      // The QR data is a URL like: https://kratos2026.vercel.app/admin/checkin/uuid
      setScanResult(decodedText);
      try {
        const url = new URL(decodedText);
        const pathParts = url.pathname.split('/');
        const id = pathParts[pathParts.length - 1];
        
        if (id && url.pathname.includes('/admin/checkin/')) {
          router.push(`/admin/checkin/${id}`);
          scanner.clear();
        } else {
          setError('Detected invalid QR format for Kratos Platform.');
        }
      } catch (e) {
        setError('Invalid URL detected in QR scan.');
      }
    }

    function onScanFailure(error: any) {
      // We ignore scan failures as they happen continuously during scanning
    }

    scanner.render(onScanSuccess, onScanFailure);

    return () => {
      scanner.clear().catch(err => console.error("Failed to clear scanner", err));
    };
  }, [router]);

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-12">
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-2 italic text-on-surface">Scanner Terminal</h1>
          <p className="font-display font-bold uppercase text-primary tracking-widest text-sm">Entry Point Verification System</p>
        </div>
        <Link href="/admin/dashboard" className="border-b-2 border-on-surface font-black uppercase text-xs hover:text-primary hover:border-primary transition-colors text-on-surface">
          &larr; Return to HQ
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <BrutalCard className="p-0 overflow-hidden" shadowColor="black">
          <div className="p-4 bg-on-surface text-surface flex justify-between items-center">
            <span className="text-xs font-black uppercase tracking-[0.2em]">Active Optics</span>
            <div className="flex gap-1">
               <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
               <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            </div>
          </div>
          <div id="reader" className="w-full bg-black min-h-[400px]"></div>
          <div className="p-4 bg-surface-container-low text-[10px] font-mono opacity-60 uppercase text-on-surface">
            Status: System Ready. Align QR in optical reticle.
          </div>
        </BrutalCard>

        <div className="space-y-6 text-on-surface">
          <BrutalCard shadow={true}>
             <h2 className="font-black uppercase text-xl mb-4 border-b-2 border-on-surface pb-2 italic">Operation Manual</h2>
             <ul className="space-y-3 font-sans text-sm">
                <li className="flex gap-3">
                   <span className="font-display font-black text-primary">01</span>
                   <span>Instruct the operator to display their digital pass.</span>
                </li>
                <li className="flex gap-3">
                   <span className="font-display font-black text-primary">02</span>
                   <span>Align the pass QR within the scanner boundaries.</span>
                </li>
                <li className="flex gap-3">
                   <span className="font-display font-black text-primary">03</span>
                   <span>Wait for automatic redirect to confirmation terminal.</span>
                </li>
                <li className="flex gap-3">
                   <span className="font-display font-black text-primary">04</span>
                   <span>Verify identity and execute **CHECK-IN** protocol.</span>
                </li>
             </ul>
          </BrutalCard>

          {error && (
            <div className="p-6 border-4 border-red-600 bg-red-50 text-red-900 hard-shadow-gold italic">
               <h3 className="font-black uppercase mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined">warning</span> SCAN ERROR
               </h3>
               <p className="text-sm font-bold">{error}</p>
               <button 
                onClick={() => setError(null)}
                className="mt-4 text-[10px] font-black uppercase border-b-2 border-red-900"
               >
                 Clear Error
               </button>
            </div>
          )}

          {scanResult && !error && (
            <div className="p-6 border-4 border-green-600 bg-green-50 text-green-900 hard-shadow-gold italic">
               <h3 className="font-black uppercase mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined">check_circle</span> DETECTED ID
               </h3>
               <p className="text-xs font-mono break-all opacity-70">{scanResult}</p>
               <p className="mt-4 text-xs font-bold uppercase">Redirecting to Authorization Service...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
