'use client';

import { useState, useTransition } from 'react';
import { createCampaign } from './actions';

interface CreateCampaignModalProps {
  eventId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateCampaignModal({ eventId, isOpen, onClose }: CreateCampaignModalProps) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [bodyHtml, setBodyHtml] = useState('');
  const [status, setStatus] = useState('draft');
  const [scheduledAt, setScheduledAt] = useState('');
  const [channel, setChannel] = useState('email');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await createCampaign(eventId, {
        name,
        subject,
        bodyHtml,
        status,
        channel,
        scheduledAt: status === 'scheduled' && scheduledAt ? scheduledAt : null,
      });
      if (res.success) {
        onClose();
        setName('');
        setSubject('');
        setBodyHtml('');
        setStatus('draft');
        setScheduledAt('');
        setChannel('email');
      } else {
        alert(res.error || 'Failed to create campaign.');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-scale-up">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-bold text-slate-900">Create Campaign</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Campaign Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Early Bird Announcement"
                className="ef-input"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Delivery Channel *</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  className="ef-input"
                >
                  <option value="email">Email</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="push">Push Notification</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="ef-input"
                >
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
            </div>

            {channel === 'email' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Email Subject Line *</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Get 20% off tickets until Monday!"
                  className="ef-input"
                  required
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                {channel === 'email' ? 'Email Body (HTML/Text) *' : channel === 'whatsapp' ? 'WhatsApp Template Message *' : 'Push Notification Body *'}
              </label>
              <textarea
                value={bodyHtml}
                onChange={(e) => setBodyHtml(e.target.value)}
                placeholder={channel === 'email' ? "<p>Hi team, welcome to our event...</p>" : channel === 'whatsapp' ? "Hello! Reminder that *{{1}}* starts in 1 hour. See you there!" : "Exciting news! The keynote speaker has been announced."}
                className="ef-input font-mono text-sm min-h-[150px]"
                rows={6}
                required
              />
            </div>
            {status === 'scheduled' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Send Date & Time *</label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="ef-input"
                  required
                />
              </div>
            )}
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
              {isPending ? 'Saving...' : 'Save Campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
