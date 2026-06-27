import { prisma } from '@eventforge/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { AnimatedSection } from '@/components/AnimatedSection';
import { Clock, Calendar, ChevronRight, User, CheckCircle2 } from 'lucide-react';

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
      <div className="bg-[#f7f9fb] min-h-screen text-[#191c1e] font-sans selection:bg-indigo-500/30">
        {blocks.map((block: any, idx: number) => {
          if (block.type === 'Hero') {
            return (
              <AnimatedSection key={block.id} delay={0.1 * idx}>
                <section
                  className="relative overflow-hidden py-32 px-6 text-center text-white"
                  style={{ backgroundColor: block.bgColor || '#0f1629', color: block.textColor || '#ffffff' }}
                >
                  <div className="absolute inset-0 ef-dot-pattern opacity-10" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] opacity-15 pointer-events-none"
                       style={{ background: 'linear-gradient(135deg, #4648d4, #0058be)' }} />
                  
                  <div className="max-w-4xl mx-auto relative z-10 space-y-8">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight drop-shadow-sm">
                      {block.title}
                    </h1>
                    {block.subtitle && (
                      <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto font-light leading-relaxed">
                        {block.subtitle}
                      </p>
                    )}
                    {block.buttonText && (
                      <div className="pt-6">
                        <Link
                          href={`/e/${event.id}/tickets`}
                          className="inline-flex items-center gap-2 text-base font-semibold px-10 py-4 rounded-full shadow-2xl transition-all hover:scale-105 hover:shadow-indigo-500/25"
                          style={{ background: 'linear-gradient(135deg, #4648d4, #0058be)', color: '#fff' }}
                        >
                          {block.buttonText} <ChevronRight className="w-5 h-5" />
                        </Link>
                      </div>
                    )}
                  </div>
                </section>
              </AnimatedSection>
            );
          }

          if (block.type === 'Speakers') {
            return event.speakers.length > 0 ? (
              <AnimatedSection key={block.id} delay={0.1}>
                <section className="py-24 px-6 bg-[#f7f9fb]">
                  <div className="max-w-5xl mx-auto space-y-12">
                    <div className="text-center space-y-3">
                      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#191c1e]">{block.title}</h2>
                      {block.subtitle && (
                        <p className="text-sm font-medium text-[#464554] max-w-xl mx-auto">{block.subtitle}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                      {event.speakers.map((speaker) => (
                        <div
                          key={speaker.id}
                          className="group p-8 text-center bg-white rounded-2xl shadow-[0_4px_20px_rgba(15,22,41,0.04)] border border-transparent hover:border-[#c7c4d7]/50 transition-all duration-300 hover:-translate-y-1"
                        >
                          <div className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center font-bold text-2xl text-white shadow-lg shadow-indigo-200"
                               style={{ background: 'linear-gradient(135deg, #4648d4, #0058be)' }}>
                            {speaker.name.charAt(0)}
                          </div>
                          <p className="font-bold text-[#191c1e] text-lg">{speaker.name}</p>
                          {speaker.title && (
                            <p className="text-xs font-semibold mt-1.5 text-[#4648d4]">{speaker.title}</p>
                          )}
                          {speaker.company && (
                            <p className="text-[11px] mt-1 text-[#767586] font-medium">{speaker.company}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </AnimatedSection>
            ) : null;
          }

          if (block.type === 'Agenda') {
            return event.sessions.length > 0 ? (
              <AnimatedSection key={block.id} delay={0.1}>
                <section className="py-24 px-6 bg-white">
                  <div className="max-w-4xl mx-auto space-y-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#eceef0] pb-6 gap-4">
                      <div className="space-y-2">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#191c1e]">{block.title}</h2>
                        {block.subtitle && (
                          <p className="text-sm font-medium text-[#464554]">{block.subtitle}</p>
                        )}
                      </div>
                      <Link
                        href={`/e/${event.id}/agenda`}
                        className="inline-flex items-center gap-1 text-sm font-bold text-[#4648d4] hover:text-[#0058be] transition-colors"
                      >
                        View Full Agenda <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                    
                    <div className="space-y-6">
                      {event.sessions.map((session) => (
                        <div
                          key={session.id}
                          className="group p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 bg-[#f8fafc] rounded-2xl shadow-[0_4px_20px_rgba(15,22,41,0.03)] border border-[#e0e3e5]/40 hover:shadow-[0_12px_32px_rgba(15,22,41,0.08)] transition-all duration-300"
                        >
                          <div className="md:w-32 flex-shrink-0 border-b md:border-b-0 md:border-r border-[#d8dadc] pb-4 md:pb-0 md:pr-6 flex items-center md:items-start md:flex-col gap-3">
                            <Clock className="w-5 h-5 text-[#4648d4]" />
                            <div>
                              <p className="text-[#191c1e] font-bold text-lg md:text-xl">
                                {new Date(session.startsAt).toLocaleTimeString('en-US', {
                                  hour: 'numeric',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex-1 space-y-3">
                            <h3 className="font-bold text-lg text-[#191c1e] leading-snug group-hover:text-[#4648d4] transition-colors">
                              {typeof session.title === 'string' ? session.title : (session.title as any)?.en || 'Untitled Session'}
                            </h3>
                            {session.speakers.length > 0 && (
                              <div className="flex flex-wrap gap-3">
                                {session.speakers.map((s) => (
                                  <div key={s.speakerId} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-[#eceef0] shadow-sm">
                                    <div className="w-5 h-5 rounded-full bg-[#e1e0ff] text-[#07006c] flex items-center justify-center text-[10px] font-bold">
                                      {s.speaker.name.charAt(0)}
                                    </div>
                                    <span className="text-xs font-semibold text-[#464554]">{s.speaker.name}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </AnimatedSection>
            ) : null;
          }

          if (block.type === 'FAQ') {
            const questions = (block.questions as any[]) || [];
            return questions.length > 0 ? (
              <AnimatedSection key={block.id} delay={0.1}>
                <section className="py-24 px-6 bg-[#f7f9fb]">
                  <div className="max-w-4xl mx-auto space-y-12">
                    <div className="text-center space-y-3">
                      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#191c1e]">{block.title}</h2>
                      {block.subtitle && (
                        <p className="text-sm font-medium text-[#464554] max-w-xl mx-auto">{block.subtitle}</p>
                      )}
                    </div>
                    <div className="grid gap-4 max-w-3xl mx-auto">
                      {questions.map((faq, idx) => (
                        <div key={idx} className="p-6 md:p-8 bg-white rounded-2xl shadow-[0_4px_20px_rgba(15,22,41,0.04)] border border-[#e0e3e5]/40 hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 mt-1">
                              <CheckCircle2 className="w-5 h-5 text-[#4648d4]" />
                            </div>
                            <div className="space-y-2">
                              <p className="font-bold text-[#191c1e] text-lg">{faq.q}</p>
                              <p className="text-sm text-[#464554] leading-relaxed">{faq.a}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </AnimatedSection>
            ) : null;
          }

          if (block.type === 'HTML') {
            return (
              <AnimatedSection key={block.id} delay={0.1}>
                <section className="py-16 px-6 max-w-5xl mx-auto bg-white rounded-3xl shadow-sm my-12 border border-[#eceef0]">
                  <div dangerouslySetInnerHTML={{ __html: block.customHtml || '' }} className="prose prose-slate max-w-none prose-headings:text-[#191c1e] prose-p:text-[#464554] prose-a:text-[#4648d4]" />
                </section>
              </AnimatedSection>
            );
          }

          return null;
        })}
      </div>
    );
  }

  // Fallback to default page layout if no builder blocks
  return (
    <div className="bg-[#f7f9fb] min-h-screen font-sans selection:bg-indigo-500/30">
      {/* Hero Section */}
      <AnimatedSection delay={0}>
        <section className="relative overflow-hidden py-32 md:py-40 px-6 text-center text-white bg-[#0f1629]">
          <div className="absolute inset-0 ef-dot-pattern opacity-10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 pointer-events-none"
               style={{ background: 'linear-gradient(135deg, #4648d4, #0058be)' }} />

          <div className="max-w-4xl mx-auto relative z-10 space-y-8">
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-semibold mb-6">
              {event.startsAt && (
                <span className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                  <Calendar className="w-4 h-4 text-[#c0c1ff]" />
                  {new Date(event.startsAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md capitalize">
                <span className="w-2 h-2 rounded-full bg-[#c0c1ff]"></span>
                {event.type.replace('_', ' ')}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] drop-shadow-md">
              {localeData?.title || event.name}
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto font-light leading-relaxed">
              {localeData?.summary || 'Join us for this amazing event.'}
            </p>

            <div className="pt-8">
              <Link
                href={`/e/${event.id}/tickets`}
                className="inline-flex items-center gap-2 text-base font-semibold px-10 py-4 rounded-full shadow-2xl transition-all hover:scale-105 hover:shadow-indigo-500/25"
                style={{ background: 'linear-gradient(135deg, #4648d4, #0058be)', color: '#fff' }}
              >
                {content.ctaText || 'Register Now'} <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* About Section */}
      <AnimatedSection delay={0.1}>
        <main className="max-w-4xl mx-auto py-24 px-6">
          <div className="p-8 md:p-12 bg-white rounded-3xl shadow-[0_4px_30px_rgba(15,22,41,0.04)] border border-[#e0e3e5]/40 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-[#4648d4]"></div>
            <h2 className="text-3xl font-bold text-[#191c1e] mb-8 pb-4 border-b border-[#eceef0]">About the Event</h2>
            <div className="prose prose-slate max-w-none text-[#464554] text-base leading-relaxed">
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
      </AnimatedSection>

      {/* Speakers Section */}
      {event.speakers.length > 0 && (
        <AnimatedSection delay={0.1}>
          <section className="bg-white border-y border-[#eceef0] py-24 px-6">
            <div className="max-w-5xl mx-auto space-y-12">
              <div className="text-center space-y-3">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#191c1e]">Featured Speakers</h2>
                <p className="text-sm font-medium text-[#464554]">Meet the experts leading our interactive sessions.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {event.speakers.map((speaker) => (
                  <div
                    key={speaker.id}
                    className="group p-8 text-center bg-[#f8fafc] rounded-2xl shadow-sm hover:shadow-[0_12px_32px_rgba(15,22,41,0.06)] border border-[#eceef0] transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center font-bold text-2xl text-white shadow-lg shadow-indigo-200"
                         style={{ background: 'linear-gradient(135deg, #4648d4, #0058be)' }}>
                      {speaker.name.charAt(0)}
                    </div>
                    <p className="font-bold text-[#191c1e] text-lg">{speaker.name}</p>
                    {speaker.title && (
                      <p className="text-xs font-semibold mt-1.5 text-[#4648d4]">{speaker.title}</p>
                    )}
                    {speaker.company && (
                      <p className="text-[11px] mt-1 text-[#767586] font-medium">{speaker.company}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Sessions Section */}
      {event.sessions.length > 0 && (
        <AnimatedSection delay={0.1}>
          <section className="py-24 px-6 max-w-4xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#eceef0] pb-6 gap-4">
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#191c1e]">Agenda Highlights</h2>
                <p className="text-sm font-medium text-[#464554]">Browse high-level schedules of upcoming sessions.</p>
              </div>
              <Link
                href={`/e/${event.id}/agenda`}
                className="inline-flex items-center gap-1 text-sm font-bold text-[#4648d4] hover:text-[#0058be] transition-colors"
              >
                View Full Agenda <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="space-y-6">
              {event.sessions.map((session) => (
                <div
                  key={session.id}
                  className="group p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 bg-white rounded-2xl shadow-[0_4px_20px_rgba(15,22,41,0.04)] border border-[#e0e3e5]/40 hover:shadow-[0_12px_32px_rgba(15,22,41,0.08)] transition-all duration-300"
                >
                  <div className="md:w-32 flex-shrink-0 border-b md:border-b-0 md:border-r border-[#eceef0] pb-4 md:pb-0 md:pr-6 flex items-center md:items-start md:flex-col gap-3">
                    <Clock className="w-5 h-5 text-[#4648d4]" />
                    <div>
                      <p className="text-[#191c1e] font-bold text-lg md:text-xl">
                        {new Date(session.startsAt).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <h3 className="font-bold text-lg text-[#191c1e] leading-snug group-hover:text-[#4648d4] transition-colors">
                      {typeof session.title === 'string' ? session.title : (session.title as any)?.en || 'Untitled Session'}
                    </h3>
                    {session.speakers.length > 0 && (
                      <div className="flex flex-wrap gap-3">
                        {session.speakers.map((s) => (
                          <div key={s.speakerId} className="flex items-center gap-2 bg-[#f8fafc] px-3 py-1.5 rounded-full border border-[#eceef0] shadow-sm">
                            <div className="w-5 h-5 rounded-full bg-[#e1e0ff] text-[#07006c] flex items-center justify-center text-[10px] font-bold">
                              {s.speaker.name.charAt(0)}
                            </div>
                            <span className="text-xs font-semibold text-[#464554]">{s.speaker.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* People You Should Meet Section */}
      <AnimatedSection delay={0.1}>
        <section className="bg-white border-y border-[#eceef0] py-24 px-6">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <span className="inline-block px-3 py-1 bg-[#d9dff9] text-[#07006c] text-xs font-bold rounded-full uppercase tracking-widest mb-2">Networking Suggestions</span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#191c1e]">People You Should Meet</h2>
              <p className="text-sm font-medium text-[#464554]">Based on shared tags, our AI matchmaking recommends connecting with these attendees.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <div className="p-6 bg-[#f8fafc] rounded-2xl border border-[#eceef0] hover:shadow-[0_8px_24px_rgba(15,22,41,0.06)] transition-all flex items-center justify-between gap-4">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center shrink-0 text-slate-500">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-bold text-[#191c1e]">Alex Rivers</p>
                    <p className="text-xs font-medium text-[#5b6279]">Senior Frontend Engineer at Vercel</p>
                    <div className="flex gap-2 pt-1.5">
                      <span className="px-2 py-0.5 rounded bg-white text-[#464554] border border-[#eceef0] text-[10px] font-bold">Next.js</span>
                      <span className="px-2 py-0.5 rounded bg-white text-[#464554] border border-[#eceef0] text-[10px] font-bold">React</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-[#d9dff9] rounded-xl px-4 py-3 text-center min-w-[76px] shadow-sm">
                  <p className="text-[9px] font-bold text-[#4648d4] uppercase tracking-widest mb-1">Match</p>
                  <p className="text-lg font-black text-[#0058be]">95%</p>
                </div>
              </div>

              <div className="p-6 bg-[#f8fafc] rounded-2xl border border-[#eceef0] hover:shadow-[0_8px_24px_rgba(15,22,41,0.06)] transition-all flex items-center justify-between gap-4">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center shrink-0 text-slate-500">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-bold text-[#191c1e]">Emily Watson</p>
                    <p className="text-xs font-medium text-[#5b6279]">Product Manager at Stripe</p>
                    <div className="flex gap-2 pt-1.5">
                      <span className="px-2 py-0.5 rounded bg-white text-[#464554] border border-[#eceef0] text-[10px] font-bold">Fintech</span>
                      <span className="px-2 py-0.5 rounded bg-white text-[#464554] border border-[#eceef0] text-[10px] font-bold">API</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-[#d9dff9] rounded-xl px-4 py-3 text-center min-w-[76px] shadow-sm">
                  <p className="text-[9px] font-bold text-[#4648d4] uppercase tracking-widest mb-1">Match</p>
                  <p className="text-lg font-black text-[#0058be]">88%</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Footer CTA */}
      <AnimatedSection delay={0.1}>
        <section className="relative overflow-hidden py-24 px-6 text-center text-white bg-[#0f1629]">
          <div className="max-w-3xl mx-auto relative z-10 space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Secure Your Spot</h2>
            <p className="text-base md:text-lg opacity-80 max-w-xl mx-auto font-light leading-relaxed">
              Attend live interactive webinars, panel discussions, and connect directly with speaker forums.
            </p>
            <div className="pt-4">
              <Link
                href={`/e/${event.id}/tickets`}
                className="inline-flex items-center gap-2 text-base font-semibold px-10 py-4 rounded-full shadow-2xl transition-all hover:scale-105 hover:shadow-indigo-500/25"
                style={{ background: 'linear-gradient(135deg, #4648d4, #0058be)', color: '#fff' }}
              >
                Get Your Tickets <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
}
