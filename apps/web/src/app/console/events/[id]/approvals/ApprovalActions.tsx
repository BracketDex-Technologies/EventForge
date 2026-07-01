'use client';

import { useTransition } from 'react';
import { resolveApprovalRequestAction } from './actions';

export default function ApprovalActions({
  eventId,
  requestId,
}: {
  eventId: string;
  requestId: string;
}) {
  const [isPending, startTransition] = useTransition();

  const resolve = (resolution: 'approved' | 'rejected') => {
    startTransition(async () => {
      const result = await resolveApprovalRequestAction(eventId, requestId, resolution);
      if (!result.success) {
        alert(result.error || 'Could not update approval request.');
      }
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        disabled={isPending}
        onClick={() => resolve('approved')}
        className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50"
      >
        Approve
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => resolve('rejected')}
        className="rounded-md border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  );
}
