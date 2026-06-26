'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

export default function OnboardingPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // Auto-generate slug from name
    if (name) {
      setSlug(
        name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  }, [name]);

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
        await new Promise(r => setTimeout(r, 500));
        
        // Use window.location.href to force a full hard reload so the layout fetches the new org
        window.location.href = '/console';
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center justify-center mb-8">
          <Image src="/logo-icon.svg" alt="EventForge" width={48} height={48} />
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome to EventForge</h1>
          <p className="mt-2 text-sm text-slate-500">
            Let's get started by setting up your organization. This will be the home for all your events.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="ef-label">Organization Name</label>
            <input
              id="name"
              type="text"
              required
              placeholder="e.g. Acme Events"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="ef-input"
              disabled={isPending}
            />
          </div>

          <div>
            <label htmlFor="slug" className="ef-label flex justify-between">
              <span>Workspace URL</span>
              <span className="text-slate-400 font-normal">Must be unique</span>
            </label>
            <div className="relative flex items-center mt-1.5">
              <span className="absolute left-3 text-slate-400 text-sm select-none">
                eventforge.app/
              </span>
              <input
                id="slug"
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="ef-input font-mono text-sm"
                style={{ paddingLeft: '125px' }}
                disabled={isPending}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending || !name || !slug}
            className="w-full ef-btn-primary py-3 mt-6 disabled:opacity-60"
          >
            {isPending ? 'Creating workspace...' : 'Create organization'}
          </button>
        </form>
      </div>
    </div>
  );
}
