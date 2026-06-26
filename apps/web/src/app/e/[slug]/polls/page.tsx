import { prisma } from '@eventforge/db';
import { notFound } from 'next/navigation';

export default async function PublicPollsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
  
  const event = await prisma.event.findFirst({
    where: isUuid ? { id: slug, deletedAt: null } : { id: slug, deletedAt: null },
    include: {
      locales: { where: { locale: 'en' } }
    }
  });

  if (!event) notFound();

  // Find all active polls for active sessions
  const sessionsWithPolls = await prisma.session.findMany({
    where: { eventId: event.id },
    include: {
      polls: {
        where: { status: 'active' }
      }
    },
    orderBy: { startsAt: 'asc' }
  });

  const activeSessions = sessionsWithPolls.filter(s => s.polls.length > 0);

  return (
    <div className="max-w-2xl mx-auto w-full py-16 px-6 animate-fade-in-up">
      <div className="text-center space-y-2 mb-10">
        <h1 className="ef-headline-lg text-3xl font-extrabold text-slate-900">Live Engagement</h1>
        <p className="text-xs font-semibold" style={{ color: 'var(--ef-text-muted)' }}>
          Participate in live session polls and Q&A questions.
        </p>
      </div>

      {activeSessions.length === 0 ? (
        <div className="ef-card p-16 text-center bg-white shadow-sm">
          <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto text-xl mb-4">
            🗳️
          </div>
          <p className="font-semibold text-slate-800 text-sm">No active polls right now</p>
          <p className="text-xs mt-1" style={{ color: 'var(--ef-text-muted)' }}>
            Polls will appear here when the speaker launches them during the live talk.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {activeSessions.map(session => (
            <div key={session.id} className="ef-card overflow-hidden bg-white shadow-sm border border-slate-100">
              {/* Card header */}
              <div className="px-6 py-4 border-b border-indigo-50/50 flex justify-between items-center" 
                   style={{ background: 'linear-gradient(135deg, #0f1629 0%, #1c243f 100%)' }}>
                <h2 className="font-bold text-sm text-white">
                  🎙️ {typeof session.title === 'string' ? session.title : (session.title as any)?.en || 'Untitled Session'}
                </h2>
              </div>
              
              <div className="p-6 space-y-6">
                {session.polls.map(poll => (
                  <div key={poll.id} className="border border-slate-100 rounded-xl p-6 bg-slate-50/50">
                    <h3 className="font-bold text-base mb-4 text-slate-900 leading-snug">
                      {typeof poll.question === 'string' ? poll.question : (poll.question as any)?.en || 'Untitled Poll'}
                    </h3>
                    
                    <div className="space-y-3">
                      {/* Interactive mock options */}
                      <button className="w-full text-left text-xs font-semibold px-4 py-3 border border-slate-200 rounded-xl bg-white hover:border-indigo-500 hover:bg-indigo-50/20 transition-all">
                        Option A
                      </button>
                      <button className="w-full text-left text-xs font-semibold px-4 py-3 border border-slate-200 rounded-xl bg-white hover:border-indigo-500 hover:bg-indigo-50/20 transition-all">
                        Option B
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
