'use client';

import { useState, useTransition } from 'react';
import { checkInAttendee, undoCheckIn, bulkCheckIn } from '../actions';

interface CheckInRecord {
  id: string;
  ticketId: string;
  method: string;
  scannedAt: string;
}

interface Attendee {
  id: string;
  displayName: string;
  company: string | null;
  jobTitle: string | null;
}

interface CheckInManagerProps {
  eventId: string;
  attendees: Attendee[];
  checkIns: CheckInRecord[];
}

export default function CheckInManager({ eventId, attendees, checkIns }: CheckInManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState('');

  const checkedInMap = new Map(checkIns.map(c => [c.ticketId, c]));

  const filtered = attendees.filter(a =>
    a.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.company || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const checkedInCount = attendees.filter(a => checkedInMap.has(a.id)).length;
  const pendingCount = attendees.length - checkedInCount;
  const checkInRate = attendees.length > 0 ? Math.round((checkedInCount / attendees.length) * 100) : 0;

  const handleCheckIn = (attendeeId: string) => {
    startTransition(async () => {
      const res = await checkInAttendee(eventId, attendeeId);
      if (!res.success) alert(res.error || 'Failed to check in.');
    });
  };

  const handleUndo = (checkInId: string) => {
    startTransition(async () => {
      const res = await undoCheckIn(eventId, checkInId);
      if (!res.success) alert(res.error || 'Failed to undo.');
    });
  };

  const handleBulkCheckIn = () => {
    const pendingIds = attendees.filter(a => !checkedInMap.has(a.id)).map(a => a.id);
    if (pendingIds.length === 0) return;

    if (!confirm(`Check in ${pendingIds.length} pending attendees?`)) return;

    startTransition(async () => {
      const res = await bulkCheckIn(eventId, pendingIds);
      if (res.success) {
        alert(`Successfully checked in ${res.count} attendees.`);
      } else {
        alert(res.error || 'Bulk check-in failed.');
      }
    });
  };

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="ef-card p-4 border-l-4 border-l-slate-300">
          <p className="text-sm font-medium text-slate-500">Total Registered</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{attendees.length}</h3>
        </div>
        <div className="ef-card p-4 border-l-4 border-l-emerald-500">
          <p className="text-sm font-medium text-slate-500">Checked In</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{checkedInCount}</h3>
        </div>
        <div className="ef-card p-4 border-l-4 border-l-amber-500">
          <p className="text-sm font-medium text-slate-500">Pending</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{pendingCount}</h3>
        </div>
        <div className="ef-card p-4 border-l-4 border-l-indigo-500">
          <p className="text-sm font-medium text-slate-500">Check-in Rate</p>
          <div className="flex items-end gap-2 mt-1">
            <h3 className="text-2xl font-bold text-slate-900">{checkInRate}%</h3>
            <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden mb-1.5">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${checkInRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="ef-card">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50">
          <div className="relative flex-1 max-w-md w-full">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, company, or ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="ef-input pl-9 text-sm w-full"
            />
          </div>
          <button
            onClick={handleBulkCheckIn}
            disabled={isPending || pendingCount === 0}
            className="ef-btn-primary text-xs px-4 py-2 disabled:opacity-50"
          >
            {isPending ? 'Processing...' : `Bulk Check-in (${pendingCount})`}
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="p-16 text-center">
            <p className="text-base font-semibold text-slate-900">No attendees found</p>
            <p className="text-sm text-slate-500 mt-1">
              {searchQuery ? 'Try a different search term.' : 'No attendees registered for this event yet.'}
            </p>
          </div>
        ) : (
          <table className="ef-table">
            <thead>
              <tr>
                <th>Attendee</th>
                <th>Company</th>
                <th>Status</th>
                <th>Method</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(attendee => {
                const checkIn = checkedInMap.get(attendee.id);
                const isCheckedIn = !!checkIn;

                return (
                  <tr key={attendee.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                          {attendee.displayName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{attendee.displayName}</div>
                          <div className="text-xs text-slate-500 font-mono">#{attendee.id.slice(0, 8)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-sm text-slate-600">{attendee.company || '–'}</td>
                    <td>
                      {isCheckedIn ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Checked In
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="text-xs text-slate-500 capitalize">
                      {checkIn?.method || '–'}
                    </td>
                    <td className="text-right">
                      {isCheckedIn ? (
                        <button
                          onClick={() => handleUndo(checkIn!.id)}
                          disabled={isPending}
                          className="ef-btn-secondary text-xs px-3 py-1.5 text-rose-600 border-rose-200 hover:bg-rose-50 hover:border-rose-300"
                        >
                          Undo
                        </button>
                      ) : (
                        <button
                          onClick={() => handleCheckIn(attendee.id)}
                          disabled={isPending}
                          className="ef-btn-secondary text-xs px-3 py-1.5 text-emerald-700 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300"
                        >
                          Check In
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
