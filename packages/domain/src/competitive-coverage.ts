export type BackstageBaselineCapability =
  | 'website_builder'
  | 'ticketing'
  | 'rsvp'
  | 'check_in_badging'
  | 'marketing'
  | 'sponsor_exhibitor'
  | 'attendee_engagement'
  | 'event_app'
  | 'lead_capture'
  | 'analytics';

export type EventForgeAiCapability = 'ops_forecast' | 'matchmaking' | 'sponsor_roi';

export interface CompetitiveCoverageInput {
  coveredCapabilities: BackstageBaselineCapability[];
  aiCapabilities: EventForgeAiCapability[];
}

export interface CompetitiveGap {
  capability: BackstageBaselineCapability;
  label: string;
}

export interface CompetitiveCoverageResult {
  parityScore: number;
  covered: CompetitiveGap[];
  gaps: CompetitiveGap[];
  moats: string[];
}

const backstageBaseline: CompetitiveGap[] = [
  { capability: 'website_builder', label: 'Website builder' },
  { capability: 'ticketing', label: 'Ticketing and registration' },
  { capability: 'rsvp', label: 'RSVP management' },
  { capability: 'check_in_badging', label: 'Check-in and badging' },
  { capability: 'marketing', label: 'Marketing campaigns' },
  { capability: 'sponsor_exhibitor', label: 'Sponsor and exhibitor management' },
  { capability: 'attendee_engagement', label: 'Attendee engagement' },
  { capability: 'event_app', label: 'Attendee event app' },
  { capability: 'lead_capture', label: 'Lead capture' },
  { capability: 'analytics', label: 'Real-time analytics' },
];

const aiMoatLabels: Record<EventForgeAiCapability, string> = {
  ops_forecast: 'AI ops forecast',
  matchmaking: 'AI matchmaking',
  sponsor_roi: 'Sponsor ROI intelligence',
};

export function buildCompetitiveCoverage(
  input: CompetitiveCoverageInput,
): CompetitiveCoverageResult {
  const coveredSet = new Set(input.coveredCapabilities);
  const covered = backstageBaseline.filter(item => coveredSet.has(item.capability));
  const gaps = backstageBaseline.filter(item => !coveredSet.has(item.capability));

  return {
    parityScore: Math.round((covered.length / backstageBaseline.length) * 100),
    covered,
    gaps,
    moats: input.aiCapabilities.map(capability => aiMoatLabels[capability]),
  };
}
