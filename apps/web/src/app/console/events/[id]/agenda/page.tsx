import { prisma } from '@eventforge/db';

export default async function ConsoleAgendaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const sessions = await prisma.session.findMany({
    where: { eventId: id },
    orderBy: { startsAt: 'asc' },
    include: {
      room: true,
      speakers: { include: { speaker: true } }
    }
  });

  const formatBadge = (type: string) => {
    const styles: Record<string, { bg: string; color: string }> = {
      keynote: { bg: '#ede9fe', color: '#5b21b6' },
      talk: { bg: 'var(--ef-info-bg)', color: 'var(--ef-info-text)' },
      workshop: { bg: 'var(--ef-warning-bg)', color: 'var(--ef-warning-text)' },
      panel: { bg: 'var(--ef-success-bg)', color: 'var(--ef-success-text)' },
      break: { bg: '#f1f5f9', color: '#475569' },
    };
    return styles[type] || styles.break;
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h2 className="ef-headline-lg">Agenda & Sessions</h2>
          <p className="text-[13px] mt-0.5" style={{ color: 'var(--ef-text-muted)' }}>
            {sessions.length} session{sessions.length !== 1 ? 's' : ''} scheduled
          </p>
        </div>
        <button className="ef-btn-primary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Session
        </button>
      </div>

      {/* Table */}
      <div className="ef-card animate-fade-in-up delay-200">
        {sessions.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(59,130,246,0.08) 100%)' }}>
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                   style={{ color: 'var(--ef-primary)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
            <p className="text-lg font-semibold" style={{ color: 'var(--ef-text-primary)' }}>
              No sessions scheduled yet
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--ef-text-muted)' }}>
              Start building your agenda by adding sessions.
            </p>
          </div>
        ) : (
          <table className="ef-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Session</th>
                <th>Format</th>
                <th>Location</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => {
                const badgeStyle = formatBadge(session.type);
                return (
                  <tr key={session.id}>
                    <td className="whitespace-nowrap" style={{ color: 'var(--ef-text-secondary)', width: '120px' }}>
                      <p className="font-medium" style={{ color: 'var(--ef-text-primary)' }}>
                        {new Date(session.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-[12px]" style={{ color: 'var(--ef-text-muted)' }}>
                        to {new Date(session.endsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>
                    <td>
                      <p className="font-semibold" style={{ color: 'var(--ef-text-primary)' }}>
                        {typeof session.title === 'string' ? session.title : (session.title as any)?.en || 'Untitled Session'}
                      </p>
                      {session.speakers.length > 0 && (
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="flex -space-x-1.5">
                            {session.speakers.slice(0, 3).map(s => (
                              <div
                                key={s.speakerId}
                                className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border-2 border-white"
                                style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(59,130,246,0.1))', color: 'var(--ef-primary)' }}
                              >
                                {s.speaker.name.charAt(0)}
                              </div>
                            ))}
                          </div>
                          <span className="text-[12px]" style={{ color: 'var(--ef-text-muted)' }}>
                            {session.speakers.map(s => s.speaker.name).join(', ')}
                          </span>
                        </div>
                      )}
                    </td>
                    <td>
                      <span
                        className="ef-badge capitalize"
                        style={{ background: badgeStyle.bg, color: badgeStyle.color }}
                      >
                        {session.type}
                      </span>
                    </td>
                    <td>
                      <span className="text-[13px]" style={{ color: 'var(--ef-text-secondary)' }}>
                        {session.room?.name || (
                          <span style={{ color: 'var(--ef-text-muted)' }}>TBA</span>
                        )}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 hover:bg-indigo-500/5"
                          style={{ color: 'var(--ef-primary)' }}
                        >
                          Edit
                        </button>
                        <button
                          className="text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 hover:bg-[var(--ef-danger-bg)]"
                          style={{ color: 'var(--ef-danger)' }}
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
