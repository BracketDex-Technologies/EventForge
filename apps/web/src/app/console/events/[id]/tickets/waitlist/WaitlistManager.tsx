'use client';

import { useState, useTransition } from 'react';
import { promoteWaitlistEntry, removeFromWaitlist, joinWaitlist } from './actions';

interface TicketType {
  id: string;
  name: string;
}

interface WaitlistEntry {
  id: string;
  ticketTypeId: string;
  email: string;
  position: number;
  promotedAt: string | null;
  createdAt: string;
  ticketType: {
    name: string;
  };
}

interface WaitlistManagerProps {
  eventId: string;
  entries: WaitlistEntry[];
  ticketTypes: TicketType[];
}

export default function WaitlistManager({ eventId, entries, ticketTypes }: WaitlistManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicketType, setSelectedTicketType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'promoted'>('all');

  // Manual addition state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addEmail, setAddEmail] = useState('');
  const [addTicketTypeId, setAddTicketTypeId] = useState(ticketTypes[0]?.id || '');

  const handlePromote = (entryId: string) => {
    if (!confirm('Are you sure you want to promote this attendee? This will release a ticket for them.')) return;
    startTransition(async () => {
      const res = await promoteWaitlistEntry(eventId, entryId);
      if (!res.success) alert(res.error || 'Failed to promote entry.');
    });
  };

  const handleRemove = (entryId: string) => {
    if (!confirm('Are you sure you want to remove this entry from the waitlist?')) return;
    startTransition(async () => {
      const res = await removeFromWaitlist(eventId, entryId);
      if (!res.success) alert(res.error || 'Failed to remove entry.');
    });
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addEmail.trim() || !addTicketTypeId) return;

    startTransition(async () => {
      const res = await joinWaitlist(eventId, addTicketTypeId, addEmail);
      if (res.success) {
        setAddEmail('');
        setShowAddModal(false);
      } else {
        alert(res.error || 'Failed to add to waitlist.');
      }
    });
  };

  const filtered = entries.filter(entry => {
    const matchesSearch = entry.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTicket = selectedTicketType === 'all' || entry.ticketTypeId === selectedTicketType;
    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'promoted' && entry.promotedAt !== null) ||
      (selectedStatus === 'pending' && entry.promotedAt === null);

    return matchesSearch && matchesTicket && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Filters & Add Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex flex-col sm:flex-row flex-1 items-stretch gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              placeholder="Search by email..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="ef-input pl-9 text-xs w-full"
            />
          </div>

          <select
            value={selectedTicketType}
            onChange={e => setSelectedTicketType(e.target.value)}
            className="ef-input text-xs"
          >
            <option value="all">All Ticket Types</option>
            {ticketTypes.map(tt => (
              <option key={tt.id} value={tt.id}>{tt.name}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value as any)}
            className="ef-input text-xs"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="promoted">Promoted / Released</option>
          </select>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="ef-btn-primary text-xs px-4 py-2 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Email manually
        </button>
      </div>

      {/* Main Table */}
      <div className="ef-card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto text-xl mb-4">
              ⏳
            </div>
            <p className="font-bold text-slate-800 text-sm">No waitlist entries found</p>
            <p className="text-xs text-slate-400 mt-1">
              Entries will appear here when registrations exceed capacity limit.
            </p>
          </div>
        ) : (
          <table className="ef-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Ticket Class</th>
                <th className="text-center">Queue Position</th>
                <th>Join Date</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(entry => {
                const isPromoted = !!entry.promotedAt;
                return (
                  <tr key={entry.id}>
                    <td className="font-semibold text-slate-900">{entry.email}</td>
                    <td className="text-slate-600 text-xs font-semibold">{entry.ticketType.name}</td>
                    <td className="text-center font-mono text-xs text-slate-500 font-bold">
                      {isPromoted ? '—' : `#${entry.position}`}
                    </td>
                    <td className="text-xs text-slate-500 font-semibold">
                      {new Date(entry.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td>
                      {isPromoted ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Promoted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          In Queue
                        </span>
                      )}
                    </td>
                    <td className="text-right space-x-2">
                      {!isPromoted && (
                        <button
                          onClick={() => handlePromote(entry.id)}
                          disabled={isPending}
                          className="ef-btn-secondary text-[11px] px-2.5 py-1 text-emerald-700 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 cursor-pointer"
                        >
                          Promote
                        </button>
                      )}
                      <button
                        onClick={() => handleRemove(entry.id)}
                        disabled={isPending}
                        className="ef-btn-secondary text-[11px] px-2.5 py-1 text-rose-600 border-rose-200 hover:bg-rose-50 hover:border-rose-300 cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-bold text-slate-900">Add to Waitlist</h3>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="ef-label">Attendee Email</label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={addEmail}
                  onChange={e => setAddEmail(e.target.value)}
                  className="ef-input text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="ef-label">Select Ticket Class</label>
                <select
                  value={addTicketTypeId}
                  onChange={e => setAddTicketTypeId(e.target.value)}
                  className="ef-input text-xs"
                >
                  {ticketTypes.map(tt => (
                    <option key={tt.id} value={tt.id}>{tt.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="ef-btn-secondary flex-1 cursor-pointer"
                  disabled={isPending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="ef-btn-primary flex-1 cursor-pointer"
                >
                  {isPending ? 'Adding...' : 'Add to Queue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
