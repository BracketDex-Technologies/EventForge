import { prisma } from '@eventforge/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import MeetingRow from './MeetingRow';

export default async function NetworkingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) notFound();

  // Query 1:1 meetings
  const meetings = await prisma.meeting.findMany({
    where: { eventId: id },
    include: {
      aAttendee: {
        select: {
          displayName: true,
          company: true,
        },
      },
      bAttendee: {
        select: {
          displayName: true,
          company: true,
        },
      },
    },
    orderBy: { slot: 'asc' },
  });

  // Calculate statistics
  const totalMeetings = meetings.length;
  const pendingCount = meetings.filter((m) => m.status === 'pending').length;
  const acceptedCount = meetings.filter((m) => m.status === 'accepted').length;

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
        <Link href={`/console/events/${id}/networking`} className="border-b-2 border-indigo-600 pb-3 font-semibold text-indigo-600">1:1 Meetings</Link>
        <Link href={`/console/events/${id}/networking/leaderboard`} className="border-b-2 border-transparent pb-3 font-medium text-slate-500 hover:text-slate-900">Leaderboard (Gamification)</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up delay-100">
        <div className="ef-card p-4">
          <p className="text-sm font-medium text-slate-500">Total Booked Meetings</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalMeetings}</h3>
        </div>
        <div className="ef-card p-4">
          <p className="text-sm font-medium text-slate-500">Pending Requests</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{pendingCount}</h3>
        </div>
        <div className="ef-card p-4">
          <p className="text-sm font-medium text-slate-500">Confirmed Meetings</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{acceptedCount}</h3>
        </div>
      </div>

      <div className="ef-card animate-fade-in-up delay-200 overflow-hidden">
        {meetings.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-14 h-14 rounded-xl mx-auto mb-4 bg-slate-100 text-slate-500 flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 0110.089 20c-2.213 0-4.302-.636-6.07-1.741V18.25c0-2.485 3.022-4.5 6.75-4.5 1.707 0 3.268.419 4.417 1.107m0 0A5.995 5.995 0 0115 15.75M9 6a3 3 0 11-6 0 3 3 0 016 0zm12.75 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <p className="text-base font-semibold text-slate-900">No meeting requests yet</p>
            <p className="text-sm text-slate-500 mt-1">
              Attendee-initiated 1:1 meeting schedules will appear here.
            </p>
          </div>
        ) : (
          <table className="ef-table">
            <thead>
              <tr>
                <th className="py-3 px-6 text-left">Initiator</th>
                <th className="py-3 px-6 text-left"></th>
                <th className="py-3 px-6 text-left">Recipient</th>
                <th className="py-3 px-6 text-left">Date & Time</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-left">Notes</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {meetings.map((meeting) => (
                <MeetingRow key={meeting.id} eventId={id} meeting={meeting} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
