import React from 'react';
import Hero from '@/components/marketing/Hero';
import Features from '@/components/marketing/Features';
import EventsGrid from '@/components/marketing/EventsGrid';
import MasterSchedule from '@/components/marketing/MasterSchedule';
import Gallery from '@/components/marketing/Gallery';
import CTA from '@/components/marketing/CTA';

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <EventsGrid />
      <MasterSchedule />
      <Gallery />
      <CTA />
    </>
  );
}
