'use client';

import { useState, useTransition } from 'react';
import { createTicketType } from './actions';

interface CreateTicketModalProps {
  eventId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateTicketModal({ eventId, isOpen, onClose }: CreateTicketModalProps) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState('');
  const [kind, setKind] = useState('paid');
  const [price, setPrice] = useState('0');
  const [quantityTotal, setQuantityTotal] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await createTicketType(eventId, {
        name,
        kind,
        price: parseFloat(price) || 0,
        quantityTotal: parseInt(quantityTotal) || 0, // 0 means unlimited
        description,
      });

      if (res.success) {
        onClose();
        // Reset form
        setName('');
        setKind('paid');
        setPrice('0');
        setQuantityTotal('');
        setDescription('');
      } else {
        alert(res.error || 'Failed to create ticket tier.');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create Ticket Tier</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Ticket Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="e.g. Early Bird, VIP Pass"
                className="ef-input" 
                required 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Ticket Type</label>
              <select value={kind} onChange={e => setKind(e.target.value)} className="ef-input">
                <option value="paid">Paid</option>
                <option value="free">Free</option>
                <option value="donation">Donation</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                <input 
                  type="number" 
                  step="0.01"
                  min="0"
                  value={price} 
                  onChange={e => setPrice(e.target.value)} 
                  disabled={kind === 'free'}
                  className="ef-input pl-7" 
                />
              </div>
            </div>

            <div className="space-y-1.5 col-span-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Capacity (0 for unlimited)</label>
              <input 
                type="number" 
                min="0"
                value={quantityTotal} 
                onChange={e => setQuantityTotal(e.target.value)} 
                placeholder="100"
                className="ef-input" 
              />
            </div>

            <div className="space-y-1.5 col-span-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Description (Optional)</label>
              <textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                placeholder="What does this ticket include?"
                className="ef-input resize-none" 
                rows={3}
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isPending}
              className="ef-btn-primary disabled:opacity-50"
            >
              {isPending ? 'Creating...' : 'Create Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
