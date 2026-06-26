import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ background: 'var(--ef-bg)' }}>
      {/* ─── Hero Header ─── */}
      <header className="w-full py-5 px-8 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md border-b border-[rgba(0,0,0,0.03)] bg-white/70">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/30"
               style={{ background: 'var(--ef-primary-gradient)' }}>
            EF
          </div>
          <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--ef-text-primary)' }}>
            EventForge
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="ef-btn-secondary" style={{ padding: '8px 20px', fontSize: '13px' }}>
            Sign In
          </Link>
          <Link href="/login" className="ef-btn-primary" style={{ padding: '8px 20px', fontSize: '13px' }}>
            Start Free
          </Link>
        </div>
      </header>

      {/* ─── Hero Content ─── */}
      <main className="flex-1 flex flex-col">
        <section className="relative overflow-hidden py-24 px-8 text-center"
                 style={{ background: 'linear-gradient(135deg, #0f1629 0%, #1a1f3a 60%, #0f1629 100%)' }}>
          {/* Dot pattern & background glow */}
          <div className="absolute inset-0 ef-dot-pattern opacity-40" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] opacity-10 pointer-events-none"
               style={{ background: 'var(--ef-primary-gradient)' }} />

          <div className="max-w-4xl mx-auto relative z-10 space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-white/90 border border-white/10"
                 style={{ background: 'rgba(255, 255, 255, 0.04)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Next-Gen Event Management Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-none">
              Forge Unforgettable <br />
              <span className="ef-gradient-text">Event Experiences</span>
            </h1>

            <p className="max-w-2xl mx-auto text-base md:text-lg leading-relaxed text-slate-300 font-light">
              EventForge is a professional-grade SaaS empowering planners, organizers, and enterprises to coordinate high-density physical and virtual events, complete with ticketing, analytics, live polling, and check-ins.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/login" className="ef-btn-primary text-base px-8 py-3.5 shadow-lg w-full sm:w-auto">
                Get Started for Free
              </Link>
              <Link href="/login" className="ef-btn-secondary text-base px-8 py-3.5 border-white/15 bg-white/5 text-white hover:bg-white/10 w-full sm:w-auto">
                Explore Demo Console
              </Link>
            </div>

            {/* Mock stats bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 max-w-3xl mx-auto border-t border-white/10 text-white">
              <div>
                <p className="text-3xl font-extrabold text-white">99.9%</p>
                <p className="text-xs text-slate-400 mt-1 font-medium">Uptime Guarantee</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-white">1.2M+</p>
                <p className="text-xs text-slate-400 mt-1 font-medium">Tickets Processed</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-white">20K+</p>
                <p className="text-xs text-slate-400 mt-1 font-medium">Events Hosted</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-white">&lt; 1s</p>
                <p className="text-xs text-slate-400 mt-1 font-medium">QR Check-in Latency</p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Features Grid ─── */}
        <section className="py-20 px-8 max-w-6xl mx-auto w-full">
          <div className="text-center mb-16 space-y-3">
            <h2 className="ef-headline-lg text-3xl font-bold">Comprehensive Tools for Every Stage</h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              From initial ticketing registration to real-time day-of-event operations, EventForge handles the details so you can focus on building connections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="ef-card p-8 space-y-4 hover:shadow-md transition-all duration-200">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-indigo-50 text-indigo-600 font-bold text-lg">
                🎟️
              </div>
              <h3 className="text-xl font-bold" style={{ color: 'var(--ef-text-primary)' }}>Multi-tier Ticketing</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--ef-text-secondary)' }}>
                Configure free or paid ticket tiers with quantity limits, custom pricing, and secure credit card checkout integrations powered by Stripe.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="ef-card p-8 space-y-4 hover:shadow-md transition-all duration-200">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-indigo-50 text-indigo-600 font-bold text-lg">
                📊
              </div>
              <h3 className="text-xl font-bold" style={{ color: 'var(--ef-text-primary)' }}>Real-Time Insights</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--ef-text-secondary)' }}>
                Track registrations, check-in velocities, gross revenue metrics, and hourly audience trends from a single dashboard.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="ef-card p-8 space-y-4 hover:shadow-md transition-all duration-200">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-indigo-50 text-indigo-600 font-bold text-lg">
                📱
              </div>
              <h3 className="text-xl font-bold" style={{ color: 'var(--ef-text-primary)' }}>High-Speed Scanning</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--ef-text-secondary)' }}>
                Check in attendees instantly with our mobile QR code scanner. Zero installation required, optimized for direct hardware camera access.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="py-12 px-8 bg-slate-900 text-slate-400 border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-white text-sm"
                 style={{ background: 'var(--ef-primary-gradient)' }}>
              EF
            </div>
            <span className="font-bold text-white text-base">EventForge</span>
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/login" className="hover:text-white transition-colors">Admin Console</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
