import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="w-full py-4 px-6 lg:px-10 flex items-center justify-between sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <Image src="/logo-icon.svg" alt="EventForge" width={32} height={32} />
          <span className="font-bold text-lg tracking-tight text-slate-900">EventForge</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login" className="ef-btn-ghost text-sm">
            Sign in
          </Link>
          <Link href="/login" className="ef-btn-primary text-sm">
            Get started
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 lg:py-28 px-6 lg:px-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-semibold mb-8">
              Now in public beta
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1]">
              The calm way to run
              <br />
              high-stakes events
            </h1>
            <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              EventForge helps organizers sell tickets, manage registrations, scan attendees, and run live polls — all in one place. Built for teams that need reliability under pressure.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login" className="ef-btn-primary text-base px-7 py-3.5 w-full sm:w-auto">
                Start for free
              </Link>
              <Link href="/login" className="ef-btn-secondary text-base px-7 py-3.5 w-full sm:w-auto">
                View demo dashboard
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-slate-200 bg-white">
          <div className="max-w-5xl mx-auto px-6 lg:px-10 py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                ['99.9%', 'Uptime guarantee'],
                ['1.2M+', 'Tickets processed'],
                ['20K+', 'Events hosted'],
                ['< 1s', 'QR scan latency'],
              ].map(([value, label]) => (
                <div key={label}>
                  <p className="text-2xl md:text-3xl font-bold text-slate-900">{value}</p>
                  <p className="mt-1 text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 lg:py-24 px-6 lg:px-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Everything you need to run an event</h2>
              <p className="mt-3 text-slate-600 max-w-xl mx-auto">
                From first ticket sold to final attendee check-out, EventForge keeps every moving part in sync.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Flexible ticketing',
                  desc: 'Free or paid tiers, quantity limits, early-bird windows, and secure Stripe checkout.',
                },
                {
                  title: 'Real-time analytics',
                  desc: 'Track sales velocity, attendance, revenue, and engagement as your event unfolds.',
                },
                {
                  title: 'Fast check-ins',
                  desc: 'Scan QR codes from any device. No app install required for staff or attendees.',
                },
                {
                  title: 'Live engagement',
                  desc: 'Run polls, Q&A, and session RSVPs to keep your audience participating.',
                },
                {
                  title: 'Team permissions',
                  desc: 'Invite organizers, staff, and volunteers with role-based access control.',
                },
                {
                  title: 'Public event pages',
                  desc: 'Launch branded event microsites with schedules, speakers, and checkout.',
                },
              ].map((feature) => (
                <div key={feature.title} className="ef-card p-6 ef-card-hover">
                  <h3 className="text-base font-semibold text-slate-900">{feature.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 lg:px-10">
          <div className="max-w-4xl mx-auto rounded-2xl bg-slate-900 px-8 py-14 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Ready to run your next event?</h2>
            <p className="mt-3 text-slate-400 max-w-lg mx-auto">
              Create a free account and start building your event in minutes. No credit card required.
            </p>
            <Link
              href="/login"
              className="inline-flex mt-8 items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-teal-500 text-white font-semibold text-sm hover:bg-teal-600 transition-colors"
            >
              Create your free account
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-10 px-6 lg:px-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <Image src="/logo-icon.svg" alt="EventForge" width={28} height={28} />
            <span className="font-bold text-slate-900">EventForge</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500">
            <Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-900 transition-colors">Terms</Link>
            <Link href="/console" className="hover:text-slate-900 transition-colors">Console</Link>
          </div>
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} EventForge. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
