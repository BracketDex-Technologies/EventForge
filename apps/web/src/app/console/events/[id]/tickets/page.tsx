import { prisma } from '@eventforge/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import CreateTicketButton from './CreateTicketButton';

export default async function TicketsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) notFound();

  const tickets = await prisma.ticketType.findMany({
    where: { eventId: id, deletedAt: null },
    orderBy: { sort: 'asc' },
    include: {
      _count: {
        select: {
          tickets: true,
        }
      }
    }
  });

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div className="animate-fade-in-up">
          <div className="flex items-center gap-2 text-sm mb-2 text-slate-400">
            <Link href={`/console/events/${id}`} className="hover:text-indigo-600 transition-colors">Event Dashboard</Link>
            <span>›</span>
            <span className="text-slate-600">Tickets</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Manage Tickets</h2>
          <p className="mt-1 text-sm text-slate-500">Configure ticket tiers, pricing, and availability.</p>
        </div>
        <div className="animate-fade-in-up">
          <CreateTicketButton eventId={id} />
        </div>
      </div>

      <div className="flex border-b border-slate-200 gap-6 text-sm">
        <Link href={`/console/events/${id}/tickets`} className="border-b-2 border-indigo-600 pb-3 font-semibold text-indigo-600">Ticket Tiers</Link>
        <Link href={`/console/events/${id}/tickets/promos`} className="border-b-2 border-transparent pb-3 font-medium text-slate-500 hover:text-slate-900">Promo Codes</Link>
      </div>

      <div className="ef-card animate-fade-in-up delay-200">
        {tickets.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-14 h-14 rounded-xl mx-auto mb-4 bg-slate-100 text-slate-500 flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
              </svg>
            </div>
            <p className="text-base font-semibold text-slate-900">No ticket types found</p>
            <p className="text-sm text-slate-500 mt-1">
              Create your first ticket tier to start accepting registrations.
            </p>
          </div>
        ) : (
          <table className="ef-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Price</th>
                <th>Sold / Capacity</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td className="font-semibold text-slate-900">{ticket.name}</td>
                  <td className="capitalize text-slate-600">{ticket.kind}</td>
                  <td className="text-slate-900 font-medium">
                    {ticket.kind === 'free' ? 'Free' : `${Number(ticket.priceCents) / 100} ${ticket.currency.toUpperCase()}`}
                  </td>
                  <td className="text-slate-600">
                    {ticket._count.tickets} / {ticket.quantityTotal === 0 ? 'Unlimited' : ticket.quantityTotal}
                  </td>
                  <td className="text-right">
                    <button className="ef-btn-secondary text-xs px-3 py-1.5">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
