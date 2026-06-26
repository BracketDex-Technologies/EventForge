'use client';

import { useState, useTransition } from 'react';
import { sendPushNotification } from './actions';

export default function BroadcastPushForm({ eventId }: { eventId: string }) {
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    startTransition(async () => {
      const res = await sendPushNotification(eventId, {
        title,
        body,
        url: url || undefined,
      });

      if (res.success) {
        alert('Notification broadcasted successfully!');
        setTitle('');
        setBody('');
        setUrl('');
      } else {
        alert(res.error || 'Failed to send notification.');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700">Notification Title *</label>
        <input
          type="text"
          required
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="e.g. Session Starting in 5 Minutes!"
          className="ef-input text-xs"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700">Message Body *</label>
        <textarea
          required
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="e.g. Join room A for the opening keynote presentation on AI."
          className="ef-input text-xs min-h-[70px]"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700">Deep Link URL (Optional)</label>
        <input
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="e.g. https://example.com/e/agenda"
          className="ef-input text-xs"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="ef-btn-primary w-full py-2.5 text-xs font-bold mt-2"
      >
        {isPending ? 'Sending Broadcast...' : '📣 Broadcast Alert'}
      </button>
    </form>
  );
}
