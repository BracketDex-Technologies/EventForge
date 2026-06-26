import Link from 'next/link';

export default function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen" style={{ background: 'var(--ef-bg)' }}>
      {/* ─── Sidebar ─── */}
      <aside
        className="w-[260px] flex flex-col fixed inset-y-0 left-0 z-30"
        style={{ background: 'var(--ef-sidebar)' }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Link href="/console" className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ background: 'var(--ef-primary-gradient)' }}
            >
              E
            </div>
            <span className="font-bold text-lg tracking-tight ef-gradient-text">
              EventForge
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="px-3 pb-2 pt-2 text-[10px] font-semibold tracking-[0.1em] uppercase"
             style={{ color: 'rgba(255,255,255,0.35)' }}>
            Main
          </p>
          <Link
            href="/console"
            className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
            style={{
              color: 'var(--ef-sidebar-text-active)',
              background: 'var(--ef-sidebar-active)',
            }}
          >
            <svg className="w-[18px] h-[18px] opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
            <div className="absolute left-0 w-1 h-6 rounded-r-full" style={{ background: 'var(--ef-primary-gradient)' }} />
          </Link>
          <Link
            href="/console/events"
            className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/[0.06]"
            style={{ color: 'var(--ef-sidebar-text)' }}
          >
            <svg className="w-[18px] h-[18px] opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Events
          </Link>

          <div className="pt-6" />
          <p className="px-3 pb-2 pt-2 text-[10px] font-semibold tracking-[0.1em] uppercase"
             style={{ color: 'rgba(255,255,255,0.35)' }}>
            Organization
          </p>
          <Link
            href="/console/team"
            className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/[0.06]"
            style={{ color: 'var(--ef-sidebar-text)' }}
          >
            <svg className="w-[18px] h-[18px] opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Team
          </Link>
          <Link
            href="/console/settings/billing"
            className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/[0.06]"
            style={{ color: 'var(--ef-sidebar-text)' }}
          >
            <svg className="w-[18px] h-[18px] opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Billing
          </Link>
        </nav>

        {/* Footer */}
        <div className="p-4 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.25)' }}>
            EventForge v1.0
          </p>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <main className="flex-1 ml-[260px] overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
