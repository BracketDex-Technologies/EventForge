import { prisma } from '@eventforge/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import ReviewForm from './ReviewForm';
import StatusActionsForm from './StatusActionsForm';

export default async function AbstractDetailPage({
  params,
}: {
  params: Promise<{ id: string; abstractId: string }>;
}) {
  const { id, abstractId } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) notFound();

  const abstract = await prisma.abstract.findUnique({
    where: { id: abstractId },
    include: {
      reviews: true,
    },
  });

  if (!abstract || abstract.eventId !== id) notFound();

  const config = await prisma.cfpConfig.findUnique({
    where: { eventId: id },
  });

  const defaultCriteria = [
    { id: 'relevance', label: 'Relevance to Event', maxScore: 5 },
    { id: 'originality', label: 'Originality & Novelty', maxScore: 5 },
    { id: 'clarity', label: 'Clarity of Abstract', maxScore: 5 },
  ];

  const reviewCriteria = (config?.reviewCriteria as any[]) || defaultCriteria;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const userReview = abstract.reviews.find(r => r.reviewerId === user?.id);

  // If blind review is enabled and user is a reviewer, hide author info
  // (unless the user is the owner / has permission, but let's keep it simple: if blindReview is true, we hide author email/name/bio from page for reviewer review phase)
  const showAuthorInfo = !config?.blindReview || abstract.status === 'accepted' || abstract.status === 'rejected';

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <div className="flex items-center gap-2 text-sm mb-2 text-slate-400">
          <Link href={`/console/events/${id}`} className="hover:text-indigo-600 transition-colors">Event Dashboard</Link>
          <span>›</span>
          <Link href={`/console/events/${id}/cfp`} className="hover:text-indigo-600 transition-colors">CFP</Link>
          <span>›</span>
          <span className="text-slate-600">Submission Details</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Abstract Review</h2>
        <p className="mt-1 text-sm text-slate-500">Read the submission and provide blind scores, or update decision status.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Proposal Details Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="ef-card p-6 space-y-5">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1">
                <span className="ef-badge ef-badge-neutral capitalize text-[10px]">
                  {abstract.sessionType}
                </span>
                <h3 className="text-xl font-bold text-slate-900">{abstract.title}</h3>
              </div>
              
              <div className="text-right">
                <p className="text-xs text-slate-400 font-medium">Average Score</p>
                <p className="text-2xl font-extrabold text-indigo-600 mt-0.5">
                  {abstract.avgScore !== null ? abstract.avgScore.toFixed(1) : '-'}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <label className="text-xs font-bold text-slate-400 block mb-1">Description / Proposal</label>
              <div className="text-slate-700 text-sm whitespace-pre-line leading-relaxed">
                {abstract.description}
              </div>
            </div>

            {abstract.tags && abstract.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {abstract.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {abstract.attachmentUrl && (
              <div className="bg-indigo-50/50 border border-indigo-100/50 rounded-xl p-4 flex justify-between items-center">
                <span className="text-xs font-semibold text-indigo-950">Attachment file included</span>
                <a
                  href={abstract.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ef-btn-secondary py-1.5 px-3 text-xs font-bold bg-white text-indigo-600 hover:text-indigo-700"
                >
                  Download File
                </a>
              </div>
            )}

            <div className="border-t border-slate-100 pt-4 grid grid-cols-2 gap-4 bg-slate-50/50 -mx-6 -mb-6 p-6">
              <div>
                <p className="text-xs text-slate-400 font-bold mb-1">Author Details</p>
                {showAuthorInfo ? (
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-slate-900">{abstract.authorName}</p>
                    <p className="text-xs text-slate-500">{abstract.authorEmail}</p>
                    {abstract.authorBio && <p className="text-xs text-slate-400 mt-1 italic line-clamp-2">{abstract.authorBio}</p>}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">🔐 Blind Review Active (Author details hidden)</p>
                )}
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold mb-1">Submission Info</p>
                <p className="text-xs text-slate-600 font-medium">Submitted on: {new Date(abstract.submittedAt).toLocaleDateString()}</p>
                <p className="text-xs text-slate-600 font-medium mt-1">Status: <span className="capitalize font-semibold text-slate-900">{abstract.status.replace('_', ' ')}</span></p>
              </div>
            </div>
          </div>

          {/* List of existing Reviews */}
          <div className="ef-card p-6 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Reviews ({abstract.reviews.length})</h4>
            {abstract.reviews.length === 0 ? (
              <p className="text-xs text-slate-400">No reviews submitted yet.</p>
            ) : (
              <div className="space-y-4 divide-y divide-slate-100">
                {abstract.reviews.map((rev) => (
                  <div key={rev.id} className="pt-3 first:pt-0 space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-semibold text-slate-500">Reviewer: {rev.reviewerId.substring(0, 8)}...</p>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        rev.recommend === 'accept' ? 'bg-emerald-100 text-emerald-800' :
                        rev.recommend === 'reject' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {rev.recommend}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(rev.scores as Record<string, number>).map(([cId, val]) => {
                        const label = reviewCriteria.find(c => c.id === cId)?.label || cId;
                        return (
                          <div key={cId} className="bg-slate-50 p-2 rounded border border-slate-100/50">
                            <span className="text-[10px] text-slate-400 font-bold block truncate">{label}</span>
                            <span className="text-xs text-slate-900 font-extrabold">{val}</span>
                          </div>
                        );
                      })}
                    </div>
                    {rev.comment && <p className="text-xs text-slate-600 italic mt-1 bg-slate-50 p-2.5 rounded-lg">"{rev.comment}"</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Reviewer Scoring & Status Actions Column */}
        <div className="space-y-6">
          {/* scoring form */}
          <div className="ef-card p-6 space-y-4">
            <h4 className="text-sm font-bold text-slate-900">Submit Your Review</h4>
            <p className="text-xs text-slate-400">Rate the abstract across event criteria.</p>
            
            <ReviewForm 
              eventId={id} 
              abstractId={abstractId}
              criteria={reviewCriteria}
              initialReview={userReview ? {
                scores: userReview.scores as Record<string, number>,
                comment: userReview.comment || '',
                recommend: userReview.recommend,
              } : undefined}
            />
          </div>

          {/* status decider form */}
          <div className="ef-card p-6 space-y-4 bg-slate-50/50 border border-slate-200">
            <h4 className="text-sm font-bold text-slate-900">Decision & Action</h4>
            <p className="text-xs text-slate-400">Organizers can accept, reject, or convert this proposal into an agenda session speaker.</p>
            
            <StatusActionsForm 
              eventId={id} 
              abstract={abstract} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
