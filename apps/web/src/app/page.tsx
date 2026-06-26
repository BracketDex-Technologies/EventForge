'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const stats = [
    { value: '99.9%', label: 'Uptime guarantee' },
    { value: '1.2M+', label: 'Tickets processed' },
    { value: '20K+', label: 'Events hosted' },
    { value: '< 1s', label: 'Check-in Latency' },
  ];

  const features = [
    {
      title: 'Flexible Ticketing',
      desc: 'Free, paid, and donation tiers with early-bird windows, quantity locks, and Stripe secure checkouts.',
      icon: (
        <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
        </svg>
      )
    },
    {
      title: 'Real-Time Analytics',
      desc: 'Track registration velocity, attendee drop-offs, and ticket tier revenues instantly as they happen.',
      icon: (
        <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
      )
    },
    {
      title: 'On-Site QR Scanner',
      desc: 'Touchless browser-based QR check-in scanning. Zero software installation required for staff or gate attendants.',
      icon: (
        <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
        </svg>
      )
    },
    {
      title: 'Live Engagement Tools',
      desc: 'Keep audiences participating with session-level Q&A boards, live interactive polls, and attendee profiles.',
      icon: (
        <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    {
      title: 'Email Workflows',
      desc: 'Create automated email campaigns and marketing workflows triggered by attendee registration and check-ins.',
      icon: (
        <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      )
    },
    {
      title: 'Badge Design & Print',
      desc: 'Fully customizable layout sheets for on-site printing queues, badge templates, and direct network printer commands.',
      icon: (
        <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.617 0-1.11-.476-1.12-1.09l-.244-2.66m11.793 0H6.207m11.586-4.62L16.5 4.5a2.25 2.25 0 00-2.25-2.25h-4.5A2.25 2.25 0 007.5 4.5L6.207 9.18" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 overflow-x-hidden font-sans">
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[160px] opacity-[0.08] bg-indigo-500 pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full blur-[140px] opacity-[0.05] bg-teal-500 pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[600px] h-[600px] rounded-full blur-[180px] opacity-[0.04] bg-indigo-600 pointer-events-none" />

      {/* Header */}
      <header className="w-full py-4 px-6 lg:px-10 flex items-center justify-between sticky top-0 z-50 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="p-1 rounded-lg bg-slate-900 border border-slate-800">
            <Image src="/logo-icon.svg" alt="EventForge" width={28} height={28} />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">EventForge</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">
            Sign in
          </Link>
          <Link href="/login" className="py-2 px-4.5 rounded-xl bg-white text-slate-950 font-bold text-sm hover:bg-slate-200 transition-colors shadow-lg shadow-white/5">
            Get started
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-6 relative">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              Now Open: Parity Release with Zoho Backstage
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08] max-w-4xl mx-auto">
              Run high-stakes events
              <span className="block mt-2 bg-gradient-to-r from-teal-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                with absolute control.
              </span>
            </h1>

            <p className="mt-6 text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
              EventForge is the complete event management suite. Host agendas, configure customizable ticket sales, manage automated email workflows, and scan QR check-ins.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-sm sm:max-w-none mx-auto">
              <Link href="/login" className="w-full sm:w-auto py-3.5 px-8 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-500 active:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2">
                Start hosting for free
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link href="/login" className="w-full sm:w-auto py-3.5 px-8 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-sm hover:bg-slate-800 hover:text-white transition-all">
                Explore demo dashboard
              </Link>
            </div>
          </div>

          {/* Product Dashboard Mockup */}
          <div className="max-w-5xl mx-auto mt-16 px-4 md:px-0 animate-fade-in-up delay-200">
            <div className="relative rounded-2xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-xl p-1.5 shadow-2xl">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-indigo-500/10 via-transparent to-teal-400/10 opacity-60 pointer-events-none" />
              
              {/* Fake Window Controls */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl overflow-hidden">
                <div className="h-10 px-4 border-b border-slate-900 flex items-center justify-between bg-slate-950/90 shrink-0">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40" />
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 tracking-wide">console.eventforge.app/dashboard</div>
                  <div className="w-12" />
                </div>

                {/* Dashboard Grid */}
                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left Column: Stats & Progress */}
                  <div className="md:col-span-2 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-900 pb-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Active Event</span>
                        <h3 className="text-lg font-bold text-white mt-0.5">Global WebDev Summit 2026</h3>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 text-[10px] font-bold uppercase animate-pulse">Live</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/60">
                        <span className="text-[10px] font-semibold text-slate-500 uppercase">Tickets Sold</span>
                        <p className="text-2xl font-bold text-white mt-1">1,248 <span className="text-xs font-normal text-slate-500">/ 1,500</span></p>
                        <div className="w-full bg-slate-950 h-1.5 rounded-full mt-3 overflow-hidden">
                          <div className="bg-indigo-500 h-full rounded-full" style={{ width: '83%' }} />
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/60">
                        <span className="text-[10px] font-semibold text-slate-500 uppercase">Total Revenue</span>
                        <p className="text-2xl font-bold text-white mt-1">$124,800</p>
                        <p className="text-[10px] text-teal-400 font-semibold mt-2.5 flex items-center gap-1">
                          ↑ 14% this hour
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/60">
                        <span className="text-[10px] font-semibold text-slate-500 uppercase">Check-ins</span>
                        <p className="text-2xl font-bold text-white mt-1">842 <span className="text-xs font-normal text-slate-500">/ 1,248</span></p>
                        <div className="w-full bg-slate-950 h-1.5 rounded-full mt-3 overflow-hidden">
                          <div className="bg-teal-400 h-full rounded-full" style={{ width: '67%' }} />
                        </div>
                      </div>
                    </div>

                    {/* Fake Chart */}
                    <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800/60">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase block mb-6">Registration Velocity (hourly)</span>
                      <div className="h-32 flex items-end gap-3 pt-2">
                        {[25, 45, 30, 60, 85, 55, 70, 95, 120, 80, 110, 140].map((h, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                            <div className="w-full bg-gradient-to-t from-indigo-600 to-teal-400 rounded-t-sm transition-all duration-500" style={{ height: `${h}%` }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Live Feed */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Live Activity Feed</h4>
                    <div className="space-y-3">
                      {[
                        { title: 'VIP Ticket checkout complete', detail: 'Sarah Connor purchased 1 ticket', time: '1m ago', color: 'border-l-indigo-500' },
                        { title: 'Attendee check-in verified', detail: 'David Miller scanned at main hall', time: '3m ago', color: 'border-l-teal-400' },
                        { title: 'Live Poll opened', detail: 'Session: "Future of Next.js"', time: '8m ago', color: 'border-l-purple-500' },
                        { title: 'New speaker confirmed', detail: 'Dr. Evelyn Carter joined Agenda', time: '15m ago', color: 'border-l-yellow-500' },
                      ].map((feed, i) => (
                        <div key={i} className={`p-3 bg-slate-900/80 border-l-2 ${feed.color} border border-slate-800/60 rounded-r-xl flex justify-between items-start text-left`}>
                          <div>
                            <p className="text-xs font-bold text-white leading-tight">{feed.title}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">{feed.detail}</p>
                          </div>
                          <span className="text-[9px] text-slate-600 font-medium whitespace-nowrap">{feed.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats strip */}
        <section className="border-y border-slate-900 bg-slate-950 py-12 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <p className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">{stat.value}</p>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="py-24 px-6 relative">
          <div className="max-w-5xl mx-auto space-y-16">
            <div className="text-center space-y-3">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Everything required to run an event</h2>
              <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
                From first ticket sold to live check-ins and session analytics, EventForge keeps every detail synchronized.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature) => (
                <div key={feature.title} className="p-6 rounded-2xl bg-slate-900/35 border border-slate-900 hover:border-indigo-500/20 hover:bg-slate-900/50 transition-all duration-300 text-left space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{feature.title}</h3>
                    <p className="mt-2 text-xs text-slate-400 leading-relaxed font-light">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-6 relative">
          <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-tr from-slate-900 via-indigo-950/20 to-slate-900 border border-slate-800/80 px-8 py-16 text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-[100px] opacity-[0.05] bg-indigo-500 pointer-events-none" />
            
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Ready to run your next event?</h2>
            <p className="text-slate-400 max-w-lg mx-auto text-sm leading-relaxed font-light">
              Create your organization, host custom websites, sell registration seats, and manage campaigns effortlessly.
            </p>
            <div className="pt-4">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-slate-950 font-bold text-sm hover:bg-slate-200 transition-colors shadow-lg"
              >
                Create your free workspace
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12 px-6 lg:px-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo-icon.svg" alt="EventForge" width={24} height={24} />
            <span className="font-bold text-white text-sm">EventForge</span>
          </Link>
          <div className="flex gap-8 text-xs text-slate-500">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/console" className="hover:text-white transition-colors">Console</Link>
          </div>
          <p className="text-[11px] text-slate-600">
            © {new Date().getFullYear()} EventForge. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
