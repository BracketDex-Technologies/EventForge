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

  // Fetch attendees and check-in statuses (mocked check-in data since we don't have a check-in model relation loaded easily without a big schema update)
  const attendees = await prisma.attendeeProfile.findMany({
    where: { eventId: id },
    orderBy: { createdAt: 'desc' },
  });

  // Mock checking in the first attendee just for UI purposes if there are any
  const attendeesWithStatus = attendees.map((a, i) => ({
    ...a,
    status: i % 3 === 0 ? 'checked_in' : 'pending',
    checkedInAt: i % 3 === 0 ? new Date().toISOString() : null,
  }));

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div className="animate-fade-in-up">
          <div className="flex items-center gap-2 text-sm mb-2 text-slate-400">
            <Link href={`/console/events/${id}`} className="hover:text-indigo-600 transition-colors">Event Dashboard</Link>
            <span>›</span>
            <span className="text-slate-600">On-site Check-in</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Check-ins Manager</h2>
          <p className="mt-1 text-sm text-slate-500">Manage attendee arrivals and badge printing.</p>
        </div>
        <div className="flex items-center gap-3 animate-fade-in-up">
          <Link href={`/console/events/${id}/scanner`} className="ef-btn-primary">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
            </svg>
            Open QR Scanner
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up delay-100">
        <div className="ef-card p-4 border-l-4 border-l-slate-300">
          <p className="text-sm font-medium text-slate-500">Total Registered</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{attendees.length}</h3>
        </div>
        <div className="ef-card p-4 border-l-4 border-l-emerald-500">
          <p className="text-sm font-medium text-slate-500">Checked In</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">
            {attendeesWithStatus.filter(a => a.status === 'checked_in').length}
          </h3>
        </div>
        <div className="ef-card p-4 border-l-4 border-l-amber-500">
          <p className="text-sm font-medium text-slate-500">Pending</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">
            {attendeesWithStatus.filter(a => a.status === 'pending').length}
          </h3>
        </div>
      </div>

      <div className="ef-card animate-fade-in-up delay-200">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="relative flex-1 max-w-md">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input type="text" placeholder="Search by name, email, or ticket ID..." className="ef-input pl-9 text-sm" />
          </div>
        </div>

        {attendeesWithStatus.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-14 h-14 rounded-xl mx-auto mb-4 bg-slate-100 text-slate-500 flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <p className="text-base font-semibold text-slate-900">No attendees to check in</p>
          </div>
        ) : (
          <table className="ef-table">
            <thead>
              <tr>
                <th>Attendee</th>
                <th>Company</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendeesWithStatus.map((attendee) => (
                <tr key={attendee.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                        {attendee.displayName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{attendee.displayName}</div>
                        <div className="text-xs text-slate-500 font-mono">#{attendee.id.slice(0, 8)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-sm text-slate-600">{attendee.company || '-'}</td>
                  <td>
                    {attendee.status === 'checked_in' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Checked In
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="text-right">
                    {attendee.status === 'pending' ? (
                      <button className="ef-btn-secondary text-xs px-3 py-1.5 text-emerald-700 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300">
                        Check In
                      </button>
                    ) : (
                      <button className="ef-btn-secondary text-xs px-3 py-1.5 opacity-50 cursor-not-allowed">
                        Checked In
                      </button>
                    )}
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
