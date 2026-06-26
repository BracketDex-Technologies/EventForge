'use client';

import Link from 'next/link';
import MarketingLayout, { useTheme } from '@/components/marketing-layout';

function AboutContent() {
  const { isDark, borderClass, cardBgClass, textPrimaryClass, textMutedClass } = useTheme();

  const values = [
    {
      title: 'Zero Commission',
      desc: 'We never take a percentage of your ticket revenue. Your earnings go directly to your Stripe account — we charge only a transparent platform subscription.',
      icon: (
        <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
        </svg>
      )
    },
    {
      title: 'Privacy by Design',
      desc: 'Attendee data is encrypted at rest and in transit. We comply with GDPR and never share personal information with third parties for advertising purposes.',
      icon: (
        <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      )
    },
    {
      title: 'Open Integration',
      desc: 'Scoped API keys, webhook triggers, and Stripe-native payment flows. EventForge is designed to integrate with your existing technology stack, not replace it.',
      icon: (
        <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
        </svg>
      )
    },
    {
      title: 'Operational Transparency',
      desc: 'Every action taken in your workspace is logged in an immutable audit trail. Full visibility into team activity, configuration changes, and data access.',
      icon: (
        <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
  ];

  const stats = [
    { value: '99.9%', label: 'Platform Uptime' },
    { value: '1.2M+', label: 'Tickets Processed' },
    { value: '20K+', label: 'Events Delivered' },
    { value: '< 1s', label: 'Avg. Check-in Time' },
  ];

  const milestones = [
    { year: '2024', title: 'Founded', desc: 'EventForge was established to address the operational complexity and excessive commission fees plaguing the event management industry.' },
    { year: '2025', title: 'Platform Launch', desc: 'Released the core platform with multi-tenant workspaces, Stripe-integrated ticketing, and browser-based QR check-in scanning.' },
    { year: '2026', title: 'Enterprise Scale', desc: 'Expanded to support hybrid events, exhibitor management, marketing automation, gamification, and real-time performance analytics.' },
  ];

  return (
    <>
      {/* Hero */}
      <section className={`py-20 sm:py-28 px-5 sm:px-6 border-b transition-colors ${borderClass}`}>
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF8552]">About EventForge</span>
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight ${textPrimaryClass}`}>
            Built for Event Professionals.<br />Designed for Enterprise Scale.
          </h1>
          <p className={`${textMutedClass} max-w-2xl mx-auto text-sm sm:text-base leading-relaxed`}>
            EventForge is a unified event management platform that handles every operational dimension — from initial ticket configuration and branded website publishing to on-site badge printing and post-event analytics. No per-ticket commissions. No vendor lock-in.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className={`border-b py-12 sm:py-14 px-5 sm:px-6 transition-colors ${borderClass} ${isDark ? 'bg-[#0c0d12]' : 'bg-[#f4f3ed]'}`}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label} className="space-y-1">
                <p className={`text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight ${textPrimaryClass}`}>{stat.value}</p>
                <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className={`py-16 sm:py-24 px-5 sm:px-6 border-b transition-colors ${borderClass}`}>
        <div className="max-w-4xl mx-auto space-y-12 sm:space-y-16">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF8552]">Our Journey</span>
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight ${textPrimaryClass}`}>Company Milestones</h2>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {milestones.map((m, idx) => (
              <div key={m.year} className={`flex gap-5 sm:gap-8 items-start`}>
                <div className="flex flex-col items-center shrink-0">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-sm ${
                    isDark ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                  }`}>
                    {m.year}
                  </div>
                  {idx < milestones.length - 1 && (
                    <div className={`w-px h-12 sm:h-16 mt-2 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
                  )}
                </div>
                <div className="space-y-1.5 pt-1">
                  <h3 className={`text-sm sm:text-base font-bold ${textPrimaryClass}`}>{m.title}</h3>
                  <p className={`text-xs sm:text-sm leading-relaxed ${textMutedClass}`}>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className={`py-16 sm:py-24 px-5 sm:px-6 border-b transition-colors ${borderClass}`}>
        <div className="max-w-5xl mx-auto space-y-12 sm:space-y-16">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF8552]">Principles</span>
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight ${textPrimaryClass}`}>Our Core Values</h2>
            <p className={`${textMutedClass} max-w-xl mx-auto text-sm leading-relaxed`}>
              The operational principles that guide every product decision and engineering trade-off.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {values.map((v) => (
              <div key={v.title} className={`p-6 sm:p-8 rounded-2xl border transition-all ${cardBgClass} space-y-4`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-slate-900/80 border border-slate-800' : 'bg-slate-50 border border-slate-200'}`}>
                  {v.icon}
                </div>
                <h3 className={`text-base font-bold ${textPrimaryClass}`}>{v.title}</h3>
                <p className={`text-xs sm:text-sm leading-relaxed ${textMutedClass}`}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`py-16 sm:py-20 px-5 sm:px-6 transition-colors`}>
        <div className={`max-w-4xl mx-auto rounded-3xl border px-6 sm:px-8 py-12 sm:py-16 text-center space-y-5 relative overflow-hidden ${
          isDark ? 'bg-gradient-to-tr from-slate-900/40 via-indigo-950/10 to-slate-900/40 border-slate-900/80' : 'bg-white border-slate-200/80 shadow-md shadow-slate-200/30'
        }`}>
          <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${textPrimaryClass}`}>Join thousands of event professionals</h2>
          <p className={`${textMutedClass} max-w-lg mx-auto text-sm leading-relaxed`}>
            Create your free workspace and experience the platform firsthand.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/login" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#FF8552] text-slate-950 font-bold text-sm hover:bg-[#ff966c] transition-colors shadow-lg">
              Get Started Free
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default function AboutPage() {
  return (
    <MarketingLayout>
      <AboutContent />
    </MarketingLayout>
  );
}
