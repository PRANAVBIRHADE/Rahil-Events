"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import BrutalCard from '@/components/ui/BrutalCard';
import BrutalInput from '@/components/ui/BrutalInput';
import BrutalButton from '@/components/ui/BrutalButton';
import { registerUser } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await registerUser(formData);
    setLoading(false);
    
    if (result.error) {
      setError(result.error);
    } else {
      router.push('/auth/login?registered=true');
    }
  }

  return (
    <BrutalCard shadowColor="gold" className="max-w-xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">Register</h1>
        <p className="text-sm opacity-60 font-sans uppercase font-bold tracking-wider italic">Create Personal Participant ID</p>
      </div>

      <div className="mb-6">
        <BrutalButton 
          type="button" 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2"
          onClick={() => {
            setLoading(true);
            signIn('google', { callbackUrl: '/dashboard' });
          }}
          disabled={loading}
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 grayscale contrast-200" />
          JOIN WITH GOOGLE
        </BrutalButton>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="h-[2px] w-full bg-on-surface/10"></div>
        <span className="text-[10px] font-black uppercase text-on-surface/40">OR E-MAIL</span>
        <div className="h-[2px] w-full bg-on-surface/10"></div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border-2 border-red-500 text-red-500 font-bold uppercase text-xs italic">
          Error: {error}
        </div>
      )}

      <form action={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <BrutalInput 
            name="name"
            id="name"
            label="Full Name" 
            placeholder="ADRIAN NEWEY" 
            required 
          />
        </div>
        <BrutalInput 
          name="email"
          id="email"
          label="Email" 
          type="email" 
          placeholder="ADRIAN@F1.COM" 
          required 
        />
        <BrutalInput 
          name="phone"
          id="phone"
          label="Phone Number" 
          type="tel" 
          placeholder="+91 XXXXX XXXXX" 
          required 
        />
        <BrutalInput 
          name="college"
          id="college"
          label="College / Institute" 
          placeholder="MPGI SOE" 
          required 
        />
        <BrutalInput 
          name="branch"
          id="branch"
          label="Department / Branch" 
          placeholder="MECHANICAL" 
          required 
        />
        <div className="md:col-span-2">
          <BrutalInput 
            name="password"
            id="password"
            label="Create Password" 
            type="password" 
            placeholder="••••••••" 
            required 
          />
        </div>

        <div className="md:col-span-2">
          <BrutalButton type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? 'INITIALIZING...' : 'Create Profile'}
          </BrutalButton>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t-2 border-on-surface text-center">
        <p className="text-sm font-sans">
          Already have an ID? <Link href="/auth/login" className="font-bold uppercase border-b-2 border-primary-container">Login</Link>
        </p>
      </div>
    </BrutalCard>
  );
}
