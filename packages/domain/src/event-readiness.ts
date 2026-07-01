export type EventReadinessKey =
  | 'website'
  | 'ticketing'
  | 'agenda'
  | 'check_in'
  | 'marketing'
  | 'sponsors'
  | 'engagement'
  | 'attendee_app'
  | 'ai_matchmaking'
  | 'accessibility'
  | 'automation'
  | 'analytics';

export interface EventReadinessInput {
  websitePublished: boolean;
  ticketTypes: number;
  sessions: number;
  speakers: number;
  checkIns: number;
  campaigns: number;
  exhibitors: number;
  leadCaptures: number;
  pollVotes: number;
  qaMessages: number;
  attendeeProfiles: number;
  aiMatchmakingEnabled: boolean;
  accessibilityControlsEnabled: boolean;
  automationRules: number;
  analyticsConnected: boolean;
}

export interface EventReadinessItem {
  key: EventReadinessKey;
  label: string;
  isComplete: boolean;
  action: string;
}

export interface EventReadinessResult {
  score: number;
  status: 'demo_ready' | 'almost_ready' | 'needs_work';
  completed: EventReadinessItem[];
  gaps: EventReadinessItem[];
  items: EventReadinessItem[];
}

export function buildEventReadiness(input: EventReadinessInput): EventReadinessResult {
  const items: EventReadinessItem[] = [
    {
      key: 'website',
      label: 'Event website',
      isComplete: input.websitePublished,
      action: 'Publish the event website with title, summary, speakers, and CTA.',
    },
    {
      key: 'ticketing',
      label: 'Ticketing and registration',
      isComplete: input.ticketTypes > 0,
      action: 'Create at least one ticket type and validate checkout.',
    },
    {
      key: 'agenda',
      label: 'Agenda, sessions, and speakers',
      isComplete: input.sessions >= 2 && input.speakers >= 1,
      action: 'Add agenda sessions and assign confirmed speakers.',
    },
    {
      key: 'check_in',
      label: 'Check-in and onsite ops',
      isComplete: input.checkIns > 0,
      action: 'Run a scanner test and complete at least one check-in.',
    },
    {
      key: 'marketing',
      label: 'Marketing campaigns',
      isComplete: input.campaigns > 0,
      action: 'Create an email, WhatsApp, or reminder campaign.',
    },
    {
      key: 'sponsors',
      label: 'Sponsors, exhibitors, and lead capture',
      isComplete: input.exhibitors > 0 && input.leadCaptures > 0,
      action: 'Add exhibitors and capture at least one booth lead.',
    },
    {
      key: 'engagement',
      label: 'Polls and Q&A',
      isComplete: input.pollVotes > 0 || input.qaMessages > 0,
      action: 'Launch a live poll or seed moderated Q&A for a session.',
    },
    {
      key: 'attendee_app',
      label: 'Attendee app experience',
      isComplete: input.attendeeProfiles > 0,
      action: 'Create attendee profiles so networking, app, and personalization work.',
    },
    {
      key: 'ai_matchmaking',
      label: 'AI matchmaking',
      isComplete: input.aiMatchmakingEnabled,
      action: 'Enable AI profile matching for attendee networking.',
    },
    {
      key: 'accessibility',
      label: 'Accessibility controls',
      isComplete: input.accessibilityControlsEnabled,
      action: 'Enable attendee high-contrast, large-text, and reading-guide controls.',
    },
    {
      key: 'automation',
      label: 'Automation and integrations',
      isComplete: input.automationRules > 0,
      action: 'Configure at least one workflow, webhook, or CRM sync rule.',
    },
    {
      key: 'analytics',
      label: 'Analytics and reporting',
      isComplete: input.analyticsConnected,
      action: 'Connect event metrics, registration, revenue, and engagement reporting.',
    },
  ];

  const completed = items.filter(item => item.isComplete);
  const gaps = items.filter(item => !item.isComplete);
  const score = Math.round((completed.length / items.length) * 100);

  return {
    score,
    status: score >= 90 ? 'demo_ready' : score >= 70 ? 'almost_ready' : 'needs_work',
    completed,
    gaps,
    items,
  };
}
