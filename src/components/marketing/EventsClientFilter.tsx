'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const ICON_MAP: Record<string, string> = {
  'Civil Engineering': 'architecture',
  'Computer Science Engineering': 'terminal',
  'Electrical Engineering': 'electric_bolt',
  'Mechanical & Automation': 'precision_manufacturing',
  'Electronics & Telecom': 'cell_tower',
  'AI & Data Science': 'memory',
  'CSE (AIML)': 'psychology',
  'Other': 'settings_input_component',
};

const getFormatLabel = (format: string | null) => {
  switch(format) {
    case 'TEAM': return 'TEAM FORMAT';
    case 'SOLO_TEAM': return 'SOLO/TEAM FORMAT';
    case 'SOLO_PAIR': return 'SOLO/PAIR FORMAT';
    case 'SOLO_TEAM_ASSIGNED': return 'SOLO (TEAM ASSIGNED)';
    case 'SOLO':
    default: return 'SOLO FORMAT';
  }
};

function FilterContent({ allEvents }: { allEvents: any[] }) {
  const searchParams = useSearchParams();
  const branchQuery = searchParams.get('branch');

  const branches = [
    'All',
    'Civil Engineering',
    'Computer Science Engineering',
    'Electrical Engineering',
    'Mechanical & Automation',
    'Electronics & Telecom',
    'AI & Data Science',
    'CSE (AIML)',
    'Other'
  ];

  const [activeFilter, setActiveFilter] = useState<string>('All');

  useEffect(() => {
    if (branchQuery && branches.includes(branchQuery)) {
      setActiveFilter(branchQuery);
    } else {
      setActiveFilter('All');
    }
  }, [branchQuery]);

  const commonEvents = allEvents.filter(e => e.isCommon);
  const branchEvents = allEvents.filter(e => !e.isCommon);

  const groupedEvents = branchEvents.reduce((acc, event) => {
    const branch = event.branch || 'Other';
    if (!acc[branch]) acc[branch] = [];
    acc[branch].push(event);
    return acc;
  }, {} as Record<string, any[]>);

  // If a specific filter is active, only show that. Otherwise show all.
  const filteredGroups: Record<string, any[]> = activeFilter === 'All' 
    ? groupedEvents 
    : { [activeFilter]: groupedEvents[activeFilter] || [] };

  return (
    <>
      <div className="mb-12 flex flex-wrap gap-2">
        {branches.map(branch => {
           // Only show branch filter if it has events or is 'All'
           if (branch !== 'All' && (!groupedEvents[branch] || groupedEvents[branch].length === 0)) return null;
           
           return (
             <button 
               key={branch}
               onClick={() => setActiveFilter(branch)}
               className={`px-4 py-2 font-display font-bold uppercase text-xs tracking-widest brutal-border transition-colors ${
                 activeFilter === branch 
                  ? 'bg-primary text-on-primary' 
                  : 'bg-surface hover:bg-surface-container-low'
               }`}
             >
               {branch}
             </button>
           );
        })}
      </div>

      {activeFilter === 'All' && commonEvents.length > 0 && (
        <div className="mb-16">
          <h3 className="text-3xl font-black uppercase mb-8 pb-4 border-b-2 border-on-surface inline-block pr-12">Universal Modules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 brutal-border overflow-hidden">
            {commonEvents.map((event, i) => (
              <div key={event.id} className="p-8 border-b-2 border-r-2 last:border-b-0 md:last:border-b-2 lg:[&:nth-child(3n)]:border-r-0 border-on-surface flex flex-col justify-between hover:bg-primary-container transition-colors group">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="material-symbols-outlined text-4xl">public</span>
                    <span className="text-[10px] font-black uppercase tracking-widest border-2 border-on-surface px-2 py-1">
                      {getFormatLabel(event.format)}
                    </span>
                  </div>
                  <h3 className="text-3xl font-black uppercase mb-4 leading-none">{event.name}</h3>
                  <p className="mb-8 opacity-70 font-sans group-hover:text-on-primary-container">
                    {event.description || event.tagline || 'Module details pending initialization...'}
                  </p>
                </div>
                <Link 
                  href={`/events/${event.slug}/register`} 
                  className="font-display font-bold uppercase border-b-2 border-on-surface w-fit hover:border-primary transition-colors block mt-8"
                >
                  Register module [₹{event.fee}]
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {Object.entries(filteredGroups).map(([branch, events]) => {
        if (!events || events.length === 0) return null;
        return (
          <div key={branch} className="mb-16 last:mb-0 animate-in fade-in duration-300">
            <h3 className="text-3xl font-black uppercase mb-8 pb-4 border-b-2 border-on-surface inline-block pr-12">{branch}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 brutal-border overflow-hidden">
              {events.map((event, i) => (
                <div key={event.id} className="p-8 border-b-2 border-r-2 last:border-b-0 md:last:border-b-2 lg:[&:nth-child(3n)]:border-r-0 border-on-surface flex flex-col justify-between hover:bg-primary-container transition-colors group">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <span className="material-symbols-outlined text-4xl">
                        {ICON_MAP[branch] || 'settings_input_component'}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-widest border-2 border-on-surface px-2 py-1">
                        {getFormatLabel(event.format)}
                      </span>
                    </div>
                    <h3 className="text-3xl font-black uppercase mb-4 leading-none">{event.name}</h3>
                    <p className="mb-8 opacity-70 font-sans group-hover:text-on-primary-container">
                      {event.description || event.tagline || 'Module details pending initialization...'}
                    </p>
                  </div>
                  <Link 
                    href={`/events/${event.slug}/register`} 
                    className="font-display font-bold uppercase border-b-2 border-on-surface w-fit hover:border-primary transition-colors block mt-8"
                  >
                    Register module [₹{event.fee}]
                  </Link>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}

export default function EventsClientFilter({ allEvents }: { allEvents: any[] }) {
  return (
    <Suspense fallback={<div className="font-display font-bold uppercase text-primary tracking-widest">LOADING FILTER CACHE...</div>}>
      <FilterContent allEvents={allEvents} />
    </Suspense>
  );
}
