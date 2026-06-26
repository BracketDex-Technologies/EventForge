'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

export default function OnboardingPage() {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const supabase = createClient();
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          throw new Error('You must be logged in to create an organization.');
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        
        const res = await fetch(`${apiUrl}/v1/organizations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({ name, slug }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || 'Failed to create organization.');
        }

        // Wait a tiny bit for the read-replica to catch up if needed
        await new Promise(r => setTimeout(r, 600));
        
        // Use window.location.href to force a full hard reload so the layout fetches the new org
        window.location.href = '/console';
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
        setError(errorMessage);
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 p-6 relative overflow-hidden font-sans">
      {/* Background glow elements */}
      <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full blur-[140px] opacity-[0.06] bg-indigo-500 pointer-events-none" />
      <div className="absolute bottom-[10%] right-[20%] w-[400px] h-[400px] rounded-full blur-[120px] opacity-[0.04] bg-teal-500 pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 sm:p-10 relative z-10">
        <div className="flex items-center justify-center mb-8">
          <div className="relative p-2 rounded-xl bg-slate-950/80 border border-slate-800 shadow-lg">
            <Image src="/logo-icon.svg" alt="EventForge" width={40} height={40} />
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white tracking-tight">Create your workspace</h1>
          <p className="mt-2 text-sm text-slate-400 leading-relaxed">
            Set up an organization workspace to host, manage, ticket, and run all your events.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/30 border border-red-900/50 text-sm text-red-400 animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Organization Name</label>
            <input
              id="name"
              type="text"
              required
              placeholder="e.g. Acme Event Management"
              value={name}
              onChange={(e) => {
                const val = e.target.value;
                setName(val);
                setSlug(
                  val
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)+/g, '')
                );
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              disabled={isPending}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="slug" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Workspace URL</label>
              <span className="text-[10px] text-slate-500 font-medium">Must be unique</span>
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-slate-500 text-sm select-none font-mono">
                eventforge.app/
              </span>
              <input
                id="slug"
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                style={{ paddingLeft: '125px', paddingRight: '16px' }}
                disabled={isPending}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending || !name || !slug}
            className="w-full py-3.5 mt-4 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-600/20 cursor-pointer flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Creating workspace...
              </>
            ) : (
              <>
                Create organization
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
