"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import BrutalCard from '@/components/ui/BrutalCard';
import BrutalInput from '@/components/ui/BrutalInput';
import BrutalButton from '@/components/ui/BrutalButton';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const registered = searchParams.get('registered');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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

    setLoading(false);

    if (result?.error) {
      setError('Invalid credentials or system synchronization error.');
    } else {
      router.push('/dashboard');
    }
  }

  return (
    <BrutalCard shadowColor="gold">
      <div className="mb-8">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">Login</h1>
        <p className="text-sm opacity-60 font-sans uppercase font-bold tracking-wider italic">Access Participant Dashboard</p>
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 grayscale contrast-200" />
          CONTINUE WITH GOOGLE
        </BrutalButton>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="h-[2px] w-full bg-on-surface/10 uppercase"></div>
        <span className="text-[10px] font-black uppercase text-on-surface/40">OR E-MAIL</span>
        <div className="h-[2px] w-full bg-on-surface/10"></div>
      </div>

      {registered && (
        <div className="mb-6 p-4 bg-green-100 border-2 border-green-500 text-green-700 font-bold uppercase text-xs italic">
          Profile Created Successfully. Initialize Session Below.
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-100 border-2 border-red-500 text-red-500 font-bold uppercase text-xs italic">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <BrutalInput 
          name="email"
          id="email"
          label="Email Address" 
          type="email" 
          placeholder="ENGINEER@COLLEGE.EDU" 
          required 
        />
        <div className="space-y-1">
          <BrutalInput 
            name="password"
            id="password"
            label="Password" 
            type="password" 
            placeholder="••••••••" 
            required 
          />
          <div className="flex justify-end">
            <Link href="/auth/forgot" className="text-xs font-bold uppercase hover:underline">Forgot Password?</Link>
          </div>
        </div>

        <BrutalButton type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? 'AUTHENTICATING...' : 'Initialize Session'}
        </BrutalButton>
      </form>

      <div className="mt-8 pt-6 border-t-2 border-on-surface text-center">
        <p className="text-sm font-sans">
          No account? <Link href="/auth/register" className="font-bold uppercase border-b-2 border-primary-container">Register Module</Link>
        </p>
      </div>
    </BrutalCard>
  );
}
