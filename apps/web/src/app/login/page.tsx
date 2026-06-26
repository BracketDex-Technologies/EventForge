'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
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

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || 'Authentication failed. Please check your credentials.');
        }

        const data = await res.json();
        
        // Sync tokens with Supabase browser client to write auth cookies
        const supabase = createClient();
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: data.accessToken,
          refresh_token: data.refreshToken,
        });

        if (sessionError) {
          throw sessionError;
        }

        // Navigate to console dashboard
        router.push('/console');
        router.refresh();
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
      }
    });
  };

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      const supabase = createClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (oauthError) throw oauthError;
    } catch (err: any) {
      setError(err.message || 'Could not initiate Google login.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
         style={{ background: 'linear-gradient(135deg, #0f1629 0%, #1a1f3a 50%, #0f1629 100%)' }}>
      {/* Animated dot pattern background */}
      <div className="absolute inset-0 ef-dot-pattern opacity-40" />
      
      {/* Subtle radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
           style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)' }} />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-auto px-6 animate-fade-in-up">
        <div className="bg-white rounded-2xl p-12"
             style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.3), 0 0 40px rgba(99,102,241,0.1)' }}>
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2.5 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                   style={{ background: 'var(--ef-primary-gradient)' }}>
                E
              </div>
              <span className="text-2xl font-bold tracking-tight ef-gradient-text">
                EventForge
              </span>
            </div>
            <p className="text-[14px]" style={{ color: 'var(--ef-text-muted)' }}>
              {isSignUp ? 'Create your organizer account' : 'Sign in to your console'}
            </p>
          </div>

          <div className="h-px mb-8" style={{ background: 'var(--ef-border)' }} />

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl text-sm border flex items-start gap-2.5 animate-shake"
                 style={{ backgroundColor: '#fef2f2', borderColor: '#fca5a5', color: '#b91c1c' }}>
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div className="animate-fade-in-up">
                <label className="ef-label">Full Name</label>
                <input
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
              <label className="ef-label">Email Address</label>
              <input
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="ef-label mb-0">Password</label>
                {!isSignUp && (
                  <a href="#" className="text-[12px] font-medium" style={{ color: 'var(--ef-primary)' }}>
                    Forgot password?
                  </a>
                )}
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="ef-input"
                disabled={isPending}
              />
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 px-6 rounded-full text-white font-semibold text-[15px] transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              style={{
                background: 'var(--ef-primary-gradient)',
                boxShadow: 'var(--ef-shadow-sm)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {isPending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </>
              ) : (
                isSignUp ? 'Sign Up' : 'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px" style={{ background: 'var(--ef-border)' }} />
            <span className="text-[12px] font-medium" style={{ color: 'var(--ef-text-muted)' }}>
              or continue with
            </span>
            <div className="flex-1 h-px" style={{ background: 'var(--ef-border)' }} />
          </div>

          {/* Social */}
          <div>
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isPending}
              className="ef-btn-secondary w-full text-sm py-2.5 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
          </div>

          {/* Footer link */}
          <p className="text-center mt-8 text-[13px]" style={{ color: 'var(--ef-text-secondary)' }}>
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <button
              type="button"
              onClick={() => {
                setError(null);
                setIsSignUp(!isSignUp);
              }}
              className="font-semibold hover:underline focus:outline-none cursor-pointer"
              style={{ color: 'var(--ef-primary)' }}
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>
      </div>

      {/* Page footer */}
      <div className="relative z-10 mt-8 text-center">
        <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
          EventForge v1.0 — <a href="#" className="hover:text-white/50 transition-colors">Privacy</a> · <a href="#" className="hover:text-white/50 transition-colors">Terms</a>
        </p>
      </div>
    </div>
  );
}
