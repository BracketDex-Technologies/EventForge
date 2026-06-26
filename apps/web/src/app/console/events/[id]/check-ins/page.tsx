import { prisma } from '@eventforge/db';
import Link from 'next/link';

export default async function CheckInsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const tickets = await prisma.ticket.findMany({
    where: { eventId: id, status: { not: 'refunded' } },
    include: { ticketType: true }
  });

  const checkedInCount = tickets.filter(t => t.status === 'checked_in').length;
  const totalTickets = tickets.length;

  return (
    <div className="space-y-6 max-w-6xl animate-fade-in-up">
      {/* Header and Stats */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="ef-headline-lg">Check-ins & Attendees</h2>
          <p className="text-[13px] mt-0.5" style={{ color: 'var(--ef-text-muted)' }}>
            Real-time status check of registered ticket entries.
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--ef-text-muted)' }}>
              Checked In Ratio
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-0.5">
              {checkedInCount} <span className="text-sm font-normal" style={{ color: 'var(--ef-text-muted)' }}>/ {totalTickets} total</span>
            </p>
          </div>
          <Link 
            href={`/console/events/${id}/scanner`} 
            className="ef-btn-primary"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
            </svg>
            Launch QR Scanner
          </Link>
        </div>
      </div>

      {/* Main card */}
      <div className="ef-card overflow-hidden">
        {/* Search */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/30">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search attendee by name or ticket code..." 
              className="ef-input"
              style={{ paddingLeft: '36px' }}
            />
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                 style={{ color: 'var(--ef-text-muted)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
            </svg>
          </div>
        </div>
        
        {/* Attendees List */}
        {tickets.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(59,130,246,0.08) 100%)' }}>
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                   style={{ color: 'var(--ef-primary)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <p className="text-lg font-semibold" style={{ color: 'var(--ef-text-primary)' }}>
              No attendees found
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--ef-text-muted)' }}>
              Make sure tickets have been created and purchases are complete.
            </p>
          </div>
        ) : (
          <table className="ef-table">
            <thead>
              <tr>
                <th>Ticket Code</th>
                <th>Ticket Type</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="ef-card-hover">
                  <td className="font-mono font-semibold" style={{ color: 'var(--ef-text-primary)' }}>
                    {ticket.code}
                  </td>
                  <td style={{ color: 'var(--ef-text-secondary)' }}>
                    {ticket.ticketType?.name}
                  </td>
                  <td>
                    {ticket.status === 'checked_in' ? (
                      <span className="ef-badge ef-badge-success">Checked In</span>
                    ) : (
                      <span className="ef-badge ef-badge-warning">Pending</span>
                    )}
                  </td>
                  <td className="text-right">
                    {ticket.status !== 'checked_in' ? (
                      <button className="ef-btn-secondary" style={{ padding: '6px 14px', fontSize: '12px', borderColor: 'var(--ef-primary)', color: 'var(--ef-primary)' }}>
                        Check In
                      </button>
                    ) : (
                      <span className="text-[12px] font-semibold pr-3" style={{ color: 'var(--ef-text-muted)' }}>Checked In</span>
                    )}
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
