import { db } from '@/db';
import { registrations, events, teamMembers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await db.select({
      memberName: teamMembers.name,
      memberCollege: teamMembers.college,
      memberPhone: teamMembers.phone,
      eventName: events.name,
      teamName: registrations.teamName,
      paymentStatus: registrations.status,
      checkInStatus: registrations.checkedIn,
    })
    .from(registrations)
    .innerJoin(events, eq(registrations.eventId, events.id))
    .innerJoin(teamMembers, eq(registrations.teamId, teamMembers.teamId));

    if (data.length === 0) {
      return new NextResponse('No registrations found.', { status: 404 });
    }

    const headers = ['Name', 'College', 'Event', 'Team', 'Phone', 'Payment status', 'Check-in status'];
    
    const csvContent = [
      headers.join(','),
      ...data.map(row => {
        return [
          `"${(row.memberName || '').replace(/"/g, '""')}"`,
          `"${(row.memberCollege || '').replace(/"/g, '""')}"`,
          `"${(row.eventName || '').replace(/"/g, '""')}"`,
          `"${(row.teamName || '').replace(/"/g, '""')}"`,
          `"${(row.memberPhone || '').replace(/"/g, '""')}"`,
          `"${(row.paymentStatus || '').replace(/"/g, '""')}"`,
          `"${row.checkInStatus ? 'CHECKED_IN' : 'NOT_CHECKED_IN'}"`,
        ].join(',');
      })
    ].join('\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="kratos_master_export.csv"',
      },
    });
  } catch (error) {
    console.error('Export Error:', error);
    return new NextResponse('Export Failed', { status: 500 });
  }
}
