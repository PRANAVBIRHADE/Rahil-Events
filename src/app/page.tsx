import React from 'react';
import { db } from '@/db';
import { systemSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import Hero from '@/components/marketing/Hero';
import Features from '@/components/marketing/Features';
import EventsGrid from '@/components/marketing/EventsGrid';
import ThreeDSchedule from '@/components/marketing/ThreeDSchedule';
import Gallery from '@/components/marketing/Gallery';
import CTA from '@/components/marketing/CTA';
import OrganizersSection from '@/components/marketing/OrganizersSection';
import AboutSection from '@/components/marketing/AboutSection';

export default async function LandingPage() {
  const [settings] = await db.select().from(systemSettings).where(eq(systemSettings.id, 1));
  
  const heroImage = settings?.heroImage ?? null;
  const aboutImage1 = settings?.aboutImage1 ?? null;
  const aboutImage2 = settings?.aboutImage2 ?? null;
  const aboutImage3 = settings?.aboutImage3 ?? null;

  return (
    <>
      <Hero heroImage={heroImage} />
      <AboutSection img1={aboutImage1} img2={aboutImage2} img3={aboutImage3} />
      <Features />
      <EventsGrid />
      <ThreeDSchedule />
      <Gallery />
      <OrganizersSection />
      <CTA />
    </>
  );
}
