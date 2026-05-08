'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const SINGLE_SONG = '/audio/song1.mp3';
const SONG_DURATION = 180; // Default estimate, will be updated by metadata

const CinematicMusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState(0.4);
  const [hasStarted, setHasStarted] = useState(false);

  // Initialize volume from localStorage
  useEffect(() => {
    const savedVolume = localStorage.getItem('kratos_volume');
    if (savedVolume !== null) {
      setVolume(parseFloat(savedVolume));
    }
  }, []);

  // Persist volume changes
  useEffect(() => {
    localStorage.setItem('kratos_volume', volume.toString());
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    // PRE-BUFFER AUDIO IMMEDIATELY ON MOUNT
    if (audioRef.current) {
      audioRef.current.src = SINGLE_SONG;
      audioRef.current.load(); // Start buffering
    }

    const syncAudio = () => {
      if (!audioRef.current || !hasStarted) return;

      const now = Math.floor(Date.now() / 1000);
      const duration = audioRef.current.duration || SONG_DURATION;
      const trackOffset = now % duration;

      // Ensure correct source
      if (!audioRef.current.src.includes('song1.mp3')) {
        audioRef.current.src = SINGLE_SONG;
      }

      audioRef.current.volume = volume;

      if (audioRef.current.paused) {
        audioRef.current.play().then(() => {
          // Only seek on initial start to join the "global broadcast"
          if (audioRef.current && Math.abs(audioRef.current.currentTime - trackOffset) > 5) {
            audioRef.current.currentTime = trackOffset;
          }
        }).catch(() => {});
      }
    };

    const handleInteraction = () => {
      if (!hasStarted && audioRef.current) {
        setHasStarted(true);
        // FORCE INSTANT PLAY on first interaction to avoid 3-5s delay
        const now = Math.floor(Date.now() / 1000);
        const duration = audioRef.current.duration || SONG_DURATION;
        const trackOffset = now % duration;
        
        audioRef.current.src = SINGLE_SONG;
        audioRef.current.volume = volume;
        audioRef.current.currentTime = trackOffset;
        audioRef.current.play().catch(() => {});
      }
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('mousemove', handleInteraction, { once: true });

    // Sync check every 10 seconds to keep the "Global Broadcast" feel
    const interval = setInterval(syncAudio, 10000);
    if (hasStarted) syncAudio();

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      clearInterval(interval);
    };
  }, [hasStarted, volume]);

  return (
    <>
      <audio
        ref={audioRef}
        style={{ display: 'none' }}
        loop
        onEnded={() => {
          if (audioRef.current) audioRef.current.play();
        }}
      />
      
      {/* Top Right Equalizer & Volume HUD */}
      {hasStarted && (
        <div style={{
          position: 'fixed',
          top: '30px',
          right: '80px',
          zIndex: 100000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '12px'
        }}>
          {/* Equalizer Row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '3px',
              height: '24px'
            }}>
              {[1, 2, 3, 4, 5].map(i => (
                <motion.div
                  key={i}
                  animate={{ 
                    height: [4, 20, 8, 24, 12, 4],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 0.8 + (i * 0.1), 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  style={{ 
                    width: '3px', 
                    background: '#00ffff', 
                    borderRadius: '2px',
                    boxShadow: '0 0 10px #00ffffaa'
                  }}
                />
              ))}
            </div>
            <div style={{
              color: '#00ffff',
              fontSize: '9px',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '3px',
              opacity: 0.6,
              textShadow: '0 0 10px #00ffff88'
            }}>
              Kratos_Audio_Feed
            </div>
          </div>

          {/* Volume Control Row */}
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(0,0,255,0.1)',
              backdropFilter: 'blur(10px)',
              padding: '4px 10px',
              borderRadius: '20px',
              border: '1px solid rgba(0,255,255,0.2)'
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00ffff" strokeWidth="2" style={{ opacity: 0.6 }}>
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              style={{
                width: '80px',
                height: '2px',
                appearance: 'none',
                background: 'rgba(0,255,255,0.2)',
                outline: 'none',
                cursor: 'pointer',
                borderRadius: '2px'
              }}
            />
          </motion.div>
        </div>
      )}
    </>
  );
};

export default CinematicMusicPlayer;
