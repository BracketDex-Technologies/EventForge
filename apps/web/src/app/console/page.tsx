import { createClient } from '@/lib/supabase/server';
import { prisma } from '@eventforge/db';
import Link from 'next/link';

export default async function ConsoleDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
    { label: 'Total Events', value: eventCount, icon: calendarIcon },
    { label: 'Completed Orders', value: orderCount, icon: cartIcon },
    { label: 'Total Check-ins', value: checkInCount, icon: checkIcon },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Logged in as <span className="font-medium text-slate-900">{user?.email || 'demo@eventforge.app'}</span>
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stats.map((stat) => (
          <div key={stat.label} className="ef-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-3xl font-bold text-slate-900 tracking-tight">{stat.value.toLocaleString('en-US')}</p>
                <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Events */}
      <div className="ef-card">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Recent events</h2>
            <p className="mt-0.5 text-sm text-slate-500">Your latest events and performance</p>
          </div>
          <Link
            href="/console/events/new"
            className="ef-btn-primary text-sm"
          >
            New event
          </Link>
        </div>

        {recentEvents.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-12 h-12 rounded-xl mx-auto mb-4 bg-slate-100 text-slate-500 flex items-center justify-center">
              {calendarIcon}
            </div>
            <p className="text-base font-semibold text-slate-900">No events yet</p>
            <p className="text-sm text-slate-500 mt-1">Create your first event to get started.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentEvents.map((event) => (
              <Link
                key={event.id}
                href={`/console/events/${event.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-sm font-semibold">
                    {event.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-slate-900">{event.name}</p>
                    <p className="text-sm text-slate-500">{event.locales[0]?.title || 'No title set'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <span className="text-slate-500">
                    <span className="font-medium text-slate-900">{event._count.orders}</span> orders
                  </span>
                  <span className="text-slate-500">
                    <span className="font-medium text-slate-900">{event._count.checkIns}</span> check-ins
                  </span>
                  <span
                    className={`ef-badge ${
                      event.status === 'published'
                        ? 'ef-badge-success'
                        : event.status === 'live'
                          ? 'ef-badge-info'
                          : 'ef-badge-neutral'
                    }`}
                  >
                    {event.status}
                  </span>
                  <svg
                    className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
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

const calendarIcon = (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>
);

const cartIcon = (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
  </svg>
);

const checkIcon = (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
