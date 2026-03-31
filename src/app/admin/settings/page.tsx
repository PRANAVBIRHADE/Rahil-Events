import React from 'react';
import { db } from '@/db';
import { systemSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import BrutalCard from '@/components/ui/BrutalCard';
import BrutalButton from '@/components/ui/BrutalButton';
import Link from 'next/link';
import { updateRegistrationSettings } from '@/lib/actions';
import ImageSettingsClient from '@/components/admin/ImageSettingsClient';

export const dynamic = 'force-dynamic';

function toDateTimeLocalValue(d: Date | null | undefined) {
  if (!d) return '';
  const date = new Date(d);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  const hours = `${date.getHours()}`.padStart(2, '0');
  const minutes = `${date.getMinutes()}`.padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default async function AdminSettingsPage() {
  const [settings] = await db.select().from(systemSettings).where(eq(systemSettings.id, 1));

  const registrationOpen = settings?.registrationOpen ?? true;
  const upiId = settings?.upiId ?? '9834147160@kotak811';
  const feePerPerson = settings?.feePerPerson ?? 0;
  const deadlineValue = toDateTimeLocalValue(settings?.deadline ?? null);

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-12">
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-2 italic">Settings Panel</h1>
          <p className="font-display font-bold uppercase text-primary tracking-widest text-sm">Registration open/close + payment configuration</p>
        </div>
        <Link href="/admin/dashboard" className="border-b-2 border-on-surface font-black uppercase text-xs hover:text-primary hover:border-primary transition-colors">
          &larr; Return to Command Center
        </Link>
      </div>

      <BrutalCard className="p-8" shadowColor="gold">
        <form action={async (formData) => {
          'use server';
          await updateRegistrationSettings(formData);
        }} className="space-y-8">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest opacity-60">Registration open</label>
            <input
              type="checkbox"
              name="registrationOpen"
              defaultChecked={registrationOpen}
              className="w-6 h-6 accent-primary brutal-border"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest opacity-60">UPI ID</label>
              <input
                name="upiId"
                defaultValue={upiId}
                className="w-full p-3 brutal-border bg-surface text-sm font-mono font-bold uppercase outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest opacity-60">Fee per person (INR)</label>
              <input
                type="number"
                name="feePerPerson"
                defaultValue={feePerPerson}
                min={0}
                className="w-full p-3 brutal-border bg-surface text-sm font-mono font-bold outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest opacity-60">Registration deadline</label>
            <input
              type="datetime-local"
              name="deadline"
              defaultValue={deadlineValue}
              className="w-full p-3 brutal-border bg-surface text-sm font-mono font-bold outline-none focus:border-primary"
            />
          </div>

          <div className="pt-2">
            <BrutalButton type="submit" size="lg">
              Save Settings
            </BrutalButton>
          </div>
        </form>
      </BrutalCard>

      <ImageSettingsClient 
         images={{
            heroImage: settings?.heroImage ?? null,
            aboutImage1: settings?.aboutImage1 ?? null,
            aboutImage2: settings?.aboutImage2 ?? null,
            aboutImage3: settings?.aboutImage3 ?? null,
         }}
      />
    </div>
  );
}

