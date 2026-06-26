'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [loadingStep, setLoadingStep] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoadingStep(isSignUp ? 'Creating your secure account...' : 'Verifying your credentials...');

    startTransition(async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const endpoint = isSignUp 
          ? `${apiUrl}/v1/auth/sign-up` 
          : `${apiUrl}/v1/auth/sign-in`;
        
        const payload = isSignUp 
          ? { email, password, displayName } 
          : { email, password };

        setLoadingStep(isSignUp ? 'Registering details with database...' : 'Authenticating secure credentials...');
        let res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          const msg = errData.message || '';
          
          if (isSignUp && (msg.toLowerCase().includes('already registered') || msg.toLowerCase().includes('already exists'))) {
            setLoadingStep('Account already exists. Retrying secure sign-in...');
            // User exists, fallback to sign in
            const signInRes = await fetch(`${apiUrl}/v1/auth/sign-in`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password }),
            });
            
            if (!signInRes.ok) {
              await signInRes.json().catch(() => ({}));
              throw new Error('Account exists, but password was incorrect. Please sign in with the correct password.');
            }
            res = signInRes;
          } else {
            throw new Error(msg || 'Authentication failed. Please check your credentials.');
          }
        }

        const data = await res.json();
        
        setLoadingStep('Establishing secure session tokens...');
        const supabase = createClient();
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: data.accessToken,
          refresh_token: data.refreshToken,
        });

        if (sessionError) {
          throw sessionError;
        }

        setLoadingStep('Syncing dashboards and event workspaces...');
        // Small delay to make the process feel solid and premium
        await new Promise((r) => setTimeout(r, 600));
        window.location.href = '/console';
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
        setError(errorMessage);
        setLoadingStep(null);
      }
    });
  };

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 overflow-x-hidden font-sans">
      {/* Left side - brand panel (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 flex-col justify-between p-16 relative overflow-hidden border-r border-slate-800">
        {/* Glow effect */}
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full blur-[160px] opacity-[0.15] bg-gradient-to-br from-indigo-500 to-teal-400 pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[140px] opacity-[0.1] bg-indigo-600 pointer-events-none" />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="relative p-1.5 rounded-xl bg-slate-950/80 border border-slate-800 backdrop-blur-md group-hover:border-slate-700 transition-colors">
              <Image src="/logo-icon.svg" alt="EventForge" width={32} height={32} />
            </div>
            <span className="text-white font-bold text-xl tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">EventForge</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            Enterprise Event Management Platform
          </div>
          <blockquote className="text-3xl font-medium text-slate-100 leading-tight tracking-tight">
            "We built EventForge to handle high-stakes event coordination, ticketing, and live engagement with absolute peace of mind."
          </blockquote>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300 text-xs border border-slate-700">EF</div>
            <div>
              <p className="text-sm font-semibold text-slate-200">The EventForge Operations Team</p>
              <p className="text-xs text-slate-500">Scale infrastructure under pressure</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex justify-between items-center text-xs text-slate-500">
          <span>© {new Date().getFullYear()} EventForge. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms</Link>
          </div>
        </div>

        {/* Subtle grid texture */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }} />
      </div>

      {/* Right side - auth form (Mobile & Desktop) */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 md:p-16 bg-gradient-to-b from-slate-950 to-slate-900 relative">
        {/* Mobile Background Glow */}
        <div className="lg:hidden absolute top-[10%] left-[10%] w-[60%] h-[60%] rounded-full blur-[120px] opacity-[0.07] bg-indigo-500 pointer-events-none" />

        <div className="w-full max-w-[420px] relative z-10">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <Image src="/logo-icon.svg" alt="EventForge" width={36} height={36} />
            <span className="font-bold text-xl tracking-tight text-white">EventForge</span>
          </div>

          {/* Form Card */}
          <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-8 sm:p-10 shadow-2xl relative">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {isSignUp ? 'Create your account' : 'Sign in to account'}
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                {isSignUp 
                  ? 'Start managing your events in minutes.' 
                  : 'Welcome back. Enter your details to continue.'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-950/30 border border-red-900/50 text-sm text-red-400">
                {error}
              </div>
            )}

            {isPending && loadingStep ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-5 text-center">
                <div className="w-12 h-12 border-2 border-indigo-500/20 border-t-indigo-400 rounded-full animate-spin" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-200 animate-pulse">{loadingStep}</p>
                  <p className="text-xs text-slate-500">Please do not close this browser window.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {isSignUp && (
                  <div>
                    <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Full name</label>
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder="Alex Johnson"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      disabled={isPending}
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Email address</label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    disabled={isPending}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Password</label>
                    {!isSignUp && (
                      <Link href="#" className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                        Forgot password?
                      </Link>
                    )}
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    disabled={isPending}
                  />
                  {isSignUp && (
                    <p className="mt-1.5 text-xs text-slate-500">Must be at least 8 characters.</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-3.5 mt-2 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-60 transition-all shadow-lg shadow-indigo-600/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSignUp ? 'Create account' : 'Sign in'}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </form>
            )}

            <p className="mt-8 text-center text-sm text-slate-400">
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setIsSignUp(!isSignUp);
                }}
                className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors hover:underline"
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>

          <div className="mt-8 flex justify-center gap-6 text-xs text-slate-600 lg:hidden">
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
