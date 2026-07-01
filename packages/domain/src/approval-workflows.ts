export type ApprovalMode = 'off' | 'manual' | 'conditional';
export type ApprovalRequestType = 'registration' | 'cancellation';
export type ApprovalDecision = 'auto_approve' | 'requires_review' | 'reject';
export type ApprovalSeverity = 'low' | 'medium' | 'critical';

export interface ApprovalPolicyInput {
  approvalMode: ApprovalMode;
  requestType: ApprovalRequestType;
  availableCapacity: number;
  attendeeCount: number;
  answers: Record<string, unknown>;
  blockedDomains: string[];
  requireApprovalForDomains: string[];
}

export interface ApprovalPolicyResult {
  decision: ApprovalDecision;
  severity: ApprovalSeverity;
  reasons: string[];
}

export function evaluateApprovalPolicy(input: ApprovalPolicyInput): ApprovalPolicyResult {
  const emailDomain = getEmailDomain(input.answers.email);
  const reasons: string[] = [];

  if (emailDomain && input.blockedDomains.includes(emailDomain)) {
    reasons.push('Email domain is blocked.');
  }

  if (input.attendeeCount > input.availableCapacity && input.requestType === 'registration') {
    reasons.push('Requested quantity exceeds available capacity.');
  }

  if (reasons.length > 0) {
    return {
      decision: 'reject',
      severity: 'critical',
      reasons,
    };
  }

  if (input.approvalMode === 'off') {
    return {
      decision: 'auto_approve',
      severity: 'low',
      reasons: ['Approval is disabled for this request type.'],
    };
  }

  if (input.approvalMode === 'manual') {
    return {
      decision: 'requires_review',
      severity: 'medium',
      reasons: ['Manual organizer approval is required.'],
    };
  }

  if (emailDomain && input.requireApprovalForDomains.includes(emailDomain)) {
    return {
      decision: 'requires_review',
      severity: 'medium',
      reasons: ['Email domain requires organizer review.'],
    };
  }

  return {
    decision: 'auto_approve',
    severity: 'low',
    reasons: ['Conditional approval checks passed.'],
  };
}

function getEmailDomain(email: unknown) {
  if (typeof email !== 'string') {
    return null;
  }

  const [, domain] = email.trim().toLowerCase().split('@');
  return domain || null;
}
