'use client';

import { useState, useTransition } from 'react';
import { createSpeaker } from './actions';

interface CreateSpeakerModalProps {
  eventId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateSpeakerModal({ eventId, isOpen, onClose }: CreateSpeakerModalProps) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [bio, setBio] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [status, setStatus] = useState('invited');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await createSpeaker(eventId, { name, email, title, company, bio, photoUrl, status });
      if (res.success) {
        onClose();
        setName(''); setEmail(''); setTitle(''); setCompany(''); setBio(''); setPhotoUrl(''); setStatus('invited');
      } else {
        alert(res.error || 'Failed to create speaker.');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-bold text-slate-900">Add Speaker</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2">
              <label className="text-xs font-semibold text-slate-700">Full Name *</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Dr. Jane Smith" className="ef-input" required />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@example.com" className="ef-input" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="ef-input">
                <option value="invited">Invited</option>
                <option value="confirmed">Confirmed</option>
                <option value="declined">Declined</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Job Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="CTO" className="ef-input" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Company</label>
              <input type="text" value={company} onChange={e => setCompany(e.target.value)} placeholder="Acme Inc." className="ef-input" />
            </div>

            <div className="space-y-1.5 col-span-2">
              <label className="text-xs font-semibold text-slate-700">Photo URL</label>
              <input type="url" value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} placeholder="https://..." className="ef-input font-mono text-xs" />
            </div>

            <div className="space-y-1.5 col-span-2">
              <label className="text-xs font-semibold text-slate-700">Bio</label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Speaker biography..." className="ef-input resize-none" rows={3} />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900">Cancel</button>
            <button type="submit" disabled={isPending} className="ef-btn-primary disabled:opacity-50">
              {isPending ? 'Adding...' : 'Add Speaker'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
