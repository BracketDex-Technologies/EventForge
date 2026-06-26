'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import { kioskCheckIn } from './actions';

export default function KioskTerminal({ eventId }: { eventId: string }) {
  const [isPending, startTransition] = useTransition();
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'already' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [attendeeInfo, setAttendeeInfo] = useState({ name: '', ticketType: '' });
  const [countdown, setCountdown] = useState(5);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Keep focus on input for automated scanners
    if (status === 'idle') {
      inputRef.current?.focus();
    }
  }, [status]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status !== 'idle' && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (status !== 'idle' && countdown === 0) {
      // Reset terminal
      setStatus('idle');
      setCode('');
      setErrorMessage('');
      setCountdown(5);
    }
    return () => clearTimeout(timer);
  }, [status, countdown]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    startTransition(async () => {
      const res = await kioskCheckIn(eventId, code);
      if (res.success) {
        setAttendeeInfo({
          name: res.attendeeName || 'Attendee',
          ticketType: res.ticketType || 'General Admission',
        });
        if (res.alreadyCheckedIn) {
          setStatus('already');
        } else {
          setStatus('success');
        }
      } else {
        setErrorMessage(res.error || 'Check-in failed');
        setStatus('error');
      }
    });
  };

  // Success view
  if (status === 'success' || status === 'already') {
    return (
      <div className="w-full text-center space-y-6 bg-slate-900 border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden animate-fade-in">
        {/* Flash/Wave indicator */}
        <div className={`absolute inset-0 opacity-10 animate-pulse pointer-events-none ${
          status === 'success' ? 'bg-emerald-500' : 'bg-amber-500'
        }`} />

        <div className="space-y-3 relative z-10">
          <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center text-3xl font-bold shadow-lg ${
            status === 'success' ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500 text-slate-950'
          }`}>
            {status === 'success' ? '✓' : 'ℹ'}
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            {status === 'success' ? 'Check-in Successful!' : 'Already Checked In'}
          </h2>
        </div>

        <div className="space-y-1 relative z-10 py-4 bg-white/5 rounded-2xl border border-white/5">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Attendee Name</p>
          <p className="text-xl font-black text-white">{attendeeInfo.name}</p>
          <p className="text-xs text-indigo-300 font-bold mt-2">{attendeeInfo.ticketType}</p>
        </div>

        <p className="text-xs text-slate-400 relative z-10">
          Welcome to the event! Please collect your badge.
        </p>

        {/* Countdown display */}
        <div className="relative z-10 pt-2 flex justify-center items-center gap-2 text-xs text-slate-500">
          <span className="w-4 h-4 rounded-full border border-slate-500 flex items-center justify-center font-mono font-bold">
            {countdown}
          </span>
          Resetting terminal...
        </div>
      </div>
    );
  }

  // Error view
  if (status === 'error') {
    return (
      <div className="w-full text-center space-y-6 bg-slate-900 border border-rose-500/30 p-8 rounded-3xl shadow-2xl animate-fade-in">
        <div className="space-y-3">
          <div className="w-20 h-20 rounded-full mx-auto bg-rose-500 text-slate-950 flex items-center justify-center text-3xl font-bold shadow-lg">
            ✕
          </div>
          <h2 className="text-2xl font-black tracking-tight text-rose-500">Check-in Failed</h2>
        </div>

        <p className="text-sm font-semibold text-slate-200 bg-rose-950/30 border border-rose-900/50 p-4 rounded-2xl">
          {errorMessage}
        </p>

        <button
          onClick={() => setStatus('idle')}
          className="ef-btn-secondary px-6 py-2 text-xs font-bold border-white/10 text-white hover:bg-white/5"
        >
          Try Again
        </button>

        <div className="pt-2 flex justify-center items-center gap-2 text-xs text-slate-500">
          <span className="w-4 h-4 rounded-full border border-slate-500 flex items-center justify-center font-mono font-bold">
            {countdown}
          </span>
          Resetting terminal...
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6 text-center bg-slate-900/50 border border-white/5 p-8 rounded-3xl shadow-xl">
      <div className="space-y-2">
        <h2 className="text-2xl font-black tracking-tight">Kiosk Self Check-in</h2>
        <p className="text-xs text-slate-400">
          Enter your 8-digit ticket verification code below.
        </p>
      </div>

      <div className="space-y-4">
        <input
          ref={inputRef}
          type="text"
          maxLength={12}
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="ENTER CODE (e.g. ABC123XY)"
          className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-center font-mono text-xl tracking-[4px] uppercase font-black text-indigo-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-slate-700 shadow-inner"
          disabled={isPending}
          autoFocus
          required
        />

        <button
          type="submit"
          disabled={isPending || !code.trim()}
          className="ef-btn-primary w-full py-3.5 rounded-2xl text-sm font-black bg-indigo-600 hover:bg-indigo-700 shadow-lg text-slate-950 font-sans disabled:opacity-50"
        >
          {isPending ? 'VERIFYING...' : 'CONFIRM CHECK-IN'}
        </button>
      </div>
    </form>
  );
}
