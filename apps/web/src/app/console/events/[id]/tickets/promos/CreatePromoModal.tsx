'use client';

import { useState, useTransition } from 'react';
import { createPromoCode } from './actions';

interface CreatePromoModalProps {
  eventId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function CreatePromoModal({ eventId, isOpen, onClose }: CreatePromoModalProps) {
  const [isPending, startTransition] = useTransition();
  const [code, setCode] = useState('');
  const [kind, setKind] = useState('percent');
  const [value, setValue] = useState(10);
  const [maxUses, setMaxUses] = useState(0);
  const [validFrom, setValidFrom] = useState('');
  const [validTo, setValidTo] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await createPromoCode(eventId, {
        code,
        kind,
        value: Number(value),
        maxUses: Number(maxUses),
        validFrom: validFrom || null,
        validTo: validTo || null,
      });
      if (res.success) {
        onClose();
        setCode('');
        setKind('percent');
        setValue(10);
        setMaxUses(0);
        setValidFrom('');
        setValidTo('');
      } else {
        alert(res.error || 'Failed to create promo code.');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-scale-up">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-bold text-slate-900">Create Promo Code</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Promo Code Name *</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. EARLYBIRD20"
                className="ef-input font-mono font-semibold tracking-wider"
                required
              />
              <p className="text-[10px] text-slate-400">Code will be automatically converted to uppercase.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Discount Type</label>
                <select
                  value={kind}
                  onChange={(e) => setKind(e.target.value)}
                  className="ef-input"
                >
                  <option value="percent">Percentage (%)</option>
                  <option value="flat">Flat Amount</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Discount Value *</label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(Number(e.target.value))}
                  placeholder={kind === 'percent' ? 'e.g. 20' : 'e.g. 15'}
                  min={0}
                  className="ef-input"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Max Uses (0 = unlimited)</label>
              <input
                type="number"
                value={maxUses}
                onChange={(e) => setMaxUses(Number(e.target.value))}
                min={0}
                className="ef-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Valid From</label>
                <input
                  type="datetime-local"
                  value={validFrom}
                  onChange={(e) => setValidFrom(e.target.value)}
                  className="ef-input"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Valid To</label>
                <input
                  type="datetime-local"
                  value={validTo}
                  onChange={(e) => setValidTo(e.target.value)}
                  className="ef-input"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="ef-btn-primary disabled:opacity-50"
            >
              {isPending ? 'Creating...' : 'Create Promo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
