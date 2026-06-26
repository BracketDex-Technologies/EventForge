'use client';

import { useState } from 'react';

interface EmbedCodePanelProps {
  eventId: string;
}

export default function EmbedCodePanel({ eventId }: EmbedCodePanelProps) {
  const [copied, setCopied] = useState(false);

  const embedScript = `<div id="eventforge-registration-widget" data-event-id="${eventId}"></div>\n<script src="https://cdn.eventforge.com/widgets/checkout.js" async defer></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="ef-card p-6 md:p-8 space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Embeddable Registration Widget</h2>
        <p className="text-sm text-slate-500 mt-1">
          Sell tickets directly on your own website, blog, or CMS (WordPress, Webflow, Squarespace).
        </p>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 flex gap-3 text-sm text-indigo-800">
        <svg className="w-5 h-5 text-indigo-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="font-semibold">Bypass Zoho Backstage's rigid builder limits.</p>
          <p className="mt-0.5">Simply copy and paste the snippet below into your site's HTML editor to embed a native, responsive checkout widget.</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold text-slate-700">Embed HTML Code</label>
          <button
            onClick={handleCopy}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.25 2.25 0 00-2.25 2.25v1.5a2.25 2.25 0 002.25 2.25H15a2.25 2.25 0 002.25-2.25v-1.5z" />
                </svg>
                Copy Snippet
              </>
            )}
          </button>
        </div>
        <pre className="bg-slate-900 text-slate-100 text-xs p-4 rounded-xl font-mono overflow-x-auto whitespace-pre border border-slate-800">
          {embedScript}
        </pre>
      </div>

      <div className="pt-4 border-t border-slate-100">
        <label className="text-xs font-semibold text-slate-700 block mb-3">Widget Preview Mockup</label>
        <div className="border border-slate-200 rounded-xl p-6 bg-slate-50 flex items-center justify-center min-h-[160px]">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm w-full max-w-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">General Admission</h4>
                <p className="text-xs text-slate-500 mt-0.5">Access to all keynotes and tracks.</p>
              </div>
              <span className="font-bold text-slate-900 text-sm">$49.00</span>
            </div>
            <button className="w-full bg-indigo-600 text-white rounded-lg py-2 text-xs font-bold hover:bg-indigo-700 transition-colors">
              Get Tickets
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
