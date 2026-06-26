import { prisma } from '@eventforge/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import PublicCfpForm from './PublicCfpForm';

export default async function PublicCfpPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);

  const event = await prisma.event.findFirst({
    where: isUuid ? { id: slug, deletedAt: null } : { id: slug, deletedAt: null },
  });

  if (!event) notFound();

  const config = await prisma.cfpConfig.findUnique({
    where: { eventId: event.id },
  });

  const isOpen = config?.status === 'open';

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Speaker Proposal</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Call for Papers (CFP)
          </h1>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            Submit your abstract to speak at <span className="font-semibold text-slate-700">{event.name}</span>.
          </p>
        </div>

        {/* Guidelines Card */}
        {config?.guidelines && (
          <div className="ef-card p-6 bg-slate-50/50 border border-slate-200/60">
            <h3 className="text-sm font-bold text-slate-900 mb-2.5">Submission Guidelines</h3>
            <div className="text-slate-600 text-xs leading-relaxed whitespace-pre-line">
              {config.guidelines}
            </div>
            {config.closesAt && (
              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-500">Submission Deadline:</span>
                <span className="text-rose-600">
                  {new Date(config.closesAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="ef-card p-6">
          {!isOpen ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 rounded-full mx-auto bg-amber-50 text-amber-500 flex items-center justify-center mb-3">
                🔒
              </div>
              <p className="text-sm font-bold text-slate-900">Submission Closed</p>
              <p className="text-xs text-slate-400 mt-1">
                The Call for Papers is currently closed or has not opened yet. Check back later or contact the event organizer.
              </p>
              <Link
                href={`/e/${event.id}`}
                className="mt-4 inline-block ef-btn-secondary py-2 px-4 text-xs font-semibold"
              >
                Back to Event Home
              </Link>
            </div>
          ) : (
            <PublicCfpForm eventId={event.id} />
          )}
        </div>
      </div>
    </div>
  );
}
