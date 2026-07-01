import { prisma } from '@eventforge/db';
import { buildCsv } from '@eventforge/domain';
import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
    select: { id: true, name: true },
  });

  if (!event) {
    return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
  }

  const attendees = await prisma.attendeeProfile.findMany({
    where: { eventId: id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      displayName: true,
      title: true,
      company: true,
      bio: true,
      visibility: true,
      points: true,
      createdAt: true,
    },
  });

  const csv = buildCsv({
    columns: [
      { key: 'id', header: 'Attendee ID' },
      { key: 'displayName', header: 'Name' },
      { key: 'title', header: 'Title' },
      { key: 'company', header: 'Company' },
      { key: 'visibility', header: 'Visibility' },
      { key: 'points', header: 'Points' },
      { key: 'createdAt', header: 'Registered At' },
    ],
    rows: attendees.map(attendee => ({
      ...attendee,
      createdAt: attendee.createdAt.toISOString(),
    })),
  });

  const filename = `${slugify(event.name)}-attendees.csv`;

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'event';
}
