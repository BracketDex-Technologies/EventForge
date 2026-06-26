import { prisma } from '@eventforge/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function PublicTicketsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
  
  const event = await prisma.event.findFirst({
    where: isUuid ? { id: slug, deletedAt: null } : { id: slug, deletedAt: null },
    include: {
      ticketTypes: {
        where: { deletedAt: null }
      }
    }
  });

  if (!event) notFound();

  return (
    <div className="py-16 px-6 animate-fade-in-up">
      <div className="max-w-2xl mx-auto ef-card bg-white shadow-lg p-8 md:p-10 border border-slate-100">
        <div className="border-b border-slate-100 pb-5 mb-8">
          <h1 className="ef-headline-lg font-bold text-2xl">Select Tickets</h1>
          <p className="text-xs font-semibold mt-1" style={{ color: 'var(--ef-text-muted)' }}>
            Register for {event.name}
          </p>
        </div>

        <form action={`/e/${event.id}/checkout`} method="GET">
          <div className="space-y-4 mb-8">
            {event.ticketTypes.map(ticket => (
              <div key={ticket.id} 
                   className="flex items-center justify-between p-5 border border-slate-100 rounded-xl hover:border-indigo-500 transition-all bg-slate-50/30">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{ticket.name}</h3>
                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--ef-text-muted)' }}>
                    {ticket.description || 'General Admission Entry'}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-base text-indigo-600">${(Number(ticket.priceCents) / 100).toFixed(2)}</span>
                  <select 
                    name={`qty_${ticket.id}`} 
                    className="border border-slate-200 rounded-lg p-1.5 text-xs font-semibold bg-white outline-none focus:border-indigo-500" 
                    defaultValue="0"
                  >
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>
              </div>
            ))}
            
            {event.ticketTypes.length === 0 && (
              <p className="text-center text-xs font-semibold py-8" style={{ color: 'var(--ef-text-muted)' }}>
                No tickets are available at this time.
              </p>
            )}
          </div>

          <div className="border-t border-slate-100 pt-6 flex justify-between items-center">
            <Link href={`/e/${event.id}`} className="text-xs font-semibold hover:underline" style={{ color: 'var(--ef-text-secondary)' }}>
              &larr; Back to Overview
            </Link>
            <button 
              type="submit" 
              className="ef-btn-primary" 
              style={{ padding: '10px 24px', fontSize: '13px' }}
              disabled={event.ticketTypes.length === 0}
            >
              Proceed to Checkout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
