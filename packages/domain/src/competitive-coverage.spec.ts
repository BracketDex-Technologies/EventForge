import { describe, expect, it } from 'vitest';
import { buildCompetitiveCoverage } from './competitive-coverage';

describe('buildCompetitiveCoverage', () => {
  it('reports full parity when every Backstage baseline area is covered', () => {
    const result = buildCompetitiveCoverage({
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

    expect(result.parityScore).toBe(100);
    expect(result.gaps).toHaveLength(0);
    expect(result.moats).toEqual([
      'AI ops forecast',
      'AI matchmaking',
      'Sponsor ROI intelligence',
    ]);
  });

  it('surfaces missing Zoho Backstage baseline capabilities as gaps', () => {
    const result = buildCompetitiveCoverage({
      coveredCapabilities: ['website_builder', 'ticketing', 'analytics'],
      aiCapabilities: [],
    });

    expect(result.parityScore).toBe(30);
    expect(result.gaps).toContainEqual(
      expect.objectContaining({
        capability: 'check_in_badging',
        label: 'Check-in and badging',
      }),
    );
    expect(result.gaps).toContainEqual(
      expect.objectContaining({
        capability: 'sponsor_exhibitor',
        label: 'Sponsor and exhibitor management',
      }),
    );
  });
});
