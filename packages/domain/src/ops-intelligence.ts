export type OpsRecommendationType = 'onsite' | 'revenue' | 'sponsor' | 'engagement';
export type OpsRecommendationSeverity = 'critical' | 'high' | 'medium';

export interface OpsIntelligenceInput {
  issuedTickets: number;
  checkIns: number;
  currentArrivalRatePerHour: number;
  scannerCapacityPerHour: number;
  vipTicketsSold: number;
  vipTicketCapacity: number;
  vipTicketPriceCents: number;
  sponsorLeadScores: number[];
  unansweredQuestions: number;
  pollVotes: number;
}

export interface OpsRecommendation {
  type: OpsRecommendationType;
  severity: OpsRecommendationSeverity;
  title: string;
  body: string;
  impact: string;
  score: number;
}

export interface OpsIntelligenceResult {
  healthScore: number;
  riskLevel: 'stable' | 'watch' | 'at_risk';
  recommendations: OpsRecommendation[];
}

export function buildOpsIntelligence(input: OpsIntelligenceInput): OpsIntelligenceResult {
  const recommendations = [
    buildCheckInRecommendation(input),
    buildVipRecommendation(input),
    buildSponsorRecommendation(input),
    buildEngagementRecommendation(input),
  ].filter((recommendation): recommendation is OpsRecommendation => recommendation !== null);

  recommendations.sort((a, b) => b.score - a.score);

  const penalty = recommendations.reduce((sum, recommendation) => sum + recommendation.score, 0);
  const healthScore = clamp(100 - penalty, 35, 98);

  return {
    healthScore,
    riskLevel: healthScore < 70 ? 'at_risk' : healthScore < 85 ? 'watch' : 'stable',
    recommendations,
  };
}

function buildCheckInRecommendation(input: OpsIntelligenceInput): OpsRecommendation | null {
  if (input.scannerCapacityPerHour <= 0) {
    return null;
  }

  const pressurePercent = Math.round(
    ((input.currentArrivalRatePerHour - input.scannerCapacityPerHour) /
      input.scannerCapacityPerHour) *
      100,
  );

  if (pressurePercent <= 10) {
    return null;
  }

  const severity = pressurePercent >= 30 ? 'critical' : 'high';

  return {
    type: 'onsite',
    severity,
    title: 'Open express check-in capacity',
    body: `Arrival demand is pacing above scanner throughput while ${formatPercent(input.checkIns, input.issuedTickets)} of issued tickets are checked in.`,
    impact: `${pressurePercent}% capacity gap`,
    score: severity === 'critical' ? 24 : 16,
  };
}

function buildVipRecommendation(input: OpsIntelligenceInput): OpsRecommendation | null {
  if (input.vipTicketCapacity <= 0 || input.vipTicketPriceCents <= 0) {
    return null;
  }

  const remainingVipTickets = input.vipTicketCapacity - input.vipTicketsSold;
  const soldPercent = input.vipTicketsSold / input.vipTicketCapacity;

  if (remainingVipTickets <= 0 || soldPercent < 0.75) {
    return null;
  }

  return {
    type: 'revenue',
    severity: soldPercent >= 0.9 ? 'high' : 'medium',
    title: 'Release VIP overflow inventory',
    body: `${remainingVipTickets} VIP seats remain while premium inventory is pacing ahead of general admission.`,
    impact: `${formatMoney(remainingVipTickets * input.vipTicketPriceCents)} projected upside`,
    score: soldPercent >= 0.9 ? 15 : 10,
  };
}

function buildSponsorRecommendation(input: OpsIntelligenceInput): OpsRecommendation | null {
  const highIntentLeads = input.sponsorLeadScores.filter(score => score >= 85);

  if (highIntentLeads.length < 2) {
    return null;
  }

  const averageScore = Math.round(
    highIntentLeads.reduce((sum, score) => sum + score, 0) / highIntentLeads.length,
  );

  return {
    type: 'sponsor',
    severity: 'high',
    title: 'Trigger sponsor lead follow-up',
    body: `${highIntentLeads.length} high-intent booth scans should be routed to sponsor CRM owners before the next session break.`,
    impact: `${averageScore}+ lead score`,
    score: 14,
  };
}

function buildEngagementRecommendation(input: OpsIntelligenceInput): OpsRecommendation | null {
  if (input.unansweredQuestions < 5) {
    return null;
  }

  return {
    type: 'engagement',
    severity: input.unansweredQuestions >= 10 ? 'high' : 'medium',
    title: 'Assign a Q&A moderator',
    body: `${input.unansweredQuestions} attendee questions are waiting while poll participation sits at ${input.pollVotes} votes.`,
    impact: 'Protect session sentiment',
    score: input.unansweredQuestions >= 10 ? 12 : 8,
  };
}

function formatPercent(value: number, total: number) {
  if (total <= 0) {
    return '0%';
  }

  return `${Math.round((value / total) * 100)}%`;
}

function formatMoney(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
