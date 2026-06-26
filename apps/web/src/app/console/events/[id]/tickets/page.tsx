import { prisma } from '@eventforge/db';

export default async function EventTicketsConsolePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const ticketTypes = await prisma.ticketType.findMany({
    where: { eventId: id, deletedAt: null },
  });

  return (
    <div className="space-y-6 max-w-6xl animate-fade-in-up">
      {/* Table Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="ef-headline-lg">Ticket Tiers</h2>
          <p className="text-[13px] mt-0.5" style={{ color: 'var(--ef-text-muted)' }}>
            Configure and monitor tickets sales and inventory limits.
          </p>
        </div>
        <button className="ef-btn-primary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Ticket Type
        </button>
      </div>

      {/* Ticket Table Card */}
      <div className="ef-card animate-fade-in-up delay-100">
        {ticketTypes.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(59,130,246,0.08) 100%)' }}>
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                   style={{ color: 'var(--ef-primary)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3m-3-6h1.5m-1.5 3h1.5m-1.5-3V6.75A2.25 2.25 0 019 4.5h9a2.25 2.25 0 012.25 2.25v10.5A2.25 2.25 0 0118 19.5H9a2.25 2.25 0 01-2.25-2.25V9zm-3 1.5H3.75A1.5 1.5 0 002.25 12v5.25a1.5 1.5 0 001.5 1.5H6a1.5 1.5 0 001.5-1.5V12A1.5 1.5 0 006 10.5H5.25" />
              </svg>
            </div>
            <p className="text-lg font-semibold" style={{ color: 'var(--ef-text-primary)' }}>
              No ticket types found
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--ef-text-muted)' }}>
              Create your first ticket type to begin selling event registrations.
            </p>
          </div>
        ) : (
          <table className="ef-table">
            <thead>
              <tr>
                <th>Ticket Name</th>
                <th>Price</th>
                <th>Availability</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ticketTypes.map((ticket) => (
                <tr key={ticket.id} className="ef-card-hover">
                  <td className="font-semibold" style={{ color: 'var(--ef-text-primary)' }}>
                    <div>
                      <p>{ticket.name}</p>
                      {ticket.description && (
                        <p className="text-[12px] font-normal mt-0.5" style={{ color: 'var(--ef-text-muted)' }}>
                          {ticket.description}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="font-semibold" style={{ color: 'var(--ef-text-primary)' }}>
                    ${(Number(ticket.priceCents) / 100).toFixed(2)}
                  </td>
                  <td>
                    {ticket.quantityTotal === 0 ? (
                      <span className="ef-badge ef-badge-neutral">Unlimited</span>
                    ) : (
                      <div className="space-y-1 max-w-[140px]">
                        <div className="flex justify-between text-[11px] font-semibold" style={{ color: 'var(--ef-text-secondary)' }}>
                          <span>{ticket.quantitySold} / {ticket.quantityTotal} sold</span>
                          <span>{Math.round((ticket.quantitySold / ticket.quantityTotal) * 100)}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div className="h-1.5 rounded-full"
                               style={{ width: `${Math.min(100, (ticket.quantitySold / ticket.quantityTotal) * 100)}%`, background: 'var(--ef-primary-gradient)' }} />
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 hover:bg-indigo-500/5"
                        style={{ color: 'var(--ef-primary)' }}
                      >
                        Edit
                      </button>
                    </div>
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
