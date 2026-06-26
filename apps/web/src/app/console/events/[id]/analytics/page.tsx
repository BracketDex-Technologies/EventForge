import { prisma } from '@eventforge/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function AnalyticsPage({
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
          <span className="text-slate-600">Analytics</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Event Analytics</h2>
        <p className="mt-1 text-sm text-slate-500">Track registrations, revenue, and attendee engagement.</p>
      </div>

      <div className="ef-card p-16 text-center animate-fade-in-up delay-200">
        <div className="w-14 h-14 rounded-xl mx-auto mb-4 bg-indigo-50 text-indigo-500 flex items-center justify-center">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Analytics Coming Soon</h3>
        <p className="text-slate-500 max-w-sm mx-auto mt-2">
          We are currently building comprehensive analytics dashboards for your events. Check back later!
        </p>
      </div>
    </div>
  );
}
