import { prisma } from '@eventforge/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import CheckInManager from './CheckInManager';

export default async function CheckInsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) notFound();

  // Fetch real attendee profiles
  const attendees = await prisma.attendeeProfile.findMany({
    where: { eventId: id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      displayName: true,
      company: true,
      title: true,
    },
  });

  const formattedAttendees = attendees.map(a => ({
    id: a.id,
    displayName: a.displayName,
    company: a.company,
    jobTitle: a.title,
  }));

  // Fetch real check-in records
  const checkIns = await prisma.checkIn.findMany({
    where: { eventId: id },
    select: {
      id: true,
      ticketId: true,
      method: true,
      at: true,
    },
  });

  const serializedCheckIns = checkIns.map(c => ({
    id: c.id,
    ticketId: c.ticketId || '',
    method: c.method,
    scannedAt: c.at.toISOString(),
  }));

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div className="animate-fade-in-up">
          <div className="flex items-center gap-2 text-sm mb-2 text-slate-400">
            <Link href={`/console/events/${id}`} className="hover:text-indigo-600 transition-colors">Event Dashboard</Link>
            <span>›</span>
            <span className="text-slate-600">On-site Check-in</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Check-ins Manager</h2>
          <p className="mt-1 text-sm text-slate-500">Manage attendee arrivals, badge printing, and check-in status.</p>
        </div>
        <div className="flex items-center gap-3 animate-fade-in-up">
          <Link href={`/console/events/${id}/scanner`} className="ef-btn-primary flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
            </svg>
            Open QR Scanner
          </Link>
          <Link href={`/console/events/${id}/kiosk`} className="ef-btn-secondary flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
            </svg>
            Kiosk Mode
          </Link>
        </div>
      </div>

      <CheckInManager
        eventId={id}
        attendees={formattedAttendees}
        checkIns={serializedCheckIns}
      />
    </div>
  );
}
