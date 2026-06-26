import { prisma } from '@eventforge/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function PollsPage({
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
          <span className="text-slate-600">Polls & Q&A</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Live Polls & Q&A</h2>
        <p className="mt-1 text-sm text-slate-500">Engage your audience during sessions with live interaction tools.</p>
      </div>

      <div className="ef-card p-16 text-center animate-fade-in-up delay-200">
        <div className="w-14 h-14 rounded-xl mx-auto mb-4 bg-indigo-50 text-indigo-500 flex items-center justify-center">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Audience Engagement Coming Soon</h3>
        <p className="text-slate-500 max-w-sm mx-auto mt-2">
          Create polls and manage Q&A sessions for your event tracks.
        </p>
      </div>
    </div>
  );
}
