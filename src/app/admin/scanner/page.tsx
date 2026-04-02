import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { requireStaffPageAccess } from '@/lib/authz';

const ScannerComponent = dynamic(() => import('@/components/admin/ScannerComponent'), {
  ssr: false,
  loading: () => (
    <div className="border-4 border-on-surface p-12 text-center bg-surface-container-low">
      <div className="animate-spin text-4xl mb-4">...</div>
      <p className="text-sm font-black uppercase tracking-widest">Warming Up Terminal...</p>
    </div>
  ),
});

export default async function AdminScannerPage() {
  await requireStaffPageAccess();

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">Entry Terminal</h1>
          <p className="font-display font-bold uppercase text-primary tracking-widest text-xs">Awaiting Transmission Scan</p>
        </div>
        <Link href="/admin/registrations" className="border-b-2 border-on-surface font-black uppercase text-[10px] hover:text-primary hover:border-primary transition-colors">
          &larr; Abort Terminal
        </Link>
      </div>

      <ScannerComponent />
    </div>
  );
}
