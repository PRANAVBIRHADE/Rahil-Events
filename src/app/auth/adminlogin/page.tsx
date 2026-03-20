'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import BrutalCard from '@/components/ui/BrutalCard';
import BrutalInput from '@/components/ui/BrutalInput';
import BrutalButton from '@/components/ui/BrutalButton';

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('AUTHORIZATION FAILED: INVALID SECURITY CLEARANCE');
    } else {
      window.location.href = '/admin/dashboard';
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20 bg-on-surface">
      <div className="w-full max-w-md">
        <header className="mb-8 text-center">
          <div className="inline-block bg-primary px-3 py-1 mb-4">
            <span className="text-on-primary font-display font-black text-xs tracking-widest uppercase">Level 4 Clearance Required</span>
          </div>
          <h1 className="text-4xl font-black text-surface tracking-tighter uppercase italic">
            Command Center<br/>Access
          </h1>
        </header>

        <BrutalCard shadowColor="black" className="bg-surface-container-low">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-100 border-2 border-red-800 text-red-800 text-xs font-bold uppercase italic animate-pulse">
                [ERROR] {error}
              </div>
            )}
            
            <BrutalInput 
              label="Admin Module Identifier (Email)" 
              name="email" 
              type="email" 
              placeholder="admin@kratos.fest"
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
              className="w-full mt-8" 
              size="lg"
              disabled={loading}
            >
              {loading ? 'AUTHENTICATING...' : 'INITIALIZE SESSION'}
            </BrutalButton>
          
            <div className="mt-8 text-center">
              <Link href="/auth/adminregister" className="text-xs font-black uppercase tracking-widest opacity-50 hover:opacity-100 hover:text-primary underline">
                AUTHORIZE NEW COMMANDER &rarr;
              </Link>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t-2 border-on-surface/10 text-center space-y-4">
            <p className="text-[10px] font-display font-bold uppercase opacity-60 tracking-widest text-on-surface">
              Unauthorized access to this terminal is strictly prohibited.
            </p>
            <div className="flex flex-col gap-3 items-center">
              <Link href="/auth/adminregister" className="text-xs font-black uppercase text-on-surface border-b-2 border-on-surface hover:bg-on-surface hover:text-surface transition-colors px-2">
                Initialize New Commander Profile
              </Link>
              <Link href="/auth/login" className="text-[10px] font-black uppercase text-primary hover:underline">
                Return to Standard Participant Login
              </Link>
            </div>
          </div>
        </BrutalCard>
      </div>
    </div>
  );
}
