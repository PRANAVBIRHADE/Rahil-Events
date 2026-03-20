'use client';

import React, { useState } from 'react';
import BrutalCard from '@/components/ui/BrutalCard';
import BrutalInput from '@/components/ui/BrutalInput';
import BrutalButton from '@/components/ui/BrutalButton';
import { completeProfile } from '@/lib/actions';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ProfileCompletionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (status === 'loading') return <div className="p-12 font-black uppercase tracking-widest animate-pulse">Scanning Session...</div>;
  if (!session?.user) {
    router.push('/auth/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    if (!session?.user?.email) return;
    formData.append('email', session.user.email);
    
    const res = await completeProfile(formData);
    
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl">
        <BrutalCard shadow={true} shadowColor="gold">
           <div className="mb-8 border-b-4 border-on-surface pb-6">
             <span className="inline-block bg-primary-container text-on-primary-container px-3 py-1 brutal-border mb-4 font-display font-black text-xs uppercase tracking-widest animate-pulse">
               Identity Incomplete
             </span>
             <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-2">
               Parameter<br />Acquisition
             </h1>
             <p className="font-sans font-bold opacity-70 border-l-4 border-primary pl-4 uppercase text-xs mt-4">
               Welcome Commander <span className="text-primary">{session.user.name}</span>.<br/>Your external secure login via Google was successful, however your institutional clearance parameters are missing. You must provide them to unlock terminal access.
             </p>
           </div>

           {error && (
             <div className="bg-red-100 text-red-800 border-2 border-red-800 p-3 mb-6 font-bold text-xs uppercase tracking-widest">
               [ERROR]: {error}
             </div>
           )}

           <form onSubmit={handleSubmit} className="space-y-6">
             <BrutalInput 
               label="College / Institution" 
               name="college" 
               placeholder="Imperial Institute of Technology" 
               required 
             />
             <div className="flex flex-col gap-2">
               <label className="text-sm font-display font-bold uppercase tracking-widest text-on-surface">Branch / Specialization</label>
               <select name="branch" required className="brutal-border bg-surface p-3 outline-none focus:border-primary font-display font-bold uppercase">
                 <option value="">-- SELECT SPECIALIZATION --</option>
                 <option value="Computer Engineering">Computer Engineering</option>
                 <option value="Information Technology">Information Technology</option>
                 <option value="Artificial Intelligence & Data Science">AI & Data Science</option>
                 <option value="Electronics & Telecommunication">E&TC</option>
                 <option value="Mechanical Engineering">Mechanical Engineering</option>
                 <option value="Civil Engineering">Civil Engineering</option>
                 <option value="Other">Other</option>
               </select>
             </div>
             <BrutalInput 
               label="Contact Number" 
               name="phone" 
               type="tel"
               placeholder="+91 00000 00000" 
               required 
             />

             <BrutalButton type="submit" size="xl" className="w-full mt-4" disabled={loading}>
               {loading ? 'WRITING TO MAINFRAME...' : 'SECURE IDENTITY'}
             </BrutalButton>
           </form>
        </BrutalCard>
      </div>
    </div>
  );
}
