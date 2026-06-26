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
      pages: { where: { slug: 'index' } },
    },
  });

  if (!event) notFound();

  const localeData = event.locales[0];
  const content = (localeData?.content as any) || {};

  const landingPage = event.pages[0];
  const blocks = landingPage?.publishedDoc as any[];

  if (blocks && blocks.length > 0) {
    return (
      <div className="animate-fade-in-up divide-y divide-slate-100 bg-white">
        {blocks.map((block: any) => {
          if (block.type === 'Hero') {
            return (
              <section
                key={block.id}
                className="relative overflow-hidden py-24 px-6 text-center text-white animate-fade-in"
                style={{ backgroundColor: block.bgColor || '#1e293b', color: block.textColor || '#ffffff' }}
              >
                <div className="absolute inset-0 ef-dot-pattern opacity-10" />
                <div className="max-w-3xl mx-auto relative z-10 space-y-6">
                  <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                    {block.title}
                  </h1>
                  {block.subtitle && (
                    <p className="text-base md:text-lg opacity-80 max-w-xl mx-auto font-light leading-relaxed">
                      {block.subtitle}
                    </p>
                  )}
                  {block.buttonText && (
                    <div className="pt-4">
                      <Link
                        href={`/e/${event.id}/tickets`}
                        className="ef-btn-primary text-base px-8 py-3.5 shadow-lg bg-white text-slate-900 hover:bg-slate-100 border-0"
                      >
                        {block.buttonText} →
                      </Link>
                    </div>
                  )}
                </div>
              </section>
            );
          }

          if (block.type === 'Speakers') {
            return event.speakers.length > 0 ? (
              <section key={block.id} className="bg-slate-50 py-16 px-6">
                <div className="max-w-4xl mx-auto space-y-10">
                  <div className="text-center space-y-2">
                    <h2 className="ef-headline-lg font-bold text-slate-900">{block.title}</h2>
                    {block.subtitle && (
                      <p className="text-xs font-medium text-slate-500">{block.subtitle}</p>
                    )}
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
                          <p className="text-[11px] font-medium mt-1 text-slate-500">{speaker.title}</p>
                        )}
                        {speaker.company && (
                          <p className="text-[10px] mt-0.5 text-slate-400">{speaker.company}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ) : null;
          }

          if (block.type === 'Agenda') {
            return event.sessions.length > 0 ? (
              <section key={block.id} className="py-16 px-6 max-w-4xl mx-auto space-y-10">
                <div className="flex justify-between items-end border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="ef-headline-lg font-bold text-slate-900">{block.title}</h2>
                    {block.subtitle && (
                      <p className="text-xs font-medium mt-0.5 text-slate-500">{block.subtitle}</p>
                    )}
                  </div>
                  <Link
                    href={`/e/${event.id}/agenda`}
                    className="text-xs font-semibold text-indigo-600 hover:underline"
                  >
                    View Full Agenda &rarr;
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {event.sessions.map((session) => (
                    <div
                      key={session.id}
                      className="ef-card p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 bg-white hover:shadow-sm transition-shadow border border-slate-100"
                    >
                      <div className="w-24 flex-shrink-0 text-slate-500 font-semibold text-xs border-b sm:border-b-0 sm:border-r border-slate-100 pb-2 sm:pb-0 sm:pr-4">
                        <p className="text-slate-900 font-bold">
                          {new Date(session.startsAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        <p className="text-[10px] text-slate-400">Start Time</p>
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900">
                          {typeof session.title === 'string' ? session.title : (session.title as any)?.en || 'Untitled Session'}
                        </h3>
                        {session.speakers.length > 0 && (
                          <p className="text-[12px] mt-1.5 text-slate-600">
                            🎙️ {session.speakers.map((s) => s.speaker.name).join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null;
          }

          if (block.type === 'FAQ') {
            const questions = (block.questions as any[]) || [];
            return questions.length > 0 ? (
              <section key={block.id} className="py-16 px-6 bg-slate-50">
                <div className="max-w-4xl mx-auto space-y-10">
                  <div className="text-center space-y-2">
                    <h2 className="ef-headline-lg font-bold text-slate-900">{block.title}</h2>
                    {block.subtitle && (
                      <p className="text-xs font-medium text-slate-500">{block.subtitle}</p>
                    )}
                  </div>
                  <div className="max-w-2xl mx-auto space-y-4">
                    {questions.map((faq, idx) => (
                      <div key={idx} className="ef-card p-5 bg-white border border-slate-100">
                        <p className="font-bold text-sm text-slate-900">{faq.q}</p>
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ) : null;
          }

          if (block.type === 'HTML') {
            return (
              <section key={block.id} className="py-12 px-6 max-w-4xl mx-auto">
                <div dangerouslySetInnerHTML={{ __html: block.customHtml || '' }} />
              </section>
            );
          }

          return null;
        })}
      </div>
    );
  }

  // Fallback to default page layout if no builder blocks
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
              <h2 className="ef-headline-lg font-bold text-slate-900">Featured Speakers</h2>
              <p className="text-xs font-medium text-slate-500">Meet the experts leading our interactive sessions.</p>
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
                    <p className="text-[11px] font-medium mt-1 text-slate-500">{speaker.title}</p>
                  )}
                  {speaker.company && (
                    <p className="text-[10px] mt-0.5 text-slate-400">{speaker.company}</p>
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
              <h2 className="ef-headline-lg font-bold text-slate-900">Agenda Highlights</h2>
              <p className="text-xs font-medium mt-0.5 text-slate-500">Browse high-level schedules of upcoming sessions.</p>
            </div>
            <Link
              href={`/e/${event.id}/agenda`}
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              View Full Agenda &rarr;
            </Link>
          </div>
          
          <div className="space-y-4">
            {event.sessions.map((session) => (
              <div
                key={session.id}
                className="ef-card p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 bg-white hover:shadow-sm transition-shadow border border-slate-100"
              >
                <div className="w-24 flex-shrink-0 text-slate-500 font-semibold text-xs border-b sm:border-b-0 sm:border-r border-slate-100 pb-2 sm:pb-0 sm:pr-4">
                  <p className="text-slate-900 font-bold">
                    {new Date(session.startsAt).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <p className="text-[10px] text-slate-400">Start Time</p>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    {typeof session.title === 'string' ? session.title : (session.title as any)?.en || 'Untitled Session'}
                  </h3>
                  {session.speakers.length > 0 && (
                    <p className="text-[12px] mt-1.5 text-slate-600">
                      🎙️ {session.speakers.map((s) => s.speaker.name).join(', ')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* People You Should Meet Section */}
      <section className="bg-slate-50 border-y border-slate-100 py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Networking Suggestions</span>
            <h2 className="ef-headline-lg font-bold text-slate-900">People You Should Meet</h2>
            <p className="text-xs font-medium text-slate-500">Based on shared tags, our AI matchmaking recommends connecting with these attendees.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="ef-card p-5 bg-white border border-slate-200/50 hover:shadow-md transition-all flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-900">Alex Rivers</p>
                <p className="text-xs text-slate-500">Senior Frontend Engineer at Vercel</p>
                <div className="flex gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-100 text-[9px] font-semibold">Next.js</span>
                  <span className="px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-100 text-[9px] font-semibold">React</span>
                </div>
              </div>
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2 text-center min-w-[70px]">
                <p className="text-[8px] font-bold text-indigo-500 uppercase tracking-widest">Match</p>
                <p className="text-base font-black text-indigo-600">95%</p>
              </div>
            </div>

            <div className="ef-card p-5 bg-white border border-slate-200/50 hover:shadow-md transition-all flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-900">Emily Watson</p>
                <p className="text-xs text-slate-500">Product Manager at Stripe</p>
                <div className="flex gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-100 text-[9px] font-semibold">Fintech</span>
                  <span className="px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-100 text-[9px] font-semibold">API</span>
                </div>
              </div>
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2 text-center min-w-[70px]">
                <p className="text-[8px] font-bold text-indigo-500 uppercase tracking-widest">Match</p>
                <p className="text-base font-black text-indigo-600">88%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

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
              className="ef-btn-primary px-8 py-3.5 shadow-lg bg-indigo-600 border-indigo-600 text-white"
            >
              Get Your Tickets
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
