'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const ScannerComponent = dynamic(() => import('@/components/admin/ScannerComponent'), {
  ssr: false,
  loading: () => (
    <div className="border-4 border-on-surface p-12 text-center bg-surface-container-low">
      <div className="animate-spin text-4xl mb-4">...</div>
      <p className="text-sm font-black uppercase tracking-widest">Warming Up Terminal...</p>
    </div>
  ),
});

export default function ScannerWrapper() {
  return <ScannerComponent />;
}
