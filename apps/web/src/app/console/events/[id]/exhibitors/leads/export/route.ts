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

  const leads = await prisma.leadCapture.findMany({
    where: { exhibitor: { eventId: id } },
    orderBy: { capturedAt: 'desc' },
    include: {
      exhibitor: {
        select: {
          name: true,
          tier: true,
          boothNumber: true,
          contactEmail: true,
        },
      },
    },
  });

  const csv = buildCsv({
    columns: [
      { key: 'exhibitor', header: 'Exhibitor' },
      { key: 'tier', header: 'Tier' },
      { key: 'booth', header: 'Booth' },
      { key: 'sponsorContact', header: 'Sponsor Contact' },
      { key: 'attendeeId', header: 'Attendee ID' },
      { key: 'ticketCode', header: 'Ticket Code' },
      { key: 'score', header: 'AI Lead Score' },
      { key: 'nextBestAction', header: 'Next Best Action' },
      { key: 'notes', header: 'Notes' },
      { key: 'capturedAt', header: 'Captured At' },
    ],
    rows: leads.map(lead => ({
      exhibitor: lead.exhibitor.name,
      tier: lead.exhibitor.tier,
      booth: lead.exhibitor.boothNumber,
      sponsorContact: lead.exhibitor.contactEmail,
      attendeeId: lead.attendeeId,
      ticketCode: lead.ticketCode,
      score: getLeadMetaValue(lead.meta, 'score'),
      nextBestAction: getLeadMetaValue(lead.meta, 'nextBestAction'),
      notes: lead.notes,
      capturedAt: lead.capturedAt.toISOString(),
    })),
  });

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${slugify(event.name)}-sponsor-leads.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}

function getLeadMetaValue(meta: unknown, key: string) {
  if (!meta || typeof meta !== 'object' || !(key in meta)) {
    return '';
  }

  const value = (meta as Record<string, unknown>)[key];
  return value === null || value === undefined ? '' : String(value);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'event';
}
