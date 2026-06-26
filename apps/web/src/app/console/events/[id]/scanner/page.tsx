import { prisma } from '@eventforge/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function ScannerPage({
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
          <span className="text-slate-600">Scanner</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">QR Check-in Scanner</h2>
        <p className="mt-1 text-sm text-slate-500">Scan attendee QR codes for fast on-site check-in.</p>
      </div>

      <div className="ef-card p-16 text-center animate-fade-in-up delay-200">
        <div className="w-14 h-14 rounded-xl mx-auto mb-4 bg-indigo-50 text-indigo-500 flex items-center justify-center">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Web Scanner Required Device Permissions</h3>
        <p className="text-slate-500 max-w-sm mx-auto mt-2">
          This feature requires camera access to scan QR codes. Please allow camera permissions when prompted.
        </p>
        <div className="mt-6">
          <button className="ef-btn-primary" disabled>Start Camera (Coming Soon)</button>
        </div>
      </div>
    </div>
  );
}
