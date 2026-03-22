import React from 'react';
import { db } from '@/db';
import { systemSettings, events } from '@/db/schema';
import { eq, isNotNull, desc } from 'drizzle-orm';
import BrutalCard from '@/components/ui/BrutalCard';
import LiveViewerCounter from '@/components/marketing/LiveViewerCounter';
import CountdownTimer from '@/components/marketing/CountdownTimer';

export default async function LeaderboardPage() {
  const settings = await db.select().from(systemSettings).where(eq(systemSettings.id, 1));
  const currentSettings = settings.length > 0 ? settings[0] : null;

  const revealTime = currentSettings?.resultsRevealTime;
  const videoUrl = currentSettings?.resultsVideoUrl;
  
  const isLocked = !revealTime || revealTime.getTime() > Date.now();

  if (isLocked) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-surface-container-low border-b-4 border-on-surface text-center">
         <span className="material-symbols-outlined text-8xl md:text-[200px] opacity-10 animate-pulse text-primary block mb-12">lock_clock</span>
         <h1 className="text-4xl md:text-8xl font-display font-black uppercase tracking-tighter mb-6 italic">Leaderboard<br/>Offline</h1>
         <div className="h-1 w-32 bg-primary brutal-border mx-auto mb-12"></div>
         <p className="font-sans font-bold text-lg md:text-2xl uppercase opacity-80 mb-8 max-w-2xl tracking-widest leading-loose">
           The outcome of the module trials is sealed. Security clearances will unlock according to the official synchronized timeline.
         </p>
         {revealTime ? (
            <div className="scale-125 mx-auto w-fit border-4 border-on-surface shadow-[6px_6px_0px_#000]">
               <CountdownTimer targetDate={revealTime.toISOString()} enableRefreshOnZero={true} />
            </div>
         ) : (
            <div className="font-display font-black text-xl md:text-3xl uppercase text-red-600 border-4 border-red-600 p-8 bg-red-50">
               AWAITING CHRONOLOGICAL INPUT FROM COMMAND CENTER
            </div>
         )}
      </div>
    );
  }

  // UNLOCKED STATE
  const allEvents = await db.select().from(events).where(isNotNull(events.winners)).orderBy(desc(events.createdAt));

  return (
    <div className="min-h-screen bg-surface-container-low pb-24 border-b-4 border-on-surface">
       {/* Video Splash Block */}
       <div className="bg-main border-y-4 border-on-surface pt-32 pb-6 md:pb-12 px-6 shadow-[0_12px_0_0_#000]">
          <div className="max-w-[1440px] mx-auto">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
                <div>
                   <h1 className="text-6xl md:text-8xl font-black font-display uppercase italic tracking-tighter text-on-surface mb-2 leading-[0.8] mt-4">Leaderboard<br/>&amp; Results</h1>
                   <div className="h-2 w-32 bg-primary brutal-border mt-4 mb-4"></div>
                   <p className="font-sans font-bold text-primary uppercase text-xs tracking-[0.3em]">Module Trials Concluded. Operational Superiority Determined.</p>
                </div>
                <LiveViewerCounter />
             </div>

             {videoUrl ? (
                <div className="relative w-full aspect-video border-4 border-on-surface bg-black brutal-border">
                   <iframe src={videoUrl} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full absolute top-0 left-0"></iframe>
                </div>
             ) : (
                <div className="relative w-full aspect-video border-4 border-on-surface bg-surface flex flex-col justify-center items-center text-center brutal-border p-12">
                   <span className="material-symbols-outlined text-[100px] opacity-20 block mb-6 animate-pulse">videocam_off</span>
                   <p className="font-display font-black uppercase tracking-widest text-2xl opacity-60">NO VISUAL PAYLOAD UPLOADED</p>
                </div>
             )}
          </div>
       </div>

       {/* Results Matrix Grid */}
       <div className="max-w-[1440px] mx-auto px-6 mt-24">
          <div className="mb-12">
             <h2 className="text-4xl font-black font-display uppercase italic tracking-tighter mb-4">Official Transmission Data</h2>
             <div className="h-2 w-24 bg-primary brutal-border"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
             {allEvents.map((evt) => {
                const winnersList = evt.winners as Array<{place: number, name: string, college: string}> || [];
                // Sort by place
                winnersList.sort((a,b) => a.place - b.place);
                
                return (
                   <BrutalCard key={evt.id} className="p-0 overflow-hidden flex flex-col h-full bg-surface" shadowColor="gold">
                      <div className="bg-primary text-on-primary p-6 border-b-4 border-on-surface flex justify-between items-center text-left h-fit min-h-24">
                         <div>
                            <h3 className="font-display font-black text-2xl uppercase tracking-widest truncate max-w-[200px] md:max-w-xs">{evt.name}</h3>
                            <p className="font-bold text-[10px] opacity-80 uppercase font-sans tracking-widest mt-1">Module // {evt.branch || 'Universal'}</p>
                         </div>
                         <span className="material-symbols-outlined text-4xl opacity-50">workspace_premium</span>
                      </div>
                      
                      <div className="p-6 space-y-4 flex-grow divide-y-2 divide-on-surface/20">
                         {winnersList.map((win, idx) => (
                           <div key={idx} className="pt-4 first:pt-0 flex gap-4 items-center">
                              <span className={`font-display font-black text-4xl w-12 text-center text-on-surface/30`}>0{win.place}</span>
                              <div className="flex-1 overflow-hidden min-h-12 flex justify-center flex-col">
                                 {win.name ? (
                                    <>
                                       <p className="font-black text-sm uppercase tracking-widest truncate text-on-surface leading-tight">{win.name}</p>
                                       <p className="font-sans font-bold text-[10px] opacity-60 uppercase truncate">{win.college}</p>
                                    </>
                                 ) : (
                                    <p className="font-display font-bold uppercase text-[10px] opacity-20 italic bg-on-surface/5 p-2 w-fit">NULL DATA</p>
                                 )}
                              </div>
                           </div>
                         ))}
                      </div>
                   </BrutalCard>
                )
             })}
             
             {allEvents.length === 0 && (
                <div className="col-span-full text-center py-20 border-4 border-dashed border-on-surface opacity-50 bg-secondary-container/50">
                   <p className="font-display font-black text-2xl uppercase tracking-widest mb-2">Null Sector Array</p>
                   <p className="font-sans font-bold uppercase text-xs">No event distributions tracked.</p>
                </div>
             )}
          </div>
       </div>
    </div>
  );
}
