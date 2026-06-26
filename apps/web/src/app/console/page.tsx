import { createClient } from '@/lib/supabase/server';
import { prisma } from '@eventforge/db';
import Link from 'next/link';

export default async function ConsoleDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch aggregate stats across all events for this user's org
  const [eventCount, orderCount, checkInCount] = await Promise.all([
    prisma.event.count({ where: { deletedAt: null } }),
    prisma.order.count({ where: { status: 'completed' } }),
    prisma.checkIn.count(),
  ]);

  const recentEvents = await prisma.event.findMany({
    where: { deletedAt: null },
    orderBy: { updatedAt: 'desc' },
    take: 5,
    include: {
      locales: { where: { locale: 'en' }, take: 1 },
      _count: { select: { orders: true, checkIns: true } },
    },
  });

  const stats = [
    {
      label: 'Total Events',
      value: eventCount,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      ),
      trend: '+3 this month',
      trendUp: true,
    },
    {
      label: 'Completed Orders',
      value: orderCount,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </svg>
      ),
      trend: '+12% vs last month',
      trendUp: true,
    },
    {
      label: 'Total Check-ins',
      value: checkInCount,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      trend: '87% scan rate',
      trendUp: true,
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Welcome Header */}
      <div className="animate-fade-in-up">
        <h2 className="ef-headline-xl" style={{ color: 'var(--ef-text-primary)' }}>
          Welcome back!
        </h2>
        <p className="mt-1 text-[15px]" style={{ color: 'var(--ef-text-secondary)' }}>
          Logged in as{' '}
          <span className="font-medium" style={{ color: 'var(--ef-text-primary)' }}>
            {user?.email || 'demo@eventforge.app'}
          </span>
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="ef-card p-6 animate-fade-in-up"
            style={{ animationDelay: `${(i + 1) * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(59,130,246,0.08) 100%)',
                  color: 'var(--ef-primary)',
                }}
              >
                {stat.icon}
              </div>
              {stat.trend && (
                <span
                  className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    background: stat.trendUp ? 'var(--ef-success-bg)' : 'var(--ef-danger-bg)',
                    color: stat.trendUp ? 'var(--ef-success-text)' : 'var(--ef-danger-text)',
                  }}
                >
                  {stat.trendUp ? '↑' : '↓'} {stat.trend}
                </span>
              )}
            </div>
            <p
              className="text-[40px] font-bold tracking-tight leading-none ef-gradient-text"
            >
              {stat.value.toLocaleString()}
            </p>
            <p className="ef-label-sm mt-2" style={{ color: 'var(--ef-text-muted)' }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Events */}
      <div className="ef-card animate-fade-in-up delay-400">
        <div className="px-6 py-5 flex justify-between items-center" style={{ borderBottom: '1px solid var(--ef-border-subtle)' }}>
          <div>
            <h3 className="ef-headline-md">Recent Events</h3>
            <p className="text-[13px] mt-0.5" style={{ color: 'var(--ef-text-muted)' }}>
              Your latest events and their performance
            </p>
          </div>
          <Link
            href="/console/events/new"
            className="ef-btn-primary text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Event
          </Link>
        </div>
        {recentEvents.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(59,130,246,0.08) 100%)' }}>
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                   style={{ color: 'var(--ef-primary)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </div>
            <p className="text-lg font-semibold" style={{ color: 'var(--ef-text-primary)' }}>No events yet</p>
            <p className="text-sm mt-1" style={{ color: 'var(--ef-text-muted)' }}>
              Create your first event to get started.
            </p>
          </div>
        ) : (
          <div>
            {recentEvents.map((event, i) => (
              <Link
                key={event.id}
                href={`/console/events/${event.id}`}
                className="flex items-center justify-between px-6 py-4 transition-all duration-200 group hover:bg-[var(--ef-surface-hover)]"
                style={{
                  borderBottom: i < recentEvents.length - 1 ? '1px solid var(--ef-border-subtle)' : 'none',
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                    style={{
                      background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(59,130,246,0.08) 100%)',
                      color: 'var(--ef-primary)',
                    }}
                  >
                    {event.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-[14px]" style={{ color: 'var(--ef-text-primary)' }}>
                      {event.name}
                    </p>
                    <p className="text-[13px]" style={{ color: 'var(--ef-text-muted)' }}>
                      {event.locales[0]?.title || 'No title set'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <span style={{ color: 'var(--ef-text-secondary)' }}>
                    <span className="font-semibold" style={{ color: 'var(--ef-text-primary)' }}>
                      {event._count.orders}
                    </span>{' '}orders
                  </span>
                  <span style={{ color: 'var(--ef-text-secondary)' }}>
                    <span className="font-semibold" style={{ color: 'var(--ef-text-primary)' }}>
                      {event._count.checkIns}
                    </span>{' '}check-ins
                  </span>
                  <span
                    className="ef-badge"
                    style={{
                      ...(event.status === 'published'
                        ? { background: 'var(--ef-success-bg)', color: 'var(--ef-success-text)' }
                        : event.status === 'live'
                          ? { background: 'var(--ef-info-bg)', color: 'var(--ef-info-text)' }
                          : { background: '#f1f5f9', color: '#475569' }),
                    }}
                  >
                    {event.status.toUpperCase()}
                  </span>
                  <svg
                    className="w-4 h-4 opacity-0 group-hover:opacity-60 transition-opacity"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    style={{ color: 'var(--ef-text-muted)' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
