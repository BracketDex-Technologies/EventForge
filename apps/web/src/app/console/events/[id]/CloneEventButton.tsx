'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { cloneEvent } from './actions';

export default function CloneEventButton({ eventId }: { eventId: string }) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleClone = () => {
    startTransition(async () => {
      const result = await cloneEvent(eventId);
      if (result.success && result.clonedEventId) {
        setShowConfirm(false);
        router.push(`/console/events/${result.clonedEventId}`);
      } else {
        alert(result.error || 'Failed to clone event.');
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="ef-btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
        </svg>
        Clone Event
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowConfirm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Clone Event</h3>
                <p className="text-xs text-slate-500">Create an identical copy of this event</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-2">
              <p className="text-xs font-bold text-slate-700">This will duplicate:</p>
              <ul className="text-xs text-slate-600 space-y-1.5">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span> Event settings, dates & venue
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span> All ticket types (sales reset to 0)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span> Agenda sessions & speaker assignments
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span> Sponsors, exhibitors & tiers
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span> Website content & locales
                </li>
              </ul>
              <div className="border-t border-slate-200 pt-2 mt-2">
                <p className="text-xs font-bold text-slate-700">Will NOT copy:</p>
                <ul className="text-xs text-slate-500 space-y-1">
                  <li className="flex items-center gap-2">
                    <span className="text-slate-400">✕</span> Orders, registrations & attendee data
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-slate-400">✕</span> Check-ins & analytics data
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="ef-btn-secondary flex-1"
                disabled={isPending}
              >
                Cancel
              </button>
              <button
                onClick={handleClone}
                disabled={isPending}
                className="ef-btn-primary flex-1"
              >
                {isPending ? 'Cloning...' : 'Clone Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
