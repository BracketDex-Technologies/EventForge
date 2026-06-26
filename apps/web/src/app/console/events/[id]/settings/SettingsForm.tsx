'use client';

import { useState, useTransition } from 'react';
import { updateEventDetails, updateEventIntegrations } from './actions';
import EmailProviderPanel from './EmailProviderPanel';
import EmbedCodePanel from './EmbedCodePanel';
import PrivacyPanel from './PrivacyPanel';

interface EventDetailsProps {
  event: {
    id: string;
    name: string;
    type: string;
    status: string;
    timezone: string;
    currency: string;
    settings: any;
  };
}

type TabType = 'general' | 'integrations' | 'email' | 'embed' | 'privacy';

export default function SettingsForm({ event }: EventDetailsProps) {
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<TabType>('general');

  // General State
  const [name, setName] = useState(event.name);
  const [type, setType] = useState(event.type);
  const [status, setStatus] = useState(event.status);
  const [timezone, setTimezone] = useState(event.timezone);
  const [currency, setCurrency] = useState(event.currency);

  // Integrations State
  const initialWebhookUrl = event.settings?.webhookUrl || '';
  const initialWebhookSecret = event.settings?.webhookSecret || '';
  const [webhookUrl, setWebhookUrl] = useState(initialWebhookUrl);
  const [webhookSecret, setWebhookSecret] = useState(initialWebhookSecret);

  const handleGeneralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await updateEventDetails(event.id, { name, type, status, timezone, currency });
      if (res.success) {
        alert('Event details updated successfully!');
      } else {
        alert(res.error || 'Failed to update event.');
      }
    });
  };

  const handleIntegrationsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await updateEventIntegrations(event.id, { webhookUrl, webhookSecret });
      if (res.success) {
        alert('Integrations updated successfully!');
      } else {
        alert(res.error || 'Failed to update integrations.');
      }
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 shrink-0 space-y-1">
        <button
          onClick={() => setActiveTab('general')}
          className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'general' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          General Configuration
        </button>
        <button
          onClick={() => setActiveTab('integrations')}
          className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'integrations' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Integrations & Webhooks
        </button>
        <button
          onClick={() => setActiveTab('email')}
          className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'email' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Email Provider (BYOE)
        </button>
        <button
          onClick={() => setActiveTab('embed')}
          className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'embed' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Embed Registration
        </button>
        <button
          onClick={() => setActiveTab('privacy')}
          className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'privacy' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Privacy & GDPR
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-2xl">
        {activeTab === 'general' && (
          <form onSubmit={handleGeneralSubmit} className="ef-card p-6 md:p-8 space-y-6 animate-fade-in-up">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Event Details</h2>
              <p className="text-sm text-slate-500 mt-1">Update the core configuration for your event.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Event Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="ef-input" 
                  required 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Event Type</label>
                  <select value={type} onChange={(e) => setType(e.target.value)} className="ef-input">
                    <option value="in_person">In-Person</option>
                    <option value="virtual">Virtual</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className="ef-input">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="live">Live</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Timezone</label>
                  <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="ef-input">
                    <option value="UTC">UTC (Universal Time)</option>
                    <option value="America/New_York">EST (New York)</option>
                    <option value="America/Los_Angeles">PST (Los Angeles)</option>
                    <option value="Europe/London">GMT (London)</option>
                    <option value="Asia/Tokyo">JST (Tokyo)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Currency</label>
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="ef-input">
                    <option value="usd">USD ($)</option>
                    <option value="eur">EUR (€)</option>
                    <option value="gbp">GBP (£)</option>
                    <option value="jpy">JPY (¥)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end border-t border-slate-100">
              <button 
                type="submit" 
                disabled={isPending}
                className="ef-btn-primary disabled:opacity-50"
              >
                {isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}

        {activeTab === 'integrations' && (
          <form onSubmit={handleIntegrationsSubmit} className="ef-card p-6 md:p-8 space-y-6 animate-fade-in-up">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Webhooks (Integration Hub)</h2>
              <p className="text-sm text-slate-500 mt-1">Connect your event to external tools like HubSpot, Zapier, or Make.com.</p>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 flex gap-3 text-sm text-indigo-800">
              <svg className="w-5 h-5 text-indigo-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>Whenever an attendee registers or checks in, we will send a POST request with the JSON payload to the URL provided below.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Endpoint URL</label>
                <input 
                  type="url" 
                  value={webhookUrl} 
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://hooks.zapier.com/hooks/catch/..."
                  className="ef-input font-mono text-xs" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Webhook Secret</label>
                <input 
                  type="password" 
                  value={webhookSecret} 
                  onChange={(e) => setWebhookSecret(e.target.value)}
                  placeholder="Leave blank for no signature"
                  className="ef-input font-mono text-xs" 
                />
                <p className="text-[10px] text-slate-500 mt-1">If provided, we will sign the webhook payload using HMAC SHA-256 for verification.</p>
              </div>
            </div>

            <div className="pt-4 flex justify-end border-t border-slate-100">
              <button 
                type="submit" 
                disabled={isPending}
                className="ef-btn-primary disabled:opacity-50 bg-[#FF8552] hover:bg-[#ff966c] border-transparent text-slate-950"
              >
                {isPending ? 'Saving...' : 'Save Integrations'}
              </button>
            </div>
          </form>
        )}

        {activeTab === 'email' && (
          <EmailProviderPanel eventId={event.id} initialSettings={event.settings || {}} />
        )}

        {activeTab === 'embed' && (
          <EmbedCodePanel eventId={event.id} />
        )}

        {activeTab === 'privacy' && (
          <PrivacyPanel eventId={event.id} initialSettings={event.settings || {}} />
        )}
      </div>
    </div>
  );
}
