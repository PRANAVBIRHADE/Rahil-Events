'use client';

import React from 'react';
import BrutalCard from '@/components/ui/BrutalCard';
import BrutalButton from '@/components/ui/BrutalButton';
import Link from 'next/link';

const TEAM_DATA = {
  faculty: [
    { name: 'Prof. Name Placeholder', role: 'Faculty Coordinator', dept: 'CSE' },
    { name: 'Dr. Name Placeholder', role: 'Chief Mentor', dept: 'Electronics' },
  ],
  students: [
    { name: 'Student Name 1', role: 'General Secretary', year: '4th Year' },
    { name: 'Student Name 2', role: 'Technical Head', year: '3rd Year' },
    { name: 'Student Name 3', role: 'Event Manager', year: '3rd Year' },
    { name: 'Student Name 4', role: 'Creative Director', year: '2nd Year' },
  ],
  developers: [
    { name: 'Developer Name', role: 'Full Stack Architect', github: '#' },
    { name: 'Designer Name', role: 'UI/UX Lead', github: '#' },
  ]
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-surface-container-low pb-24">
      {/* Hero Section */}
      <section className="bg-on-surface text-surface py-24 px-6 border-b-8 border-primary-container">
        <div className="max-w-[1440px] mx-auto">
          <span className="font-mono text-primary-container text-lg mb-4 block animate-pulse">
            [ SYSTEM_OVERVIEW_INITIATED ]
          </span>
          <h1 className="text-7xl md:text-9xl font-black uppercase italic tracking-tighter leading-none mb-8">
            THE ARCHITECTS <br />
            <span className="text-primary-container">OF KRATOS</span>
          </h1>
          <p className="max-w-3xl text-xl font-display opacity-80 leading-relaxed uppercase">
            A convergence of visionaries, engineers, and designers. Meet the core team responsible for orchestrating the largest technical festival of 2026.
          </p>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-6 mt-20 space-y-32">
        
        {/* Faculty Section */}
        <section>
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-5xl font-black uppercase italic tracking-tighter">FACULTY LEADERSHIP</h2>
            <div className="flex-1 h-2 bg-on-surface"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {TEAM_DATA.faculty.map((member, i) => (
              <BrutalCard key={i} className="flex flex-col justify-between">
                <div>
                  <h3 className="text-3xl font-black uppercase mb-2">{member.name}</h3>
                  <p className="text-primary font-bold uppercase tracking-widest">{member.role}</p>
                </div>
                <div className="mt-8 pt-6 border-t-2 border-on-surface/10">
                  <span className="font-mono text-sm opacity-60">DEPT: {member.dept}</span>
                </div>
              </BrutalCard>
            ))}
          </div>
        </section>

        {/* Student Section */}
        <section>
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-5xl font-black uppercase italic tracking-tighter">EVENT COORDINATORS</h2>
            <div className="flex-1 h-2 bg-on-surface"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM_DATA.students.map((member, i) => (
              <BrutalCard key={i} shadowColor="gold" className="hover:bg-primary-container/20 transition-colors">
                <h3 className="text-xl font-black uppercase mb-1">{member.name}</h3>
                <p className="text-xs font-bold uppercase opacity-60 mb-4">{member.role}</p>
                <div className="bg-on-surface text-surface text-[10px] px-2 py-0.5 inline-block font-black uppercase italic">
                  {member.year}
                </div>
              </BrutalCard>
            ))}
          </div>
        </section>

        {/* Developer Wing */}
        <section id="developers" className="bg-on-surface p-12 brutal-border shadow-[12px_12px_0px_0px_var(--primary-container)]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
            <div>
              <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-surface leading-none">
                THE DEVELOPER <br />
                <span className="text-primary-container">WING</span>
              </h2>
              <p className="text-surface/60 mt-4 max-w-xl font-mono uppercase text-sm">
                This platform was engineered from scratch to handle high-concurrency registrations, real-time presence tracking, and dynamic leaderboard rendering.
              </p>
            </div>
            <div className="bg-surface/5 p-6 border-2 border-surface/20 font-mono text-xs text-primary-container space-y-2">
              <p>{'>'} STACK: NEXT.JS + TAILWIND + NEON_POSTGRES</p>
              <p>{'>'} STATUS: SYSTEM_ONLINE</p>
              <p>{'>'} BUILD: v1.0.26_STABLE</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {TEAM_DATA.developers.map((dev, i) => (
              <div key={i} className="group relative">
                <div className="absolute inset-0 bg-primary-container/20 translate-x-2 translate-y-2 group-hover:translate-x-4 group-hover:translate-y-4 transition-all"></div>
                <div className="relative bg-surface p-8 border-4 border-on-surface">
                   <h3 className="text-4xl font-black uppercase tracking-tighter text-on-surface mb-2">{dev.name}</h3>
                   <p className="font-display font-bold text-primary italic uppercase tracking-widest text-lg mb-6">{dev.role}</p>
                   <Link href={dev.github}>
                    <BrutalButton size="sm" variant="outline" className="w-full md:w-auto">
                      View Protocol
                    </BrutalButton>
                   </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-20">
           <h3 className="text-4xl font-black uppercase italic mb-8">WANT TO JOIN THE RESERVE TEAM?</h3>
           <div className="flex flex-col md:flex-row gap-6 justify-center">
             <Link href="/contact">
               <BrutalButton size="xl" className="px-12">Contact Command</BrutalButton>
             </Link>
             <Link href="/">
               <BrutalButton size="xl" variant="outline" className="px-12">Back to HQ</BrutalButton>
             </Link>
           </div>
        </section>
      </div>
    </div>
  );
}
