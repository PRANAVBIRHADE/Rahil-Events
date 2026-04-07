'use client';

import React, { useState } from 'react';
import BrutalCard from '@/components/ui/BrutalCard';
import Link from 'next/link';
import { bulkUpdateRegistrationStatus, bulkDeleteRegistrations } from '@/lib/actions';
import BrutalButton from '@/components/ui/BrutalButton';

type Registration = {
  id: string;
  participantName: string;
  participantEmail: string;
  eventName: string;
  eventId: string;
  amount: number | null;
  status: string | null;
  createdAt: Date | null;
  transactionId: string | null;
  teamId: string | null;
  teamName: string | null;
};

type TeamMember = {
  id: string;
  teamId: string;
  name: string;
  college: string | null;
  phone: string | null;
};

type Props = {
  registrations: Registration[];
  teamMembers: TeamMember[];
  canManageRegistrations?: boolean;
};

export default function TrafficRegistryClient({ registrations, teamMembers, canManageRegistrations = true }: Props) {
  const [activeTab, setActiveTab] = useState<'ALL' | 'EVENTS' | 'TEAMS'>('ALL');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === registrations.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(registrations.map(r => r.id)));
  };

  const handleBulkAction = async (status: 'APPROVED' | 'REJECTED') => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Are you sure you want to ${status.toLowerCase()} ${selectedIds.size} registrations?`)) return;
    
    setIsUpdating(true);
    const result = await bulkUpdateRegistrationStatus(Array.from(selectedIds), status);
    if ('error' in result) alert(result.error);
    else {
      alert(`Successfully updated ${selectedIds.size} records.`);
      setSelectedIds(new Set());
    }
    setIsUpdating(false);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`WARNING: You are about to DELETE ${selectedIds.size} registrations. This cannot be undone. Proceed?`)) return;
    
    setIsUpdating(true);
    const result = await bulkDeleteRegistrations(Array.from(selectedIds));
    if ('error' in result) alert(result.error);
    else {
      alert(`Successfully deleted ${selectedIds.size} records.`);
      setSelectedIds(new Set());
    }
    setIsUpdating(false);
  };

  // Group by Event
  const eventsMap = new Map<string, { name: string; regs: Registration[] }>();
  registrations.forEach(reg => {
    if (!eventsMap.has(reg.eventId)) {
      eventsMap.set(reg.eventId, { name: reg.eventName, regs: [] });
    }
    eventsMap.get(reg.eventId)!.regs.push(reg);
  });

  // Group by Team
  const teamsMap = new Map<string, { name: string; leader: Registration; members: TeamMember[] }>();
  registrations.forEach(reg => {
    if (reg.teamId) {
      if (!teamsMap.has(reg.teamId)) {
        teamsMap.set(reg.teamId, { 
          name: reg.teamName || 'Unnamed Team', 
          leader: reg, 
          members: teamMembers.filter(m => m.teamId === reg.teamId) 
        });
      }
    }
  });

  return (
    <div className="space-y-8">
      {/* Tab Selectors */}
      <div className="flex border-4 border-on-surface bg-surface overflow-hidden">
        <button 
          onClick={() => setActiveTab('ALL')}
          className={`flex-1 py-4 font-black uppercase tracking-widest text-sm transition-all ${activeTab === 'ALL' ? 'bg-on-surface text-surface' : 'hover:bg-primary-container/20'}`}
        >
          All Packets
        </button>
        <button 
          onClick={() => setActiveTab('EVENTS')}
          className={`flex-1 py-4 font-black uppercase tracking-widest text-sm border-x-4 border-on-surface transition-all ${activeTab === 'EVENTS' ? 'bg-on-surface text-surface' : 'hover:bg-primary-container/20'}`}
        >
          Events Roster
        </button>
        <button 
          onClick={() => setActiveTab('TEAMS')}
          className={`flex-1 py-4 font-black uppercase tracking-widest text-sm transition-all ${activeTab === 'TEAMS' ? 'bg-on-surface text-surface' : 'hover:bg-primary-container/20'}`}
        >
          Squadrons
        </button>
      </div>

      <BrutalCard className="p-0 overflow-hidden shadow-none" shadowColor="black">
        {activeTab === 'ALL' && (
          <>
            <div className="p-6 border-b-2 border-on-surface bg-surface-container-low flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase italic">Master Log: {registrations.length} Entries</h2>
            </div>
            <div className="overflow-x-auto max-h-[70vh]">
              <table className="w-full text-left font-sans text-sm">
                <thead className="bg-surface-container-low border-b-2 border-on-surface text-[10px] font-black uppercase tracking-widest sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="p-4 w-10">
                      {canManageRegistrations && (
                        <input 
                          type="checkbox" 
                          checked={selectedIds.size === registrations.length && registrations.length > 0} 
                          onChange={toggleSelectAll}
                          className="w-4 h-4"
                        />
                      )}
                    </th>
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Participant</th>
                    <th className="p-4">Event</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-on-surface/10">
                  {registrations.map((reg) => (
                    <tr key={reg.id} className={`hover:bg-primary-container/10 transition-colors ${selectedIds.has(reg.id) ? 'bg-primary-container/20' : ''}`}>
                      <td className="p-4">
                        {canManageRegistrations && (
                          <input 
                            type="checkbox" 
                            checked={selectedIds.has(reg.id)} 
                            onChange={() => toggleSelect(reg.id)}
                            className="w-4 h-4"
                          />
                        )}
                      </td>
                      <td className="p-4 text-xs font-bold opacity-60 uppercase whitespace-nowrap">
                        {reg.createdAt?.toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }) || ''}
                      </td>
                      <td className="p-4">
                        <div className="font-bold uppercase">{reg.participantName}</div>
                        <div className="text-[10px] opacity-60 truncate max-w-[180px]">{reg.participantEmail}</div>
                      </td>
                      <td className="p-4 font-black text-xs uppercase text-primary">{reg.eventName}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 border-2 text-[10px] font-black uppercase ${
                          reg.status === 'APPROVED' ? 'bg-green-100 text-green-800 border-green-800' :
                          reg.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 border-yellow-800' :
                          'bg-red-100 text-red-800 border-red-800'
                        }`}>
                          {reg.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {canManageRegistrations ? (
                          <Link href={`/admin/verify/${reg.id}`} className="text-[10px] font-black uppercase border-b-2 border-on-surface hover:text-primary hover:border-primary">
                            Inspect
                          </Link>
                        ) : (
                          <span className="text-[10px] font-black uppercase opacity-40">LOCKED</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'EVENTS' && (
          <div className="divide-y-4 divide-on-surface">
            {Array.from(eventsMap.entries()).map(([eventId, data]) => (
              <details key={eventId} className="group">
                <summary className="p-6 bg-surface-container-low flex justify-between items-center cursor-pointer list-none hover:bg-primary-container/10 transition-all">
                   <div>
                      <h3 className="text-2xl font-black uppercase italic group-open:text-primary">{data.name}</h3>
                      <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest">{data.regs.length} Deployments</p>
                   </div>
                   <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <div className="p-0 border-t-2 border-on-surface">
                   <table className="w-full text-left font-sans text-xs">
                      <thead className="bg-surface-container-highest/30 border-b-2 border-on-surface text-[9px] font-black uppercase tracking-widest">
                         <tr>
                            <th className="p-3">Participant</th>
                            <th className="p-3">Team Name</th>
                            <th className="p-3 text-right">{canManageRegistrations ? 'Review' : 'Action'}</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-on-surface/10">
                         {data.regs.map(r => (
                           <tr key={r.id} className="hover:bg-primary-container/5">
                              <td className="p-3 font-bold uppercase">{r.participantName}</td>
                              <td className="p-3 italic font-bold text-[10px]">{r.teamName || '-'}</td>
                                 {canManageRegistrations ? (
                                   <Link href={`/admin/verify/${r.id}`} className="underline font-black uppercase text-[9px]">Open</Link>
                                 ) : (
                                   <span className="text-[9px] font-black uppercase opacity-40 italic">LOCKED</span>
                                 )}
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
              </details>
            ))}
          </div>
        )}

        {activeTab === 'TEAMS' && (
          <div className="divide-y-4 divide-on-surface">
            {Array.from(teamsMap.entries()).map(([teamId, data]) => (
              <details key={teamId} className="group">
                <summary className="p-6 bg-surface-container-low flex justify-between items-center cursor-pointer list-none hover:bg-primary-container/10 transition-all">
                   <div className="flex items-center gap-4">
                      <div className="bg-on-surface text-surface w-10 h-10 flex items-center justify-center font-black rounded-sm group-open:bg-primary">
                         {data.members.length + 1}
                      </div>
                      <div>
                        <h3 className="text-2xl font-black uppercase italic group-open:text-primary leading-none">{data.name}</h3>
                        <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest mt-1">Event: {data.leader.eventName}</p>
                      </div>
                   </div>
                   <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <div className="p-6 bg-surface grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-t-2 border-on-surface">
                   {/* Leader Card */}
                   <div className="p-4 border-2 border-on-surface bg-primary-container/10 flex flex-col justify-between">
                      <div>
                         <span className="text-[8px] font-black uppercase bg-primary text-on-primary px-1 mb-2 inline-block">Squad Leader</span>
                         <p className="font-black uppercase text-lg">{data.leader.participantName}</p>
                         <p className="text-[10px] font-mono opacity-60">{data.leader.participantEmail}</p>
                      </div>
                   </div>

                   {/* Member Cards */}
                   {data.members.map(m => (
                     <div key={m.id} className="p-4 border-2 border-on-surface bg-surface-container-low flex flex-col justify-between">
                        <div>
                           <span className="text-[8px] font-black uppercase bg-surface-container-highest text-on-surface px-1 mb-2 inline-block">Team Member</span>
                           <p className="font-black uppercase text-lg">{m.name}</p>
                           <p className="text-[10px] font-mono opacity-60">{m.phone || 'NO PHONE'}</p>
                        </div>
                     </div>
                   ))}
                </div>
              </details>
            ))}
            {teamsMap.size === 0 && (
              <div className="p-20 text-center opacity-30">
                 <h2 className="text-4xl font-black uppercase tracking-widest italic">NO SQUADRONS FOUND</h2>
              </div>
            )}
          </div>
        )}
      </BrutalCard>

      {/* Floating Bulk Action Bar */}
      {canManageRegistrations && selectedIds.size > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <BrutalCard className="flex flex-col md:flex-row items-center gap-6 px-8 py-4 bg-on-surface text-surface" shadowColor="gold">
            <div className="flex items-center gap-4">
               <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center font-black text-on-primary">
                 {selectedIds.size}
               </div>
               <span className="font-black uppercase tracking-widest text-sm">Packets Selected</span>
            </div>
            
            <div className="h-0.5 md:h-8 w-full md:w-0.5 bg-surface/20" />

            <div className="flex gap-4">
               <BrutalButton 
                  onClick={() => handleBulkAction('APPROVED')} 
                  disabled={isUpdating}
                  variant="secondary" 
                  size="sm" 
                  className="bg-green-500 text-on-primary border-green-600 hover:bg-green-600 transition-colors"
                >
                  BULK APPROVE
               </BrutalButton>
               <BrutalButton 
                  onClick={() => handleBulkAction('REJECTED')} 
                  disabled={isUpdating}
                  variant="secondary" 
                  size="sm" 
                  className="bg-red-500 text-on-primary border-red-600 hover:bg-red-600 transition-colors"
                >
                  BULK REJECT
               </BrutalButton>
               <BrutalButton 
                  onClick={handleBulkDelete} 
                  disabled={isUpdating}
                  variant="secondary" 
                  size="sm" 
                  className="bg-black text-white border-on-surface hover:bg-gray-800 transition-colors"
                >
                  BULK DELETE
               </BrutalButton>
               <BrutalButton 
                  onClick={() => setSelectedIds(new Set())} 
                  disabled={isUpdating}
                  variant="outline" 
                  size="sm" 
                  className="text-surface border-surface hover:bg-surface/10 transition-colors"
                >
                  CANCEL
               </BrutalButton>
            </div>
          </BrutalCard>
        </div>
      )}
    </div>
  );
}
