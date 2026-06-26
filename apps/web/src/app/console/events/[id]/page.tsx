import { prisma } from '@eventforge/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function EventEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      locales: { where: { locale: 'en' } },
      _count: {
        select: {
          ticketTypes: true,
          sessions: true,
          orders: true,
          checkIns: true,
          campaigns: true,
        },
      },
    },
  });

  if (!event) notFound();

  const locale = event.locales[0];
  const content = (locale?.content as any) || {};
  const counts = event._count;

  const statCards = [
    { label: 'Ticket Types', value: counts.ticketTypes, href: `/console/events/${id}/tickets` },
    { label: 'Sessions', value: counts.sessions, href: `/console/events/${id}/agenda` },
    { label: 'Orders', value: counts.orders, href: `/console/events/${id}/analytics` },
    { label: 'Check-ins', value: counts.checkIns, href: `/console/events/${id}/check-ins` },
    { label: 'Campaigns', value: counts.campaigns, href: `/console/events/${id}/marketing` },
  ];

  const quickActions = [
    { label: 'Manage Tickets', href: `/console/events/${id}/tickets`, icon: ticketIcon },
    { label: 'Edit Agenda', href: `/console/events/${id}/agenda`, icon: listIcon },
    { label: 'Polls & Q&A', href: `/console/events/${id}/polls`, icon: chartIcon },
    { label: 'Check-ins', href: `/console/events/${id}/check-ins`, icon: checkIcon },
    { label: 'QR Scanner', href: `/console/events/${id}/scanner`, icon: qrIcon },
    { label: 'Email Campaigns', href: `/console/events/${id}/marketing`, icon: mailIcon },
    { label: 'Analytics', href: `/console/events/${id}/analytics`, icon: analyticsIcon },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-2 text-sm mb-2 text-slate-400">
          <Link href="/console/events" className="hover:text-indigo-600 transition-colors">Events</Link>
          <span>›</span>
          <span className="text-slate-600">{event.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-slate-900">{event.name}</h2>
          <span
            className={`ef-badge mt-1 ${
              event.status === 'published'
                ? 'ef-badge-success'
                : event.status === 'live'
                  ? 'ef-badge-info'
                  : 'ef-badge-neutral'
            }`}
          >
            {event.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statCards.map((stat, i) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="ef-card ef-card-hover p-5 text-center animate-fade-in-up"
            style={{ animationDelay: `${(i + 1) * 0.08}s` }}
          >
            <p className="text-[28px] font-bold tracking-tight text-slate-900">
              {stat.value}
            </p>
            <p className="ef-label-sm mt-1 text-slate-400">
              {stat.label}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="ef-card p-6 animate-fade-in-up delay-300">
            <h3 className="text-base font-semibold text-slate-900 mb-5">Event Details</h3>
            <div className="space-y-5">
              <div>
                <label className="ef-label">Event Name</label>
                <input type="text" defaultValue={event.name} className="ef-input" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="ef-label">Start Date</label>
                  <input
                    type="datetime-local"
                    defaultValue={event.startsAt ? new Date(event.startsAt).toISOString().slice(0, 16) : ''}
                    className="ef-input"
                  />
                </div>
                <div>
                  <label className="ef-label">End Date</label>
                  <input
                    type="datetime-local"
                    defaultValue={event.endsAt ? new Date(event.endsAt).toISOString().slice(0, 16) : ''}
                    className="ef-input"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="ef-label">Type</label>
                  <select defaultValue={event.type} className="ef-input">
                    <option value="in_person">In Person</option>
                    <option value="virtual">Virtual</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="ef-label">Timezone</label>
                  <input type="text" defaultValue={event.timezone} className="ef-input" />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="ef-btn-primary">Save Details</button>
            </div>
          </div>

          <div className="ef-card p-6 animate-fade-in-up delay-400">
            <h3 className="text-base font-semibold text-slate-900 mb-5">Website Content (English)</h3>
            <div className="space-y-5">
              <div>
                <label className="ef-label">Hero Title</label>
                <input type="text" defaultValue={locale?.title || ''} className="ef-input" />
              </div>
              <div>
                <label className="ef-label">Hero Summary</label>
                <textarea rows={2} defaultValue={locale?.summary || ''} className="ef-input" style={{ resize: 'vertical' }} />
              </div>
              <div>
                <label className="ef-label">CTA Button Text</label>
                <input type="text" defaultValue={content.ctaText || 'Register Now'} className="ef-input" />
              </div>
              <div>
                <label className="ef-label">About Section</label>
                <textarea
                  rows={4}
                  defaultValue={content.aboutHtml || ''}
                  className="ef-input font-mono text-xs"
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="ef-btn-primary">Save Content</button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="ef-card p-6 animate-fade-in-up delay-200">
            <h3 className="ef-label-sm mb-4 text-slate-600">Quick Actions</h3>
            <ul className="space-y-1">
              {quickActions.map((action) => (
                <li key={action.label}>
                  <Link
                    href={action.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-slate-600 transition-colors group hover:bg-slate-50 hover:text-slate-900"
                  >
                    <span className="text-slate-400 group-hover:text-slate-600 transition-colors">{action.icon}</span>
                    {action.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="ef-card p-6 animate-fade-in-up delay-300">
            <h3 className="ef-label-sm mb-4 text-slate-600">Event Settings</h3>
            <ul className="space-y-3 text-[13px]">
              <li className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-400">Currency</span>
                <span className="font-semibold uppercase text-slate-900">{event.currency}</span>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-400">Locale</span>
                <span className="font-semibold text-slate-900">{event.localeDefault}</span>
              </li>
              <li className="flex justify-between items-center py-1">
                <span className="text-slate-400">Format</span>
                <span className="font-semibold capitalize text-slate-900">{event.type.replace('_', ' ')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

const ticketIcon = <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" /></svg>;
const listIcon = <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>;
const chartIcon = <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>;
const checkIcon = <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const qrIcon = <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" /></svg>;
const mailIcon = <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>;
const analyticsIcon = <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>;
