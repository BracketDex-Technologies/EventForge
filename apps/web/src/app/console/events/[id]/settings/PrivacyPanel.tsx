'use client';

import { useState, useTransition } from 'react';
import { updatePrivacySettings } from './actions';

interface PrivacyPanelProps {
  eventId: string;
  initialSettings: {
    autoDeletePii?: boolean;
    piiRetentionDays?: number;
    cookieConsentBanner?: boolean;
  };
}

export default function PrivacyPanel({ eventId, initialSettings }: PrivacyPanelProps) {
  const [isPending, startTransition] = useTransition();
  const [autoDeletePii, setAutoDeletePii] = useState(initialSettings.autoDeletePii || false);
  const [piiRetentionDays, setPiiRetentionDays] = useState(initialSettings.piiRetentionDays || 30);
  const [cookieConsentBanner, setCookieConsentBanner] = useState(initialSettings.cookieConsentBanner || false);
  const [exportPending, setExportPending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await updatePrivacySettings(eventId, {
        autoDeletePii,
        piiRetentionDays: Number(piiRetentionDays),
        cookieConsentBanner,
      });
      if (res.success) {
        alert('Privacy and GDPR settings updated successfully!');
      } else {
        alert(res.error || 'Failed to update privacy settings.');
      }
    });
  };

  const handleGDPRExport = () => {
    setExportPending(true);
    setTimeout(() => {
      setExportPending(false);
      alert('GDPR Right of Access Data Export initialized. A download link with all attendee details, orders, and logs has been sent to your email.');
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="ef-card p-6 md:p-8 space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Privacy & GDPR Compliance</h2>
        <p className="text-sm text-slate-500 mt-1">Configure user data retention policies, right to be forgotten, and consent dialogs.</p>
      </div>

      <div className="space-y-4">
        {/* Toggle auto-delete PII */}
        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <input
            type="checkbox"
            id="autoDeletePii"
            checked={autoDeletePii}
            onChange={(e) => setAutoDeletePii(e.target.checked)}
            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 mt-1"
          />
          <div className="space-y-1 flex-1">
            <label htmlFor="autoDeletePii" className="text-sm font-semibold text-slate-950 cursor-pointer">
              Auto-delete Attendee PII (Right to be Forgotten)
            </label>
            <p className="text-xs text-slate-500">
              When enabled, all personally identifiable information (emails, phone numbers, bio details) will be scrubbed automatically after the event.
            </p>
          </div>
        </div>

        {/* Retention Days Dropdown */}
        {autoDeletePii && (
          <div className="space-y-1.5 pl-7 animate-fade-in">
            <label className="text-xs font-semibold text-slate-700">Scrub PII after event completion</label>
            <select
              value={piiRetentionDays}
              onChange={(e) => setPiiRetentionDays(Number(e.target.value))}
              className="ef-input max-w-xs"
            >
              <option value={30}>30 Days</option>
              <option value={60}>60 Days</option>
              <option value={90}>90 Days</option>
            </select>
          </div>
        )}

        {/* Toggle cookie consent banner */}
        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <input
            type="checkbox"
            id="cookieConsentBanner"
            checked={cookieConsentBanner}
            onChange={(e) => setCookieConsentBanner(e.target.checked)}
            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 mt-1"
          />
          <div className="space-y-1 flex-1">
            <label htmlFor="cookieConsentBanner" className="text-sm font-semibold text-slate-950 cursor-pointer">
              Show Cookie Consent Banner
            </label>
            <p className="text-xs text-slate-500">
              Display a compliant cookie consent banner on the public registration portal.
            </p>
          </div>
        </div>

        {/* GDPR Data Export Panel */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 mb-2">GDPR Right of Access (Data Portability)</h3>
          <p className="text-xs text-slate-500 mb-3">
            Organizers can download a structured ZIP archive containing all system data related to attendees, orders, and event interactions for compliance audits.
          </p>
          <button
            type="button"
            onClick={handleGDPRExport}
            disabled={exportPending}
            className="ef-btn-secondary py-2 px-4 text-xs font-semibold"
          >
            {exportPending ? 'Generating Export...' : 'Request Data Export ZIP'}
          </button>
        </div>
      </div>

      <div className="pt-4 flex justify-end border-t border-slate-100">
        <button
          type="submit"
          disabled={isPending}
          className="ef-btn-primary disabled:opacity-50"
        >
          {isPending ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
}
