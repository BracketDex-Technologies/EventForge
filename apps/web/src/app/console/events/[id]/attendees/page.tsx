import { prisma } from '@eventforge/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function AttendeesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) notFound();

  const attendees = await prisma.attendeeProfile.findMany({
    where: { eventId: id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div className="animate-fade-in-up">
          <div className="flex items-center gap-2 text-sm mb-2 text-slate-400">
            <Link href={`/console/events/${id}`} className="hover:text-indigo-600 transition-colors">Event Dashboard</Link>
            <span>›</span>
            <span className="text-slate-600">Attendees</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Attendees CRM</h2>
          <p className="mt-1 text-sm text-slate-500">View and manage all registered attendees for your event.</p>
        </div>
        <div className="flex items-center gap-3 animate-fade-in-up">
          <Link href={`/console/events/${id}/attendees/export`} className="ef-btn-secondary">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export CSV
          </Link>
          <button className="ef-btn-primary">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Attendee
          </button>
        </div>
      </div>

      <div className="ef-card animate-fade-in-up delay-200">
        <div className="p-4 border-b border-slate-100 flex items-center gap-4 bg-slate-50">
          <div className="relative flex-1 max-w-md">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input type="text" placeholder="Search attendees by name or email..." className="ef-input pl-9 text-sm" />
          </div>
          <select className="ef-input max-w-[150px] text-sm">
            <option value="all">All Statuses</option>
            <option value="checked_in">Checked In</option>
            <option value="pending">Pending Check-in</option>
          </select>
        </div>

        {attendees.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-14 h-14 rounded-xl mx-auto mb-4 bg-slate-100 text-slate-500 flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <p className="text-base font-semibold text-slate-900">No attendees yet</p>
            <p className="text-sm text-slate-500 mt-1">
              Share your event page to start collecting registrations.
            </p>
          </div>
        ) : (
          <table className="ef-table">
            <thead>
              <tr>
                <th>Attendee</th>
                <th>Company & Title</th>
                <th>Ticket Info</th>
                <th>Registered</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendees.map((attendee) => (
                <tr key={attendee.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                        {attendee.displayName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{attendee.displayName}</div>
                        <div className="text-xs text-slate-500">ID: {attendee.id.slice(0, 8)}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col text-sm">
                      <span className="text-slate-900 font-medium">{attendee.company || '-'}</span>
                      <span className="text-slate-500">{attendee.title || '-'}</span>
                    </div>
                  </td>
                  <td>
                    <span className="ef-badge ef-badge-success">Registered</span>
                  </td>
                  <td className="text-slate-600 text-sm">
                    {new Date(attendee.createdAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </td>
                  <td className="text-right">
                    <button className="ef-btn-secondary text-xs px-3 py-1.5">View Profile</button>
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
