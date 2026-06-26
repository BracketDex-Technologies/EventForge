import { prisma } from '@eventforge/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function LeaderboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) notFound();

  // Query top attendees in leaderboard
  const attendees = await prisma.attendeeProfile.findMany({
    where: { eventId: id },
    orderBy: { points: 'desc' },
    take: 30,
  });

  // Calculate statistics
  const totalParticipants = attendees.length;
  const activeParticipants = attendees.filter((a) => a.points > 0).length;
  const totalPoints = attendees.reduce((acc, a) => acc + a.points, 0);
  const avgPoints = activeParticipants > 0 ? Math.round(totalPoints / activeParticipants) : 0;

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div className="animate-fade-in-up">
          <div className="flex items-center gap-2 text-sm mb-2 text-slate-400">
            <Link href={`/console/events/${id}`} className="hover:text-indigo-600 transition-colors">Event Dashboard</Link>
            <span>›</span>
            <span className="text-slate-600">Networking</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Networking & Gamification</h2>
          <p className="mt-1 text-sm text-slate-500">Coordinate 1:1 attendee match-making, monitor booked meeting slots, and view leaderboard engagement.</p>
        </div>
      </div>

      <div className="flex border-b border-slate-200 gap-6 text-sm">
        <Link href={`/console/events/${id}/networking`} className="border-b-2 border-transparent pb-3 font-medium text-slate-500 hover:text-slate-900">1:1 Meetings</Link>
        <Link href={`/console/events/${id}/networking/leaderboard`} className="border-b-2 border-indigo-600 pb-3 font-semibold text-indigo-600">Leaderboard (Gamification)</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up delay-100">
        <div className="ef-card p-4">
          <p className="text-sm font-medium text-slate-500">Enrolled Attendees</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalParticipants}</h3>
        </div>
        <div className="ef-card p-4">
          <p className="text-sm font-medium text-slate-500">Active Participants (Points &gt; 0)</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{activeParticipants}</h3>
        </div>
        <div className="ef-card p-4">
          <p className="text-sm font-medium text-slate-500">Avg. Points / Active User</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{avgPoints}</h3>
        </div>
      </div>

      <div className="ef-card animate-fade-in-up delay-200 overflow-hidden">
        {attendees.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-14 h-14 rounded-xl mx-auto mb-4 bg-slate-100 text-slate-500 flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.75m-1.875-3h7.5A2.25 2.25 0 0017.625 9v-.75A2.25 2.25 0 0015.375 6h-7.5A2.25 2.25 0 005.625 8.25v.75A2.25 2.25 0 007.875 11.25z" />
              </svg>
            </div>
            <p className="text-base font-semibold text-slate-900">No active leaderboard users</p>
            <p className="text-sm text-slate-500 mt-1">
              Gamification points earned by attendees via check-ins, polls, or meetings will appear here.
            </p>
          </div>
        ) : (
          <table className="ef-table">
            <thead>
              <tr>
                <th className="py-3 px-6 text-left w-16">Rank</th>
                <th className="py-3 px-6 text-left">Attendee</th>
                <th className="py-3 px-6 text-left">Company</th>
                <th className="py-3 px-6 text-left">Interests</th>
                <th className="py-3 px-6 text-right">Points</th>
              </tr>
            </thead>
            <tbody>
              {attendees.map((attendee, index) => (
                <tr key={attendee.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-500">
                    #{index + 1}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      {attendee.photoUrl ? (
                        <img
                          src={attendee.photoUrl}
                          alt={attendee.displayName}
                          className="w-8 h-8 rounded-full bg-slate-50 object-cover border border-slate-100"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                          {attendee.displayName.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-slate-800">{attendee.displayName}</div>
                        {attendee.title && <div className="text-xs text-slate-400">{attendee.title}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">
                    {attendee.company || '-'}
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-500">
                    <div className="flex flex-wrap gap-1">
                      {attendee.interests.length > 0 ? (
                        attendee.interests.map((interest) => (
                          <span
                            key={interest}
                            className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium"
                          >
                            {interest}
                          </span>
                        ))
                      ) : (
                        '-'
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right font-bold text-slate-900">
                    {attendee.points.toLocaleString()} pts
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
