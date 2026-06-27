import { prisma } from '@eventforge/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import FloorPlanEditor from './FloorPlanEditor';

export default async function FloorPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) notFound();

  // Load existing floor plan
  const floorPlan = await prisma.floorPlan.findFirst({
    where: { eventId: id },
  });

  // Load exhibitors to assign to booths
  const exhibitors = await prisma.exhibitor.findMany({
    where: { eventId: id },
    orderBy: { name: 'asc' },
  });

  const defaultLayout = {
    width: 600,
    height: 400,
    booths: [
      { id: 'booth_1', x: 50, y: 50, w: 80, h: 80, label: 'Booth 101', exhibitorId: '' },
      { id: 'booth_2', x: 180, y: 50, w: 80, h: 80, label: 'Booth 102', exhibitorId: '' },
      { id: 'booth_3', x: 310, y: 50, w: 80, h: 80, label: 'Booth 103', exhibitorId: '' },
      { id: 'booth_4', x: 50, y: 200, w: 100, h: 100, label: 'Premium Booth A', exhibitorId: '' },
    ]
  };

  const initialFloorPlan = floorPlan ? {
    id: floorPlan.id,
    name: floorPlan.name,
    layout: floorPlan.layout as any,
    bgImageUrl: floorPlan.bgImageUrl,
  } : {
    id: null,
    name: 'Exhibition Hall A',
    layout: defaultLayout,
    bgImageUrl: '',
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <div className="flex items-center gap-2 text-sm mb-2 text-slate-400">
          <Link href={`/console/events/${id}`} className="hover:text-indigo-600 transition-colors">Event Dashboard</Link>
          <span>›</span>
          <span className="text-slate-600">Floor Plan</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Interactive Floor Plan Designer</h2>
        <p className="mt-1 text-sm text-slate-500">Design exhibit hall layouts, place sponsor booths, and assign exhibitor locations.</p>
      </div>

      <FloorPlanEditor
        eventId={id}
        initialFloorPlan={initialFloorPlan}
        exhibitors={exhibitors.map(ex => ({ id: ex.id, name: ex.name }))}
      />
    </div>
  );
}
// TS refresh

