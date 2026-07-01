import { describe, expect, it } from 'vitest';
import { buildOpsIntelligence } from './ops-intelligence';

describe('buildOpsIntelligence', () => {
  it('prioritizes check-in pressure when arrivals outpace scanner capacity', () => {
    const result = buildOpsIntelligence({
      issuedTickets: 600,
      checkIns: 120,
      currentArrivalRatePerHour: 260,
      scannerCapacityPerHour: 180,
      vipTicketsSold: 96,
      vipTicketCapacity: 120,
      vipTicketPriceCents: 59900,
      sponsorLeadScores: [92, 88, 73],
      unansweredQuestions: 8,
      pollVotes: 32,
    });

    expect(result.healthScore).toBeLessThan(80);
    const topRecommendation = result.recommendations[0];
    expect(topRecommendation).toBeDefined();
    expect(topRecommendation).toMatchObject({
      type: 'onsite',
      title: 'Open express check-in capacity',
      severity: 'critical',
    });
    expect(topRecommendation?.impact).toContain('44%');
  });

  it('projects VIP revenue opportunity from remaining high-value inventory', () => {
    const result = buildOpsIntelligence({
      issuedTickets: 300,
      checkIns: 210,
      currentArrivalRatePerHour: 90,
      scannerCapacityPerHour: 180,
      vipTicketsSold: 110,
      vipTicketCapacity: 120,
      vipTicketPriceCents: 59900,
      sponsorLeadScores: [64, 58],
      unansweredQuestions: 2,
      pollVotes: 18,
    });

    expect(result.recommendations).toContainEqual(
      expect.objectContaining({
        type: 'revenue',
        title: 'Release VIP overflow inventory',
        impact: '$5,990 projected upside',
      }),
    );
  });

  it('surfaces sponsor follow-up when high-intent leads are present', () => {
    const result = buildOpsIntelligence({
      issuedTickets: 100,
      checkIns: 80,
      currentArrivalRatePerHour: 20,
      scannerCapacityPerHour: 120,
      vipTicketsSold: 20,
      vipTicketCapacity: 100,
      vipTicketPriceCents: 49900,
      sponsorLeadScores: [91, 89, 40],
      unansweredQuestions: 0,
      pollVotes: 22,
    });

    expect(result.recommendations).toContainEqual(
      expect.objectContaining({
        type: 'sponsor',
        title: 'Trigger sponsor lead follow-up',
        severity: 'high',
      }),
    );
  });
});
