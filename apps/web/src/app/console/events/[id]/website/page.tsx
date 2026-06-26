import { prisma } from '@eventforge/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import PageBuilderDesigner from './PageBuilderDesigner';

export default async function WebsiteBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) notFound();

  // Load the main landing page (slug = 'index')
  let page = await prisma.eventPage.findUnique({
    where: {
      eventId_slug: { eventId: id, slug: 'index' },
    },
  });

  const defaultBlocks = [
    {
      id: 'hero',
      type: 'Hero',
      title: event.name,
      subtitle: 'Join us for this production-grade learning experience!',
      bgColor: '#1e293b',
      textColor: '#ffffff',
      buttonText: 'Get Tickets Now',
    },
    {
      id: 'speakers',
      type: 'Speakers',
      title: 'Expert Speakers',
      subtitle: 'Learn from industry leaders guiding the future.',
    },
    {
      id: 'agenda',
      type: 'Agenda',
      title: 'Event Schedule',
      subtitle: 'Full timetable of keynotes, workshops, and panels.',
    },
    {
      id: 'faq',
      type: 'FAQ',
      title: 'Frequently Asked Questions',
      questions: [
        { q: 'Is this event virtual or in-person?', a: 'This is a hybrid event with both in-person and online access!' },
        { q: 'Can I get a refund on my ticket?', a: 'Yes, full refunds are available up to 7 days before the event starts.' }
      ]
    }
  ];

  const currentBlocks = page ? (page.builderDoc as any[]) : defaultBlocks;

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <div className="flex items-center gap-2 text-sm mb-2 text-slate-400">
          <Link href={`/console/events/${id}`} className="hover:text-indigo-600 transition-colors">Event Dashboard</Link>
          <span>›</span>
          <span className="text-slate-600">Website Builder</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">No-Code Website Builder</h2>
        <p className="mt-1 text-sm text-slate-500">Design a custom, block-based landing page for your event without any code.</p>
      </div>

      <PageBuilderDesigner 
        eventId={id} 
        initialBlocks={currentBlocks} 
        isPublished={!!page?.publishedDoc}
      />
    </div>
  );
}
