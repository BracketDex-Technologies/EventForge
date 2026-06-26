import { prisma } from '@eventforge/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function MatchmakingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) notFound();

  // Load attendee profiles
  const profiles = await prisma.attendeeProfile.findMany({
    where: { eventId: id },
  });

  // Calculate Matches (Cosine Similarity on interests/tags)
  // Simple Jaccard similarity or overlap count as similarity score
  const matches: Array<{
    a: { name: string; email: string; company: string | null; interests: string[] };
    b: { name: string; email: string; company: string | null; interests: string[] };
    common: string[];
    score: number;
  }> = [];

  for (let i = 0; i < profiles.length; i++) {
    for (let j = i + 1; j < profiles.length; j++) {
      const a = profiles[i];
      const b = profiles[j];

      if (!a.interests || !b.interests) continue;

      const aInterests = a.interests.map(s => s.toLowerCase().trim());
      const bInterests = b.interests.map(s => s.toLowerCase().trim());

      const common = aInterests.filter(val => bInterests.includes(val));

      if (common.length > 0) {
        // Jaccard Index: Intersection / Union
        const unionSize = new Set([...aInterests, ...bInterests]).size;
        const score = Math.round((common.length / unionSize) * 100);

        matches.push({
          a: {
            name: a.displayName,
            email: 'attendee.a@example.com', // mock email or user query
            company: a.company,
            interests: a.interests,
          },
          b: {
            name: b.displayName,
            email: 'attendee.b@example.com',
            company: b.company,
            interests: b.interests,
          },
          common,
          score,
        });
      }
    }
  }

  // Sort matches by highest score
  const sortedMatches = matches.sort((x, y) => y.score - x.score);

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <div className="flex items-center gap-2 text-sm mb-2 text-slate-400">
          <Link href={`/console/events/${id}`} className="hover:text-indigo-600 transition-colors">Event Dashboard</Link>
          <span>›</span>
          <Link href={`/console/events/${id}/networking`} className="hover:text-indigo-600 transition-colors">Networking</Link>
          <span>›</span>
          <span className="text-slate-600">AI Matchmaking</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">AI Matchmaking Engine</h2>
        <p className="mt-1 text-sm text-slate-500">Automatically analyze attendee profiles and interests to suggest high-value meetings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Match Stats Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="ef-card p-6 bg-slate-900 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400">Matchmaking Stats</h3>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Total Profiles</p>
                <p className="text-2xl font-black text-white mt-0.5">{profiles.length}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Suggested Matches</p>
                <p className="text-2xl font-black text-emerald-400 mt-0.5">{sortedMatches.length}</p>
              </div>
            </div>
            
            <p className="text-xs text-slate-400 mt-4 leading-normal">
              Organizers can review generated matchmaking pairings and nudge attendees to schedule one-on-one video meetings.
            </p>
          </div>
        </div>

        {/* Matches List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="ef-card p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-5">AI Recommended Pairs</h3>

            {sortedMatches.length === 0 ? (
              <div className="p-16 text-center border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
                <div className="w-12 h-12 rounded-full mx-auto bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                  ✨
                </div>
                <p className="text-sm font-semibold text-slate-700">No match pairings found</p>
                <p className="text-xs text-slate-400 mt-1">
                  Pairs will be generated once attendees add tags or interests to their profiles.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedMatches.map((match, idx) => (
                  <div 
                    key={idx} 
                    className="p-5 border border-slate-200/60 rounded-2xl bg-white flex flex-col sm:flex-row justify-between items-center gap-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                      {/* Attendee A */}
                      <div className="space-y-1 text-center sm:text-left">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Attendee A</p>
                        <p className="text-sm font-bold text-slate-900">{match.a.name}</p>
                        {match.a.company && <p className="text-xs text-slate-500">{match.a.company}</p>}
                        <div className="flex flex-wrap gap-1 mt-1 justify-center sm:justify-start">
                          {match.a.interests.slice(0, 3).map(interest => (
                            <span key={interest} className="px-1.5 py-0.5 rounded bg-slate-50 border border-slate-100 text-slate-600 text-[9px] font-semibold">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Attendee B */}
                      <div className="space-y-1 text-center sm:text-left">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Attendee B</p>
                        <p className="text-sm font-bold text-slate-900">{match.b.name}</p>
                        {match.b.company && <p className="text-xs text-slate-500">{match.b.company}</p>}
                        <div className="flex flex-wrap gap-1 mt-1 justify-center sm:justify-start">
                          {match.b.interests.slice(0, 3).map(interest => (
                            <span key={interest} className="px-1.5 py-0.5 rounded bg-slate-50 border border-slate-100 text-slate-600 text-[9px] font-semibold">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Similarity score badge & Action */}
                    <div className="flex flex-col items-center gap-2 flex-shrink-0 bg-indigo-50/50 border border-indigo-100/50 p-4 rounded-xl text-center min-w-[120px]">
                      <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest">Match Score</span>
                      <span className="text-2xl font-black text-indigo-600">{match.score}%</span>
                      <button
                        type="button"
                        onClick={() => alert(`Suggestion sent to ${match.a.name} and ${match.b.name}!`)}
                        className="ef-btn-primary py-1 px-3 text-[10px] font-bold bg-indigo-600 hover:bg-indigo-700 border-indigo-650"
                      >
                        Nudge Match
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
