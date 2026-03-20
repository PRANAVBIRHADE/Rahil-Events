import { db } from '@/db';
import { registrations, users, events } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await db.select({
      participantName: users.name,
      moduleName: events.name,
      status: registrations.status,
      transactionId: registrations.transactionId,
    })
    .from(registrations)
    .innerJoin(users, eq(registrations.userId, users.id))
    .innerJoin(events, eq(registrations.eventId, events.id));

    if (data.length === 0) {
      return new NextResponse('No proofs found.', { status: 404 });
    }

    const headers = ['Participant Name', 'Module Name', 'Status', 'Transaction Verification Link / ID'];
    
    const csvContent = [
      headers.join(','),
      ...data.map(row => {
        return [
          `"${(row.participantName || '').replace(/"/g, '""')}"`,
          `"${(row.moduleName || '').replace(/"/g, '""')}"`,
          row.status,
          `"${(row.transactionId || '').replace(/"/g, '""')}"`,
        ].join(',');
      })
    ].join('\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="kratos_payment_proofs.csv"',
      },
    });
  } catch (error) {
    console.error('Proofs Export Error:', error);
    return new NextResponse('Export Failed', { status: 500 });
  }
}
