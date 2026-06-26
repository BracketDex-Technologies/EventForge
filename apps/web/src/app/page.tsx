'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MarketingLayout, { useTheme } from '@/components/marketing-layout';

function LandingContent() {
  const { isDark, borderClass, cardBgClass, textPrimaryClass, textMutedClass, textLabelsClass } = useTheme();
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [eventName, setEventName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [location, setLocation] = useState('');
  const [ticketCode, setTicketCode] = useState('');
  const [email, setEmail] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const stats = [
    { value: '99.9%', label: 'Platform Uptime' },
    { value: '1.2M+', label: 'Tickets Processed' },
    { value: '20K+', label: 'Events Delivered' },
    { value: '< 1s', label: 'Avg. Check-in Time' },
  ];

  const journeySteps = [
    {
      num: '01',
      phase: 'Plan',
      title: 'Configure & Publish',
      desc: 'Set up branded event microsites, configure multi-tier registration forms, define ticket pricing structures, and manage speaker profiles — all from a unified workspace.',
      color: 'border-l-amber-500'
    },
    {
      num: '02',
      phase: 'Execute',
      title: 'Operate & Engage',
      desc: 'Facilitate seamless on-site check-ins via browser-based QR scanning, print custom attendee badges, run session-level polls, and moderate live Q&A — in real time.',
      color: 'border-l-emerald-400'
    },
    {
      num: '03',
      phase: 'Analyze',
      title: 'Measure & Optimize',
      desc: 'Access hourly registration velocity metrics, monitor revenue by ticket tier, automate post-event follow-up campaigns, and generate attendee engagement reports.',
      color: 'border-l-indigo-500'
    }
  ];

  const faqs = [
    {
      q: 'Does EventForge charge commissions on ticket sales?',
      a: 'No. EventForge operates on a zero-commission model. Revenue from ticket sales is deposited directly into your connected Stripe account. You pay only standard payment processing fees — no platform markup, no per-ticket surcharges.'
    },
    {
      q: 'Is a native application required for on-site check-in?',
      a: 'No. The EventForge check-in scanner is a progressive web application that runs directly in any modern mobile browser. Staff can begin scanning QR codes immediately — no app store download or device provisioning required.'
    },
    {
      q: 'Can I use a custom domain for my event website?',
      a: 'Yes. EventForge supports custom domain mapping at the organization level with automatic SSL certificate provisioning and renewal. Your attendees will see your brand domain throughout the registration experience.'
    },
    {
      q: 'How does live audience engagement work during sessions?',
      a: 'Each session in your agenda can be equipped with live polling and moderated Q&A. Attendees access these features through their mobile browser — no additional login or application required. Results update in real time for presenters and organizers.'
    },
    {
      q: 'What event types does EventForge support?',
      a: 'EventForge supports in-person, virtual, and hybrid event formats. Virtual sessions can integrate with Zoom, Microsoft Teams, or Vimeo for live streaming, while in-person sessions leverage venue and room management with capacity controls.'
    }
  ];

  const features = [
    {
      title: 'Multi-Tier Ticketing',
      desc: 'Configure free, paid, donation, group, and hidden ticket types with early-bird pricing windows, inventory controls, and secure Stripe checkout.',
      icon: (
        <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
        </svg>
      )
    },
    {
      title: 'Real-Time Analytics',
      desc: 'Monitor registration velocity, revenue by tier, attendee engagement, and check-in throughput with hourly metric rollups.',
      icon: (
        <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
      )
    },
    {
      title: 'Browser-Based QR Scanner',
      desc: 'Touchless attendee check-in using any mobile browser camera. Zero software installation — staff can begin scanning in seconds.',
      icon: (
        <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
        </svg>
      )
    },
    {
      title: 'Audience Engagement Suite',
      desc: 'Embed live polls, moderated Q&A, and attendee networking profiles into every session. Participants interact directly from mobile browsers.',
      icon: (
        <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    {
      title: 'Marketing Automation',
      desc: 'Design email campaigns with MJML templates, segment audiences, and trigger automated workflows on registration, check-in, or custom events.',
      icon: (
        <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      )
    },
    {
      title: 'Badge Design & Print',
      desc: 'Create custom badge layouts with a visual editor. Queue print jobs to network printers or generate PDF badges for on-demand distribution.',
      icon: (
        <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.617 0-1.11-.476-1.12-1.09l-.244-2.66m11.793 0H6.207m11.586-4.62L16.5 4.5a2.25 2.25 0 00-2.25-2.25h-4.5A2.25 2.25 0 007.5 4.5L6.207 9.18" />
        </svg>
      )
    }
  ];

  const inputClass = `w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all ${
    isDark ? 'bg-slate-950/80 border-slate-800 text-white placeholder-slate-700' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
  }`;

  return (
    <>
      {/* ── Split Hero Section ── */}
      <section className={`relative min-h-[calc(100vh-80px)] flex flex-col lg:flex-row items-stretch border-b transition-colors ${borderClass}`}>
        
        {/* Left Column */}
        <div className="flex-1 px-5 py-10 sm:p-12 lg:p-16 flex flex-col justify-center max-w-4xl z-10">
          <div className="space-y-6 sm:space-y-8 max-w-2xl">
            
            {/* Trust Badges */}
            <div className="flex items-center gap-6 sm:gap-8">
              <div className="space-y-1">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 fill-amber-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className={`text-[10px] sm:text-xs font-semibold ${textLabelsClass}`}>
                  4.9/5 <span className="text-slate-500">(25K+)</span>
                </p>
                <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 tracking-wider uppercase">Reviews.io</p>
              </div>

              <div className={`w-px h-10 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />

              <div className="space-y-1">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 fill-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className={`text-[10px] sm:text-xs font-semibold ${textLabelsClass}`}>
                  4.8/5 <span className="text-slate-500">(64K+)</span>
                </p>
                <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 tracking-wider uppercase">Trustpilot</p>
              </div>
            </div>

            {/* Headline — professional MNC copy */}
            <h1 className={`text-3xl sm:text-5xl lg:text-6xl font-black leading-[1.08] tracking-tight ${textPrimaryClass}`}>
              Enterprise Event Management, <span className="text-[#FF8552]">Simplified.</span>
            </h1>

            {/* Sub-headline */}
            <p className={`${textMutedClass} text-sm sm:text-base leading-relaxed max-w-xl`}>
              Plan conferences, sell tickets, manage on-site operations, and engage audiences — all from a single, unified platform. Zero commission on every transaction.
            </p>

            {/* CTA Buttons — clean on mobile */}
            <div className="flex flex-col sm:flex-row gap-3 sm:hidden pt-2">
              <Link
                href="/login"
                className="py-3.5 px-6 rounded-xl bg-[#FF8552] text-slate-950 font-bold text-sm text-center hover:bg-[#ff966c] transition-colors shadow-lg shadow-[#FF8552]/10"
              >
                Start Free
              </Link>
              <Link
                href="/how-it-works"
                className={`py-3.5 px-6 rounded-xl border font-bold text-sm text-center transition-colors ${
                  isDark ? 'border-slate-800 text-slate-300 hover:bg-slate-900' : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                See How It Works
              </Link>
            </div>

            {/* Interactive Widget — desktop + tablet only */}
            <div className="hidden sm:block pt-2 max-w-xl">
              <div className={`rounded-2xl overflow-hidden shadow-2xl p-1.5 backdrop-blur-xl border ${
                isDark ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'
              }`}>
                {/* Tabs */}
                <div className={`flex gap-1 pb-1 border-b px-2 pt-1.5 shrink-0 ${isDark ? 'border-slate-800/40' : 'border-slate-100'}`}>
                  <button
                    onClick={() => setActiveTab('create')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                      activeTab === 'create'
                        ? isDark ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Create Event
                  </button>
                  <button
                    onClick={() => setActiveTab('join')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                      activeTab === 'join'
                        ? isDark ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Join Event
                  </button>
                </div>

                {/* Fields */}
                <div className="p-3 grid grid-cols-12 gap-3 items-center">
                  {activeTab === 'create' ? (
                    <>
                      <div className="col-span-4 space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1">Organization</label>
                        <input type="text" placeholder="Acme Corp" value={eventName} onChange={(e) => setEventName(e.target.value)} className={inputClass} />
                      </div>
                      <div className="col-span-3 space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1">Capacity</label>
                        <input type="text" placeholder="e.g. 500" value={capacity} onChange={(e) => setCapacity(e.target.value)} className={inputClass} />
                      </div>
                      <div className="col-span-5 space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1">Venue</label>
                        <div className="relative flex items-center">
                          <svg className="w-3.5 h-3.5 text-slate-500 absolute left-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                          </svg>
                          <input type="text" placeholder="City or venue" value={location} onChange={(e) => setLocation(e.target.value)} className={`${inputClass} pl-9`} />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="col-span-6 space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1">Ticket Code</label>
                        <input type="text" placeholder="e.g. TKT-8492" value={ticketCode} onChange={(e) => setTicketCode(e.target.value)} className={inputClass} />
                      </div>
                      <div className="col-span-6 space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1">Email Address</label>
                        <input type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
                      </div>
                    </>
                  )}
                </div>

                <div className="p-3 pt-0 flex justify-end">
                  <Link
                    href="/login"
                    className="py-3 px-6 rounded-xl bg-[#FF8552] text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-[#ff966c] transition-colors"
                  >
                    {activeTab === 'create' ? 'Launch Workspace' : 'Access Ticket'}
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column — Hero Image */}
        <div className={`hidden lg:block lg:w-[40%] relative overflow-hidden border-l transition-colors ${borderClass}`}>
          <Image src="/hero-conference.png" alt="Professional conference hosted on EventForge" fill className="object-cover" priority />
          <div className={`absolute inset-0 bg-gradient-to-r via-transparent to-transparent opacity-100 pointer-events-none ${isDark ? 'from-[#0c0d12]' : 'from-[#FAF9F6]'}`} />
          <div className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-60 pointer-events-none ${isDark ? 'from-[#0c0d12]' : 'from-[#FAF9F6]'}`} />
        </div>
      </section>

      {/* ── Stats Strip ── */}
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

      {/* ── Event Lifecycle Journey ── */}
      <section className={`py-16 sm:py-24 px-5 sm:px-6 border-b transition-colors ${borderClass}`}>
        <div className="max-w-5xl mx-auto space-y-12 sm:space-y-16">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF8552]">Platform Workflow</span>
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight ${textPrimaryClass}`}>The Event Lifecycle</h2>
            <p className={`${textMutedClass} max-w-xl mx-auto text-sm leading-relaxed`}>
              A structured approach to event delivery — from initial configuration through post-event analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {journeySteps.map((step) => (
              <div key={step.num} className={`p-6 sm:p-8 border-l-4 rounded-r-2xl border ${step.color} ${cardBgClass} space-y-4 sm:space-y-5 transition-all`}>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">{step.phase}</span>
                  <span className="text-2xl font-mono font-bold text-slate-300">{step.num}</span>
                </div>
                <div className="space-y-2">
                  <h3 className={`text-sm sm:text-base font-bold ${textPrimaryClass}`}>{step.title}</h3>
                  <p className={`text-xs leading-relaxed font-light ${textMutedClass}`}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Bento Grid ── */}
      <section className="py-16 sm:py-24 px-5 sm:px-6 relative">
        <div className="max-w-5xl mx-auto space-y-12 sm:space-y-16">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF8552]">Capabilities</span>
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight ${textPrimaryClass}`}>End-to-End Event Infrastructure</h2>
            <p className={`${textMutedClass} max-w-xl mx-auto text-sm leading-relaxed`}>
              From the first ticket sold to the final attendee report, every operational detail is managed in one platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
            {features.map((feature) => (
              <div key={feature.title} className={`p-5 sm:p-6 rounded-2xl border transition-all duration-300 text-left space-y-3 sm:space-y-4 ${cardBgClass} hover:border-indigo-500/20`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-slate-900/80 border border-slate-800' : 'bg-slate-100 border border-slate-200'}`}>
                  {feature.icon}
                </div>
                <div>
                  <h3 className={`text-sm sm:text-base font-bold ${textPrimaryClass}`}>{feature.title}</h3>
                  <p className={`mt-1.5 sm:mt-2 text-xs leading-relaxed font-light ${textMutedClass}`}>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/features" className={`text-sm font-semibold transition-colors ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'}`}>
              View all 27+ features →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ Accordion ── */}
      <section className={`py-16 sm:py-24 px-5 sm:px-6 border-t transition-colors ${borderClass}`}>
        <div className="max-w-4xl mx-auto space-y-12 sm:space-y-16">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF8552]">Common Questions</span>
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight ${textPrimaryClass}`}>Frequently Asked Questions</h2>
            <p className={`${textMutedClass} max-w-md mx-auto text-sm leading-relaxed`}>
              Technical and commercial details about the EventForge platform.
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isDark ? 'border-slate-800 bg-slate-900/10' : 'border-slate-200 bg-white'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 sm:p-6 text-left focus:outline-none cursor-pointer"
                  >
                    <span className={`font-semibold text-sm sm:text-base pr-4 ${textPrimaryClass}`}>{faq.q}</span>
                    <svg
                      className={`w-5 h-5 text-slate-400 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                  <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 border-t' : 'max-h-0'} ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                    <p className={`p-5 sm:p-6 text-xs sm:text-sm leading-relaxed ${textMutedClass}`}>{faq.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Call to Action ── */}
      <section className={`py-16 sm:py-20 px-5 sm:px-6 relative border-t transition-colors ${borderClass}`}>
        <div className={`max-w-4xl mx-auto rounded-3xl border px-6 sm:px-8 py-12 sm:py-16 text-center space-y-5 sm:space-y-6 relative overflow-hidden ${
          isDark
            ? 'bg-gradient-to-tr from-slate-900/40 via-indigo-950/10 to-slate-900/40 border-slate-900/80'
            : 'bg-white border-slate-200/80 shadow-md shadow-slate-200/30'
        }`}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-[100px] opacity-[0.05] bg-indigo-500 pointer-events-none" />
          
          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight ${textPrimaryClass}`}>Ready to deliver your next event?</h2>
          <p className={`${textMutedClass} max-w-lg mx-auto text-sm leading-relaxed font-light`}>
            Create your workspace, configure your first event, and start selling tickets — all within minutes.
          </p>
          <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 sm:py-4 rounded-xl bg-[#FF8552] text-slate-950 font-bold text-sm hover:bg-[#ff966c] transition-colors shadow-lg"
            >
              Create Free Workspace
              <svg className="w-4 h-4 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/pricing"
              className={`inline-flex items-center justify-center px-8 py-3.5 sm:py-4 rounded-xl border font-bold text-sm transition-colors ${
                isDark ? 'border-slate-800 text-slate-300 hover:bg-slate-900' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default function Home() {
  return (
    <MarketingLayout>
      <LandingContent />
    </MarketingLayout>
  );
}
