'use client';

import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import BrutalCard from '@/components/ui/BrutalCard';

export default function ScannerComponent() {
  const [scanResult, setScanResult] = useState<string | null>(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'reader',
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
        aspectRatio: 1.0
      },
      /* verbose= */ false
    );

    const onScanSuccess = (decodedText: string) => {
      const trimmed = decodedText.trim();
      scanner.clear();
      setScanResult(trimmed);
      
      const userRouteMarker = '/admin/checkin/user/';
      const registrationRouteMarker = '/admin/checkin/';

      if (trimmed.includes(userRouteMarker)) {
        const id = trimmed.split(userRouteMarker).pop()?.split(/[?#]/)[0]?.trim();
        window.location.href = `${userRouteMarker}${id}`;
      } else if (trimmed.includes(registrationRouteMarker)) {
        const id = trimmed.split(registrationRouteMarker).pop()?.split(/[?#]/)[0]?.trim();
        window.location.href = `${registrationRouteMarker}${id}`;
      } else {
        alert('INVALID QR: Protocol mismatch. This is not a Kratos Entry Pass.');
        window.location.reload();
      }
    };

    const onScanFailure = () => {
      // ignore
    };

    scanner.render(onScanSuccess, onScanFailure);

    return () => {
      scanner.clear().catch(err => console.error('Failed to clear scanner', err));
    };
  }, []);

  return (
    <BrutalCard className="p-0 overflow-hidden" shadowColor="black">
      <div className="bg-on-surface text-surface p-4 flex justify-between items-center">
         <span className="text-[10px] font-black uppercase tracking-widest">Digital Sentry V1.0</span>
         <div className="flex gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-75"></span>
         </div>
      </div>
      
      <div className="p-6 bg-surface">
        <div id="reader" className="w-full border-4 border-on-surface overflow-hidden"></div>
      </div>

      <div className="p-6 bg-surface-container-low border-t-4 border-on-surface">
        <h3 className="text-sm font-black uppercase mb-2">Instructions:</h3>
        <ul className="text-xs font-bold uppercase opacity-70 space-y-2">
           <li>1. Grant camera permissions when prompted.</li>
           <li>2. Align the participant&apos;s QR code within the frame.</li>
           <li>3. Scanner will automatically redirect to verification.</li>
        </ul>
      </div>
      
      {scanResult && (
        <div className="p-4 border-t-2 border-primary bg-primary/10 font-mono text-[9px] break-all">
          LAST_DECODED: {scanResult}
        </div>
      )}
    </BrutalCard>
  );
}
