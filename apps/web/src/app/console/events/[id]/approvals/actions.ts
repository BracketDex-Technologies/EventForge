'use server';

import { prisma } from '@eventforge/db';
import { resolveApprovalRequest, type ApprovalResolution } from '@eventforge/domain';
import { revalidatePath } from 'next/cache';

export async function resolveApprovalRequestAction(
  eventId: string,
  requestId: string,
  resolution: ApprovalResolution,
) {
  try {
    const request = await prisma.approvalRequest.findFirst({
      where: { id: requestId, eventId },
      select: {
        id: true,
        status: true,
        requestType: true,
        requesterEmail: true,
      },
    });

    if (!request) {
      return { success: false, error: 'Approval request not found.' };
    }

    const result = resolveApprovalRequest({
      currentStatus: toApprovalRequestStatus(request.status),
      resolution,
      reason:
        resolution === 'approved'
          ? `Approved ${request.requestType} request for ${request.requesterEmail ?? 'attendee'}.`
          : `Rejected ${request.requestType} request for ${request.requesterEmail ?? 'attendee'}.`,
    });

    await prisma.approvalRequest.update({
      where: { id: request.id },
      data: {
        status: result.status,
        decisionReason: result.decisionReason,
        reviewedAt: new Date(),
      },
    });

    revalidatePath(`/console/events/${eventId}/approvals`);
    revalidatePath(`/console/events/${eventId}/readiness`);

    return { success: true };
  } catch (error) {
    console.error('Failed to resolve approval request:', error);
    return { success: false, error: 'Failed to resolve approval request.' };
  }
}

function toApprovalRequestStatus(status: string) {
  if (
    status === 'pending' ||
    status === 'approved' ||
    status === 'rejected' ||
    status === 'cancelled'
  ) {
    return status;
  }

  return 'pending';
}
