'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function TermsPage() {
  const sections = [
    { id: 'agreement', title: '1. Agreement to Terms' },
    { id: 'accounts', title: '2. Workspace & Security' },
    { id: 'billing', title: '3. Billing & Payments' },
    { id: 'ticketing', title: '4. Ticketing & Content' },
    { id: 'liability', title: '5. Limitation of Liability' },
    { id: 'governing-law', title: '6. Governing Law' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      {/* Header */}
      <header className="w-full py-4 px-6 lg:px-10 flex items-center justify-between sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <Image src="/logo-icon.svg" alt="EventForge" width={32} height={32} />
          <span className="font-bold text-lg tracking-tight text-slate-900">EventForge</span>
        </Link>
        <Link href="/login" className="ef-btn-ghost text-sm py-2 px-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          Return to Login
        </Link>
      </header>
      
      {/* Main Content Layout */}
      <div className="flex-1 max-w-6xl w-full mx-auto py-12 px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Navigation (Sticky) */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24 space-y-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">On This Page</h3>
            <nav className="flex flex-col gap-2.5">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors"
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Terms Body */}
        <main className="col-span-1 lg:col-span-3 bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-sm space-y-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Terms of Service</h1>
            <p className="text-sm text-slate-400">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          <div className="prose prose-slate max-w-none text-sm text-slate-600 leading-relaxed space-y-6">
            <p>
              Welcome to EventForge. By accessing or using our website, APIs, attendee registration portals, and check-in scanner services, you agree to be bound by these Terms of Service.
            </p>

            <hr className="border-slate-100 my-6" />

            {/* Section 1 */}
            <section id="agreement" className="space-y-3 scroll-mt-24">
              <h2 className="text-lg font-bold text-slate-900">{sections[0].title}</h2>
              <p>
                By creating a workspace console or purchasing registration tickets through EventForge, you agree to comply with all applicable local, national, and international laws. If you disagree with any part of these terms, you are prohibited from accessing the service.
              </p>
            </section>

            {/* Section 2 */}
            <section id="accounts" className="space-y-3 scroll-mt-24">
              <h2 className="text-lg font-bold text-slate-900">{sections[1].title}</h2>
              <p>
                When creating a workspace account, you must provide accurate registration details. You are solely responsible for maintaining the confidentiality of your credentials and credentials delegated to event organizers or check-in staff.
              </p>
              <p>
                We reserve the right to suspend organization workspaces immediately in cases of database abuse, spam invites, check-in scanning fraud, or security breaches.
              </p>
            </section>

            {/* Section 3 */}
            <section id="billing" className="space-y-3 scroll-mt-24">
              <h2 className="text-lg font-bold text-slate-900">{sections[2].title}</h2>
              <p>
                Certain features (such as custom domains, advanced marketing campaigns, and ticketing) are tied to subscription tiers. Payment processing and invoicing are handled through Stripe checkout sessions.
              </p>
              <p>
                All fees are billed in USD (or custom organization currencies) and are non-refundable unless specified otherwise by local consumer protection laws. You agree to pay all transaction taxes related to ticketing checkout.
              </p>
            </section>

            {/* Section 4 */}
            <section id="ticketing" className="space-y-3 scroll-mt-24">
              <h2 className="text-lg font-bold text-slate-900">{sections[3].title}</h2>
              <p>
                EventForge provides ticketing configurations and QR validation services. If you configure ticket sales, you acknowledge that:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>You are solely responsible for setting ticket refunds, promo code eligibility, and check-in validation parameters.</li>
                <li>Any content you upload (hero descriptions, venue parameters, speaker profiles, custom layouts) remains your intellectual property, but you grant EventForge a license to display it publicly on event pages.</li>
                <li>You may not upload content that violates copyright laws, contains malware, or promotes illegal activities.</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section id="liability" className="space-y-3 scroll-mt-24">
              <h2 className="text-lg font-bold text-slate-900">{sections[4].title}</h2>
              <p>
                EventForge is provided on an "as is" and "as available" basis. To the maximum extent permitted by law, EventForge and its affiliates shall not be liable for any indirect, incidental, special, or consequential damages resulting from database downtime, checkout ticket failure, or on-site scanner connectivity lag.
              </p>
            </section>

            {/* Section 6 */}
            <section id="governing-law" className="space-y-3 scroll-mt-24">
              <h2 className="text-lg font-bold text-slate-900">{sections[5].title}</h2>
              <p>
                These Terms of Service are governed by the laws of the jurisdiction where EventForge's parent entity is incorporated, without regard to conflict of law principles. Any legal action arising from these terms shall be resolved in courts located in that same jurisdiction.
              </p>
            </section>

            <hr className="border-slate-100 my-6" />

            {/* Contact */}
            <section className="space-y-2">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Questions?</h2>
              <p>For inquiries regarding our terms, email: <span className="font-semibold text-slate-900">support@eventforge.app</span></p>
            </section>
          </div>
        </main>
      </div>
      
      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-10 px-6 lg:px-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} EventForge. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm text-slate-500">
            <Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
