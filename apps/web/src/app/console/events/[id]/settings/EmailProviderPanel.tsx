'use client';

import { useState, useTransition } from 'react';
import { updateEmailProvider } from './actions';

interface EmailProviderPanelProps {
  eventId: string;
  initialSettings: {
    emailProvider?: string;
    emailApiKey?: string;
    emailFromAddress?: string;
    emailFromName?: string;
  };
}

export default function EmailProviderPanel({ eventId, initialSettings }: EmailProviderPanelProps) {
  const [isPending, startTransition] = useTransition();
  const [emailProvider, setEmailProvider] = useState(initialSettings.emailProvider || 'default');
  const [emailApiKey, setEmailApiKey] = useState(initialSettings.emailApiKey || '');
  const [emailFromAddress, setEmailFromAddress] = useState(initialSettings.emailFromAddress || '');
  const [emailFromName, setEmailFromName] = useState(initialSettings.emailFromName || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await updateEmailProvider(eventId, {
        emailProvider,
        emailApiKey,
        emailFromAddress,
        emailFromName,
      });
      if (res.success) {
        alert('Email provider configuration updated successfully!');
      } else {
        alert(res.error || 'Failed to update email provider settings.');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="ef-card p-6 md:p-8 space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Email Delivery Provider (BYOE)</h2>
        <p className="text-sm text-slate-500 mt-1">
          Configure your own transactional email delivery service to maximize inbox delivery rates.
        </p>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 flex gap-3 text-sm text-indigo-800">
        <svg className="w-5 h-5 text-indigo-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="font-semibold">Prevent emails landing in the spam folder.</p>
          <p className="mt-0.5">By configuring custom API credentials, invitations and tickets are dispatched directly via your validated sending domain.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Email Service Provider</label>
          <select
            value={emailProvider}
            onChange={(e) => setEmailProvider(e.target.value)}
            className="ef-input"
          >
            <option value="default">Default Service (EventForge Shared Relay)</option>
            <option value="sendgrid">SendGrid API</option>
            <option value="resend">Resend API</option>
            <option value="ses">Amazon SES</option>
          </select>
        </div>

        {emailProvider !== 'default' && (
          <>
            <div className="space-y-1.5 animate-fade-in">
              <label className="text-xs font-semibold text-slate-700">API Key / Access Token</label>
              <input
                type="password"
                value={emailApiKey}
                onChange={(e) => setEmailApiKey(e.target.value)}
                placeholder="SG.xxxx or re_xxxx"
                className="ef-input font-mono text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4 animate-fade-in">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">From Name</label>
                <input
                  type="text"
                  value={emailFromName}
                  onChange={(e) => setEmailFromName(e.target.value)}
                  placeholder="e.g. Event Organizer"
                  className="ef-input"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">From Email Address</label>
                <input
                  type="email"
                  value={emailFromAddress}
                  onChange={(e) => setEmailFromAddress(e.target.value)}
                  placeholder="e.g. contact@yourdomain.com"
                  className="ef-input"
                  required
                />
              </div>
            </div>
          </>
        )}
      </div>

      <div className="pt-4 flex justify-end border-t border-slate-100">
        <button
          type="submit"
          disabled={isPending}
          className="ef-btn-primary disabled:opacity-50"
        >
          {isPending ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>
    </form>
  );
}
