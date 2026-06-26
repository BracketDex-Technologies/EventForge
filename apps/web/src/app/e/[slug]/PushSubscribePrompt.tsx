'use client';

import { useState, useEffect, useTransition } from 'react';
import { subscribeToPush } from '@/app/console/events/[id]/notifications/actions';

export default function PushSubscribePrompt({ eventId }: { eventId: string }) {
  const [isPending, startTransition] = useTransition();
  const [showPrompt, setShowPrompt] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        // Show prompt after 3 seconds
        const timer = setTimeout(() => {
          setShowPrompt(true);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleEnable = () => {
    if (typeof window === 'undefined') return;

    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        startTransition(async () => {
          // Generate mock web push subscription parameters
          const mockEndpoint = `https://fcm.googleapis.com/fcm/send/mock-token-${Math.random().toString(36).substring(2, 15)}`;
          const mockP256dh = `mock-p256dh-${Math.random().toString(36).substring(2, 10)}`;
          const mockAuth = `mock-auth-${Math.random().toString(36).substring(2, 10)}`;

          const res = await subscribeToPush(eventId, {
            endpoint: mockEndpoint,
            keysP256dh: mockP256dh,
            keysAuth: mockAuth,
          });

          if (res.success) {
            setSuccessMsg(true);
            setShowPrompt(false);
            setTimeout(() => setSuccessMsg(false), 4000);
          }
        });
      } else {
        setShowPrompt(false);
      }
    });
  };

  if (successMsg) {
    return (
      <div className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-slate-800 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in-up text-xs font-semibold">
        <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-900 flex items-center justify-center font-bold">✓</span>
        Notifications enabled! You will receive live updates.
      </div>
    );
  }

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-4 rounded-2xl shadow-2xl max-w-sm flex items-start gap-3.5 animate-fade-in-up">
      <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 text-lg">
        🔔
      </div>

      <div className="space-y-2.5">
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">Enable Event Updates</h4>
          <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
            Get instant alerts when keynotes, workshops, or polls start.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleEnable}
            disabled={isPending}
            className="ef-btn-primary py-1 px-3 text-[11px] font-bold"
          >
            {isPending ? 'Enabling...' : 'Enable'}
          </button>
          <button
            onClick={() => setShowPrompt(false)}
            className="px-3 py-1 border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-700 rounded-lg text-[11px] font-semibold transition-colors"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
}
