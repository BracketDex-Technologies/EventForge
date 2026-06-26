import { prisma } from '@eventforge/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function MarketingPage({
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
          <span className="text-slate-600">Marketing</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Email Marketing</h2>
        <p className="mt-1 text-sm text-slate-500">Send campaigns to attendees and promote your event.</p>
      </div>

      <div className="ef-card p-16 text-center animate-fade-in-up delay-200">
        <div className="w-14 h-14 rounded-xl mx-auto mb-4 bg-indigo-50 text-indigo-500 flex items-center justify-center">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Marketing Tools Coming Soon</h3>
        <p className="text-slate-500 max-w-sm mx-auto mt-2">
          Design and send email campaigns directly from EventForge.
        </p>
      </div>
    </div>
  );
}
