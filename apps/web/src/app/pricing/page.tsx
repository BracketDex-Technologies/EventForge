'use client';

import { useState } from 'react';
import Link from 'next/link';
import MarketingLayout, { useTheme } from '@/components/marketing-layout';

function PricingContent() {
  const { isDark, borderClass, cardBgClass, textPrimaryClass, textMutedClass } = useTheme();
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const plans = [
    {
      name: 'Free',
      desc: 'For individuals and small teams exploring event management.',
      monthlyPrice: 0,
      annualPrice: 0,
      highlight: false,
      cta: 'Get Started Free',
      limits: {
        admins: '1',
        eventDays: '1 / event',
        attendees: '100 / event',
        speakers: '3 / event',
        exhibitors: '—',
        campaigns: '1 / event',
        customDomain: false,
        badgePrinting: false,
        workflows: false,
        apiAccess: false,
        brandedApp: false,
      },
    },
    {
      name: 'Essentials',
      desc: 'For growing teams building audience engagement through events.',
      monthlyPrice: 29,
      annualPrice: 23,
      highlight: false,
      cta: 'Start Essentials',
      limits: {
        admins: '3',
        eventDays: '3 / event',
        attendees: '500 / event',
        speakers: '25 / event',
        exhibitors: '15 / event',
        campaigns: '5 / event',
        customDomain: false,
        badgePrinting: true,
        workflows: false,
        apiAccess: false,
        brandedApp: false,
      },
    },
    {
      name: 'Premium',
      desc: 'For event professionals who need flexibility and full platform access.',
      monthlyPrice: 79,
      annualPrice: 63,
      highlight: true,
      cta: 'Start Premium',
      limits: {
        admins: '5',
        eventDays: '5 / event',
        attendees: '2,000 / event',
        speakers: '100 / event',
        exhibitors: '50 / event',
        campaigns: 'Unlimited',
        customDomain: true,
        badgePrinting: true,
        workflows: true,
        apiAccess: true,
        brandedApp: false,
      },
    },
    {
      name: 'Ultimate',
      desc: 'For large-scale enterprise events with advanced customization needs.',
      monthlyPrice: 199,
      annualPrice: 159,
      highlight: false,
      cta: 'Start Ultimate',
      limits: {
        admins: 'Unlimited',
        eventDays: '15 / event',
        attendees: '10,000 / event',
        speakers: 'Unlimited',
        exhibitors: 'Unlimited',
        campaigns: 'Unlimited',
        customDomain: true,
        badgePrinting: true,
        workflows: true,
        apiAccess: true,
        brandedApp: true,
      },
    },
  ];

  const featureRows = [
    { label: 'Portal Admins', key: 'admins' as const },
    { label: 'Event Duration', key: 'eventDays' as const },
    { label: 'Attendees per Event', key: 'attendees' as const },
    { label: 'Speakers per Event', key: 'speakers' as const },
    { label: 'Exhibitors per Event', key: 'exhibitors' as const },
    { label: 'Email Campaigns', key: 'campaigns' as const },
    { label: 'Custom Domain + SSL', key: 'customDomain' as const },
    { label: 'Badge Printing', key: 'badgePrinting' as const },
    { label: 'Workflow Automation', key: 'workflows' as const },
    { label: 'API Access', key: 'apiAccess' as const },
    { label: 'Branded Mobile App', key: 'brandedApp' as const },
  ];

  const faqs = [
    { q: 'Is there a per-ticket commission?', a: 'No. EventForge charges zero commission on ticket sales across every plan, including Free. You pay only standard Stripe payment processing fees.' },
    { q: 'Can I switch plans at any time?', a: 'Yes. Upgrades take effect immediately with prorated billing for the current period. Downgrades take effect at the end of your current billing cycle.' },
    { q: 'What happens if I exceed attendee limits?', a: 'You will receive a notification when approaching your plan limit. You can upgrade your plan at any time to increase capacity without disrupting active registrations.' },
    { q: 'Do you offer custom enterprise pricing?', a: 'Yes. For organizations with events exceeding 10,000 attendees or requiring dedicated infrastructure, contact our sales team for a custom quote.' },
    { q: 'Is there a free trial for paid plans?', a: 'The Free plan provides full access to core features with usage limits. Paid plans include a 14-day free trial with no credit card required.' },
  ];

  return (
    <>
      {/* Hero */}
      <section className={`py-20 sm:py-28 px-5 sm:px-6 border-b transition-colors ${borderClass}`}>
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF8552]">Pricing</span>
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight ${textPrimaryClass}`}>
            Transparent Pricing.<br />Zero Commission.
          </h1>
          <p className={`${textMutedClass} max-w-2xl mx-auto text-sm sm:text-base leading-relaxed`}>
            Every plan includes core event management features with no hidden fees, no per-ticket charges, and no vendor lock-in. Scale as you grow.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <span className={`text-sm font-semibold ${!annual ? textPrimaryClass : textMutedClass}`}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative w-12 h-6 rounded-full transition-colors ${annual ? 'bg-[#FF8552]' : isDark ? 'bg-slate-700' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${annual ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
            <span className={`text-sm font-semibold ${annual ? textPrimaryClass : textMutedClass}`}>
              Annual
              <span className="ml-1.5 text-[10px] font-bold text-emerald-500 uppercase">Save 20%</span>
            </span>
          </div>
        </div>
      </section>

      {/* Plan Cards */}
      <section className={`py-16 sm:py-24 px-5 sm:px-6 border-b transition-colors ${borderClass}`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl border p-6 sm:p-7 space-y-5 transition-all relative ${
                  plan.highlight
                    ? 'border-[#FF8552] shadow-lg shadow-[#FF8552]/10'
                    : cardBgClass
                } ${isDark && !plan.highlight ? 'bg-slate-900/20' : ''}`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 rounded-full bg-[#FF8552] text-slate-950 text-[10px] font-bold uppercase tracking-wider">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="space-y-2">
                  <h3 className={`text-lg font-bold ${textPrimaryClass}`}>{plan.name}</h3>
                  <p className={`text-xs leading-relaxed ${textMutedClass}`}>{plan.desc}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3xl sm:text-4xl font-black ${textPrimaryClass}`}>
                      ${annual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    {plan.monthlyPrice > 0 && (
                      <span className={`text-sm ${textMutedClass}`}>/mo</span>
                    )}
                  </div>
                  {plan.monthlyPrice === 0 && (
                    <p className={`text-xs ${textMutedClass}`}>Free forever</p>
                  )}
                  {annual && plan.monthlyPrice > 0 && (
                    <p className="text-xs text-emerald-500">Billed annually</p>
                  )}
                </div>

                <Link
                  href="/login"
                  className={`block text-center py-3 rounded-xl font-bold text-sm transition-colors ${
                    plan.highlight
                      ? 'bg-[#FF8552] text-slate-950 hover:bg-[#ff966c]'
                      : isDark
                        ? 'bg-slate-800 text-white hover:bg-slate-700'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {plan.cta}
                </Link>

                <div className="space-y-2.5 pt-2">
                  {featureRows.map((row) => {
                    const val = plan.limits[row.key];
                    const isBoolean = typeof val === 'boolean';
                    return (
                      <div key={row.label} className="flex items-center justify-between text-xs">
                        <span className={textMutedClass}>{row.label}</span>
                        {isBoolean ? (
                          val ? (
                            <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          ) : (
                            <span className={textMutedClass}>—</span>
                          )
                        ) : (
                          <span className={`font-semibold ${textPrimaryClass}`}>{val}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Zero Commission Badge */}
          <div className="mt-8 text-center">
            <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-bold ${
              isDark ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' : 'border-emerald-200 text-emerald-700 bg-emerald-50'
            }`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              0% commission on ticket sales — every plan, every transaction
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={`py-16 sm:py-24 px-5 sm:px-6 border-b transition-colors ${borderClass}`}>
        <div className="max-w-4xl mx-auto space-y-10 sm:space-y-14">
          <div className="text-center space-y-3">
            <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${textPrimaryClass}`}>Pricing Questions</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className={`rounded-2xl border transition-all overflow-hidden ${isDark ? 'border-slate-800 bg-slate-900/10' : 'border-slate-200 bg-white'}`}>
                  <button onClick={() => setOpenFaq(isOpen ? null : idx)} className="w-full flex items-center justify-between p-5 sm:p-6 text-left focus:outline-none cursor-pointer">
                    <span className={`font-semibold text-sm sm:text-base pr-4 ${textPrimaryClass}`}>{faq.q}</span>
                    <svg className={`w-5 h-5 text-slate-400 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                  <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 border-t' : 'max-h-0'} ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                    <p className={`p-5 sm:p-6 text-xs sm:text-sm leading-relaxed ${textMutedClass}`}>{faq.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 px-5 sm:px-6">
        <div className={`max-w-4xl mx-auto rounded-3xl border px-6 sm:px-8 py-12 sm:py-16 text-center space-y-5 relative overflow-hidden ${
          isDark ? 'bg-gradient-to-tr from-slate-900/40 via-indigo-950/10 to-slate-900/40 border-slate-900/80' : 'bg-white border-slate-200/80 shadow-md shadow-slate-200/30'
        }`}>
          <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${textPrimaryClass}`}>Start free. Upgrade anytime.</h2>
          <p className={`${textMutedClass} max-w-lg mx-auto text-sm leading-relaxed`}>
            No credit card required. Full platform access on the Free plan with room to scale.
          </p>
          <div className="pt-2">
            <Link href="/login" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#FF8552] text-slate-950 font-bold text-sm hover:bg-[#ff966c] transition-colors shadow-lg">
              Create Free Workspace
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default function PricingPage() {
  return (
    <MarketingLayout>
      <PricingContent />
    </MarketingLayout>
  );
}
