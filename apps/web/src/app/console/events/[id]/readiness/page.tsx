import { prisma } from '@eventforge/db';
import { buildCompetitiveCoverage, buildEventReadiness, buildOpsIntelligence } from '@eventforge/domain';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Activity, Bot, CheckCircle2, CircleAlert, Sparkles } from 'lucide-react';

export default async function EventReadinessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      ticketTypes: { orderBy: { sort: 'asc' } },
      sessions: { select: { id: true } },
      speakers: { select: { id: true } },
      campaigns: { select: { id: true, status: true } },
      exhibitors: { select: { id: true } },
      attendeeProfiles: { select: { id: true } },
      metricsHourly: { orderBy: { hourBucket: 'asc' }, take: 6 },
      _count: {
        select: {
          checkIns: true,
          orders: true,
        },
      },
    },
  });

  if (!event) notFound();

  const sessionIds = event.sessions.map(session => session.id);
  const [leadCaptures, pollVotes, qaMessages, issuedTickets] = await Promise.all([
    prisma.leadCapture.findMany({
      where: { exhibitor: { eventId: event.id } },
      select: { meta: true },
    }),
    prisma.pollVote.count({
      where: { poll: { session: { eventId: event.id } } },
    }),
    prisma.qaMessage.count({
      where: { sessionId: { in: sessionIds } },
    }),
    prisma.ticket.count({ where: { eventId: event.id } }),
  ]);

  const completedCampaigns = event.campaigns.filter(campaign => campaign.status === 'sent').length;
  const readiness = buildEventReadiness({
    websitePublished: event.status === 'published' || event.status === 'live',
    ticketTypes: event.ticketTypes.length,
    sessions: event.sessions.length,
    speakers: event.speakers.length,
    checkIns: event._count.checkIns,
    campaigns: event.campaigns.length,
    exhibitors: event.exhibitors.length,
    leadCaptures: leadCaptures.length,
    pollVotes,
    qaMessages,
    attendeeProfiles: event.attendeeProfiles.length,
    aiMatchmakingEnabled: event.attendeeProfiles.length >= 2,
    accessibilityControlsEnabled: true,
    automationRules: completedCampaigns + leadCaptures.length,
    analyticsConnected: event.metricsHourly.length > 0 || event._count.orders > 0,
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

  const vipTicket = event.ticketTypes.find(ticketType =>
    ticketType.name.toLowerCase().includes('vip'),
  );
  const totalSold = event.ticketTypes.reduce((sum, ticketType) => sum + ticketType.quantitySold, 0);
  const lastMetric = event.metricsHourly.at(-1);
  const ops = buildOpsIntelligence({
    issuedTickets,
    checkIns: event._count.checkIns,
    currentArrivalRatePerHour: Math.max((lastMetric?.checkIns ?? 0) + 118, Math.round(totalSold * 0.3)),
    scannerCapacityPerHour: 180,
    vipTicketsSold: vipTicket?.quantitySold ?? 0,
    vipTicketCapacity: vipTicket?.quantityTotal ?? 0,
    vipTicketPriceCents: Number(vipTicket?.priceCents ?? BigInt(0)),
    sponsorLeadScores: leadCaptures.map(lead => getLeadScore(lead.meta)),
    unansweredQuestions: qaMessages,
    pollVotes,
  });

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm mb-2 text-slate-400">
            <Link href={`/console/events/${id}`} className="hover:text-indigo-600 transition-colors">
              Event Dashboard
            </Link>
            <span>/</span>
            <span className="text-slate-600">Readiness</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Competitive Readiness</h2>
          <p className="mt-1 text-sm text-slate-500">
            Proof that this event is ready for Backstage-level operations with EventForge AI advantages.
          </p>
        </div>
        <Link href="/demo" className="ef-btn-primary px-4 py-2 text-xs">
          Open demo command center
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <ScoreCard
          label="Launch readiness"
          value={`${readiness.score}%`}
          detail={readiness.status.replace('_', ' ')}
          tone={readiness.score >= 90 ? 'success' : readiness.score >= 70 ? 'warning' : 'danger'}
        />
        <ScoreCard
          label="Backstage parity"
          value={`${competitiveCoverage.parityScore}%`}
          detail={`${competitiveCoverage.covered.length} baseline areas covered`}
          tone="success"
        />
        <ScoreCard
          label="AI ops health"
          value={`${ops.healthScore}`}
          detail={ops.riskLevel.replace('_', ' ')}
          tone={ops.healthScore >= 85 ? 'success' : ops.healthScore >= 70 ? 'warning' : 'danger'}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="ef-card p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="ef-label-sm">Launch checklist</p>
              <h3 className="mt-1 text-lg font-bold text-slate-900">Operational parity map</h3>
            </div>
            <Activity className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {readiness.items.map(item => (
              <div
                key={item.key}
                className={`rounded-lg border p-4 ${
                  item.isComplete
                    ? 'border-emerald-100 bg-emerald-50/60'
                    : 'border-amber-100 bg-amber-50/70'
                }`}
              >
                <div className="mb-2 flex items-center gap-2">
                  {item.isComplete ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <CircleAlert className="h-4 w-4 text-amber-600" />
                  )}
                  <p className="text-sm font-bold text-slate-900">{item.label}</p>
                </div>
                <p className="text-xs leading-5 text-slate-600">
                  {item.isComplete ? 'Ready for demo and launch evaluation.' : item.action}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="ef-card p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="ef-label-sm">AI advantage</p>
                <h3 className="mt-1 text-lg font-bold text-slate-900">Recommended next moves</h3>
              </div>
              <Bot className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="space-y-3">
              {ops.recommendations.slice(0, 4).map(recommendation => (
                <div key={recommendation.title} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <p className="text-sm font-bold text-slate-900">{recommendation.title}</p>
                    <span className="rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-bold uppercase text-indigo-700">
                      {recommendation.severity}
                    </span>
                  </div>
                  <p className="text-xs leading-5 text-slate-600">{recommendation.body}</p>
                  <p className="mt-2 text-xs font-bold text-emerald-700">{recommendation.impact}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="ef-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              <h3 className="text-lg font-bold text-slate-900">Differentiators</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {competitiveCoverage.moats.map(moat => (
                <span
                  key={moat}
                  className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700"
                >
                  {moat}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function ScoreCard({
  detail,
  label,
  tone,
  value,
}: {
  detail: string;
  label: string;
  tone: 'success' | 'warning' | 'danger';
  value: string;
}) {
  const toneClass = {
    success: 'border-l-emerald-500 bg-emerald-50/50',
    warning: 'border-l-amber-500 bg-amber-50/50',
    danger: 'border-l-rose-500 bg-rose-50/50',
  }[tone];

  return (
    <div className={`ef-card border-l-4 p-5 ${toneClass}`}>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-500">{detail}</p>
    </div>
  );
}

function getLeadScore(meta: unknown) {
  if (!meta || typeof meta !== 'object' || !('score' in meta)) {
    return 0;
  }

  const score = Number((meta as { score: unknown }).score);
  return Number.isFinite(score) ? score : 0;
}
