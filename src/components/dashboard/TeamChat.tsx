'use client';

import React, { useState, useEffect, useRef } from 'react';
import BrutalCard from '@/components/ui/BrutalCard';
import BrutalInput from '@/components/ui/BrutalInput';
import BrutalButton from '@/components/ui/BrutalButton';
import { sendTeamMessage } from '@/lib/actions';

type TeamChatProps = {
  registrationId: string;
  currentUserId: string;
};

export default function TeamChat({ registrationId, currentUserId }: TeamChatProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/team/${registrationId}/messages`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setMessages(data);
        }
      } catch (err) {
        console.error('Comms error:', err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 4000);
    return () => clearInterval(interval);
  }, [isOpen, registrationId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setLoading(true);
    const content = newMessage;
    setNewMessage('');
    
    const result = await sendTeamMessage(registrationId, content);
    if (result.error) {
       console.error(result.error);
    }
    setLoading(false);
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="text-[10px] font-black uppercase tracking-widest text-primary border-b-2 border-primary hover:text-on-surface hover:border-on-surface transition-colors flex items-center gap-2"
      >
        <span className="material-symbols-outlined text-sm">chat</span>
        Open Team Comms
      </button>
    );
  }

  return (
    <BrutalCard className="mt-4 p-4 border-primary shadow-none bg-primary/5">
      <div className="flex justify-between items-center mb-4 border-b border-primary/20 pb-2">
        <h4 className="text-xs font-black uppercase tracking-tighter text-primary italic">Direct Team Comms</h4>
        <button onClick={() => setIsOpen(false)} className="text-primary hover:text-on-surface">
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      </div>

      <div 
        ref={scrollRef}
        className="h-48 overflow-y-auto space-y-3 mb-4 pr-2 custom-scrollbar"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col ${msg.senderId === currentUserId ? 'items-end' : 'items-start'}`}
          >
            <span className="text-[8px] font-bold uppercase opacity-40 mb-1">{msg.senderName}</span>
            <div 
              className={`max-w-[80%] p-2 brutal-border text-xs ${
                msg.senderId === currentUserId 
                  ? 'bg-primary text-on-primary' 
                  : 'bg-surface text-on-surface'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-[10px] font-bold uppercase opacity-20 text-center py-8 italic tracking-widest">
            Module comms silent. Initialize transmission.
          </p>
        )}
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <input 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="ENTER MESSAGE..."
          className="flex-1 brutal-border bg-surface px-3 py-1.5 text-xs font-mono outline-none focus:border-primary"
        />
        <BrutalButton type="submit" size="sm" disabled={loading}>
          SEND
        </BrutalButton>
      </form>
    </BrutalCard>
  );
}
