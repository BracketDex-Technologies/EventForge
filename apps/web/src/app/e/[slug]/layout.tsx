import { prisma } from '@eventforge/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import PushSubscribePrompt from './PushSubscribePrompt';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);

  const event = await prisma.event.findFirst({
    where: isUuid ? { id: slug, deletedAt: null } : { id: slug, deletedAt: null },
    include: {
      locales: { where: { locale: 'en' } }
    }
  });

  if (!event) return {};

  const localeData = event.locales[0];
  const title = localeData?.title || event.name;
  const description = localeData?.summary || `Join us for ${event.name}. Plan, ticket, and run professional events with EventForge.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function PublicEventLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
  
  const event = await prisma.event.findFirst({
    where: isUuid ? { id: slug, deletedAt: null } : { id: slug, deletedAt: null },
    include: {
      locales: { where: { locale: 'en' } }
    }
  });

  if (!event) notFound();

  const localeData = event.locales[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href={`/e/${event.id}`} className="flex items-center gap-2.5">
            <Image src="/logo-icon.svg" alt="EventForge" width={28} height={28} />
            <span className="font-bold text-base tracking-tight text-slate-900">
              {localeData?.title || event.name}
            </span>
          </Link>
          <nav className="hidden md:flex gap-8 items-center text-sm font-medium">
            <Link href={`/e/${event.id}`} className="text-slate-600 hover:text-slate-900 transition-colors">
              Overview
            </Link>
            <Link href={`/e/${event.id}/agenda`} className="text-slate-600 hover:text-slate-900 transition-colors">
              Agenda
            </Link>
            <Link href={`/e/${event.id}/polls`} className="text-slate-600 hover:text-slate-900 transition-colors">
              Live
            </Link>
            <Link
              href={`/e/${event.id}/tickets`}
              className="ef-btn-primary text-xs px-5 py-2"
            >
              Get Tickets
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {children}
        <PushSubscribePrompt eventId={event.id} />
      </main>

      <footer className="bg-slate-900 text-slate-400 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <Image src="/logo-icon.svg" alt="EventForge" width={24} height={24} />
            <p className="font-bold text-white text-sm">{localeData?.title || event.name}</p>
          </div>
          <div className="flex gap-8 text-xs">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
          <p className="text-[11px] text-slate-500">Powered by EventForge</p>
        </div>
      </footer>
    </div>
  );
}
