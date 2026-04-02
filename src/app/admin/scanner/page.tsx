import React from 'react';
import Link from 'next/link';
import { requireStaffPageAccess } from '@/lib/authz';
import ScannerWrapper from '@/components/admin/ScannerWrapper';


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

      <ScannerWrapper />
    </div>
  );
}
