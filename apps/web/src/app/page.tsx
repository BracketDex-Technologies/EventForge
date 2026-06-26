'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [eventName, setEventName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [location, setLocation] = useState('');
  const [ticketCode, setTicketCode] = useState('');
  const [email, setEmail] = useState('');

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
    <div className="min-h-screen flex flex-col bg-[#0c0d12] text-slate-100 overflow-x-hidden font-sans">
      
      {/* Navigation Header */}
      <header className="w-full h-20 px-6 lg:px-12 flex items-center justify-between sticky top-0 z-50 border-b border-slate-900/60 bg-[#0c0d12]/90 backdrop-blur-md">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="p-1 rounded-xl bg-slate-900 border border-slate-800">
            <Image src="/logo-icon.svg" alt="EventForge" width={28} height={28} />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">EventForge</span>
        </Link>

        {/* Central Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-400">
          <Link href="#" className="hover:text-white transition-colors">About Us</Link>
          <div className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors group">
            <span>Features</span>
            <svg className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
          <Link href="#" className="hover:text-white transition-colors">How It Works</Link>
          <Link href="#" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="#" className="hover:text-white transition-colors">Support</Link>
        </nav>

        {/* Action CTAs */}
        <div className="flex items-center gap-5">
          <Link href="/login" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">
            Sign in
          </Link>
          <Link href="/login" className="py-2.5 px-5 rounded-xl bg-[#FF8552] text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-[#ff966c] transition-colors shadow-lg shadow-[#FF8552]/10">
            Get Started
          </Link>
        </div>
      </header>

      <main className="flex-1">
        
        {/* Split Hero Section */}
        <section className="relative min-h-[calc(100vh-80px)] flex flex-col lg:flex-row items-stretch border-b border-slate-900/60">
          
          {/* Left Column (Content & Widgets) */}
          <div className="flex-1 p-6 sm:p-12 lg:p-16 flex flex-col justify-center max-w-4xl z-10 bg-[#0c0d12]">
            <div className="space-y-8 max-w-2xl">
              
              {/* Star Ratings Row */}
              <div className="flex flex-wrap items-center gap-8">
                {/* Reviews.io badge */}
                <div className="space-y-1 text-left">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg key={s} className="w-4 h-4 text-amber-500 fill-amber-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-xs font-semibold text-slate-300">
                    4.9/5 <span className="text-slate-500 font-medium">(25K+ Reviews)</span>
                  </p>
                  <p className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Reviews.io</p>
                </div>

                {/* Trustpilot badge */}
                <div className="space-y-1 text-left">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg key={s} className="w-4 h-4 text-emerald-400 fill-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-xs font-semibold text-slate-300">
                    4.8/5 <span className="text-slate-500 font-medium">(64K+ Reviews)</span>
                  </p>
                  <p className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Trustpilot</p>
                </div>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight">
                Skip the Hassle: Complete Event Management, <span className="text-[#FF8552]">100% Guaranteed!</span>
              </h1>

              {/* Description */}
              <p className="text-slate-400 text-sm sm:text-base font-light leading-relaxed max-w-xl">
                Events made easy: Venues, ticketing, live polling, and check-ins at your fingertips. Get started today and manage your first event for free!
              </p>

              {/* Bottom Interactive Search Widget */}
              <div className="pt-4 max-w-xl">
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl p-1.5 backdrop-blur-xl">
                  {/* Selector Tabs */}
                  <div className="flex gap-1 pb-1 border-b border-slate-800/40 px-2 pt-1.5 shrink-0">
                    <button
                      onClick={() => setActiveTab('create')}
                      className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                        activeTab === 'create'
                          ? 'bg-slate-800 text-white'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      Create Event
                    </button>
                    <button
                      onClick={() => setActiveTab('join')}
                      className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                        activeTab === 'join'
                          ? 'bg-slate-800 text-white'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      Join Event
                    </button>
                  </div>

                  {/* Input Form Fields */}
                  <div className="p-3 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    {activeTab === 'create' ? (
                      <>
                        <div className="sm:col-span-4 space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1">Workspace</label>
                          <input
                            type="text"
                            placeholder="Acme Events"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                          />
                        </div>
                        <div className="sm:col-span-3 space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1">Capacity</label>
                          <input
                            type="text"
                            placeholder="e.g. 500"
                            value={capacity}
                            onChange={(e) => setCapacity(e.target.value)}
                            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                          />
                        </div>
                        <div className="sm:col-span-5 space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1">Location</label>
                          <div className="relative flex items-center">
                            <svg className="w-3.5 h-3.5 text-slate-500 absolute left-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                            <input
                              type="text"
                              placeholder="Enter location"
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="sm:col-span-6 space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1">Ticket Code</label>
                          <input
                            type="text"
                            placeholder="e.g. TKT-8492"
                            value={ticketCode}
                            onChange={(e) => setTicketCode(e.target.value)}
                            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                          />
                        </div>
                        <div className="sm:col-span-6 space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1">Email Address</label>
                          <input
                            type="email"
                            placeholder="you@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Submission Row */}
                  <div className="p-3 pt-0 flex justify-end">
                    <Link
                      href="/login"
                      className="py-3 px-6 rounded-xl bg-[#FF8552] text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-[#ff966c] transition-colors w-full sm:w-auto text-center"
                    >
                      {activeTab === 'create' ? 'Launch Event' : 'Access Ticket'}
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column (Hero Event Image Grid with fade overlay) */}
          <div className="hidden lg:block lg:w-[40%] relative overflow-hidden bg-slate-900 border-l border-slate-900/60">
            <Image
              src="/hero-conference.png"
              alt="Conference Events"
              fill
              className="object-cover"
              priority
            />
            {/* Blending Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0c0d12] via-transparent to-transparent opacity-100 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d12] via-transparent to-transparent opacity-60 pointer-events-none" />
          </div>
        </section>

        {/* Stats Strip */}
        <section className="border-b border-slate-900/60 bg-[#0c0d12] py-14 px-6">
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
        <section className="py-24 px-6 relative bg-[#0c0d12]">
          <div className="max-w-5xl mx-auto space-y-16">
            <div className="text-center space-y-3">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Everything required to run an event</h2>
              <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
                From first ticket sold to live check-ins and session analytics, EventForge keeps every detail synchronized.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature) => (
                <div key={feature.title} className="p-6 rounded-2xl bg-slate-900/30 border border-slate-900/60 hover:border-indigo-500/20 hover:bg-slate-900/50 transition-all duration-300 text-left space-y-4">
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
        <section className="py-20 px-6 relative bg-[#0c0d12] border-t border-slate-900/60">
          <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-tr from-slate-900/40 via-indigo-950/10 to-slate-900/40 border border-slate-900/80 px-8 py-16 text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-[100px] opacity-[0.05] bg-indigo-500 pointer-events-none" />
            
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Ready to run your next event?</h2>
            <p className="text-slate-400 max-w-lg mx-auto text-sm leading-relaxed font-light">
              Create your organization, host custom websites, sell registration seats, and manage campaigns effortlessly.
            </p>
            <div className="pt-4">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#FF8552] text-slate-950 font-bold text-sm hover:bg-[#ff966c] transition-colors shadow-lg"
              >
                Create your free workspace
                <svg className="w-4.5 h-4.5 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#0c0d12] py-12 px-6 lg:px-12">
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
