import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { prisma } from '@eventforge/db';

export default async function EventsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const member = await prisma.organizationMember.findFirst({
    where: { userId: user.id },
    include: { organization: true }
  });

  if (!member) {
    return (
      <div className="p-8 text-center text-sm text-slate-400">
        No organization found. Please contact support.
      </div>
    );
  }

  const events = await prisma.event.findMany({
    where: { organizationId: member.organizationId, deletedAt: null },
    orderBy: { createdAt: 'desc' }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <span className="ef-badge ef-badge-success">Published</span>;
      case 'live':
        return <span className="ef-badge ef-badge-info animate-pulse">Live</span>;
      default:
        return <span className="ef-badge ef-badge-neutral">Draft</span>;
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Events</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage and monitor your upcoming and past events.
          </p>
        </div>
        <Link href="/console/events/new" className="ef-btn-primary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Create Event
        </Link>
      </div>

      <div className="ef-card">
        {events.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-14 h-14 rounded-xl mx-auto mb-4 bg-slate-100 text-slate-500 flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </div>
            <p className="text-base font-semibold text-slate-900">No events found</p>
            <p className="text-sm text-slate-500 mt-1">
              Create your first event to get started with EventForge.
            </p>
          </div>
        ) : (
          <table className="ef-table">
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Type</th>
                <th>Status</th>
                <th>Starts At</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td className="font-semibold text-slate-900">
                    {event.name}
                  </td>
                  <td className="capitalize text-slate-600">
                    {event.type.replace('_', ' ')}
                  </td>
                  <td>
                    {getStatusBadge(event.status)}
                  </td>
                  <td className="text-slate-600">
                    {event.startsAt ? new Date(event.startsAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    }) : <span className="text-slate-400">TBD</span>}
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/console/events/${event.id}`} className="ef-btn-secondary text-xs px-3 py-1.5">
                        Manage
                      </Link>
                      <Link href={`/e/${event.id}`} target="_blank" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
                        View ↗
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
