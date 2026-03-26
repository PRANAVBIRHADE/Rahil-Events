import React from 'react';
import Hero from '@/components/marketing/Hero';
import Features from '@/components/marketing/Features';
import EventsGrid from '@/components/marketing/EventsGrid';
import ThreeDSchedule from '@/components/marketing/ThreeDSchedule';
import Gallery from '@/components/marketing/Gallery';
import CTA from '@/components/marketing/CTA';
import OrganizersSection from '@/components/marketing/OrganizersSection';

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <EventsGrid />
      <ThreeDSchedule />
      <Gallery />
      <OrganizersSection />
      <CTA />
    </>
  );
}
