import { prisma } from '@eventforge/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function PublicEventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);

  const event = await prisma.event.findFirst({
    where: isUuid ? { id: slug, deletedAt: null } : { id: slug, deletedAt: null },
    include: {
      locales: { where: { locale: 'en' } },
      sessions: {
        orderBy: { startsAt: 'asc' },
        take: 3,
        include: { speakers: { include: { speaker: true } } },
      },
      speakers: { take: 6 },
    },
  });

  if (!event) notFound();

  const localeData = event.locales[0];
  const content = (localeData?.content as any) || {};

  return (
    <div className="animate-fade-in-up">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-6 text-center text-white"
               style={{ background: 'linear-gradient(135deg, #0f1629 0%, #1a1f3a 60%, #0f1629 100%)' }}>
        <div className="absolute inset-0 ef-dot-pattern opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[100px] opacity-10 pointer-events-none"
             style={{ background: 'var(--ef-primary-gradient)' }} />

        <div className="max-w-3xl mx-auto relative z-10 space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            {localeData?.title || event.name}
          </h1>
          <p className="text-base md:text-lg opacity-80 max-w-xl mx-auto font-light leading-relaxed">
            {localeData?.summary || 'Join us for this amazing event.'}
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold">
            {event.startsAt && (
              <span className="px-4.5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
                📅{' '}
                {new Date(event.startsAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            )}
            <span className="px-4.5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm capitalize">
              🏷️ {event.type.replace('_', ' ')}
            </span>
          </div>

          <div className="pt-4">
            <Link
              href={`/e/${event.id}/tickets`}
              className="ef-btn-primary text-base px-8 py-3.5 shadow-lg"
            >
              {content.ctaText || 'Register Now →'}
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <main className="max-w-4xl mx-auto py-16 px-6">
        <div className="ef-card p-8 md:p-12 bg-white shadow-sm">
          <h2 className="ef-headline-md font-bold mb-6 pb-3 border-b border-slate-100">About the Event</h2>
          <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed">
            {content.aboutHtml ? (
              <div dangerouslySetInnerHTML={{ __html: content.aboutHtml }} />
            ) : (
              <p>
                Welcome to {event.name}. More details regarding sessions, speakers, and schedule will be released shortly.
              </p>
            )}
          </div>
        </div>
      </main>

      {/* Speakers Section */}
      {event.speakers.length > 0 && (
        <section className="bg-slate-50 border-y border-slate-100 py-16 px-6">
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="text-center space-y-2">
              <h2 className="ef-headline-lg font-bold">Featured Speakers</h2>
              <p className="text-xs font-medium" style={{ color: 'var(--ef-text-muted)' }}>Meet the experts leading our interactive sessions.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {event.speakers.map((speaker) => (
                <div
                  key={speaker.id}
                  className="ef-card p-6 text-center hover:shadow-md transition-shadow bg-white border border-slate-100/80"
                >
                  <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center font-bold text-lg text-white"
                       style={{ background: 'var(--ef-primary-gradient)' }}>
                    {speaker.name.charAt(0)}
                  </div>
                  <p className="font-semibold text-slate-900 text-sm">{speaker.name}</p>
                  {speaker.title && (
                    <p className="text-[11px] font-medium mt-1" style={{ color: 'var(--ef-text-secondary)' }}>{speaker.title}</p>
                  )}
                  {speaker.company && (
                    <p className="text-[10px] mt-0.5" style={{ color: 'var(--ef-text-muted)' }}>{speaker.company}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sessions Section */}
      {event.sessions.length > 0 && (
        <section className="py-16 px-6 max-w-4xl mx-auto space-y-10">
          <div className="flex justify-between items-end border-b border-slate-100 pb-4">
            <div>
              <h2 className="ef-headline-lg font-bold">Agenda Highlights</h2>
              <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--ef-text-muted)' }}>Browse high-level schedules of upcoming sessions.</p>
            </div>
            <Link
              href={`/e/${event.id}/agenda`}
              className="text-xs font-semibold hover:underline"
              style={{ color: 'var(--ef-primary)' }}
            >
              View Full Agenda &rarr;
            </Link>
          </div>
          
          <div className="space-y-4">
            {event.sessions.map((session) => (
              <div
                key={session.id}
                className="ef-card p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 bg-white hover:shadow-sm transition-shadow"
              >
                <div className="w-24 flex-shrink-0 text-slate-500 font-semibold text-xs border-b sm:border-b-0 sm:border-r border-slate-100 pb-2 sm:pb-0 sm:pr-4">
                  <p className="text-slate-900">
                    {new Date(session.startsAt).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <p className="text-[10px]" style={{ color: 'var(--ef-text-muted)' }}>Start Time</p>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    {typeof session.title === 'string' ? session.title : (session.title as any)?.en || 'Untitled Session'}
                  </h3>
                  {session.speakers.length > 0 && (
                    <p className="text-[12px] mt-1.5" style={{ color: 'var(--ef-text-secondary)' }}>
                      🎙️ {session.speakers.map((s) => s.speaker.name).join(', ')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer CTA */}
      <section className="text-white py-16 px-6 text-center border-t border-slate-900/10"
               style={{ background: 'linear-gradient(135deg, #10172a 0%, #1e1b4b 100%)' }}>
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="ef-headline-lg font-bold text-white">Secure Your Registration Spot</h2>
          <p className="text-xs opacity-75 max-w-sm mx-auto font-light leading-relaxed">
            Attend live interactive webinars, panel discussions, and connect directly with speaker forums.
          </p>
          <div className="pt-2">
            <Link
              href={`/e/${event.id}/tickets`}
              className="ef-btn-primary px-8 py-3.5 shadow-lg"
            >
              Get Your Tickets
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
