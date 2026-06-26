'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const endpoint = isSignUp 
          ? `${apiUrl}/v1/auth/sign-up` 
          : `${apiUrl}/v1/auth/sign-in`;
        
        const payload = isSignUp 
          ? { email, password, displayName } 
          : { email, password };

        let res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          const msg = errData.message || '';
          
          if (isSignUp && (msg.toLowerCase().includes('already registered') || msg.toLowerCase().includes('already exists'))) {
            // User exists, fallback to sign in
            const signInRes = await fetch(`${apiUrl}/v1/auth/sign-in`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password }),
            });
            
            if (!signInRes.ok) {
              const signInErr = await signInRes.json().catch(() => ({}));
              throw new Error('Account exists, but password was incorrect. Please sign in with the correct password.');
            }
            res = signInRes;
          } else {
            throw new Error(msg || 'Authentication failed. Please check your credentials.');
          }
        }

        const data = await res.json();
        
        const supabase = createClient();
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: data.accessToken,
          refresh_token: data.refreshToken,
        });

        if (sessionError) {
          throw sessionError;
        }

        window.location.href = '/console';
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
      }
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 flex-col justify-between p-12 relative overflow-hidden">
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image src="/logo-icon.svg" alt="EventForge" width={36} height={36} />
            <span className="text-white font-bold text-xl tracking-tight">EventForge</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <blockquote className="text-2xl font-medium text-white leading-relaxed">
            "The most intuitive platform we've used to manage ticket sales and attendee check-ins at scale."
          </blockquote>
          <p className="mt-6 text-slate-400 text-sm">
            Trusted by event organizers, conferences, and venues worldwide.
          </p>
        </div>

        <div className="relative z-10 text-xs text-slate-500">
          © {new Date().getFullYear()} EventForge. All rights reserved.
        </div>

        {/* Subtle background texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
      </div>

      {/* Right side - auth form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-slate-50">
        <div className="w-full max-w-[420px]">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <Image src="/logo-icon.svg" alt="EventForge" width={36} height={36} />
            <span className="font-bold text-xl tracking-tight text-slate-900">EventForge</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">
              {isSignUp ? 'Create your account' : 'Sign in to your account'}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {isSignUp 
                ? 'Start managing your events in minutes.' 
                : 'Welcome back. Enter your details to continue.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div>
                <label htmlFor="name" className="ef-label">Full name</label>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="Alex Johnson"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="ef-input"
                  disabled={isPending}
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="ef-label">Email address</label>
              <input
                id="email"
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="ef-input"
                disabled={isPending}
              />
            </div>

            <div>
              <label htmlFor="password" className="ef-label">Password</label>
              <input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="ef-input"
                disabled={isPending}
              />
              {isSignUp && (
                <p className="mt-1.5 text-xs text-slate-400">Must be at least 8 characters.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full ef-btn-primary py-3 disabled:opacity-60"
            >
              {isPending ? 'Processing...' : isSignUp ? 'Create account' : 'Sign in'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <button
              type="button"
              onClick={() => {
                setError(null);
                setIsSignUp(!isSignUp);
              }}
              className="font-semibold text-slate-900 hover:underline"
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
