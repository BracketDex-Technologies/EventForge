import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { prisma } from '@eventforge/db';

export default async function EventsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Get the organization for this user
  const member = await prisma.organizationMember.findFirst({
    where: { userId: user.id },
    include: { organization: true }
  });

  if (!member) {
    return (
      <div className="p-8 text-center text-sm" style={{ color: 'var(--ef-text-muted)' }}>
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
    <div className="space-y-6 max-w-6xl animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="ef-headline-lg">Events</h2>
          <p className="text-[13px] mt-0.5" style={{ color: 'var(--ef-text-muted)' }}>
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

      {/* Events Container */}
      <div className="ef-card animate-fade-in-up delay-100">
        {events.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(59,130,246,0.08) 100%)' }}>
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                   style={{ color: 'var(--ef-primary)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
              </svg>
            </div>
            <p className="text-lg font-semibold" style={{ color: 'var(--ef-text-primary)' }}>
              No events found
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--ef-text-muted)' }}>
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
                <tr key={event.id} className="ef-card-hover">
                  <td className="font-semibold" style={{ color: 'var(--ef-text-primary)' }}>
                    {event.name}
                  </td>
                  <td className="capitalize" style={{ color: 'var(--ef-text-secondary)' }}>
                    {event.type.replace('_', ' ')}
                  </td>
                  <td>
                    {getStatusBadge(event.status)}
                  </td>
                  <td style={{ color: 'var(--ef-text-secondary)' }}>
                    {event.startsAt ? new Date(event.startsAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    }) : <span style={{ color: 'var(--ef-text-muted)' }}>TBD</span>}
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/console/events/${event.id}`} className="ef-btn-secondary" style={{ padding: '6px 14px', fontSize: '12px' }}>
                        Manage
                      </Link>
                      <Link href={`/e/${event.id}`} target="_blank" className="ef-btn-secondary border-none" style={{ padding: '6px 10px', fontSize: '12px', color: 'var(--ef-primary)' }}>
                        View Site ↗
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
