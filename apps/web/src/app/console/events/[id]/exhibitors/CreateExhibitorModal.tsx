'use client';

import { useState, useTransition } from 'react';
import { createExhibitor } from './actions';

interface CreateExhibitorModalProps {
  eventId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateExhibitorModal({ eventId, isOpen, onClose }: CreateExhibitorModalProps) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState('');
  const [tier, setTier] = useState('standard');
  const [description, setDescription] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [boothNumber, setBoothNumber] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [website, setWebsite] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await createExhibitor(eventId, {
        name,
        tier,
        description,
        logoUrl,
        boothNumber,
        contactEmail,
        website,
      });
      if (res.success) {
        onClose();
        setName('');
        setTier('standard');
        setDescription('');
        setLogoUrl('');
        setBoothNumber('');
        setContactEmail('');
        setWebsite('');
      } else {
        alert(res.error || 'Failed to create exhibitor.');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-scale-up">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-bold text-slate-900">Add Exhibitor / Sponsor</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2">
              <label className="text-xs font-semibold text-slate-700">Company Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Acme Tech Corp"
                className="ef-input"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Sponsorship Tier</label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value)}
                className="ef-input"
              >
                <option value="platinum">Platinum</option>
                <option value="gold">Gold</option>
                <option value="silver">Silver</option>
                <option value="standard">Standard</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Booth Number</label>
              <input
                type="text"
                value={boothNumber}
                onChange={(e) => setBoothNumber(e.target.value)}
                placeholder="e.g. A-12"
                className="ef-input"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Contact Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="e.g. sponsors@acme.com"
                className="ef-input"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Website</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://..."
                className="ef-input"
              />
            </div>

            <div className="space-y-1.5 col-span-2">
              <label className="text-xs font-semibold text-slate-700">Logo Image URL</label>
              <input
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://..."
                className="ef-input font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5 col-span-2">
              <label className="text-xs font-semibold text-slate-700">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the exhibitor..."
                className="ef-input resize-none"
                rows={3}
              />
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
              {isPending ? 'Adding...' : 'Add Exhibitor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
