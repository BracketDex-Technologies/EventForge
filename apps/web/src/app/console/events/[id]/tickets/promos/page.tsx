import { prisma } from '@eventforge/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import CreatePromoButton from './CreatePromoButton';
import PromoRow from './PromoRow';

export default async function PromosPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) notFound();

  // Query promo codes
  const promoCodes = await prisma.promoCode.findMany({
    where: { eventId: id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div className="animate-fade-in-up">
          <div className="flex items-center gap-2 text-sm mb-2 text-slate-400">
            <Link href={`/console/events/${id}`} className="hover:text-indigo-600 transition-colors">Event Dashboard</Link>
            <span>›</span>
            <Link href={`/console/events/${id}/tickets`} className="hover:text-indigo-600 transition-colors">Tickets</Link>
            <span>›</span>
            <span className="text-slate-600">Promo Codes</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Manage Tickets</h2>
          <p className="mt-1 text-sm text-slate-500">Configure ticket tiers, pricing, and availability.</p>
        </div>
        <div className="animate-fade-in-up">
          <CreatePromoButton eventId={id} />
        </div>
      </div>

      <div className="flex border-b border-slate-200 gap-6 text-sm">
        <Link href={`/console/events/${id}/tickets`} className="border-b-2 border-transparent pb-3 font-medium text-slate-500 hover:text-slate-900">Ticket Tiers</Link>
        <Link href={`/console/events/${id}/tickets/promos`} className="border-b-2 border-indigo-600 pb-3 font-semibold text-indigo-600">Promo Codes</Link>
      </div>

      <div className="ef-card animate-fade-in-up delay-200 overflow-hidden">
        {promoCodes.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-14 h-14 rounded-xl mx-auto mb-4 bg-slate-100 text-slate-500 flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a1.125 1.125 0 001.591 0l4.318-4.318a1.125 1.125 0 000-1.591L9.568 3.659A2.25 2.25 0 008.137 3zm1.5 5.25a1.125 1.125 0 11-2.25 0 1.125 1.125 0 012.25 0z" />
              </svg>
            </div>
            <p className="text-base font-semibold text-slate-900">No promo codes found</p>
            <p className="text-sm text-slate-500 mt-1">
              Create a promo code to offer ticket discounts to your attendees.
            </p>
          </div>
        ) : (
          <table className="ef-table">
            <thead>
              <tr>
                <th className="py-3 px-6 text-left">Code</th>
                <th className="py-3 px-6 text-left">Discount</th>
                <th className="py-3 px-6 text-left">Usage</th>
                <th className="py-3 px-6 text-left">Starts At</th>
                <th className="py-3 px-6 text-left">Expires At</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {promoCodes.map((promo) => (
                <PromoRow key={promo.id} eventId={id} promo={promo} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
