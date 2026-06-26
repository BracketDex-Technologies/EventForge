'use client';

import { useState } from 'react';
import Link from 'next/link';
import MarketingLayout, { useTheme } from '@/components/marketing-layout';

interface Feature {
  title: string;
  desc: string;
}

interface Category {
  id: string;
  label: string;
  emoji: string;
  tagline: string;
  features: Feature[];
}

function FeaturesContent() {
  const { isDark, borderClass, cardBgClass, textPrimaryClass, textMutedClass } = useTheme();
  const [activeCategory, setActiveCategory] = useState('ticketing');

  const categories: Category[] = [
    {
      id: 'ticketing',
      label: 'Ticketing & Registration',
      emoji: '🎫',
      tagline: 'Flexible registration workflows with zero commission on every transaction.',
      features: [
        { title: 'Multi-Tier Ticket Types', desc: 'Configure free, paid, donation, add-on, group, and hidden ticket types — each with independent pricing, sale windows, and inventory limits.' },
        { title: 'Dynamic Registration Forms', desc: 'Attach custom form fields (text, dropdown, file upload, date, phone) to ticket types with conditional logic and validation rules.' },
        { title: 'Stripe-Integrated Checkout', desc: 'Secure payment processing with idempotent order creation, automatic tax calculation, and real-time payment intent tracking.' },
        { title: 'Promo Codes & Discounts', desc: 'Create flat-amount or percentage-based promotional codes with usage limits, validity windows, and per-tier targeting.' },
        { title: 'Waitlist Management', desc: 'Automatically queue attendees when ticket tiers sell out, with position tracking and one-click promotion when capacity opens.' },
        { title: 'Order Management', desc: 'Full order lifecycle — pending, completed, refunded, cancelled — with partial refund support and Stripe webhook synchronization.' },
      ]
    },
    {
      id: 'agenda',
      label: 'Agenda & Speakers',
      emoji: '🎤',
      tagline: 'Multi-track schedules with speaker profiles, room assignments, and session RSVPs.',
      features: [
        { title: 'Multi-Track Agenda Builder', desc: 'Organize sessions across parallel tracks with color-coded categories and drag-and-drop scheduling within rooms.' },
        { title: 'Session Types', desc: 'Support for keynotes, talks, workshops, panels, breaks, and networking sessions — each with configurable capacity and RSVP requirements.' },
        { title: 'Speaker Management', desc: 'Dedicated speaker profiles with bios, photos, social links, company affiliations, and portal tokens for self-service content updates.' },
        { title: 'Room & Venue Configuration', desc: 'Define physical venues with addresses and capacity limits, then assign rooms with optional virtual URLs for hybrid sessions.' },
        { title: 'Session RSVPs', desc: 'Enable per-session registration with capacity enforcement, waitlist overflow, and individual session-level check-in tracking.' },
        { title: 'Virtual & Hybrid Streaming', desc: 'Integrate Zoom, Microsoft Teams, or Vimeo streams directly into session records for seamless hybrid event delivery.' },
      ]
    },
    {
      id: 'onsite',
      label: 'On-Site Operations',
      emoji: '📱',
      tagline: 'Browser-based check-in, custom badges, and multi-printer queue management.',
      features: [
        { title: 'QR Code Check-In Scanner', desc: 'Progressive web app scanner that uses device cameras to decode QR tickets instantly — no native app installation required for staff.' },
        { title: 'Multi-Channel Check-In', desc: 'Support for QR scan, manual name lookup, walk-in registration, and kiosk self-check-in modes with configurable staff permissions.' },
        { title: 'Custom Badge Templates', desc: 'Visual badge layout editor with support for A4, Letter, 4×6, and CR80 paper sizes. Render attendee data dynamically at print time.' },
        { title: 'Print Queue Management', desc: 'Queue badge print jobs to network printers using ESC/POS, ZPL, or PDF drivers. Track job status from queued through printed.' },
        { title: 'Session-Level Check-In', desc: 'Track attendance at individual sessions with separate check-in records, enabling per-session analytics and capacity monitoring.' },
      ]
    },
    {
      id: 'engagement',
      label: 'Engagement & Networking',
      emoji: '💬',
      tagline: 'Real-time interaction tools that keep audiences engaged before, during, and after sessions.',
      features: [
        { title: 'Live Audience Polling', desc: 'Create single-select or multi-select polls per session. Attendees vote from their mobile browsers with results updating in real time.' },
        { title: 'Moderated Q&A Boards', desc: 'Session-level question boards with upvoting, anonymous submission, and moderator controls to hide, answer, or feature questions.' },
        { title: 'Attendee Chat Channels', desc: 'Real-time text messaging channels scoped to events, sessions, or custom groups with message types for reactions and system notifications.' },
        { title: '1:1 Meeting Scheduler', desc: 'Enable attendees to request, accept, or decline scheduled meetings with calendar slot selection and optional virtual room URLs.' },
        { title: 'Attendee Networking Profiles', desc: 'Rich profiles with display names, photos, titles, companies, interest tags, bios, and social links — with configurable privacy levels.' },
        { title: 'Gamification Engine', desc: 'Award points for check-ins, poll participation, meeting bookings, and session attendance. Track engagement on per-attendee leaderboards.' },
      ]
    },
    {
      id: 'marketing',
      label: 'Marketing & Automation',
      emoji: '📧',
      tagline: 'Targeted email campaigns and event-driven workflow automation.',
      features: [
        { title: 'Email Campaign Manager', desc: 'Design email campaigns with MJML templates, define audience segments, schedule delivery, and track opens, clicks, and bounces.' },
        { title: 'Workflow Automation', desc: 'Define trigger-based workflows (ticket purchase, check-in, schedule) with multi-step sequences including email sends, delays, and webhooks.' },
        { title: 'Email Template Library', desc: 'Organization-scoped MJML templates with variable schemas for consistent branding across confirmation emails, reminders, and follow-ups.' },
        { title: 'Delivery Tracking', desc: 'Per-message event tracking — sent, delivered, opened, clicked, bounced, complained — with organization-level aggregate dashboards.' },
        { title: 'Exhibitor Portal', desc: 'Tiered exhibitor management (Platinum, Gold, Silver, Standard) with booth assignments, logos, lead capture scanning, and contact details.' },
        { title: 'Lead Capture', desc: 'Exhibitors scan attendee QR codes to capture leads with notes and metadata, building qualified contact lists directly from the event floor.' },
      ]
    },
    {
      id: 'platform',
      label: 'Analytics & Platform',
      emoji: '📊',
      tagline: 'Real-time metrics, multi-tenant workspaces, API access, and enterprise billing.',
      features: [
        { title: 'Real-Time Performance Dashboard', desc: 'Hourly rollup metrics for registrations, revenue, check-ins, cancellations, refunds, and page views — filterable by event and date range.' },
        { title: 'Multi-Tenant Workspaces', desc: 'Organization-scoped tenancy with role-based access control (Owner, Admin, Organizer, Staff, Viewer) and email-based team invitations.' },
        { title: 'Custom Event Websites', desc: 'Build branded event microsites with a page builder, publish to custom domains with automatic SSL provisioning, and localize content for multiple languages.' },
        { title: 'Scoped API Keys', desc: 'Generate API keys with granular permission scopes (events:read, tickets:write, etc.) for secure third-party integrations and webhook consumers.' },
        { title: 'Immutable Audit Trail', desc: 'Every tenant action is logged with actor, target, action type, and metadata — providing full operational transparency for compliance requirements.' },
        { title: 'Subscription Billing', desc: 'Tiered subscription plans with Stripe integration, seat-based pricing, usage metering, and automatic invoice generation.' },
      ]
    },
  ];

  const activeData = categories.find(c => c.id === activeCategory) || categories[0];

  const comparisonRows = [
    { feature: 'Commission on Ticket Sales', eventforge: '0%', others: '2–8% + fees' },
    { feature: 'Check-In App Required', eventforge: 'No — browser-based', others: 'Native app' },
    { feature: 'Custom Domain Support', eventforge: 'Included (with SSL)', others: 'Premium plans only' },
    { feature: 'Badge Printing', eventforge: 'Built-in', others: 'Third-party add-on' },
    { feature: 'Live Polls & Q&A', eventforge: 'Included', others: 'Separate tool' },
    { feature: 'Exhibitor Lead Capture', eventforge: 'Included', others: 'Add-on fee' },
    { feature: 'API Access', eventforge: 'Scoped keys included', others: 'Enterprise plans only' },
    { feature: 'Audit Logging', eventforge: 'Full trail', others: 'Limited or none' },
  ];

  return (
    <>
      {/* Hero */}
      <section className={`py-20 sm:py-28 px-5 sm:px-6 border-b transition-colors ${borderClass}`}>
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF8552]">Platform Capabilities</span>
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight ${textPrimaryClass}`}>
            Every Feature You Need.<br />Zero Compromises.
          </h1>
          <p className={`${textMutedClass} max-w-2xl mx-auto text-sm sm:text-base leading-relaxed`}>
            27+ features across 6 operational categories — from ticketing and on-site operations to marketing automation and real-time analytics. All included. No add-on fees.
          </p>
        </div>
      </section>

      {/* Category Tabs + Feature Grid */}
      <section className={`py-16 sm:py-24 px-5 sm:px-6 border-b transition-colors ${borderClass}`}>
        <div className="max-w-6xl mx-auto space-y-10 sm:space-y-14">
          
          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                  activeCategory === cat.id
                    ? 'bg-[#FF8552] text-slate-950 border-[#FF8552]'
                    : isDark
                      ? 'border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      : 'border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <span className="mr-1.5">{cat.emoji}</span>{cat.label}
              </button>
            ))}
          </div>

          {/* Active Category Header */}
          <div className="space-y-2">
            <h2 className={`text-xl sm:text-2xl font-extrabold tracking-tight ${textPrimaryClass}`}>
              {activeData.emoji} {activeData.label}
            </h2>
            <p className={`text-sm ${textMutedClass}`}>{activeData.tagline}</p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {activeData.features.map((f) => (
              <div key={f.title} className={`p-5 sm:p-6 rounded-2xl border transition-all ${cardBgClass} space-y-3 hover:border-indigo-500/20`}>
                <h3 className={`text-sm font-bold ${textPrimaryClass}`}>{f.title}</h3>
                <p className={`text-xs leading-relaxed ${textMutedClass}`}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className={`py-16 sm:py-24 px-5 sm:px-6 border-b transition-colors ${borderClass}`}>
        <div className="max-w-4xl mx-auto space-y-10 sm:space-y-14">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF8552]">Competitive Advantage</span>
            <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${textPrimaryClass}`}>EventForge vs. Traditional Platforms</h2>
            <p className={`${textMutedClass} max-w-xl mx-auto text-sm leading-relaxed`}>
              A transparent comparison of what is included by default versus what competitors charge extra for.
            </p>
          </div>

          <div className={`rounded-2xl border overflow-hidden ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={isDark ? 'bg-slate-900/50' : 'bg-slate-50'}>
                    <th className={`text-left px-5 py-4 font-bold text-xs uppercase tracking-wider ${textMutedClass}`}>Feature</th>
                    <th className={`text-center px-5 py-4 font-bold text-xs uppercase tracking-wider text-[#FF8552]`}>EventForge</th>
                    <th className={`text-center px-5 py-4 font-bold text-xs uppercase tracking-wider ${textMutedClass}`}>Others</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr key={row.feature} className={`border-t ${isDark ? 'border-slate-800' : 'border-slate-100'} ${i % 2 === 0 ? '' : isDark ? 'bg-slate-900/20' : 'bg-slate-50/50'}`}>
                      <td className={`px-5 py-3.5 font-medium text-xs sm:text-sm ${textPrimaryClass}`}>{row.feature}</td>
                      <td className="px-5 py-3.5 text-center text-xs sm:text-sm font-semibold text-emerald-500">{row.eventforge}</td>
                      <td className={`px-5 py-3.5 text-center text-xs sm:text-sm ${textMutedClass}`}>{row.others}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`py-16 sm:py-20 px-5 sm:px-6`}>
        <div className={`max-w-4xl mx-auto rounded-3xl border px-6 sm:px-8 py-12 sm:py-16 text-center space-y-5 relative overflow-hidden ${
          isDark ? 'bg-gradient-to-tr from-slate-900/40 via-indigo-950/10 to-slate-900/40 border-slate-900/80' : 'bg-white border-slate-200/80 shadow-md shadow-slate-200/30'
        }`}>
          <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${textPrimaryClass}`}>See it in action</h2>
          <p className={`${textMutedClass} max-w-lg mx-auto text-sm leading-relaxed`}>
            Create a free workspace and explore every feature — no credit card required.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/login" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#FF8552] text-slate-950 font-bold text-sm hover:bg-[#ff966c] transition-colors shadow-lg">
              Start Free
            </Link>
            <Link href="/pricing" className={`inline-flex items-center justify-center px-8 py-3.5 rounded-xl border font-bold text-sm transition-colors ${isDark ? 'border-slate-800 text-slate-300 hover:bg-slate-900' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
              Compare Plans
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default function FeaturesPage() {
  return (
    <MarketingLayout>
      <FeaturesContent />
    </MarketingLayout>
  );
}
