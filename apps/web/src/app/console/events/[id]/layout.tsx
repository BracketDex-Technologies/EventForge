import Link from 'next/link';
import { prisma } from '@eventforge/db';
import { notFound } from 'next/navigation';
import EventNav from './EventNav';

const tabs = [
  { label: 'Overview', href: '' },
  { label: 'Tickets', href: '/tickets' },
  { label: 'Agenda', href: '/agenda' },
  { label: 'Polls & Q&A', href: '/polls' },
  { label: 'Check-ins', href: '/check-ins' },
  { label: 'Scanner', href: '/scanner' },
  { label: 'Marketing', href: '/marketing' },
  { label: 'Analytics', href: '/analytics' },
];

export default async function EventLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
    select: { id: true, name: true, status: true },
  });

  if (!event) notFound();

  const basePath = `/console/events/${id}`;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <span className="ef-badge ef-badge-success text-[10px]">Published</span>;
      case 'live':
        return <span className="ef-badge ef-badge-info text-[10px] animate-pulse">Live</span>;
      default:
        return <span className="ef-badge ef-badge-neutral text-[10px]">Draft</span>;
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="ef-card p-6 animate-fade-in-up">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <Link
              href="/console/events"
              className="text-xs font-semibold flex items-center gap-1 text-indigo-600 hover:text-indigo-700 transition-colors mb-1"
            >
              &larr; All Events
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-slate-900">
                {event.name}
              </h1>
              {getStatusBadge(event.status)}
            </div>
            <p className="text-xs text-slate-400">
              Event ID: <span className="font-mono text-slate-500">{event.id}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-3 self-start md:self-center">
            <Link
              href={`/e/${event.id}`}
              target="_blank"
              className="ef-btn-secondary text-xs px-4 py-2"
            >
              Preview ↗
            </Link>
            <button className="ef-btn-primary text-xs px-4 py-2">
              Publish
            </button>
          </div>
        </div>

        <div className="h-px bg-slate-100 my-5" />
        <EventNav tabs={tabs} basePath={basePath} />
      </div>

      <div className="animate-fade-in-up delay-100">
        {children}
      </div>
    </div>
  );
}
