import { db } from '@/db';
import { registrations, users, events } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await db.select({
      id: registrations.id,
      participantName: users.name,
      participantEmail: users.email,
      moduleName: events.name,
      branch: events.branch,
      fee: events.fee,
      status: registrations.status,
      transactionId: registrations.transactionId,
      createdAt: registrations.createdAt,
    })
    .from(registrations)
    .innerJoin(users, eq(registrations.userId, users.id))
    .innerJoin(events, eq(registrations.eventId, events.id));

    if (data.length === 0) {
      return new NextResponse('No registrations found.', { status: 404 });
    }

    const headers = ['Registration ID', 'Participant Name', 'Participant Email', 'Module Name', 'Branch', 'Fee', 'Status', 'Transaction ID', 'Registration Date'];
    
    const csvContent = [
      headers.join(','),
      ...data.map(row => {
        return [
          row.id,
          `"${(row.participantName || '').replace(/"/g, '""')}"`,
          `"${(row.participantEmail || '').replace(/"/g, '""')}"`,
          `"${(row.moduleName || '').replace(/"/g, '""')}"`,
          `"${(row.branch || '').replace(/"/g, '""')}"`,
          row.fee,
          row.status,
          `"${(row.transactionId || '').replace(/"/g, '""')}"`,
          row.createdAt?.toISOString() || ''
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
