import { prisma } from '@eventforge/db';
import { notFound } from 'next/navigation';

export default async function PublicAgendaPage({
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

  const sessions = await prisma.session.findMany({
    where: { eventId: event.id },
    orderBy: { startsAt: 'asc' },
    include: {
      room: true,
      speakers: { include: { speaker: true } }
    }
  });

  // Group by day
  const groupedSessions = sessions.reduce((acc, session) => {
    const day = new Date(session.startsAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    if (!acc[day]) acc[day] = [];
    acc[day].push(session);
    return acc;
  }, {} as Record<string, typeof sessions>);

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
    <div className="max-w-4xl mx-auto w-full py-16 px-6 animate-fade-in-up">
      <div className="border-b border-slate-100 pb-6 mb-10">
        <h1 className="ef-headline-lg text-3xl font-extrabold text-slate-900">Event Agenda</h1>
        <p className="text-xs font-semibold mt-1" style={{ color: 'var(--ef-text-muted)' }}>
          Browse schedules, formats, rooms and leading speakers.
        </p>
      </div>

      {Object.keys(groupedSessions).length === 0 ? (
        <div className="ef-card p-12 text-center text-slate-500">
          No sessions have been scheduled yet. Check back soon!
        </div>
      ) : (
        <div className="space-y-12">
          {Object.entries(groupedSessions).map(([day, daySessions]) => (
            <div key={day} className="space-y-6">
              <h2 className="text-sm font-bold uppercase tracking-wider pb-2 border-b border-indigo-100" style={{ color: 'var(--ef-primary)' }}>
                {day}
              </h2>
              <div className="space-y-4">
                {daySessions.map(session => {
                  const badgeStyle = formatBadge(session.type);
                  return (
                    <div key={session.id} className="ef-card p-6 flex flex-col sm:flex-row gap-6 bg-white hover:shadow-md transition-shadow">
                      {/* Timeline column */}
                      <div className="w-28 flex-shrink-0 text-xs font-semibold border-b sm:border-b-0 sm:border-r border-slate-50 pb-2 sm:pb-0 sm:pr-4" style={{ color: 'var(--ef-text-secondary)' }}>
                        <p className="text-slate-900 font-bold">
                          {new Date(session.startsAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-[10px]" style={{ color: 'var(--ef-text-muted)' }}>
                          to {new Date(session.endsAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>

                      {/* Content column */}
                      <div className="flex-1 space-y-3">
                        <div className="space-y-1">
                          <h3 className="text-base font-bold text-slate-900 leading-tight">
                            {typeof session.title === 'string' ? session.title : (session.title as any)?.en || 'Untitled Session'}
                          </h3>
                          <div className="flex gap-2 pt-1 flex-wrap">
                            <span className="ef-badge capitalize text-[10px]" style={{ background: badgeStyle.bg, color: badgeStyle.color }}>
                              {session.type}
                            </span>
                            {session.room?.name && (
                              <span className="ef-badge ef-badge-neutral text-[10px]">
                                📍 {session.room.name}
                              </span>
                            )}
                          </div>
                        </div>

                        {session.description && (
                          <p className="text-slate-500 text-xs leading-relaxed max-w-2xl">
                            {typeof session.description === 'string' ? session.description : (session.description as any)?.en || ''}
                          </p>
                        )}

                        {session.speakers.length > 0 && (
                          <div className="flex items-center gap-2 pt-2">
                            <div className="flex -space-x-1.5">
                              {session.speakers.map(s => (
                                <div key={s.speakerId} 
                                     className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm" 
                                     style={{ background: 'var(--ef-primary-gradient)' }}
                                     title={s.speaker.name}>
                                  {s.speaker.name.charAt(0)}
                                </div>
                              ))}
                            </div>
                            <span className="text-[11px] font-semibold" style={{ color: 'var(--ef-text-secondary)' }}>
                              {session.speakers.map(s => s.speaker.name).join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
