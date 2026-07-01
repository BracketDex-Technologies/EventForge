import { prisma } from '@eventforge/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import CreateExhibitorButton from './CreateExhibitorButton';
import ExhibitorRow from './ExhibitorRow';

export default async function ExhibitorsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) notFound();

  // Query exhibitors
  const exhibitors = await prisma.exhibitor.findMany({
    where: { eventId: id },
    orderBy: [{ tier: 'asc' }, { name: 'asc' }],
  });

  // Calculate statistics
  const totalExhibitors = exhibitors.length;
  const uniqueBooths = new Set(exhibitors.map((ex) => ex.boothNumber).filter(Boolean)).size;
  const totalLeads = exhibitors.reduce((acc, ex) => acc + ex.leadsCaptured, 0);

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div className="animate-fade-in-up">
          <div className="flex items-center gap-2 text-sm mb-2 text-slate-400">
            <Link href={`/console/events/${id}`} className="hover:text-indigo-600 transition-colors">Event Dashboard</Link>
            <span>›</span>
            <span className="text-slate-600">Exhibitors</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Exhibitors & Sponsors</h2>
          <p className="mt-1 text-sm text-slate-500">Manage event exhibitors, sponsor tiers, booth allocations, and lead retrieval stats.</p>
        </div>
        <div className="flex items-center gap-3 animate-fade-in-up">
          <Link href={`/console/events/${id}/exhibitors/leads/export`} className="ef-btn-secondary">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export Leads
          </Link>
          <CreateExhibitorButton eventId={id} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up delay-100">
        <div className="ef-card p-4">
          <p className="text-sm font-medium text-slate-500">Total Exhibitors</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalExhibitors}</h3>
        </div>
        <div className="ef-card p-4">
          <p className="text-sm font-medium text-slate-500">Booths Allocated</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{uniqueBooths}</h3>
        </div>
        <div className="ef-card p-4">
          <p className="text-sm font-medium text-slate-500">Total Leads Captured</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalLeads}</h3>
        </div>
      </div>

      <div className="ef-card animate-fade-in-up delay-200 overflow-hidden">
        {exhibitors.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-14 h-14 rounded-xl mx-auto mb-4 bg-slate-100 text-slate-500 flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72M6.75 18h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .414.336.75.75.75z" />
              </svg>
            </div>
            <p className="text-base font-semibold text-slate-900">No exhibitors yet</p>
            <p className="text-sm text-slate-500 mt-1">
              Add your first sponsor or exhibitor to display them here.
            </p>
          </div>
        ) : (
          <table className="ef-table">
            <thead>
              <tr>
                <th className="py-3 px-6 text-left">Company</th>
                <th className="py-3 px-6 text-left">Sponsorship Tier</th>
                <th className="py-3 px-6 text-left">Booth</th>
                <th className="py-3 px-6 text-left">Contact Email</th>
                <th className="py-3 px-6 text-left">Leads Captured</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {exhibitors.map((exhibitor) => (
                <ExhibitorRow
                  key={exhibitor.id}
                  eventId={id}
                  exhibitor={exhibitor}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
