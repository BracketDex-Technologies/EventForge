'use client';

import Link from 'next/link';
import MarketingLayout, { useTheme } from '@/components/marketing-layout';

function HowItWorksContent() {
  const { isDark, borderClass, cardBgClass, textPrimaryClass, textMutedClass } = useTheme();

  const steps = [
    {
      num: '01',
      title: 'Create Your Workspace',
      desc: 'Set up your organization in under two minutes. Configure your brand identity, invite team members with role-based permissions, and establish your event management headquarters.',
      details: [
        'Multi-tenant organization with custom slug',
        'Role-based access: Owner, Admin, Organizer, Staff, Viewer',
        'Email-based team invitations with secure token validation',
        'API key generation for third-party integrations',
      ],
      color: 'from-amber-500/20 to-amber-500/5',
      accentColor: 'text-amber-500',
      borderColor: 'border-amber-500/30',
    },
    {
      num: '02',
      title: 'Configure & Publish',
      desc: 'Build your event from the ground up — define venues, create ticket tiers, design registration forms, add speakers to sessions, and publish a branded event website on your own domain.',
      details: [
        'Multi-tier ticketing: free, paid, donation, group, hidden',
        'Custom registration form fields with conditional logic',
        'Multi-track agenda with speaker profiles and room assignments',
        'Branded event websites with custom domains and SSL',
        'Promo codes with percentage or flat-amount discounts',
      ],
      color: 'from-indigo-500/20 to-indigo-500/5',
      accentColor: 'text-indigo-400',
      borderColor: 'border-indigo-500/30',
    },
    {
      num: '03',
      title: 'Sell & Promote',
      desc: 'Launch ticket sales through secure Stripe checkout, deploy targeted email campaigns, and automate marketing workflows triggered by attendee actions.',
      details: [
        'Stripe-integrated secure payment processing',
        'Email campaigns with MJML templates and audience segments',
        'Workflow automation: triggers on registration, check-in, or schedule',
        'Waitlist management with automatic promotion',
        'Exhibitor portal with tiered sponsorship management',
      ],
      color: 'from-emerald-500/20 to-emerald-500/5',
      accentColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
    },
    {
      num: '04',
      title: 'Execute On-Site',
      desc: 'Check in attendees with browser-based QR scanning, print custom badges, run live polls and Q&A during sessions, and enable attendee networking — all in real time.',
      details: [
        'Browser-based QR scanner — no app installation required',
        'Custom badge design with network printer queue management',
        'Session-level live polling and moderated Q&A boards',
        '1:1 meeting scheduler for attendee networking',
        'Gamification engine with points and leaderboards',
      ],
      color: 'from-rose-500/20 to-rose-500/5',
      accentColor: 'text-rose-400',
      borderColor: 'border-rose-500/30',
    },
    {
      num: '05',
      title: 'Measure & Optimize',
      desc: 'Access real-time performance dashboards with hourly metric rollups. Track registration velocity, revenue by tier, check-in throughput, and attendee engagement across your event portfolio.',
      details: [
        'Hourly metrics: registrations, revenue, check-ins, page views',
        'Revenue breakdown by ticket tier and promo code',
        'Email delivery tracking: opens, clicks, bounces',
        'Immutable audit trail for compliance reporting',
        'Automated post-event follow-up workflows',
      ],
      color: 'from-cyan-500/20 to-cyan-500/5',
      accentColor: 'text-cyan-400',
      borderColor: 'border-cyan-500/30',
    },
  ];

  const useCases = [
    {
      title: 'Conferences & Summits',
      desc: 'Multi-day, multi-track agendas with keynote speakers, breakout sessions, exhibitor booths, and live audience engagement tools.',
      tags: ['Multi-Track Agenda', 'Speaker Portal', 'Exhibitors', 'Badge Printing'],
    },
    {
      title: 'Workshops & Training',
      desc: 'Capacity-controlled sessions with RSVP requirements, custom registration forms for prerequisites, and session-level attendance tracking.',
      tags: ['Session RSVPs', 'Custom Forms', 'Check-In Tracking'],
    },
    {
      title: 'Meetups & Networking',
      desc: 'Free or donation-based ticketing with attendee networking profiles, 1:1 meeting scheduling, and gamification to drive participation.',
      tags: ['Free Tickets', 'Networking Profiles', '1:1 Meetings', 'Gamification'],
    },
    {
      title: 'Hybrid & Virtual Events',
      desc: 'Combine in-person venue management with Zoom, Teams, or Vimeo streaming integration for sessions accessible to remote attendees.',
      tags: ['Stream Integration', 'Virtual Rooms', 'Live Polls', 'Chat Channels'],
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className={`py-20 sm:py-28 px-5 sm:px-6 border-b transition-colors ${borderClass}`}>
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF8552]">Getting Started</span>
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight ${textPrimaryClass}`}>
            Five Steps from Setup<br />to Sold-Out Event
          </h1>
          <p className={`${textMutedClass} max-w-2xl mx-auto text-sm sm:text-base leading-relaxed`}>
            EventForge provides a structured operational framework that guides your team from workspace creation through post-event analytics — with every tool built directly into the platform.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className={`py-16 sm:py-24 px-5 sm:px-6 border-b transition-colors ${borderClass}`}>
        <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
          {steps.map((step, idx) => (
            <div key={step.num} className={`relative rounded-2xl border overflow-hidden transition-all ${cardBgClass}`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${step.color} pointer-events-none`} />
              <div className="relative p-6 sm:p-8 space-y-5">
                <div className="flex items-center gap-4">
                  <span className={`text-3xl sm:text-4xl font-mono font-black ${step.accentColor} opacity-60`}>{step.num}</span>
                  <div>
                    <h3 className={`text-base sm:text-lg font-bold ${textPrimaryClass}`}>{step.title}</h3>
                  </div>
                </div>
                <p className={`text-xs sm:text-sm leading-relaxed ${textMutedClass}`}>{step.desc}</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {step.details.map((d) => (
                    <li key={d} className="flex items-start gap-2 text-xs">
                      <svg className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${step.accentColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      <span className={textMutedClass}>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {idx < steps.length - 1 && (
                <div className="flex justify-center -mb-4 relative z-10">
                  <div className={`w-px h-8 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className={`py-16 sm:py-24 px-5 sm:px-6 border-b transition-colors ${borderClass}`}>
        <div className="max-w-5xl mx-auto space-y-12 sm:space-y-16">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF8552]">Event Types</span>
            <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${textPrimaryClass}`}>Built for Every Event Format</h2>
            <p className={`${textMutedClass} max-w-xl mx-auto text-sm leading-relaxed`}>
              Whether you are running a 50-person workshop or a 10,000-seat conference, EventForge scales to match your requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {useCases.map((uc) => (
              <div key={uc.title} className={`p-6 sm:p-8 rounded-2xl border transition-all ${cardBgClass} space-y-4`}>
                <h3 className={`text-base font-bold ${textPrimaryClass}`}>{uc.title}</h3>
                <p className={`text-xs sm:text-sm leading-relaxed ${textMutedClass}`}>{uc.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {uc.tags.map((tag) => (
                    <span key={tag} className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${
                      isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 px-5 sm:px-6">
        <div className={`max-w-4xl mx-auto rounded-3xl border px-6 sm:px-8 py-12 sm:py-16 text-center space-y-5 relative overflow-hidden ${
          isDark ? 'bg-gradient-to-tr from-slate-900/40 via-indigo-950/10 to-slate-900/40 border-slate-900/80' : 'bg-white border-slate-200/80 shadow-md shadow-slate-200/30'
        }`}>
          <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${textPrimaryClass}`}>Ready to get started?</h2>
          <p className={`${textMutedClass} max-w-lg mx-auto text-sm leading-relaxed`}>
            Create your free workspace in under two minutes. No credit card required.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/login" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#FF8552] text-slate-950 font-bold text-sm hover:bg-[#ff966c] transition-colors shadow-lg">
              Create Free Workspace
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

export default function HowItWorksPage() {
  return (
    <MarketingLayout>
      <HowItWorksContent />
    </MarketingLayout>
  );
}
