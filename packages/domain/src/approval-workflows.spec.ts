import { describe, expect, it } from 'vitest';
import { evaluateApprovalPolicy, resolveApprovalRequest } from './approval-workflows';

describe('evaluateApprovalPolicy', () => {
  it('auto-approves registrations when approval is disabled and capacity is available', () => {
    const result = evaluateApprovalPolicy({
      approvalMode: 'off',
      requestType: 'registration',
      availableCapacity: 25,
      attendeeCount: 2,
      answers: {},
      blockedDomains: [],
      requireApprovalForDomains: [],
    });

    expect(result.decision).toBe('auto_approve');
    expect(result.reasons).toEqual(['Approval is disabled for this request type.']);
  });

  it('requires review for configured attendee domains', () => {
    const result = evaluateApprovalPolicy({
      approvalMode: 'conditional',
      requestType: 'registration',
      availableCapacity: 10,
      attendeeCount: 1,
      answers: { email: 'buyer@enterprise.example' },
      blockedDomains: [],
      requireApprovalForDomains: ['enterprise.example'],
    });

    expect(result).toMatchObject({
      decision: 'requires_review',
      severity: 'medium',
    });
    expect(result.reasons).toContain('Email domain requires organizer review.');
  });

  it('rejects blocked domains and over-capacity requests', () => {
    const result = evaluateApprovalPolicy({
      approvalMode: 'conditional',
      requestType: 'registration',
      availableCapacity: 1,
      attendeeCount: 2,
      answers: { email: 'person@blocked.example' },
      blockedDomains: ['blocked.example'],
      requireApprovalForDomains: [],
    });

    expect(result.decision).toBe('reject');
    expect(result.severity).toBe('critical');
    expect(result.reasons).toContain('Email domain is blocked.');
    expect(result.reasons).toContain('Requested quantity exceeds available capacity.');
  });

  it('routes cancellation requests to review when cancellation approval is enabled', () => {
    const result = evaluateApprovalPolicy({
      approvalMode: 'manual',
      requestType: 'cancellation',
      availableCapacity: 0,
      attendeeCount: 1,
      answers: {},
      blockedDomains: [],
      requireApprovalForDomains: [],
    });

    expect(result.decision).toBe('requires_review');
    expect(result.reasons).toEqual(['Manual organizer approval is required.']);
  });
});

describe('resolveApprovalRequest', () => {
  it('approves a pending request with a decision reason', () => {
    const result = resolveApprovalRequest({
      currentStatus: 'pending',
      resolution: 'approved',
      reason: 'Enterprise buyer verified.',
    });

    expect(result).toEqual({
      status: 'approved',
      decisionReason: 'Enterprise buyer verified.',
      isTerminal: true,
    });
  });

  it('rejects a pending request and requires a reason', () => {
    const result = resolveApprovalRequest({
      currentStatus: 'pending',
      resolution: 'rejected',
      reason: 'Blocked procurement domain.',
    });

    expect(result.status).toBe('rejected');
    expect(result.decisionReason).toBe('Blocked procurement domain.');
  });

  it('prevents resolving a non-pending request', () => {
    expect(() =>
      resolveApprovalRequest({
        currentStatus: 'approved',
        resolution: 'rejected',
        reason: 'Changed mind.',
      }),
    ).toThrow('Only pending approval requests can be resolved.');
  });
});
