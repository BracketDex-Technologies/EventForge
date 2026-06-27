import { prisma } from '@eventforge/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import WaitlistManager from './WaitlistManager';

export default async function WaitlistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) notFound();

  // Load all waitlist entries for this event
  const entries = await prisma.waitlistEntry.findMany({
    where: { eventId: id },
    include: {
      ticketType: {
        select: {
          name: true,
        },
      },
    },
    orderBy: [
      { promotedAt: 'asc' },
      { position: 'asc' },
    ],
  });

  // Load ticket types for manually adding entries
  const ticketTypes = await prisma.ticketType.findMany({
    where: { eventId: id, deletedAt: null },
    select: {
      id: true,
      name: true,
    },
  });

  const serializedEntries = entries.map(e => ({
    id: e.id,
    eventId: e.eventId,
    ticketTypeId: e.ticketTypeId,
    email: e.email,
    position: e.position,
    promotedAt: e.promotedAt ? e.promotedAt.toISOString() : null,
    createdAt: e.createdAt.toISOString(),
    ticketType: {
      name: e.ticketType.name,
    },
  }));

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div className="animate-fade-in-up">
          <div className="flex items-center gap-2 text-sm mb-2 text-slate-400">
            <Link href={`/console/events/${id}`} className="hover:text-indigo-600 transition-colors">Event Dashboard</Link>
            <span>›</span>
            <Link href={`/console/events/${id}/tickets`} className="hover:text-indigo-600 transition-colors">Tickets</Link>
            <span>›</span>
            <span className="text-slate-600">Waitlist</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Waitlist Queue</h2>
          <p className="mt-1 text-sm text-slate-500">Track and promote registrations on the event waitlist.</p>
        </div>
      </div>

      <div className="flex border-b border-slate-200 gap-6 text-sm">
        <Link href={`/console/events/${id}/tickets`} className="border-b-2 border-transparent pb-3 font-medium text-slate-500 hover:text-slate-900">Ticket Tiers</Link>
        <Link href={`/console/events/${id}/tickets/promos`} className="border-b-2 border-transparent pb-3 font-medium text-slate-500 hover:text-slate-900">Promo Codes</Link>
        <Link href={`/console/events/${id}/tickets/waitlist`} className="border-b-2 border-indigo-600 pb-3 font-semibold text-indigo-600">Waitlist</Link>
      </div>

      <WaitlistManager
        eventId={id}
        entries={serializedEntries}
        ticketTypes={ticketTypes}
      />
    </div>
  );
}
