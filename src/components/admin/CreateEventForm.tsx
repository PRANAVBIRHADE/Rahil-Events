'use client';

import React, { useState } from 'react';
import BrutalCard from '@/components/ui/BrutalCard';
import BrutalInput from '@/components/ui/BrutalInput';
import BrutalButton from '@/components/ui/BrutalButton';
import { createEvent } from '@/lib/actions';

export default function CreateEventForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const result = await createEvent(formData);

    if (result.success) {
      setMessage({ type: 'success', text: 'MODULE INITIALIZED: NEW EVENT BROADCASTED.' });
      (e.target as HTMLFormElement).reset();
    } else {
      setMessage({ type: 'error', text: result.error || 'COMMUNICATION ERROR: FAILED TO PERSIST MODULE.' });
    }
    setLoading(false);
  }

  return (
    <BrutalCard shadowColor="gold">
      <h3 className="text-xl font-black uppercase mb-6 border-b-2 border-on-surface pb-2 italic">Module Initialization</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {message && (
          <div className={`p-3 border-2 text-[10px] font-bold uppercase italic ${
            message.type === 'success' ? 'bg-green-100 border-green-800 text-green-800' : 'bg-red-100 border-red-800 text-red-800'
          }`}>
            [{message.type === 'success' ? 'SUCCESS' : 'ERROR'}] {message.text}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BrutalInput label="Module Name" name="name" placeholder="e.g. BRIDGE DESIGN" required />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-display font-bold uppercase tracking-widest text-on-surface">Branch</label>
            <select name="branch" className="brutal-border bg-surface p-3 outline-none focus:border-primary font-display font-bold uppercase text-xs">
              <option value="Civil Engineering">Civil Engineering</option>
              <option value="Computer Science Engineering">Computer Science Engineering</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
              <option value="Mechanical & Automation">Mechanical & Automation</option>
              <option value="Electronics & Telecom">Electronics & Telecom</option>
              <option value="AI & Data Science">AI & Data Science</option>
              <option value="CSE (AIML)">CSE (AIML)</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <BrutalInput label="Tagline" name="tagline" placeholder="Engineering the future..." />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <BrutalInput label="Fee (INR)" name="fee" type="number" placeholder="499" required />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-display font-bold uppercase tracking-widest text-on-surface">Format</label>
            <select name="format" className="brutal-border bg-surface p-3 outline-none focus:border-primary font-display font-bold uppercase text-xs h-[46px]">
              <option value="SOLO">SOLO</option>
              <option value="TEAM">TEAM</option>
              <option value="SOLO_TEAM">SOLO / TEAM BOTH</option>
              <option value="SOLO_TEAM_ASSIGNED">SOLO (TEAM ASSIGNED)</option>
            </select>
          </div>
          <BrutalInput label="Max Team Size" name="teamSize" type="number" min="1" max="4" defaultValue="1" />
          <div className="flex items-center gap-3 h-full pt-6">
            <input type="checkbox" name="isCommon" id="isCommon" className="w-5 h-5 accent-primary-container brutal-border cursor-pointer" />
            <label htmlFor="isCommon" className="text-sm font-display font-black uppercase tracking-widest cursor-pointer leading-tight">
              Universal Module<br/><span className="text-[10px] opacity-60">Common for all branches</span>
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-display font-bold uppercase tracking-widest text-on-surface">Description (JSON/Markdown Structure)</label>
          <textarea 
            name="description" 
            rows={3} 
            className="brutal-border bg-surface p-3 outline-none focus:border-primary font-sans font-bold text-sm w-full"
            placeholder="Detailed rules and module objectives..."
          />
        </div>

        <BrutalButton type="submit" className="w-full mt-4" disabled={loading}>
          {loading ? 'UPLOADING...' : 'BROADCAST MODULE'}
        </BrutalButton>
      </form>
    </BrutalCard>
  );
}
