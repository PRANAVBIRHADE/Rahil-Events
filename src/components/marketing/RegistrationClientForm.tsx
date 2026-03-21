'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import BrutalCard from '@/components/ui/BrutalCard';
import BrutalInput from '@/components/ui/BrutalInput';
import BrutalButton from '@/components/ui/BrutalButton';
import BrutalQRCode from '@/components/ui/BrutalQRCode';
import { CldUploadWidget } from 'next-cloudinary';
import { createRegistration } from '@/lib/actions';

const StepHeader = ({ number, title }: { number: string; title: string }) => (
  <div className="relative mb-8">
    <div className="absolute -top-4 -left-4 bg-on-surface text-surface px-4 py-1 font-display font-black text-xl">
      {number}
    </div>
    <h2 className="text-3xl font-black uppercase tracking-tighter ml-4">{title}</h2>
  </div>
);

type RegistrationClientFormProps = {
  eventId: string;
  eventFormat: string;
  isTeamFormat: boolean;
  isTeamRequired: boolean;
  teamSize: number;
  eventData: {
    fee: number;
    upiId: string;
    upiURI: string;
  };
  dbUser: {
    name: string;
    phone: string | null;
  };
};

export default function RegistrationClientForm({
  eventId,
  eventFormat,
  isTeamFormat,
  isTeamRequired,
  teamSize,
  eventData,
  dbUser
}: RegistrationClientFormProps) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!imageUrl) {
      setError('Please upload the payment screenshot to proceed.');
      return;
    }

    setLoading(true);
    
    // Convert form data
    const formData = new FormData(e.currentTarget);
    formData.append('eventId', eventId);
    formData.append('paymentScreenshot', imageUrl);

    const result = await createRegistration(formData);

    if (result && result.error) {
       setError(result.error);
       setLoading(false);
    } else {
       router.push('/dashboard');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-16">
      {error && (
        <div className="bg-red-500 text-white p-4 font-bold border-2 border-on-surface mb-8">
          CRITICAL ERROR: {error}
        </div>
      )}

      {/* STEP 1: Details */}
      <BrutalCard shadow={true}>
        <StepHeader number="01" title={isTeamFormat ? "Team Roster Specification" : "User Specification"} />
        <div className="space-y-6">
          <div className="bg-primary/10 border-2 border-primary p-6 mb-8">
            <h3 className="font-display font-black tracking-tighter uppercase mb-2">Primary Commander</h3>
            <p className="text-xs font-bold font-sans opacity-70 mb-4">Your core user identity is already verified for this transmission.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-60 pointer-events-none">
              <BrutalInput label="Verified Name" defaultValue={dbUser.name} required />
              <BrutalInput label="Verified Contact" defaultValue={dbUser.phone || ''} required />
            </div>
          </div>

          {isTeamFormat && (
            <div className="space-y-6 mt-8 pt-8 border-t-2 border-on-surface">
              <h3 className="font-display text-2xl font-black tracking-tighter uppercase mb-4">Platoon Configuration</h3>
              {(eventFormat === 'SOLO_TEAM' || eventFormat === 'SOLO_PAIR') && (
                <p className="text-xs font-bold opacity-60 italic mb-4">Note: Team Details are optional for Solo/Team format events. Fill only if participating as a team.</p>
              )}
              <BrutalInput label="Squadron / Team Name" name="teamName" placeholder="e.g. NEURAL SYNDICATE" required={isTeamRequired} />
              
              <div className="space-y-6 mt-4">
                {Array.from({ length: Math.max(0, (teamSize || 1) - 1) }).map((_, i) => (
                  <div key={i} className="p-6 border-2 border-on-surface bg-surface-container-low relative">
                    <div className="absolute -top-3 left-4 bg-on-surface text-surface px-3 py-1 text-[10px] font-black tracking-widest uppercase">
                      Operator 0{i + 2}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                       <BrutalInput name={`member_${i}_name`} label="Full Name" placeholder={`Operator ${i + 2} Name`} required={isTeamRequired} />
                       <BrutalInput name={`member_${i}_phone`} label="Contact Sequence" placeholder="+91 00000 00000" required={isTeamRequired} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </BrutalCard>

      {/* STEP 2: Payment */}
      <BrutalCard shadow={true}>
        <StepHeader number="02" title="Payment Terminal" />
        <div className="flex flex-col md:flex-row gap-8 items-center bg-surface-container-low p-6 brutal-border">
          <div className="w-48 h-48 bg-white p-2 border-2 border-on-surface flex items-center justify-center relative overflow-hidden">
            <BrutalQRCode data={eventData.upiURI} size={160} className="w-full h-full" />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <p className="text-[10px] font-display font-bold uppercase tracking-widest opacity-60">Official UPI ID</p>
              <p className="text-2xl font-black tracking-tighter uppercase">{eventData.upiId}</p>
            </div>
            <div>
              <p className="text-[10px] font-display font-bold uppercase tracking-widest opacity-60">Amount Required</p>
              <p className="text-4xl font-black text-primary" style={{ textShadow: '2px 2px 0px #F9F9F9' }}>₹ {eventData.fee}.00</p>
            </div>
            <div className="w-full">
              <BrutalInput name="transactionId" label="Transaction / UTR ID" placeholder="Enter 12-digit UTR No." required />
            </div>
          </div>
        </div>
      </BrutalCard>

      {/* STEP 3: Upload */}
      <BrutalCard shadow={true} shadowColor="gold">
        <StepHeader number="03" title="Validation & Evidence" />
        
        <CldUploadWidget 
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default"}
          onSuccess={(result) => {
            if (result.info && typeof result.info !== 'string') {
              setImageUrl(result.info.secure_url);
            }
          }}
        >
          {({ open }) => (
            <div 
              onClick={() => open()}
              className={`border-2 border-dashed ${imageUrl ? 'border-primary bg-primary/10' : 'border-on-surface/30 bg-surface-container-low'} p-12 text-center hover:border-primary transition-colors group cursor-pointer`}
            >
              <span className={`material-symbols-outlined text-6xl ${imageUrl ? 'text-primary' : 'text-on-surface/20'} group-hover:text-primary mb-4 transition-colors`}>
                {imageUrl ? 'check_circle' : 'cloud_upload'}
              </span>
              <p className="font-display font-bold uppercase tracking-tighter text-lg">
                {imageUrl ? 'Screenshot Attached Successfully!' : 'Upload Payment Screenshot'}
              </p>
              <p className="text-sm opacity-60 mt-2 font-mono">
                {imageUrl ? 'Ready for command approval.' : 'JPEG, PNG or PDF (Max 5MB)'}
              </p>
            </div>
          )}
        </CldUploadWidget>
        
        <div className="mt-8 flex items-start gap-4 p-4 brutal-border bg-surface-container-low">
          <input className="mt-1 w-5 h-5 brutal-border rounded-none checked:bg-primary accent-primary focus:ring-0" id="terms" type="checkbox" required />
          <label className="text-sm font-bold leading-tight opacity-70 uppercase tracking-tight" htmlFor="terms">
            I verify that all technical details provided are accurate and the payment proof is authentic. I agree to the <span className="underline border-b-2 border-primary-container">Precision Code of Conduct</span>.
          </label>
        </div>

        <BrutalButton className="w-full mt-10" size="xl" disabled={loading}>
          {loading ? 'Transmitting Data...' : 'Complete Registration'}
        </BrutalButton>
      </BrutalCard>
    </form>
  );
}
