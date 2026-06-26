import { prisma } from '@eventforge/db';

export default async function ConsoleAnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const [metrics, checkIns, orders] = await Promise.all([
    prisma.eventMetricHourly.findMany({
      where: { eventId: id },
      orderBy: { hourBucket: 'asc' }
    }),
    prisma.checkIn.count({ where: { eventId: id } }),
    prisma.order.findMany({ where: { eventId: id } })
  ]);

  const totalRegistrations = orders.filter(o => o.status === 'completed').length;
  const totalRevenue = orders.filter(o => o.status === 'completed').reduce((acc, order) => acc + Number(order.totalCents), 0);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Event Analytics</h2>
        </div>
        <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md font-bold text-sm shadow-sm">
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Registrations</h3>
          <p className="text-3xl font-bold text-gray-900">{totalRegistrations}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Gross Revenue</h3>
          <p className="text-3xl font-bold text-gray-900">${(totalRevenue / 100).toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Check-ins</h3>
          <p className="text-3xl font-bold text-gray-900">{checkIns}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-5 border-b">
          <h3 className="text-lg font-bold text-gray-900">Recent Activity Rollups</h3>
        </div>
        {metrics.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No activity metrics recorded yet. Metrics are aggregated hourly.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registrations</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-ins</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page Views</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {metrics.slice(-10).reverse().map((m) => (
                <tr key={m.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(m.hourBucket).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{m.registrations}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{m.checkIns}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{m.pageViews}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 font-medium">
                    ${(Number(m.revenueCents) / 100).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
