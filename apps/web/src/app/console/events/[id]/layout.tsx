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
        return <span className="ef-badge ef-badge-success text-[10px] py-0.5 px-2">Published</span>;
      case 'live':
        return <span className="ef-badge ef-badge-info text-[10px] py-0.5 px-2 animate-pulse">Live</span>;
      default:
        return <span className="ef-badge ef-badge-neutral text-[10px] py-0.5 px-2">Draft</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Event Header Card */}
      <div className="ef-card p-6 bg-white animate-fade-in-up">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <Link
              href="/console/events"
              className="text-[12px] font-semibold flex items-center gap-1 hover:underline mb-1"
              style={{ color: 'var(--ef-primary)' }}
            >
              &larr; All Events
            </Link>
            <div className="flex items-center gap-3">
              <h2 className="ef-headline-md font-bold text-gray-900 leading-tight">
                {event.name}
              </h2>
              {getStatusBadge(event.status)}
            </div>
            <p className="text-[12px]" style={{ color: 'var(--ef-text-muted)' }}>
              Event ID: <span className="font-mono text-slate-500">{event.id}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-3 self-start md:self-center">
            <Link
              href={`/e/${event.id}`}
              target="_blank"
              className="ef-btn-secondary"
              style={{ padding: '8px 18px', fontSize: '13px' }}
            >
              Preview Site ↗
            </Link>
            <button className="ef-btn-primary" style={{ padding: '8px 18px', fontSize: '13px' }}>
              Publish Event
            </button>
          </div>
        </div>

        {/* Tab Navigation Divider */}
        <div className="h-px bg-slate-100 my-5" />

        {/* Dynamic client tab nav */}
        <EventNav tabs={tabs} basePath={basePath} />
      </div>

      {/* Child views container */}
      <div className="animate-fade-in-up delay-100">
        {children}
      </div>
    </div>
  );
}
