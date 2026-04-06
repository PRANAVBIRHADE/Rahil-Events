'use client';

import React, { useState, useEffect } from 'react';

const TimerUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center p-3 md:p-4 brutal-border bg-surface hard-shadow min-w-[70px] md:min-w-[100px]">
    <span className="text-3xl md:text-6xl font-black font-display leading-none">
      {value.toString().padStart(2, '0')}
    </span>
    <span className="text-xs font-bold uppercase tracking-widest mt-2">{label}</span>
  </div>
);

const CountdownTimer = ({ targetDate = '2026-04-27T05:00:00Z', enableRefreshOnZero = false }: { targetDate?: string, enableRefreshOnZero?: boolean }) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft(null);
        if (enableRefreshOnZero) {
          window.location.reload();
        }
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, enableRefreshOnZero]);

  if (!timeLeft) return null;

  return (
    <div className="flex flex-wrap justify-center gap-3 md:gap-4 py-4 md:py-8">
      <TimerUnit value={timeLeft.days} label="Days" />
      <TimerUnit value={timeLeft.hours} label="Hours" />
      <TimerUnit value={timeLeft.minutes} label="Mins" />
      <TimerUnit value={timeLeft.seconds} label="Secs" />
    </div>
  );
};

export default CountdownTimer;
