'use client';

import React, { useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import BrutalButton from '@/components/ui/BrutalButton';
import { submitRegistration } from './actions';
import {
  getEventMaxParticipants,
  getEventMinParticipants,
  getEventParticipationOptions,
  isAllowedPaymentScreenshotFormat,
  isValidPhone,
  normalizeText,
  PAYMENT_SCREENSHOT_ALLOWED_FORMATS,
  PAYMENT_SCREENSHOT_MAX_BYTES,
  type PaymentScreenshotUpload,
  type RegistrationMemberInput,
} from '@/lib/registration';

type EventOption = {
  fee: number;
  format: string | null;
  id: string;
  name: string;
  slug: string;
  teamSize: number | null;
  teamSizeMin: number | null;
};

type UploadWidgetResult = {
  info?: string | { bytes?: number; format?: string; secure_url?: string };
};

type UnifiedRegistrationFormProps = {
  events: EventOption[];
  initialEventId?: string;
  upiId: string;
};

function createEmptyMember(): RegistrationMemberInput {
  return {
    name: '',
    email: '',
    phone: '',
    college: '',
    branch: '',
    year: '1',
  };
}

function createMemberList(count: number, existingMembers: RegistrationMemberInput[] = []) {
  const nextMembers = existingMembers.slice(0, count);

  while (nextMembers.length < count) {
    nextMembers.push(createEmptyMember());
  }

  return nextMembers;
}

function getInitialState(events: EventOption[], initialEventId: string | undefined) {
  const initialEvent = events.find((event) => event.id === initialEventId) ?? null;
  const options = getEventParticipationOptions(initialEvent?.format);
  const teamMode = options.requireTeam;
  const initialCount = getEventMinParticipants(initialEvent?.format, initialEvent?.teamSizeMin, teamMode);

  return {
    initialEvent,
    initialMembers: createMemberList(initialCount),
    initialTeamMode: teamMode,
  };
}

export default function UnifiedRegistrationForm({
  events,
  initialEventId = '',
  upiId,
}: UnifiedRegistrationFormProps) {
  const { initialEvent, initialMembers, initialTeamMode } = getInitialState(events, initialEventId);

  const [selectedEventId, setSelectedEventId] = useState(initialEvent?.id ?? '');
  const [isTeamMode, setIsTeamMode] = useState(initialTeamMode);
  const [teamName, setTeamName] = useState('');
  const [members, setMembers] = useState<RegistrationMemberInput[]>(initialMembers);
  const [transactionId, setTransactionId] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState<PaymentScreenshotUpload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const selectedEvent = events.find((event) => event.id === selectedEventId) ?? null;
  const participationOptions = getEventParticipationOptions(selectedEvent?.format);
  const effectiveTeamMode = participationOptions.requireTeam ? true : isTeamMode;
  const minParticipants = getEventMinParticipants(
    selectedEvent?.format,
    selectedEvent?.teamSizeMin,
    effectiveTeamMode,
  );
  const maxParticipants = getEventMaxParticipants(selectedEvent?.teamSize);
  const requiresPayment = Boolean(selectedEvent && selectedEvent.fee > 0);

  const syncMembersForSelection = (event: EventOption | null, teamMode: boolean, existingMembers: RegistrationMemberInput[]) => {
    const nextMinParticipants = getEventMinParticipants(event?.format, event?.teamSizeMin, teamMode);
    const nextMaxParticipants = getEventMaxParticipants(event?.teamSize);
    return createMemberList(Math.min(nextMaxParticipants, nextMinParticipants), existingMembers);
  };

  const handleEventChange = (eventId: string) => {
    const event = events.find((entry) => entry.id === eventId) ?? null;
    const options = getEventParticipationOptions(event?.format);
    const nextTeamMode = options.requireTeam;

    setSelectedEventId(eventId);
    setIsTeamMode(nextTeamMode);
    setTeamName('');
    setMembers((currentMembers) => syncMembersForSelection(event, nextTeamMode, currentMembers));
    setTransactionId('');
    setPaymentScreenshot(null);
    setError('');
    setSuccess(false);
  };

  const handleTeamModeChange = (nextTeamMode: boolean) => {
    if (!selectedEvent || participationOptions.requireTeam) {
      return;
    }

    setIsTeamMode(nextTeamMode);
    setMembers((currentMembers) => syncMembersForSelection(selectedEvent, nextTeamMode, currentMembers));
    setError('');
  };

  const handleMemberChange = (index: number, field: keyof RegistrationMemberInput, value: string) => {
    setMembers((currentMembers) => {
      const nextMembers = [...currentMembers];
      nextMembers[index] = { ...nextMembers[index], [field]: value };
      return nextMembers;
    });
  };

  const addMember = () => {
    setMembers((currentMembers) => createMemberList(Math.min(currentMembers.length + 1, maxParticipants), currentMembers));
  };

  const removeMember = (index: number) => {
    setMembers((currentMembers) => {
      const nextMembers = currentMembers.filter((_, memberIndex) => memberIndex !== index);
      return createMemberList(Math.max(nextMembers.length, minParticipants), nextMembers);
    });
  };

  const validateForm = () => {
    if (!selectedEvent) {
      return 'Please select an event.';
    }

    if (effectiveTeamMode && members.length < minParticipants) {
      return 'Team members required';
    }

    if (effectiveTeamMode && !normalizeText(teamName || '')) {
      return 'Please enter a team name';
    }

    for (const [index, member] of members.entries()) {
      if (
        !normalizeText(member.name || '') ||
        !normalizeText(member.phone || '') ||
        !normalizeText(member.college || '') ||
        !normalizeText(member.branch || '')
      ) {
        return 'Please fill in all required fields.';
      }

      if (index === 0 && !normalizeText(member.email || '')) {
        return 'Please fill in all required fields.';
      }

      if (!isValidPhone(member.phone)) {
        return 'Please enter valid phone number';
      }
    }

    if (requiresPayment && !normalizeText(transactionId || '')) {
      return 'Please enter the transaction ID.';
    }

    if (requiresPayment && !paymentScreenshot) {
      return 'Upload payment screenshot';
    }

    return '';
  };

  const handleUploadSuccess = (result: UploadWidgetResult) => {
    if (!result.info || typeof result.info === 'string') {
      setError('Upload failed. Please try again.');
      return;
    }

    const format = result.info.format?.toLowerCase() ?? '';
    const bytes = result.info.bytes ?? 0;
    const url = result.info.secure_url ?? '';

    if (!url || !isAllowedPaymentScreenshotFormat(format)) {
      setPaymentScreenshot(null);
      setError('Payment screenshot must be a JPG or PNG file.');
      return;
    }

    if (bytes <= 0 || bytes > PAYMENT_SCREENSHOT_MAX_BYTES) {
      setPaymentScreenshot(null);
      setError('Payment screenshot must be 5 MB or smaller.');
      return;
    }

    setPaymentScreenshot({ bytes, format, url });
    setError('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    const result = await submitRegistration({
      eventId: selectedEventId,
      members,
      paymentScreenshot,
      teamFormat: effectiveTeamMode,
      teamName: effectiveTeamMode ? teamName : '',
      transactionId,
    });

    setLoading(false);

    if (result.success) {
      setSuccess(true);
      return;
    }

    setError(result.error || 'Registration failed');
  };

  if (success) {
    return (
      <div className="bg-surface-container-low brutal-border p-8 border-l-8 border-l-green-500">
        <h2 className="text-4xl font-black uppercase italic mb-4">Registration Submitted</h2>
        <p className="font-sans font-bold">Your registration is now pending review.</p>
        <p className="mt-4">
          Use your phone number or transaction ID on the <a href="/status" className="underline text-primary">Check Status</a>{' '}
          page to track approval.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-surface-container p-6 md:p-8 brutal-border">
      {error ? <div className="bg-red-200 text-red-900 p-4 font-bold border-2 border-red-500">{error}</div> : null}

      <div className="space-y-4">
        <label className="font-display font-black text-xl uppercase italic">Select Event</label>
        <select
          className="w-full bg-surface brutal-input p-4 font-bold uppercase"
          value={selectedEventId}
          onChange={(currentEvent) => handleEventChange(currentEvent.target.value)}
          required
        >
          <option value="">-- Choose an Event --</option>
          {events.map((eventOption) => (
            <option key={eventOption.id} value={eventOption.id}>
              {eventOption.name} {eventOption.fee > 0 ? `(INR ${eventOption.fee})` : '(FREE)'}
            </option>
          ))}
        </select>
      </div>

      {selectedEvent ? (
        <>
          {participationOptions.allowTeam ? (
            <div className="space-y-4 bg-primary-container/20 p-4 brutal-border">
              <label className="font-display font-black text-xl uppercase italic">Participation Mode</label>
              {participationOptions.requireTeam ? (
                <div className="font-bold uppercase text-sm">
                  Team registration is required for this event.
                </div>
              ) : (
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer font-bold">
                    <input
                      type="radio"
                      checked={!effectiveTeamMode}
                      onChange={() => handleTeamModeChange(false)}
                      className="w-5 h-5 accent-primary"
                    />
                    Individual
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-bold">
                    <input
                      type="radio"
                      checked={effectiveTeamMode}
                      onChange={() => handleTeamModeChange(true)}
                      className="w-5 h-5 accent-primary"
                    />
                    Team
                  </label>
                </div>
              )}

              {effectiveTeamMode ? (
                <div className="mt-4">
                  <label className="block text-sm font-bold uppercase mb-2">Team Name</label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(currentEvent) => setTeamName(currentEvent.target.value)}
                    className="w-full bg-surface brutal-input p-3"
                    placeholder="Enter your team name"
                    required={effectiveTeamMode}
                  />
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-display font-black text-2xl uppercase italic">
                {effectiveTeamMode ? 'Team Members' : 'Participant Details'}
              </h3>
              <span className="text-xs font-black uppercase opacity-60">
                {members.length} / {maxParticipants}
              </span>
            </div>

            {members.map((member, index) => (
              <div key={`${selectedEventId || 'event'}-${index}`} className="bg-surface p-4 brutal-border space-y-4 relative">
                {index >= minParticipants ? (
                  <button
                    type="button"
                    onClick={() => removeMember(index)}
                    className="absolute top-2 right-2 text-red-600 font-black px-2 hover:bg-red-100 uppercase text-xs"
                  >
                    Remove
                  </button>
                ) : null}
                <h4 className="font-bold underline mb-4">
                  {index === 0 ? 'Leader / Main Details' : `Member ${index + 1}`}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    value={member.name}
                    onChange={(currentEvent) => handleMemberChange(index, 'name', currentEvent.target.value)}
                    className="brutal-input p-3"
                  />
                  {index === 0 ? (
                    <input
                      type="email"
                      placeholder="Email Address"
                      required
                      value={member.email}
                      onChange={(currentEvent) => handleMemberChange(index, 'email', currentEvent.target.value)}
                      className="brutal-input p-3"
                    />
                  ) : null}
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    required
                    value={member.phone}
                    onChange={(currentEvent) => handleMemberChange(index, 'phone', currentEvent.target.value)}
                    className="brutal-input p-3"
                  />
                  <input
                    type="text"
                    placeholder="College Name"
                    required
                    value={member.college}
                    onChange={(currentEvent) => handleMemberChange(index, 'college', currentEvent.target.value)}
                    className="brutal-input p-3"
                  />
                  <input
                    type="text"
                    placeholder="Branch / Department"
                    required
                    value={member.branch}
                    onChange={(currentEvent) => handleMemberChange(index, 'branch', currentEvent.target.value)}
                    className="brutal-input p-3"
                  />
                  <select
                    required
                    value={member.year}
                    onChange={(currentEvent) => handleMemberChange(index, 'year', currentEvent.target.value)}
                    className="brutal-input p-3"
                  >
                    <option value="1">First Year</option>
                    <option value="2">Second Year</option>
                    <option value="3">Third Year</option>
                    <option value="4">Fourth Year</option>
                  </select>
                </div>
              </div>
            ))}

            {effectiveTeamMode && members.length < maxParticipants ? (
              <BrutalButton type="button" variant="outline" onClick={addMember} className="w-full py-4 text-sm font-bold">
                Add Team Member
              </BrutalButton>
            ) : null}
          </div>

          {requiresPayment ? (
            <div className="bg-on-surface text-surface p-6 px-8 hard-shadow-gold italic space-y-6">
              <h3 className="font-black text-2xl uppercase text-primary-container">Payment Details</h3>
              <p className="font-sans">
                Registration Fee: <strong className="text-xl">INR {selectedEvent.fee}</strong>
              </p>
              <div className="bg-surface/10 p-4 font-mono">UPI ID: {upiId}</div>

              <div className="space-y-4">
                <label className="block text-sm font-bold uppercase text-primary-container">Transaction ID</label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(currentEvent) => setTransactionId(currentEvent.target.value)}
                  className="w-full bg-surface text-on-surface brutal-input p-3"
                  placeholder="Enter your UTR or transaction ID"
                  required
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-bold uppercase text-primary-container">Payment Screenshot</label>
                {!uploadPreset ? (
                  <div className="border-2 border-red-500 bg-red-50 text-red-900 p-4 font-bold">
                    Cloudinary upload is not configured. Add the upload preset before opening registrations.
                  </div>
                ) : (
                  <CldUploadWidget
                    uploadPreset={uploadPreset}
                    options={{
                      clientAllowedFormats: [...PAYMENT_SCREENSHOT_ALLOWED_FORMATS],
                      maxFileSize: PAYMENT_SCREENSHOT_MAX_BYTES,
                      maxFiles: 1,
                      multiple: false,
                      resourceType: 'image',
                    }}
                    onError={() => {
                      setPaymentScreenshot(null);
                      setError('Upload failed. Please try again.');
                    }}
                    onSuccess={(result) => handleUploadSuccess(result as UploadWidgetResult)}
                  >
                    {({ open }) => (
                      <button
                        type="button"
                        onClick={() => open?.()}
                        className="w-full bg-primary-container text-on-primary-container p-4 font-bold border-2 border-transparent hover:border-surface transition-colors"
                      >
                        {paymentScreenshot ? 'Screenshot Attached' : 'Upload Screenshot'}
                      </button>
                    )}
                  </CldUploadWidget>
                )}
                <p className="text-xs font-bold uppercase opacity-70">JPG or PNG only, up to 5 MB.</p>
              </div>
            </div>
          ) : null}

          <BrutalButton
            type="submit"
            size="xl"
            disabled={loading || (requiresPayment && !uploadPreset)}
            className="w-full py-6 mt-8"
          >
            {loading ? 'Submitting...' : 'Submit Registration'}
          </BrutalButton>
        </>
      ) : null}
    </form>
  );
}
