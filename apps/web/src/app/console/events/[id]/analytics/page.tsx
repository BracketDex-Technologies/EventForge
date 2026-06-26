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

  // Mock data for analytics
  const metrics = [
    { label: 'Page Views', value: '12,450', change: '+14%' },
    { label: 'Registrations', value: '845', change: '+5%' },
    { label: 'Check-ins', value: '720', change: '+2%' },
    { label: 'Revenue', value: '$45,200', change: '+24%' },
  ];

  const salesData = [
    { day: 'Mon', value: 30 },
    { day: 'Tue', value: 45 },
    { day: 'Wed', value: 25 },
    { day: 'Thu', value: 60 },
    { day: 'Fri', value: 90 },
    { day: 'Sat', value: 110 },
    { day: 'Sun', value: 85 },
  ];

  const maxValue = Math.max(...salesData.map(d => d.value));

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
          <p className="mt-1 text-sm text-slate-500">Track performance and attendee engagement.</p>
        </div>
        <div className="flex items-center gap-3 animate-fade-in-up">
          <select className="ef-input text-sm py-2">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>All time</option>
          </select>
          <button className="ef-btn-secondary py-2">Export Report</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up delay-100">
        {metrics.map((metric, i) => (
          <div key={i} className="ef-card p-5">
            <p className="text-sm font-medium text-slate-500 mb-1">{metric.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-bold text-slate-900">{metric.value}</h3>
              <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                {metric.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up delay-200">
        <div className="ef-card p-6 lg:col-span-2">
          <h3 className="text-base font-semibold text-slate-900 mb-6">Ticket Sales</h3>
          <div className="h-64 flex items-end gap-2 justify-between">
            {salesData.map((data, i) => {
              const height = `${(data.value / maxValue) * 100}%`;
              return (
                <div key={i} className="flex flex-col items-center flex-1 gap-2 group">
                  <div className="w-full bg-slate-100 rounded-t-sm relative h-full flex items-end group-hover:bg-slate-200 transition-colors">
                    <div 
                      className="w-full bg-indigo-500 rounded-t-sm transition-all duration-500 ease-out group-hover:bg-indigo-600"
                      style={{ height }}
                    ></div>
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded pointer-events-none transition-opacity">
                      {data.value}
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">{data.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="ef-card p-6">
          <h3 className="text-base font-semibold text-slate-900 mb-6">Traffic Sources</h3>
          <div className="space-y-4">
            {[
              { source: 'Direct', percent: 45, color: 'bg-indigo-500' },
              { source: 'Social Media', percent: 30, color: 'bg-emerald-500' },
              { source: 'Email', percent: 15, color: 'bg-amber-500' },
              { source: 'Referral', percent: 10, color: 'bg-rose-500' },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700">{item.source}</span>
                  <span className="text-slate-500">{item.percent}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
