import { describe, expect, it } from 'vitest';
import { buildEventReadiness } from './event-readiness';

describe('buildEventReadiness', () => {
  it('marks an event demo-ready when core Zoho parity and AI advantage signals are present', () => {
    const result = buildEventReadiness({
      websitePublished: true,
      ticketTypes: 3,
      sessions: 8,
      speakers: 6,
      checkIns: 120,
      campaigns: 3,
      exhibitors: 4,
      leadCaptures: 60,
      pollVotes: 180,
      qaMessages: 30,
      attendeeProfiles: 240,
      aiMatchmakingEnabled: true,
      accessibilityControlsEnabled: true,
      automationRules: 2,
      analyticsConnected: true,
    });

    expect(result.status).toBe('demo_ready');
    expect(result.score).toBe(100);
    expect(result.gaps).toHaveLength(0);
    expect(result.completed).toContainEqual(
      expect.objectContaining({ key: 'ai_matchmaking', label: 'AI matchmaking' }),
    );
  });

  it('returns actionable gaps for missing launch capabilities', () => {
    const result = buildEventReadiness({
      websitePublished: false,
      ticketTypes: 0,
      sessions: 1,
      speakers: 0,
      checkIns: 0,
      campaigns: 0,
      exhibitors: 0,
      leadCaptures: 0,
      pollVotes: 0,
      qaMessages: 0,
      attendeeProfiles: 0,
      aiMatchmakingEnabled: false,
      accessibilityControlsEnabled: false,
      automationRules: 0,
      analyticsConnected: false,
    });

    expect(result.status).toBe('needs_work');
    expect(result.score).toBeLessThan(40);
    expect(result.gaps).toContainEqual(
      expect.objectContaining({
        key: 'ticketing',
        label: 'Ticketing and registration',
        action: 'Create at least one ticket type and validate checkout.',
      }),
    );
    expect(result.gaps).toContainEqual(
      expect.objectContaining({
        key: 'accessibility',
        label: 'Accessibility controls',
      }),
    );
  });
});
