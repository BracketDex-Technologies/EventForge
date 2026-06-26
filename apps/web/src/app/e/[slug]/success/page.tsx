import { prisma } from '@eventforge/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const orderId = sp.orderId as string;

  if (!orderId) notFound();

  const event = await prisma.event.findFirst({
    where: { id: slug },
  });

  if (!event) notFound();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, tickets: true }
  });

  return (
    <div className="min-h-screen py-20 px-6 text-center animate-fade-in-up" style={{ background: 'var(--ef-bg)' }}>
      <div className="max-w-xl mx-auto ef-card bg-white shadow-lg p-10 border border-slate-100">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
          ✓
        </div>
        <h1 className="ef-headline-lg font-bold text-2xl mb-3">Order Confirmed!</h1>
        <p className="text-slate-600 text-xs max-w-sm mx-auto leading-relaxed mb-8">
          You are officially registered for <span className="font-semibold text-slate-900">{event.name}</span>. A copy of your ticket receipt has been sent to your email.
        </p>

        {/* Invoice Card */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 mb-8 text-left">
          <h3 className="font-bold text-xs uppercase tracking-wider mb-2 text-slate-400">Order Details</h3>
          <p className="text-xs font-semibold mb-4" style={{ color: 'var(--ef-text-secondary)' }}>
            Order ID: <span className="font-mono text-slate-500">{order?.id.split('-')[0]}</span>
          </p>
          <ul className="divide-y divide-slate-100 text-xs font-semibold">
            {order?.items.map(item => (
              <li key={item.id} className="py-2.5 flex justify-between text-slate-950">
                <span>{item.qty}x Event Ticket</span>
                <span>${(Number(item.unitPriceCents) * item.qty / 105).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>

        <Link href={`/e/${event.id}`} className="ef-btn-primary text-sm px-8 py-3.5 shadow-md">
          Return to Event Website
        </Link>
      </div>
    </div>
  );
}
