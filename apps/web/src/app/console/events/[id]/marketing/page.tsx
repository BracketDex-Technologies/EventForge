import { prisma } from '@eventforge/db';

export default async function ConsoleMarketingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const campaigns = await prisma.campaign.findMany({
    where: { eventId: id },
    orderBy: { createdAt: 'desc' }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <span className="ef-badge ef-badge-success">Sent</span>;
      case 'scheduled':
        return <span className="ef-badge ef-badge-info">Scheduled</span>;
      default:
        return <span className="ef-badge ef-badge-neutral">Draft</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="ef-headline-lg">Marketing & Campaigns</h2>
          <p className="text-[13px] mt-0.5" style={{ color: 'var(--ef-text-muted)' }}>
            Design and send custom email updates to your attendee list.
          </p>
        </div>
        <button className="ef-btn-primary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Campaign
        </button>
      </div>

      {/* Campaigns list card */}
      <div className="ef-card animate-fade-in-up delay-100">
        {campaigns.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(59,130,246,0.08) 100%)' }}>
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                   style={{ color: 'var(--ef-primary)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <p className="text-lg font-semibold" style={{ color: 'var(--ef-text-primary)' }}>
              No marketing campaigns
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--ef-text-muted)' }}>
              Create your first email campaign to connect with your attendees.
            </p>
          </div>
        ) : (
          <table className="ef-table">
            <thead>
              <tr>
                <th>Campaign details</th>
                <th>Status</th>
                <th>Sent / Scheduled</th>
                <th>Audience Engagement</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="ef-card-hover">
                  <td>
                    <div>
                      <p className="font-semibold text-gray-900">{campaign.name}</p>
                      <p className="text-[12px] font-normal mt-0.5" style={{ color: 'var(--ef-text-muted)' }}>
                        Subject: {(campaign.subject as any)?.en || 'No subject'}
                      </p>
                    </div>
                  </td>
                  <td>
                    {getStatusBadge(campaign.status)}
                  </td>
                  <td style={{ color: 'var(--ef-text-secondary)' }}>
                    {campaign.scheduledAt 
                      ? new Date(campaign.scheduledAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                      : new Date(campaign.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td>
                    <div className="flex items-center gap-4 text-xs font-semibold" style={{ color: 'var(--ef-text-secondary)' }}>
                      <span className="flex items-center gap-1" title="Recipients">
                        👤 {campaign.recipientCount}
                      </span>
                      <span className="flex items-center gap-1 text-emerald-600" title="Opens">
                        📖 {campaign.openCount}
                      </span>
                      <span className="flex items-center gap-1 text-indigo-600" title="Clicks">
                        👆 {campaign.clickCount}
                      </span>
                      {campaign.bounceCount > 0 && (
                        <span className="flex items-center gap-1 text-red-600" title="Bounces">
                          ❌ {campaign.bounceCount}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="text-right">
                    <button
                      className="text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 hover:bg-indigo-500/5"
                      style={{ color: 'var(--ef-primary)' }}
                    >
                      View
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
