import { prisma } from '@eventforge/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';

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

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-2 text-sm mb-2 text-slate-400">
          <Link href={`/console/events/${id}`} className="hover:text-indigo-600 transition-colors">Event Dashboard</Link>
          <span>›</span>
          <span className="text-slate-600">Check-ins</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Attendee Check-ins</h2>
        <p className="mt-1 text-sm text-slate-500">Monitor live check-ins and manage on-site registrations.</p>
      </div>

      <div className="ef-card p-16 text-center animate-fade-in-up delay-200">
        <div className="w-14 h-14 rounded-xl mx-auto mb-4 bg-indigo-50 text-indigo-500 flex items-center justify-center">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Check-in Management Coming Soon</h3>
        <p className="text-slate-500 max-w-sm mx-auto mt-2">
          Live monitoring of check-ins will be available before your event starts.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link href={`/console/events/${id}/scanner`} className="ef-btn-primary">
            Open QR Scanner
          </Link>
        </div>
      </div>
    </div>
  );
}
