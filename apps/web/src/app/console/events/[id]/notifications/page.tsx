import { prisma } from '@eventforge/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import BroadcastPushForm from './BroadcastPushForm';

export default async function NotificationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) notFound();

  // Load subscriptions count
  const subCount = await prisma.pushSubscription.count({
    where: { eventId: id },
  });

  // Load notification history
  const history = await prisma.pushNotification.findMany({
    where: { eventId: id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <div className="flex items-center gap-2 text-sm mb-2 text-slate-400">
          <Link href={`/console/events/${id}`} className="hover:text-indigo-600 transition-colors">Event Dashboard</Link>
          <span>›</span>
          <span className="text-slate-600">Push Notifications</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Web Push Notifications</h2>
        <p className="mt-1 text-sm text-slate-500">Send real-time alerts and schedule announcement updates directly to attendees' browser screens.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form and Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="ef-card p-5 space-y-4 border-l-4 border-l-indigo-600">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Subscribers</p>
              <h3 className="text-3xl font-black text-slate-950 mt-1">{subCount}</h3>
              <p className="text-xs text-slate-500 mt-2">
                Attendees who allowed browser notifications on your public event page.
              </p>
            </div>
          </div>

          <div className="ef-card p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Send Broadcast Notification</h3>
            <BroadcastPushForm eventId={id} />
          </div>
        </div>

        {/* History Table */}
        <div className="lg:col-span-2">
          <div className="ef-card p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-5">Broadcasting History</h3>
            
            {history.length === 0 ? (
              <div className="p-16 text-center border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
                <div className="w-12 h-12 rounded-full mx-auto bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                  🔔
                </div>
                <p className="text-sm font-semibold text-slate-700">No notifications sent yet</p>
                <p className="text-xs text-slate-400 mt-1">Use the form to send alerts to attendees.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="ef-table">
                  <thead>
                    <tr>
                      <th>Notification</th>
                      <th>Deliveries</th>
                      <th>Status</th>
                      <th className="text-right">Sent Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <td>
                          <div className="space-y-0.5">
                            <p className="font-semibold text-slate-900">{item.title}</p>
                            <p className="text-xs text-slate-500">{item.body}</p>
                            {item.url && (
                              <p className="text-[10px] text-indigo-500 font-mono mt-0.5">{item.url}</p>
                            )}
                          </div>
                        </td>
                        <td className="text-xs text-slate-700 font-semibold">{item.sentCount} devices</td>
                        <td>
                          <span className="ef-badge ef-badge-success text-[10px]">Sent</span>
                        </td>
                        <td className="text-xs text-slate-500 font-medium text-right">
                          {item.sentAt ? new Date(item.sentAt).toLocaleString() : new Date(item.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
// TS refresh

