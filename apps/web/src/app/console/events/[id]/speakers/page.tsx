import { prisma } from '@eventforge/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import CreateSpeakerButton from './CreateSpeakerButton';

export default async function SpeakersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) notFound();

  const speakers = await prisma.speaker.findMany({
    where: { eventId: id },
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: {
          sessions: true
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
            <span className="text-slate-600">Speakers</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Manage Speakers</h2>
          <p className="mt-1 text-sm text-slate-500">Add speakers, manage their profiles, and assign them to sessions.</p>
        </div>
        <div className="animate-fade-in-up">
          <CreateSpeakerButton eventId={id} />
        </div>
      </div>

      <div className="ef-card animate-fade-in-up delay-200">
        {speakers.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-14 h-14 rounded-xl mx-auto mb-4 bg-slate-100 text-slate-500 flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <p className="text-base font-semibold text-slate-900">No speakers found</p>
            <p className="text-sm text-slate-500 mt-1">
              Add speakers to feature them on your event website.
            </p>
          </div>
        ) : (
          <table className="ef-table">
            <thead>
              <tr>
                <th>Speaker</th>
                <th>Company & Title</th>
                <th>Status</th>
                <th>Sessions</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {speakers.map((speaker) => (
                <tr key={speaker.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                        {speaker.name.charAt(0)}
                      </div>
                      <div className="font-semibold text-slate-900">{speaker.name}</div>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col text-sm">
                      <span className="text-slate-900 font-medium">{speaker.company || '-'}</span>
                      <span className="text-slate-500">{speaker.title || '-'}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`ef-badge ${speaker.status === 'confirmed' ? 'ef-badge-success' : 'ef-badge-neutral'}`}>
                      {speaker.status}
                    </span>
                  </td>
                  <td className="text-slate-600 font-medium">
                    {speaker._count.sessions}
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
