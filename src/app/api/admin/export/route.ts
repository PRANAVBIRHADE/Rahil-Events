import { db } from '@/db';
import { registrations, events, teamMembers, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { requireStaffPageAccess } from '@/lib/authz';

export async function GET(request: Request) {
  try {
    await requireStaffPageAccess();

    const { searchParams } = new URL(request.url);
    const dataset = searchParams.get('dataset') || 'participants';
    const eventId = searchParams.get('eventId');

    if (dataset === 'users') {
      const allUsers = await db.select({
        name: users.name,
        email: users.email,
        phone: users.phone,
        college: users.college,
        branch: users.branch,
        year: users.year,
        role: users.role,
        xp: users.xp,
        level: users.level,
        joinedAt: users.createdAt,
      }).from(users);

      if (allUsers.length === 0) {
        return new NextResponse('No users found.', { status: 404 });
      }

      const headers = ['Name', 'Email', 'Phone', 'College', 'Branch', 'Year', 'Role', 'XP', 'Level', 'Joined'];
      
      const csvContent = [
        headers.join(','),
        ...allUsers.map(row => {
          return [
            `"${(row.name || '').replace(/"/g, '""')}"`,
            `"${(row.email || '').replace(/"/g, '""')}"`,
            `"${(row.phone || '').replace(/"/g, '""')}"`,
            `"${(row.college || '').replace(/"/g, '""')}"`,
            `"${(row.branch || '').replace(/"/g, '""')}"`,
            `"${(row.year?.toString() || '').replace(/"/g, '""')}"`,
            `"${(row.role || '').replace(/"/g, '""')}"`,
            `"${(row.xp?.toString() || '').replace(/"/g, '""')}"`,
            `"${(row.level?.toString() || '').replace(/"/g, '""')}"`,
            `"${row.joinedAt ? new Date(row.joinedAt).toISOString() : ''}"`,
          ].join(',');
        })
      ].join('\n');

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="kratos_users_export.csv"',
        },
      });
    }

    // Default: participants dataset
    const baseQuery = db.select({
      memberName: teamMembers.name,
      memberCollege: teamMembers.college,
      memberPhone: teamMembers.phone,
      eventName: events.name,
      teamName: registrations.teamName,
      paymentStatus: registrations.status,
      userId: registrations.userId,
    })
    .from(registrations)
    .innerJoin(events, eq(registrations.eventId, events.id))
    .innerJoin(teamMembers, eq(registrations.teamId, teamMembers.teamId));

    const finalQuery = eventId ? baseQuery.where(eq(registrations.eventId, eventId)) : baseQuery;
    
    // Also include solo entries where no teamMembers row might exist but we want the core user info.
    // Wait, Kratos enforces team creation even for single players inside teamMembers table in the logic.
    // So innerJoin on teamMembers is sufficient per the schema design.
    
    const data = await finalQuery;

    if (data.length === 0) {
      return new NextResponse('No registrations found.', { status: 404 });
    }

    const headers = ['Name', 'College', 'Event', 'Team', 'Phone', 'Payment status', 'User ID'];
    
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
          `"${(row.userId || '').replace(/"/g, '""')}"`,
        ].join(',');
      })
    ].join('\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="kratos_participants_export.csv"',
      },
    });
  } catch (error) {
    console.error('Export Error:', error);
    return new NextResponse('Export Failed. Unauthorized or Server Error.', { status: 500 });
  }
}
