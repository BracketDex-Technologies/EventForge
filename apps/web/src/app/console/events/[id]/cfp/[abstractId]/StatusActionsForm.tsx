'use client';

import { useTransition } from 'react';
import { updateAbstractStatus, convertToSession } from '../actions';
import Link from 'next/link';

interface StatusActionsFormProps {
  eventId: string;
  abstract: {
    id: string;
    status: string;
    convertedSessionId: string | null;
  };
}

export default function StatusActionsForm({ eventId, abstract }: StatusActionsFormProps) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (newStatus: string) => {
    startTransition(async () => {
      const res = await updateAbstractStatus(eventId, abstract.id, newStatus);
      if (res.success) {
        alert(`Status updated to ${newStatus}!`);
      } else {
        alert(res.error || 'Failed to update status.');
      }
    });
  };

  const handleConvertToSession = () => {
    startTransition(async () => {
      const res = await convertToSession(eventId, abstract.id);
      if (res.success) {
        alert('Converted to session successfully!');
      } else {
        alert(res.error || 'Failed to convert to session.');
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Current status display */}
      <div className="flex justify-between items-center bg-white border border-slate-100 p-3 rounded-xl shadow-sm">
        <span className="text-xs font-semibold text-slate-500">Current Status</span>
        <span className="capitalize text-xs font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-full">
          {abstract.status.replace('_', ' ')}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => handleStatusChange('accepted')}
          disabled={isPending || abstract.status === 'accepted'}
          className="ef-btn-primary py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:bg-emerald-600"
        >
          Accept Abstract
        </button>
        <button
          type="button"
          onClick={() => handleStatusChange('rejected')}
          disabled={isPending || abstract.status === 'rejected'}
          className="ef-btn-secondary py-2 text-xs font-bold border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50"
        >
          Reject Abstract
        </button>
      </div>

      {abstract.status === 'accepted' && (
        <div className="border-t border-slate-200 pt-3 mt-1 space-y-3">
          {abstract.convertedSessionId ? (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center">
              <p className="text-xs font-semibold text-emerald-900">Converted to session!</p>
              <Link
                href={`/console/events/${eventId}/agenda`}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 mt-1 inline-block underline"
              >
                Go to Agenda Scheduler &rarr;
              </Link>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleConvertToSession}
              disabled={isPending}
              className="ef-btn-primary w-full py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 flex justify-center items-center gap-1.5"
            >
              🔄 Convert to Agenda Session
            </button>
          )}
        </div>
      )}
    </div>
  );
}
