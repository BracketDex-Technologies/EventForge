import { prisma } from '@eventforge/db';

export default async function ConsolePollsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  // Find sessions for this event to group polls
  const sessions = await prisma.session.findMany({
    where: { eventId: id },
    include: {
      polls: true
    },
    orderBy: { startsAt: 'asc' }
  });

  return (
    <div className="space-y-6 max-w-6xl animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="ef-headline-lg">Polls & Live Q&A</h2>
          <p className="text-[13px] mt-0.5" style={{ color: 'var(--ef-text-muted)' }}>
            Engage your audience with live questions during event sessions.
          </p>
        </div>
        <button className="ef-btn-primary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Create Poll
        </button>
      </div>

      {/* Sessions & Polls list */}
      <div className="space-y-6">
        {sessions.length === 0 ? (
          <div className="ef-card p-16 text-center">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(59,130,246,0.08) 100%)' }}>
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                   style={{ color: 'var(--ef-primary)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0110 21a3.745 3.745 0 01-3.068-1.593 3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
            </div>
            <p className="text-lg font-semibold" style={{ color: 'var(--ef-text-primary)' }}>
              No sessions found
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--ef-text-muted)' }}>
              Please schedule a session in your Agenda before creating active polls.
            </p>
          </div>
        ) : (
          sessions.map(session => (
            <div key={session.id} className="ef-card overflow-hidden bg-white shadow-sm border border-slate-100">
              {/* Session Row Head */}
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h3 className="font-bold text-[15px]" style={{ color: 'var(--ef-text-primary)' }}>
                    {typeof session.title === 'string' ? session.title : (session.title as any)?.en || 'Untitled Session'}
                  </h3>
                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--ef-text-muted)' }}>
                    Session ID: <span className="font-mono text-slate-500">{session.id}</span>
                  </p>
                </div>
                <span className="ef-badge ef-badge-neutral text-[11px] py-1 px-3">
                  {session.polls.length} Poll{session.polls.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              {/* Poll list */}
              {session.polls.length === 0 ? (
                <div className="p-6 text-center text-sm" style={{ color: 'var(--ef-text-muted)' }}>
                  No polls active for this session.
                </div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {session.polls.map(poll => (
                    <li key={poll.id} className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-slate-50/40 transition-colors">
                      <div>
                        <h4 className="font-semibold text-sm" style={{ color: 'var(--ef-text-primary)' }}>
                          {typeof poll.question === 'string' ? poll.question : (poll.question as any)?.en || 'Untitled Poll'}
                        </h4>
                        <div className="flex gap-2 mt-2">
                          {poll.status === 'active' ? (
                            <span className="ef-badge ef-badge-success text-[10px]">Active</span>
                          ) : (
                            <span className="ef-badge ef-badge-neutral text-[10px]">Draft</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 self-end sm:self-center">
                        <button
                          className="text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 hover:bg-indigo-500/5"
                          style={{ color: 'var(--ef-primary)' }}
                        >
                          Results
                        </button>
                        <button
                          className="text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 hover:bg-[var(--ef-surface-container)]"
                          style={{ color: 'var(--ef-text-secondary)' }}
                        >
                          Edit
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
