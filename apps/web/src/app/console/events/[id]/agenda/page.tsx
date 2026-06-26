import { prisma } from '@eventforge/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function AgendaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) notFound();

  const sessions = await prisma.session.findMany({
    where: { eventId: id },
    orderBy: { startsAt: 'asc' },
    include: {
      room: true,
      track: true,
      speakers: {
        include: {
          speaker: true
        }
      }
    }
  });

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div className="animate-fade-in-up">
          <div className="flex items-center gap-2 text-sm mb-2 text-slate-400">
            <Link href={`/console/events/${id}`} className="hover:text-indigo-600 transition-colors">Event Dashboard</Link>
            <span>›</span>
            <span className="text-slate-600">Agenda</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Agenda & Sessions</h2>
          <p className="mt-1 text-sm text-slate-500">Manage the schedule, sessions, and tracks for your event.</p>
        </div>
        <button className="ef-btn-primary animate-fade-in-up">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Session
        </button>
      </div>

      <div className="ef-card animate-fade-in-up delay-200">
        {sessions.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-14 h-14 rounded-xl mx-auto mb-4 bg-slate-100 text-slate-500 flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </div>
            <p className="text-base font-semibold text-slate-900">No sessions scheduled</p>
            <p className="text-sm text-slate-500 mt-1">
              Start building your event's agenda by adding your first session.
            </p>
          </div>
        ) : (
          <table className="ef-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Title</th>
                <th>Track / Room</th>
                <th>Speakers</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.id}>
                  <td className="font-medium text-slate-900 whitespace-nowrap">
                    {new Date(session.startsAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} -
                    {new Date(session.endsAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </td>
                  <td className="font-semibold text-slate-900">
                    {(session.title as any)?.en || 'Untitled Session'}
                  </td>
                  <td>
                    <div className="flex flex-col gap-1 text-sm">
                      {session.track ? <span className="text-indigo-600 font-medium">{session.track.name}</span> : <span className="text-slate-400">No Track</span>}
                      <span className="text-slate-500">{session.room?.name || 'No Room'}</span>
                    </div>
                  </td>
                  <td className="text-slate-600">
                    {session.speakers.length > 0 
                      ? session.speakers.map(s => s.speaker.name).join(', ')
                      : <span className="text-slate-400">TBA</span>}
                  </td>
                  <td className="text-right">
                    <button className="ef-btn-secondary text-xs px-3 py-1.5">Edit</button>
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
