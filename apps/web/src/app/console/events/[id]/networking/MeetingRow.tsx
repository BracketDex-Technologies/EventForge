'use client';

import { useTransition } from 'react';
import { updateMeetingStatus } from './actions';

interface MeetingRowProps {
  eventId: string;
  meeting: {
    id: string;
    slot: Date;
    status: string;
    notes: string | null;
    roomUrl: string | null;
    aAttendee: { displayName: string; company: string | null };
    bAttendee: { displayName: string; company: string | null };
  };
}

export default function MeetingRow({ eventId, meeting }: MeetingRowProps) {
  const [isPending, startTransition] = useTransition();

  const handleUpdate = (status: string) => {
    startTransition(async () => {
      const res = await updateMeetingStatus(meeting.id, eventId, status);
      if (!res.success) alert(res.error);
    });
  };

  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="py-4 px-6">
        <div className="font-semibold text-slate-800">{meeting.aAttendee.displayName}</div>
        <div className="text-xs text-slate-400">{meeting.aAttendee.company || 'No Company'}</div>
      </td>
      <td className="py-4 px-6 text-slate-400 text-sm font-medium">➔</td>
      <td className="py-4 px-6">
        <div className="font-semibold text-slate-800">{meeting.bAttendee.displayName}</div>
        <div className="text-xs text-slate-400">{meeting.bAttendee.company || 'No Company'}</div>
      </td>
      <td className="py-4 px-6 text-sm text-slate-700">
        {new Date(meeting.slot).toLocaleString('en-US', {
          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        })}
      </td>
      <td className="py-4 px-6">
        {meeting.status === 'accepted' && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
            Accepted
          </span>
        )}
        {meeting.status === 'pending' && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
            Pending
          </span>
        )}
        {meeting.status === 'declined' && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-100">
            Declined
          </span>
        )}
        {meeting.status === 'cancelled' && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            Cancelled
          </span>
        )}
      </td>
      <td className="py-4 px-6 text-sm text-slate-500 max-w-[200px] truncate">
        {meeting.notes || '-'}
      </td>
      <td className="py-4 px-6 text-right space-x-2">
        {meeting.status === 'pending' && (
          <>
            <button
              onClick={() => handleUpdate('accepted')}
              disabled={isPending}
              className="text-emerald-600 hover:text-emerald-900 text-sm font-semibold disabled:opacity-50"
            >
              Accept
            </button>
            <button
              onClick={() => handleUpdate('declined')}
              disabled={isPending}
              className="text-rose-600 hover:text-rose-900 text-sm font-medium disabled:opacity-50"
            >
              Decline
            </button>
          </>
        )}
        {meeting.status === 'accepted' && (
          <button
            onClick={() => handleUpdate('cancelled')}
            disabled={isPending}
            className="text-slate-500 hover:text-slate-900 text-sm font-medium disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </td>
    </tr>
  );
}
