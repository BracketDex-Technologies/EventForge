import { prisma } from '@eventforge/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import CfpConfigForm from './CfpConfigForm';

export default async function CfpDashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) notFound();

  // Fetch CFP Config
  let config = await prisma.cfpConfig.findUnique({
    where: { eventId: id },
  });

  // Fetch Abstracts
  const abstracts = await prisma.abstract.findMany({
    where: { eventId: id },
    orderBy: { submittedAt: 'desc' },
    include: {
      reviews: {
        select: {
          id: true,
        },
      },
    },
  });

  // Default criteria if none exist
  const defaultCriteria = [
    { id: 'relevance', label: 'Relevance to Event', maxScore: 5 },
    { id: 'originality', label: 'Originality & Novelty', maxScore: 5 },
    { id: 'clarity', label: 'Clarity of Abstract', maxScore: 5 },
  ];

  const reviewCriteria = (config?.reviewCriteria as any[]) || defaultCriteria;

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <div className="flex items-center gap-2 text-sm mb-2 text-slate-400">
          <Link href={`/console/events/${id}`} className="hover:text-indigo-600 transition-colors">Event Dashboard</Link>
          <span>›</span>
          <span className="text-slate-600">Call for Papers (CFP)</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Call for Papers & Abstract Management</h2>
        <p className="mt-1 text-sm text-slate-500">Configure public speaker submission guidelines, review criteria, and manage abstract approvals.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CFP Config Column */}
        <div className="lg:col-span-1">
          <div className="ef-card p-6 space-y-6">
            <div>
              <h3 className="text-base font-semibold text-slate-900">CFP Settings</h3>
              <p className="text-xs text-slate-400 mt-1">Configure status, deadlines and scoring rules.</p>
            </div>
            
            <CfpConfigForm 
              eventId={id} 
              initialConfig={{
                status: config?.status || 'draft',
                opensAt: config?.opensAt ? new Date(config.opensAt).toISOString().split('T')[0] : '',
                closesAt: config?.closesAt ? new Date(config.closesAt).toISOString().split('T')[0] : '',
                guidelines: config?.guidelines || '',
                maxSubmissions: config?.maxSubmissions ?? 3,
                blindReview: config?.blindReview ?? true,
                reviewCriteria,
              }}
            />
          </div>
        </div>

        {/* Submissions List Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="ef-card p-6">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Submitted Abstracts</h3>
                <p className="text-xs text-slate-400 mt-1">Review, score, and accept proposals.</p>
              </div>
              <Link 
                href={`/e/${id}/cfp`}
                target="_blank"
                className="ef-btn-secondary px-3 py-1.5 text-xs flex items-center gap-1.5"
              >
                Public CFP Form ↗
              </Link>
            </div>

            {abstracts.length === 0 ? (
              <div className="p-16 text-center border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
                <div className="w-14 h-14 rounded-xl mx-auto mb-4 bg-slate-100 text-slate-400 flex items-center justify-center">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 17.25V5.25A2.25 2.25 0 015.25 3h7.5c.621 0 1.125.504 1.125 1.125v3.5m0 0h5.25M12 7.5h.008v.008H12V7.5zm0 3h.008v.008H12v-.008zm0 3h.008v.008H12v-.008zm0 3h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-slate-700">No submissions yet</p>
                <p className="text-xs text-slate-400 mt-1">Abstracts submitted by speakers will appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="ef-table">
                  <thead>
                    <tr>
                      <th>Title / Author</th>
                      <th>Type</th>
                      <th>Avg Score</th>
                      <th>Reviews</th>
                      <th>Status</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {abstracts.map((ab) => {
                      const getStatusBadge = (status: string) => {
                        switch (status) {
                          case 'accepted':
                            return <span className="ef-badge ef-badge-success text-[10px]">Accepted</span>;
                          case 'rejected':
                            return <span className="ef-badge ef-badge-danger text-[10px]">Rejected</span>;
                          case 'under_review':
                            return <span className="ef-badge ef-badge-info text-[10px] animate-pulse">In Review</span>;
                          default:
                            return <span className="ef-badge ef-badge-neutral text-[10px]">Submitted</span>;
                        }
                      };

                      return (
                        <tr key={ab.id} className="hover:bg-slate-50/50 transition-colors">
                          <td>
                            <div className="space-y-0.5">
                              <p className="font-semibold text-slate-900 line-clamp-1">{ab.title}</p>
                              <p className="text-xs text-slate-500 font-medium">
                                {config?.blindReview ? 'Blind Author' : ab.authorName} ({ab.authorEmail})
                              </p>
                            </div>
                          </td>
                          <td className="capitalize text-xs font-semibold text-slate-600">{ab.sessionType}</td>
                          <td className="text-slate-900 font-bold text-sm">
                            {ab.avgScore !== null ? ab.avgScore.toFixed(1) : '-'}
                          </td>
                          <td className="text-slate-500 text-xs font-semibold">{ab.reviews.length} reviews</td>
                          <td>{getStatusBadge(ab.status)}</td>
                          <td className="text-right">
                            <Link
                              href={`/console/events/${id}/cfp/${ab.id}`}
                              className="ef-btn-secondary text-[11px] px-2.5 py-1.5 font-bold"
                            >
                              Review &rarr;
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
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
