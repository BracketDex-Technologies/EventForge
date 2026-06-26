import { prisma } from '@eventforge/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import SettingsForm from './SettingsForm';

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) notFound();

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-2 text-sm mb-2 text-slate-400">
          <Link href={`/console/events/${id}`} className="hover:text-indigo-600 transition-colors">Event Dashboard</Link>
          <span>›</span>
          <span className="text-slate-600">Settings</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Event Settings</h2>
        <p className="mt-1 text-sm text-slate-500">Manage your event configuration and external integrations.</p>
      </div>

      <SettingsForm event={event} />
    </div>
  );
}
