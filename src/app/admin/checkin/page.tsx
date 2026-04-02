import React from 'react';
import Link from 'next/link';
import { db } from '@/db';
import { eq, sql } from 'drizzle-orm';
import { events, registrations, teamMembers, users } from '@/db/schema';
import BrutalCard from '@/components/ui/BrutalCard';
import BrutalButton from '@/components/ui/BrutalButton';
import { markRegistrationCheckedIn } from '@/lib/actions';
import { requireStaffPageAccess } from '@/lib/authz';
import RapidCheckInForm from '@/components/admin/RapidCheckInForm';

export const dynamic = 'force-dynamic';

type SearchParams = {
  teamCode?: string;
  name?: string;
  phone?: string;
  eventId?: string;
};

export default async function AdminCheckInPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  await requireStaffPageAccess();

  const resolvedSearchParams = await searchParams;
  const teamCode = resolvedSearchParams.teamCode?.trim() || '';
  const name = resolvedSearchParams.name?.trim() || '';
  const phone = resolvedSearchParams.phone?.trim() || '';
  const eventId = resolvedSearchParams.eventId?.trim() || '';

  const allEvents = await db.select({ id: events.id, name: events.name }).from(events);

  const shouldSearch = teamCode.length > 0 || name.length > 0 || phone.length > 0 || eventId.length > 0;

  let results: Array<{
    regId: string;
    eventName: string;
    teamName: string | null;
    regStatus: string;
    checkedIn: boolean;
    checkedInAt: Date | null;
    memberName: string;
    memberPhone: string | null;
    memberCollege: string | null;
    userPhone: string | null;
  }> = [];

  if (shouldSearch) {
    type SqlFragment = ReturnType<typeof sql>;
    const conditions: SqlFragment[] = [];

    if (teamCode) {
      conditions.push(sql`CAST(${registrations.id} AS text) ILIKE ${`${teamCode}%`}`);
    }
    if (name) {
      conditions.push(sql`LOWER(${teamMembers.name}) LIKE ${`%${name.toLowerCase()}%`}`);
    }
    if (phone) {
      conditions.push(sql`LOWER(${teamMembers.phone}) LIKE ${`%${phone.toLowerCase()}%`}`);
    }
    if (eventId) {
      conditions.push(sql`${registrations.eventId} = ${eventId}`);
    }

    if (conditions.length > 0) {
      const whereClause = conditions.reduce((acc, curr) => sql`${acc} AND ${curr}`);
      const rows = await db
        .select({
          regId: registrations.id,
          eventName: events.name,
          teamName: registrations.teamName,
          regStatus: registrations.status,
          checkedIn: registrations.checkedIn,
          checkedInAt: registrations.checkedInAt,
          memberName: teamMembers.name,
          memberPhone: teamMembers.phone,
          memberCollege: teamMembers.college,
          userPhone: users.phone,
        })
        .from(registrations)
        .innerJoin(users, eq(registrations.userId, users.id))
        .innerJoin(events, eq(registrations.eventId, events.id))
        .innerJoin(teamMembers, eq(registrations.teamId, teamMembers.teamId))
        .where(whereClause);

      const byId = new Map<string, (typeof rows)[number]>();
      for (const row of rows) byId.set(row.regId, row);
      results = Array.from(byId.values()).map((row) => ({
        regId: row.regId,
        eventName: row.eventName,
        teamName: row.teamName,
        regStatus: row.regStatus ?? 'PENDING',
        checkedIn: row.checkedIn,
        checkedInAt: row.checkedInAt ?? null,
        memberName: row.memberName,
        memberPhone: row.memberPhone ?? null,
        memberCollege: row.memberCollege ?? null,
        userPhone: row.userPhone ?? null,
      }));
    }
  }

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-12">
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-2 italic">Event Check-In</h1>
          <p className="font-display font-bold uppercase text-primary tracking-widest text-sm">Search team + mark checked-in</p>
        </div>
        <Link href="/admin/dashboard" className="border-b-2 border-on-surface font-black uppercase text-xs hover:text-primary hover:border-primary transition-colors">
          &larr; Return to Admin Panel
        </Link>
      </div>

      <div className="mb-8">
        <RapidCheckInForm events={allEvents} />
      </div>

      <BrutalCard className="p-6" shadowColor="gold">
        <h2 className="text-xl font-black uppercase italic mb-4">Manual Look-up</h2>
        <form className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end" method="get">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest opacity-60">Event Filter</label>
            <select
              name="eventId"
              defaultValue={eventId}
              className="w-full p-3 brutal-border bg-surface text-sm font-mono font-bold uppercase outline-none focus:border-primary"
            >
              <option value="">All Events</option>
              {allEvents.map((e) => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest opacity-60">Team Code</label>
            <input
              name="teamCode"
              defaultValue={teamCode}
              className="w-full p-3 brutal-border bg-surface text-sm font-mono font-bold uppercase outline-none focus:border-primary"
              placeholder="Registration ID / Protocol Code"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest opacity-60">Name</label>
            <input
              name="name"
              defaultValue={name}
              className="w-full p-3 brutal-border bg-surface text-sm font-mono font-bold outline-none focus:border-primary"
              placeholder="Member name"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest opacity-60">Phone</label>
            <input
              name="phone"
              defaultValue={phone}
              className="w-full p-3 brutal-border bg-surface text-sm font-mono font-bold outline-none focus:border-primary"
              placeholder="+91..."
            />
          </div>

          <div className="md:col-span-4 flex gap-4 pt-2">
            <BrutalButton type="submit" variant="secondary" size="sm">
              SEARCH &amp; SHOW
            </BrutalButton>
            <Link
              href="/admin/checkin"
              className="flex items-center px-4 py-2 brutal-border bg-surface text-xs font-black uppercase tracking-widest hover:bg-surface-container-low"
            >
              CLEAR
            </Link>
          </div>
        </form>
      </BrutalCard>

      {shouldSearch && (
        <div className="mt-8">
          <BrutalCard className="p-0 overflow-hidden" shadow={false}>
            <div className="p-6 border-b-2 border-on-surface bg-surface-container-low">
              <h2 className="text-2xl font-black uppercase italic">Results: {results.length}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans">
                <thead className="bg-surface-container-low border-b-2 border-on-surface text-[10px] font-black uppercase tracking-widest">
                  <tr>
                    <th className="p-4">Registration ID / Team</th>
                    <th className="p-4">Event</th>
                    <th className="p-4">Payment Status</th>
                    <th className="p-4">Check-in Status</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-on-surface/10">
                  {results.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-16 text-center opacity-40">
                        NO SEARCH RESULTS FOUND
                      </td>
                    </tr>
                  ) : (
                    results.map((result) => (
                      <tr key={result.regId} className="hover:bg-primary-container/10 transition-colors">
                        <td className="p-4">
                          <div className="font-mono text-xs opacity-70">{result.regId.substring(0, 18)}</div>
                          <div className="font-bold uppercase text-sm truncate max-w-[220px]">{result.teamName || result.memberName}</div>
                          <div className="text-[10px] opacity-60 uppercase truncate max-w-[220px]">{result.memberName} {result.memberPhone ? `(${result.memberPhone})` : ''}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-black uppercase text-xs text-primary truncate max-w-[220px]">{result.eventName}</div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 border-2 text-[10px] font-black uppercase ${result.regStatus === 'APPROVED' ? 'bg-green-100 text-green-800 border-green-800' : 'bg-surface border-on-surface opacity-30'}`}>
                            {result.regStatus}
                          </span>
                        </td>
                        <td className="p-4">
                          {result.checkedIn ? (
                            <div className="text-xs font-bold uppercase text-blue-600">
                              VERIFIED ENTRY
                              {result.checkedInAt ? (
                                <div className="text-[10px] opacity-60 font-mono">{result.checkedInAt.toLocaleString()}</div>
                              ) : null}
                            </div>
                          ) : (
                            <div className="text-xs font-bold uppercase opacity-60">WAITING AT GATE</div>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {result.checkedIn ? null : (
                            <form action={async (formData) => {
                              'use server';
                              await markRegistrationCheckedIn(formData);
                            }}>
                              <input type="hidden" name="id" value={result.regId} />
                              <BrutalButton
                                type="submit"
                                variant="outline"
                                size="sm"
                                disabled={result.regStatus !== 'APPROVED'}
                                className="w-full"
                              >
                                AUTHORIZE ENTRY
                              </BrutalButton>
                            </form>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </BrutalCard>
        </div>
      )}
    </div>
  );
}
