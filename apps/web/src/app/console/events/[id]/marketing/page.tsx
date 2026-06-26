import { prisma } from '@eventforge/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function MarketingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) notFound();

  // Mock campaigns
  const campaigns = [
    { id: '1', name: 'Early Bird Announcement', status: 'Sent', sentDate: '2023-10-15', opens: '45%', clicks: '12%' },
    { id: '2', name: 'Speaker Lineup Reveal', status: 'Sent', sentDate: '2023-11-01', opens: '52%', clicks: '18%' },
    { id: '3', name: 'Last Chance to Register', status: 'Draft', sentDate: null, opens: '-', clicks: '-' },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div className="animate-fade-in-up">
          <div className="flex items-center gap-2 text-sm mb-2 text-slate-400">
            <Link href={`/console/events/${id}`} className="hover:text-indigo-600 transition-colors">Event Dashboard</Link>
            <span>›</span>
            <span className="text-slate-600">Marketing</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Email Campaigns</h2>
          <p className="mt-1 text-sm text-slate-500">Communicate with your attendees and promote your event.</p>
        </div>
        <div className="flex items-center gap-3 animate-fade-in-up">
          <button className="ef-btn-primary">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create Campaign
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up delay-100">
        <div className="ef-card p-4">
          <p className="text-sm font-medium text-slate-500">Total Sent Emails</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">2,450</h3>
        </div>
        <div className="ef-card p-4">
          <p className="text-sm font-medium text-slate-500">Avg. Open Rate</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">48.5%</h3>
        </div>
        <div className="ef-card p-4">
          <p className="text-sm font-medium text-slate-500">Avg. Click Rate</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">15.2%</h3>
        </div>
      </div>

      <div className="ef-card animate-fade-in-up delay-200">
        {campaigns.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-14 h-14 rounded-xl mx-auto mb-4 bg-slate-100 text-slate-500 flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <p className="text-base font-semibold text-slate-900">No campaigns yet</p>
            <p className="text-sm text-slate-500 mt-1">
              Create your first email campaign to engage your audience.
            </p>
          </div>
        ) : (
          <table className="ef-table">
            <thead>
              <tr>
                <th>Campaign Name</th>
                <th>Status</th>
                <th>Sent Date</th>
                <th>Opens</th>
                <th>Clicks</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr key={campaign.id}>
                  <td className="font-medium text-slate-900">{campaign.name}</td>
                  <td>
                    {campaign.status === 'Sent' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700">
                        {campaign.status}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                        {campaign.status}
                      </span>
                    )}
                  </td>
                  <td className="text-sm text-slate-600">
                    {campaign.sentDate ? new Date(campaign.sentDate).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    }) : '-'}
                  </td>
                  <td className="text-sm text-slate-600">{campaign.opens}</td>
                  <td className="text-sm text-slate-600">{campaign.clicks}</td>
                  <td className="text-right">
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                      {campaign.status === 'Draft' ? 'Edit' : 'View Report'}
                    </button>
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
