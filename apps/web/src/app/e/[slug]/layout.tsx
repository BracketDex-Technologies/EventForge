import { prisma } from '@eventforge/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';

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
    <div className="min-h-screen flex flex-col font-sans" style={{ background: 'var(--ef-bg)' }}>
      {/* Premium Sticky Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-[rgba(0,0,0,0.03)] sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href={`/e/${event.id}`} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm"
                 style={{ background: 'var(--ef-primary-gradient)' }}>
              EF
            </div>
            <span className="font-bold text-base tracking-tight text-slate-900 hover:opacity-85 transition-opacity">
              {localeData?.title || event.name}
            </span>
          </Link>
          <nav className="flex gap-6 items-center text-xs font-semibold">
            <Link
              href={`/e/${event.id}`}
              className="text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Overview
            </Link>
            <Link
              href={`/e/${event.id}/agenda`}
              className="text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Agenda
            </Link>
            <Link
              href={`/e/${event.id}/polls`}
              className="text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Live Interaction
            </Link>
            <Link
              href={`/e/${event.id}/tickets`}
              className="ef-btn-primary"
              style={{ padding: '8px 20px', fontSize: '12px' }}
            >
              Get Tickets
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Premium Dark Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 px-6 border-t border-slate-800">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md flex items-center justify-center font-bold text-white text-xs"
                   style={{ background: 'var(--ef-primary-gradient)' }}>
                EF
              </div>
              <p className="font-bold text-white text-sm">{localeData?.title || event.name}</p>
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 ml-8">Powered by EventForge SaaS Engine</p>
          </div>
          <div className="flex gap-6 text-[12px]">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
