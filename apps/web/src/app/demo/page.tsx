import { prisma } from '@eventforge/db';
import { buildCompetitiveCoverage, buildOpsIntelligence } from '@eventforge/domain';
import Link from 'next/link';
import type React from 'react';
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Bot,
  CalendarDays,
  ChartSpline,
  CircleDollarSign,
  Radio,
  Sparkles,
  Ticket,
  Users,
} from 'lucide-react';

const DEMO_EVENT_ID = '00000000-0000-4000-8000-000000000100';

export const dynamic = 'force-dynamic';

export default async function DemoPage() {
  const event = await prisma.event.findUnique({
    where: { id: DEMO_EVENT_ID },
    include: {
      locales: { where: { locale: 'en' }, take: 1 },
      ticketTypes: { orderBy: { sort: 'asc' } },
      sessions: { orderBy: { startsAt: 'asc' }, take: 3 },
      speakers: { take: 3 },
      exhibitors: { orderBy: { leadsCaptured: 'desc' }, take: 3 },
      campaigns: { orderBy: { createdAt: 'desc' }, take: 3 },
      attendeeProfiles: { orderBy: { points: 'desc' }, take: 4 },
      metricsHourly: { orderBy: { hourBucket: 'asc' }, take: 6 },
      _count: {
        select: {
          checkIns: true,
          orders: true,
          campaigns: true,
          attendeeProfiles: true,
        },
      },
    },
  });

  if (!event) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
          <p className="mb-4 inline-flex rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
            Demo data missing
          </p>
          <h1 className="text-4xl font-bold tracking-tight">Seed the demo event first</h1>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            Run <code className="rounded bg-white/10 px-2 py-1">pnpm db:seed</code>, then reload this page.
          </p>
        </section>
      </main>
    );
  }

  const locale = event.locales[0];
  const [revenueCents, pollVotes, questions, leadCaptures, issuedTickets] =
    await Promise.all([
      prisma.order.aggregate({
        where: { eventId: event.id, status: 'completed' },
        _sum: { totalCents: true },
      }),
      prisma.pollVote.count({
        where: { poll: { session: { eventId: event.id } } },
      }),
      prisma.qaMessage.count({
        where: { sessionId: { in: event.sessions.map((session) => session.id) } },
      }),
      prisma.leadCapture.findMany({
        where: { exhibitor: { eventId: event.id } },
        select: { meta: true },
      }),
      prisma.ticket.count({ where: { eventId: event.id } }),
    ]);

  const totalCapacity = event.ticketTypes.reduce(
    (sum, ticketType) => sum + ticketType.quantityTotal,
    0,
  );
  const sold = event.ticketTypes.reduce(
    (sum, ticketType) => sum + ticketType.quantitySold,
    0,
  );
  const checkInRate =
    issuedTickets > 0
      ? Math.round((event._count.checkIns / issuedTickets) * 100)
      : 0;
  const capacityUsed =
    totalCapacity > 0 ? Math.round((sold / totalCapacity) * 100) : 0;
  const revenue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: event.currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(Number(revenueCents._sum.totalCents ?? BigInt(0)) / 100);
  const vipTicket = event.ticketTypes.find((ticketType) =>
    ticketType.name.toLowerCase().includes('vip'),
  );
  const lastMetric = event.metricsHourly.at(-1);
  const forecastedArrivalRate = Math.max(
    (lastMetric?.checkIns ?? 0) + 118,
    Math.round(sold * 0.3),
  );
  const opsIntelligence = buildOpsIntelligence({
    issuedTickets,
    checkIns: event._count.checkIns,
    currentArrivalRatePerHour: forecastedArrivalRate,
    scannerCapacityPerHour: 180,
    vipTicketsSold: vipTicket?.quantitySold ?? 0,
    vipTicketCapacity: vipTicket?.quantityTotal ?? 0,
    vipTicketPriceCents: Number(vipTicket?.priceCents ?? BigInt(0)),
    sponsorLeadScores: leadCaptures.map((lead) => getLeadScore(lead.meta)),
    unansweredQuestions: questions,
    pollVotes,
  });
  const competitiveCoverage = buildCompetitiveCoverage({
    coveredCapabilities: [
      'website_builder',
      'ticketing',
      'rsvp',
      'check_in_badging',
      'marketing',
      'sponsor_exhibitor',
      'attendee_engagement',
      'event_app',
      'lead_capture',
      'analytics',
    ],
    aiCapabilities: ['ops_forecast', 'matchmaking', 'sponsor_roi'],
  });

  const stats = [
    {
      label: 'Revenue booked',
      value: revenue,
      detail: `${event._count.orders} completed orders`,
      icon: CircleDollarSign,
    },
    {
      label: 'Tickets sold',
      value: sold.toLocaleString('en-US'),
      detail: `${capacityUsed}% capacity used`,
      icon: Ticket,
    },
    {
      label: 'Checked in',
      value: event._count.checkIns.toLocaleString('en-US'),
      detail: `${checkInRate}% of issued tickets`,
      icon: BadgeCheck,
    },
    {
      label: 'Engagement',
      value: (pollVotes + questions).toLocaleString('en-US'),
      detail: `${pollVotes} votes, ${questions} questions`,
      icon: Activity,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.32),transparent_34%),linear-gradient(135deg,#020617,#111827_52%,#0f172a)]">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[1fr_420px] lg:px-8 lg:py-14">
          <div className="flex flex-col justify-between gap-12">
            <div>
              <div className="mb-8 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-indigo-300/30 bg-indigo-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-100">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI-first event OS demo
                </span>
                <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100">
                  Published
                </span>
              </div>
              <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-white md:text-7xl">
                {locale?.title ?? event.name}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
                {locale?.summary ??
                  'A complete demo of event websites, ticketing, check-in, engagement, expo, analytics, and AI operations intelligence.'}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/e/${event.id}`}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
              >
                Open public event
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={`/e/${event.id}/tickets`}
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                View tickets
              </Link>
              <Link
                href={`/e/${event.id}/polls`}
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Live engagement
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Ops Command Center
                </p>
                <h2 className="mt-1 text-xl font-bold">AI recommendations</h2>
              </div>
              <div className="text-right">
                <Bot className="ml-auto h-8 w-8 text-indigo-200" />
                <p className="mt-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                  Health {opsIntelligence.healthScore}
                </p>
              </div>
            </div>
            <div className="mb-4 grid grid-cols-3 gap-2 rounded-lg border border-white/10 bg-black/20 p-3 text-center">
              <div>
                <p className="text-lg font-bold text-white">{forecastedArrivalRate}</p>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">arrivals/hr</p>
              </div>
              <div>
                <p className="text-lg font-bold text-white">180</p>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">scan cap/hr</p>
              </div>
              <div>
                <p className="text-lg font-bold text-white">{opsIntelligence.riskLevel.replace('_', ' ')}</p>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">risk</p>
              </div>
            </div>
            <div className="space-y-3">
              {opsIntelligence.recommendations.map((item) => (
                <div key={item.title} className="rounded-lg border border-white/10 bg-black/20 p-4">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                    <span className="shrink-0 rounded-full bg-emerald-300/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-200">
                      {item.impact}
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-slate-300">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                  <Icon className="h-5 w-5 text-indigo-200" />
                </div>
                <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-400">{stat.detail}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.04] p-6">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Competitive command view
              </p>
              <h2 className="mt-1 text-xl font-bold">Zoho Backstage parity, plus AI moats</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                EventForge covers the core Backstage event lifecycle, then layers predictive operations,
                sponsor ROI intelligence, and AI matchmaking on top of the standard event stack.
              </p>
            </div>
            <div className="rounded-lg border border-emerald-300/20 bg-emerald-300/10 px-5 py-4 text-right">
              <p className="text-3xl font-bold text-emerald-100">{competitiveCoverage.parityScore}%</p>
              <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-300">baseline parity</p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-lg border border-white/10 bg-black/20 p-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                Covered Backstage baseline
              </p>
              <div className="flex flex-wrap gap-2">
                {competitiveCoverage.covered.map((item) => (
                  <span
                    key={item.capability}
                    className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-semibold text-slate-200"
                  >
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-indigo-300/20 bg-indigo-300/10 p-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-indigo-200">
                EventForge AI advantage
              </p>
              <div className="space-y-2">
                {competitiveCoverage.moats.map((moat) => (
                  <div key={moat} className="flex items-center gap-2 text-sm font-semibold text-indigo-50">
                    <Sparkles className="h-4 w-4 text-indigo-200" />
                    {moat}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Revenue and operations
                </p>
                <h2 className="mt-1 text-xl font-bold">Live event health</h2>
              </div>
              <ChartSpline className="h-6 w-6 text-indigo-200" />
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {event.ticketTypes.map((ticketType) => {
                const percent =
                  ticketType.quantityTotal > 0
                    ? Math.round((ticketType.quantitySold / ticketType.quantityTotal) * 100)
                    : 0;
                return (
                  <div key={ticketType.id} className="rounded-lg border border-white/10 bg-black/20 p-4">
                    <div className="mb-3 flex justify-between gap-3 text-sm">
                      <span className="font-semibold">{ticketType.name}</span>
                      <span className="text-slate-400">{percent}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <div className="h-2 rounded-full bg-indigo-400" style={{ width: `${percent}%` }} />
                    </div>
                    <p className="mt-3 text-xs text-slate-400">
                      {ticketType.quantitySold} sold of {ticketType.quantityTotal}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {event.metricsHourly.map((metric) => (
                <div key={metric.id} className="rounded-lg bg-slate-900/80 p-4">
                  <p className="text-xs text-slate-500">
                    {metric.hourBucket.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </p>
                  <p className="mt-2 text-lg font-bold">{metric.registrations} registrations</p>
                  <p className="text-sm text-slate-400">{metric.checkIns} check-ins</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Sponsor ROI
                </p>
                <h2 className="mt-1 text-xl font-bold">Expo intelligence</h2>
              </div>
              <Radio className="h-6 w-6 text-indigo-200" />
            </div>
            <div className="space-y-3">
              {event.exhibitors.map((exhibitor) => (
                <div key={exhibitor.id} className="rounded-lg border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold">{exhibitor.name}</p>
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        {exhibitor.tier} tier / Booth {exhibitor.boothNumber}
                      </p>
                    </div>
                    <div className="rounded-lg bg-emerald-300/10 px-3 py-2 text-right">
                      <p className="text-lg font-bold text-emerald-100">{exhibitor.leadsCaptured}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-300">leads</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{exhibitor.description}</p>
                </div>
              ))}
              <div className="rounded-lg border border-indigo-300/20 bg-indigo-300/10 p-4 text-sm text-indigo-100">
                {leadCaptures.length} captured leads include AI-scored next-best actions for sponsor follow-up.
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <Panel title="Agenda" icon={<CalendarDays className="h-5 w-5" />}>
            {event.sessions.map((session) => (
              <div key={session.id} className="border-b border-white/10 py-3 last:border-b-0">
                <p className="font-semibold">{String((session.title as Record<string, string>).en ?? 'Session')}</p>
                <p className="text-sm text-slate-400">
                  {session.startsAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at{' '}
                  {session.startsAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </p>
              </div>
            ))}
          </Panel>
          <Panel title="Networking" icon={<Users className="h-5 w-5" />}>
            {event.attendeeProfiles.map((attendee) => (
              <div key={attendee.id} className="flex items-center justify-between border-b border-white/10 py-3 last:border-b-0">
                <div>
                  <p className="font-semibold">{attendee.displayName}</p>
                  <p className="text-sm text-slate-400">{attendee.company}</p>
                </div>
                <span className="rounded-full bg-white/10 px-2 py-1 text-xs font-bold">{attendee.points} pts</span>
              </div>
            ))}
          </Panel>
          <Panel title="Marketing" icon={<Sparkles className="h-5 w-5" />}>
            {event.campaigns.map((campaign) => (
              <div key={campaign.id} className="border-b border-white/10 py-3 last:border-b-0">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold">{campaign.name}</p>
                  <span className="rounded-full bg-white/10 px-2 py-1 text-xs font-bold uppercase">
                    {campaign.channel}
                  </span>
                </div>
                <p className="text-sm text-slate-400">
                  {campaign.status} / {campaign.recipientCount} recipients
                </p>
              </div>
            ))}
          </Panel>
        </div>
      </section>
    </main>
  );
}

function getLeadScore(meta: unknown) {
  if (!meta || typeof meta !== 'object' || !('score' in meta)) {
    return 0;
  }

  const score = Number((meta as { score: unknown }).score);
  return Number.isFinite(score) ? score : 0;
}

function Panel({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">{title}</h2>
        <span className="text-indigo-200">{icon}</span>
      </div>
      <div>{children}</div>
    </div>
  );
}
