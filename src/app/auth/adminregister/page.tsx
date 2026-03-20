'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import BrutalCard from '@/components/ui/BrutalCard';
import BrutalInput from '@/components/ui/BrutalInput';
import BrutalButton from '@/components/ui/BrutalButton';
import { registerAdmin } from '@/lib/actions';
import { useRouter } from 'next/navigation';

export default function AdminRegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await registerAdmin(formData);
    setLoading(false);
    
    if (result.error) {
      setError(`[ERROR] ${result.error}`);
    } else {
      router.push('/auth/adminlogin?registered=true');
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20 bg-on-surface">
      <div className="w-full max-w-md">
        <header className="mb-8 text-center">
          <div className="inline-block bg-primary-container px-3 py-1 mb-4">
            <span className="text-on-primary-container font-display font-black text-xs tracking-widest uppercase">New Commander Init</span>
          </div>
          <h1 className="text-4xl font-black text-surface tracking-tighter uppercase italic">
            Command Center<br/>Registry
          </h1>
        </header>

        <BrutalCard shadowColor="black" className="bg-surface-container-low">
          <form action={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-100 border-2 border-red-800 text-red-800 text-xs font-bold uppercase italic animate-pulse">
                {error}
              </div>
            )}
            
            <BrutalInput 
              label="Commander Designator (Name)" 
              name="name" 
              type="text" 
              placeholder="E.G. CHIEF OPERATIONS"
              required 
            />

            <BrutalInput 
              label="Admin Module Identifier (Email)" 
              name="email" 
              type="email" 
              placeholder="newadmin@kratos.fest"
              required 
            />
            
            <BrutalInput 
              label="Security Override Key (Password)" 
              name="password" 
              type="password" 
              placeholder="••••••••"
              required 
            />

            <BrutalButton 
              type="submit" 
              className="w-full mt-4" 
              size="lg"
              disabled={loading}
            >
              {loading ? 'INITIALIZING...' : 'ESTABLISH CLEARANCE'}
            </BrutalButton>
          </form>

          <div className="mt-8 pt-6 border-t-2 border-on-surface/10 text-center">
             <Link href="/auth/adminlogin" className="text-[10px] font-black uppercase text-primary hover:underline block">
              &larr; Abort & Return to Admin Login
            </Link>
          </div>
        </BrutalCard>
      </div>
    </div>
  );
}
