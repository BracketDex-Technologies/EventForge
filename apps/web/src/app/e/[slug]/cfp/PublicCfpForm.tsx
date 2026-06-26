'use client';

import { useState, useTransition } from 'react';
import { submitAbstract } from '@/app/console/events/[id]/cfp/actions';

export default function PublicCfpForm({ eventId }: { eventId: string }) {
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [authorBio, setAuthorBio] = useState('');
  const [sessionType, setSessionType] = useState('talk');
  const [tagsInput, setTagsInput] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const tags = tagsInput
        .split(',')
        .map(t => t.trim().toLowerCase())
        .filter(t => t.length > 0);

      const res = await submitAbstract(eventId, {
        title,
        description,
        authorName,
        authorEmail,
        authorBio: authorBio || undefined,
        sessionType,
        tags,
        attachmentUrl: attachmentUrl || undefined,
      });

      if (res.success) {
        setSubmitted(true);
      } else {
        alert(res.error || 'Failed to submit proposal.');
      }
    });
  };

  if (submitted) {
    return (
      <div className="p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full mx-auto bg-emerald-50 text-emerald-500 flex items-center justify-center text-xl">
          ✓
        </div>
        <h3 className="text-lg font-bold text-slate-900">Submission Successful!</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Thank you for submitting your speaker proposal. The event organizers will review your abstract and contact you shortly.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setTitle('');
            setDescription('');
            setTagsInput('');
            setAttachmentUrl('');
          }}
          className="ef-btn-secondary py-2 px-4 text-xs font-semibold"
        >
          Submit Another Proposal
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5 col-span-2 md:col-span-1">
          <label className="text-xs font-bold text-slate-700">Your Full Name</label>
          <input
            type="text"
            required
            value={authorName}
            onChange={e => setAuthorName(e.target.value)}
            placeholder="Jane Doe"
            className="ef-input text-xs"
          />
        </div>
        <div className="space-y-1.5 col-span-2 md:col-span-1">
          <label className="text-xs font-bold text-slate-700">Email Address</label>
          <input
            type="email"
            required
            value={authorEmail}
            onChange={e => setAuthorEmail(e.target.value)}
            placeholder="jane@example.com"
            className="ef-input text-xs"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700">Speaker Biography</label>
        <textarea
          value={authorBio}
          onChange={e => setAuthorBio(e.target.value)}
          placeholder="Brief professional summary about yourself (education, company, speaking experience)..."
          className="ef-input text-xs min-h-[70px]"
        />
      </div>

      <div className="h-px bg-slate-100 my-4" />

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700">Session/Talk Title</label>
        <input
          type="text"
          required
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="e.g. Masterclass on Next.js 15 Server Actions"
          className="ef-input text-xs"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5 col-span-2 md:col-span-1">
          <label className="text-xs font-bold text-slate-700">Session Type</label>
          <select
            value={sessionType}
            onChange={e => setSessionType(e.target.value)}
            className="ef-input text-xs"
          >
            <option value="talk">Standard Talk (45 min)</option>
            <option value="keynote">Keynote Address (30 min)</option>
            <option value="workshop">Interactive Workshop (90 min)</option>
            <option value="panel">Panel Discussion (60 min)</option>
          </select>
        </div>
        <div className="space-y-1.5 col-span-2 md:col-span-1">
          <label className="text-xs font-bold text-slate-700">Tags / Topics (Comma separated)</label>
          <input
            type="text"
            value={tagsInput}
            onChange={e => setTagsInput(e.target.value)}
            placeholder="nextjs, react, frontend"
            className="ef-input text-xs"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700">Abstract Summary / Proposal Details</label>
        <textarea
          required
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Provide a comprehensive summary of what your session will cover, key takeaways, and why it is valuable to attendees..."
          className="ef-input text-xs min-h-[140px]"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700">Attachment / Slides URL (Optional)</label>
        <input
          type="url"
          value={attachmentUrl}
          onChange={e => setAttachmentUrl(e.target.value)}
          placeholder="https://drive.google.com/file/... or link to draft slides"
          className="ef-input text-xs"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="ef-btn-primary w-full py-2.5 text-xs font-bold mt-2"
      >
        {isPending ? 'Submitting Proposal...' : 'Submit Speaker Proposal'}
      </button>
    </form>
  );
}
