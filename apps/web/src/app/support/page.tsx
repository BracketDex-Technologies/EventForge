'use client';

import { useState } from 'react';
import MarketingLayout, { useTheme } from '@/components/marketing-layout';

function SupportContent() {
  const { isDark, borderClass, cardBgClass, textPrimaryClass, textMutedClass } = useTheme();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('technical');
  const [message, setMessage] = useState('');

  const supportChannels = [
    {
      title: 'Email Support',
      desc: 'For billing, account issues, and technical support.',
      contact: 'support@eventforge.app',
      icon: (
        <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      )
    },
    {
      title: 'Live Chat',
      desc: 'Available Mon–Fri, 9 AM–6 PM EST for Premium and Ultimate plans.',
      contact: 'Access via Console',
      icon: (
        <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
        </svg>
      )
    },
    {
      title: 'Enterprise Support',
      desc: 'Dedicated technical account manager and SLA guarantees.',
      contact: 'enterprise@eventforge.app',
      icon: (
        <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.315 48.315 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
        </svg>
      )
    }
  ];

  const kbCategories = [
    { title: 'Getting Started', desc: 'Workspace setup, organization roles, and initial configuration.', count: 12 },
    { title: 'Ticketing & Payments', desc: 'Ticket tiers, Stripe integration, refunds, and promo codes.', count: 24 },
    { title: 'On-Site Operations', desc: 'QR check-in, badge printing, and gate control.', count: 18 },
    { title: 'Marketing & Campaigns', desc: 'Email templates, segmentation, and automated workflows.', count: 15 },
    { title: 'Account & Billing', desc: 'Subscription management, invoices, and usage limits.', count: 9 },
    { title: 'API & Integrations', desc: 'Webhooks, API keys, and third-party CRM syncing.', count: 14 },
  ];

  const inputClass = `w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all ${
    isDark ? 'bg-slate-950/80 border-slate-800 text-white placeholder-slate-700' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
  }`;

  return (
    <>
      {/* Hero with Search */}
      <section className={`py-20 sm:py-28 px-5 sm:px-6 border-b transition-colors ${borderClass} relative overflow-hidden`}>
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 blur-[120px] rounded-full pointer-events-none ${isDark ? 'bg-indigo-500/10' : 'bg-indigo-500/5'}`} />
        
        <div className="max-w-3xl mx-auto text-center space-y-8 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF8552]">Support Center</span>
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight ${textPrimaryClass}`}>
            How can we help you today?
          </h1>
          
          <div className="relative max-w-2xl mx-auto mt-8">
            <svg className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search for articles, guides, or troubleshooting steps..." 
              className={`w-full pl-12 pr-4 py-4 rounded-2xl border shadow-sm text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all ${
                isDark ? 'bg-slate-900/80 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          <div className="flex items-center justify-center gap-2 pt-4">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className={`text-xs font-semibold ${textMutedClass}`}>All Systems Operational</span>
          </div>
        </div>
      </section>

      {/* Support Channels Grid */}
      <section className={`py-16 sm:py-24 px-5 sm:px-6 border-b transition-colors ${borderClass}`}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {supportChannels.map((channel) => (
            <div key={channel.title} className={`p-6 sm:p-8 rounded-2xl border transition-all ${cardBgClass} space-y-4`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-slate-900/80 border border-slate-800' : 'bg-slate-50 border border-slate-200'}`}>
                {channel.icon}
              </div>
              <div className="space-y-1">
                <h3 className={`text-base font-bold ${textPrimaryClass}`}>{channel.title}</h3>
                <p className={`text-xs sm:text-sm leading-relaxed ${textMutedClass}`}>{channel.desc}</p>
              </div>
              <div className={`text-sm font-semibold ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                {channel.contact}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Knowledge Base & Contact Form */}
      <section className={`py-16 sm:py-24 px-5 sm:px-6 border-b transition-colors ${borderClass}`}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Left: KB Categories */}
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className={`text-2xl font-extrabold tracking-tight ${textPrimaryClass}`}>Knowledge Base</h2>
              <p className={`text-sm ${textMutedClass}`}>Browse our comprehensive documentation and guides.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {kbCategories.map((kb) => (
                <div key={kb.title} className={`p-5 rounded-xl border transition-all cursor-pointer ${cardBgClass} hover:border-indigo-500/30 group`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`text-sm font-bold ${textPrimaryClass}`}>{kb.title}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                      {kb.count}
                    </span>
                  </div>
                  <p className={`text-xs leading-relaxed ${textMutedClass}`}>{kb.desc}</p>
                  <div className="mt-4 flex items-center text-xs font-semibold text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    View Articles <span className="ml-1">→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className={`text-2xl font-extrabold tracking-tight ${textPrimaryClass}`}>Contact Technical Support</h2>
              <p className={`text-sm ${textMutedClass}`}>Submit a ticket and our team will respond within 24 hours.</p>
            </div>

            <form className={`p-6 sm:p-8 rounded-2xl border space-y-5 ${cardBgClass}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Full Name</label>
                  <input type="text" placeholder="Jane Doe" value={name} onChange={e => setName(e.target.value)} className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Email Address</label>
                  <input type="email" placeholder="jane@company.com" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Subject Area</label>
                <select value={subject} onChange={e => setSubject(e.target.value)} className={inputClass}>
                  <option value="technical">Technical Support</option>
                  <option value="billing">Billing & Subscription</option>
                  <option value="sales">Sales & Enterprise Inquiry</option>
                  <option value="feature">Feature Request</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Message</label>
                <textarea 
                  rows={5} 
                  placeholder="Please describe your issue in detail..." 
                  value={message} 
                  onChange={e => setMessage(e.target.value)} 
                  className={`${inputClass} resize-none`}
                />
              </div>

              <button type="button" className="w-full py-3.5 rounded-xl bg-[#FF8552] text-slate-950 font-bold text-sm hover:bg-[#ff966c] transition-colors shadow-lg shadow-[#FF8552]/10 mt-2">
                Submit Support Ticket
              </button>
            </form>
          </div>

        </div>
      </section>

    </>
  );
}

export default function SupportPage() {
  return (
    <MarketingLayout>
      <SupportContent />
    </MarketingLayout>
  );
}
