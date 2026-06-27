import { prisma } from '@eventforge/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function AnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) notFound();

  // Fetch all core metrics from the database
  const [
    registrationsCount,
    revenueData,
    checkInsCount,
    ticketTypesWithSales,
    sessionsCount,
    speakersCount,
    ordersWithDates,
    attendeeProfiles,
    campaignsCount,
    pollVotesCount,
    qaMessagesCount,
  ] = await Promise.all([
    prisma.ticket.count({
      where: { eventId: id, status: { not: 'cancelled' } },
    }),
    prisma.order.aggregate({
      _sum: { totalCents: true },
      _count: true,
      where: { eventId: id, status: 'completed' },
    }),
    prisma.checkIn.count({
      where: { eventId: id },
    }),
    prisma.ticketType.findMany({
      where: { eventId: id },
      select: {
        id: true,
        name: true,
        priceCents: true,
        quantityTotal: true,
        quantitySold: true,
        currency: true,
      },
      orderBy: { sort: 'asc' },
    }),
    prisma.session.count({ where: { eventId: id } }),
    prisma.speaker.count({ where: { eventId: id } }),
    prisma.order.findMany({
      where: { eventId: id, status: 'completed' },
      select: {
        totalCents: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.attendeeProfile.count({ where: { eventId: id } }),
    prisma.campaign.count({ where: { eventId: id } }),
    prisma.pollVote.count({
      where: {
        poll: { session: { eventId: id } },
      },
    }),
    prisma.session.findMany({ where: { eventId: id }, select: { id: true } }).then(sessions => 
      prisma.qaMessage.count({
        where: {
          sessionId: { in: sessions.map(s => s.id) }
        }
      })
    ),
  ]);

  const totalRevenue = revenueData._sum.totalCents ? Number(revenueData._sum.totalCents) / 100 : 0;
  const totalOrders = revenueData._count;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const checkInRate = registrationsCount > 0 ? Math.round((checkInsCount / registrationsCount) * 100) : 0;

  const formattedRevenue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: event.currency.toUpperCase() || 'USD',
    minimumFractionDigits: 0,
  }).format(totalRevenue);

  const formattedAvgOrder = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: event.currency.toUpperCase() || 'USD',
    minimumFractionDigits: 0,
  }).format(avgOrderValue);

  // Group orders by date for the sales chart
  const dailySales = new Map<string, number>();
  for (const order of ordersWithDates) {
    const day = order.createdAt.toISOString().split('T')[0]!;
    dailySales.set(day, (dailySales.get(day) || 0) + 1);
  }

  const last7Days: { day: string; label: string; value: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0]!;
    const label = d.toLocaleDateString('en-US', { weekday: 'short' });
    last7Days.push({ day: key, label, value: dailySales.get(key) || 0 });
  }

  const maxSalesValue = Math.max(...last7Days.map(d => d.value), 1);

  // Ticket type breakdown
  const totalCapacity = ticketTypesWithSales.reduce((sum, tt) => sum + (tt.quantityTotal || 0), 0);
  const totalSold = ticketTypesWithSales.reduce((sum, tt) => sum + (tt.quantitySold || 0), 0);
  const capacityRate = totalCapacity > 0 ? Math.round((totalSold / totalCapacity) * 100) : 0;

  const metrics = [
    { label: 'Total Revenue', value: formattedRevenue, badge: `${totalOrders} orders`, color: 'border-l-emerald-500' },
    { label: 'Registrations', value: registrationsCount.toString(), badge: `${attendeeProfiles} profiles`, color: 'border-l-indigo-500' },
    { label: 'Check-ins', value: checkInsCount.toString(), badge: `${checkInRate}% rate`, color: 'border-l-amber-500' },
    { label: 'Avg Order Value', value: formattedAvgOrder, badge: 'per order', color: 'border-l-rose-500' },
  ];

  const engagementMetrics = [
    { label: 'Sessions', value: sessionsCount, icon: '📋' },
    { label: 'Speakers', value: speakersCount, icon: '🎤' },
    { label: 'Campaigns', value: campaignsCount, icon: '📧' },
    { label: 'Poll Votes', value: pollVotesCount, icon: '🗳️' },
    { label: 'Q&A Questions', value: qaMessagesCount, icon: '💬' },
    { label: 'Capacity Used', value: `${capacityRate}%`, icon: '📊' },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div className="animate-fade-in-up">
          <div className="flex items-center gap-2 text-sm mb-2 text-slate-400">
            <Link href={`/console/events/${id}`} className="hover:text-indigo-600 transition-colors">Event Dashboard</Link>
            <span>›</span>
            <span className="text-slate-600">Analytics</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h2>
          <p className="mt-1 text-sm text-slate-500">Real-time performance metrics and attendee engagement.</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up delay-100">
        {metrics.map((metric, i) => (
          <div key={i} className={`ef-card p-5 border-l-4 ${metric.color}`}>
            <p className="text-sm font-medium text-slate-500 mb-1">{metric.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-bold text-slate-900">{metric.value}</h3>
              <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
                {metric.badge}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up delay-200">
        {/* Daily Sales Chart */}
        <div className="ef-card p-6 lg:col-span-2">
          <h3 className="text-base font-semibold text-slate-900 mb-6">Daily Orders (Last 7 Days)</h3>
          <div className="h-64 flex items-end gap-3 justify-between">
            {last7Days.map((data, i) => {
              const height = maxSalesValue > 0 ? `${(data.value / maxSalesValue) * 100}%` : '0%';
              return (
                <div key={i} className="flex flex-col items-center flex-1 gap-2 group">
                  <div className="w-full bg-slate-100 rounded-t-lg relative h-full flex items-end group-hover:bg-slate-200 transition-colors">
                    <div
                      className="w-full bg-indigo-500 rounded-t-lg transition-all duration-500 ease-out group-hover:bg-indigo-600"
                      style={{ height, minHeight: data.value > 0 ? '8px' : '0' }}
                    />
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded pointer-events-none transition-opacity whitespace-nowrap">
                      {data.value} orders
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">{data.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ticket Type Breakdown */}
        <div className="ef-card p-6">
          <h3 className="text-base font-semibold text-slate-900 mb-6">Ticket Breakdown</h3>
          <div className="space-y-4">
            {ticketTypesWithSales.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">No ticket types configured.</p>
            ) : (
              ticketTypesWithSales.map(tt => {
                const soldPercent = tt.quantityTotal ? Math.round(((tt.quantitySold || 0) / tt.quantityTotal) * 100) : 0;
                const isSoldOut = soldPercent >= 100;
                return (
                  <div key={tt.id}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium text-slate-700">{tt.name}</span>
                      <span className="text-slate-500 text-xs">
                        {tt.quantitySold || 0}/{tt.quantityTotal || '∞'}
                        {isSoldOut && (
                          <span className="ml-1.5 text-rose-600 font-bold">SOLD OUT</span>
                        )}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-500 ${
                          isSoldOut ? 'bg-rose-500' : soldPercent > 75 ? 'bg-amber-500' : 'bg-indigo-500'
                        }`}
                        style={{ width: `${Math.min(soldPercent, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="animate-fade-in-up delay-300">
        <h3 className="text-base font-semibold text-slate-900 mb-4">Engagement Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {engagementMetrics.map((m, i) => (
            <div key={i} className="ef-card p-4 text-center">
              <div className="text-2xl mb-2">{m.icon}</div>
              <p className="text-xl font-bold text-slate-900">{m.value}</p>
              <p className="text-xs text-slate-500 font-medium mt-1">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
