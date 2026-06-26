import { prisma } from '@eventforge/db';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import Stripe from 'stripe';

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  
  const event = await prisma.event.findFirst({
    where: { id: slug, deletedAt: null },
    include: {
      ticketTypes: {
        where: { deletedAt: null }
      }
    }
  });

  if (!event) notFound();

  // Parse selected tickets from search parameters
  const selectedTickets: Array<{ id: string; name: string; qty: number; unitPrice: number; total: number }> = [];
  let subtotalCents = 0;

  for (const ticket of event.ticketTypes) {
    const qtyKey = `qty_${ticket.id}`;
    const qtyStr = sp[qtyKey];
    const qty = typeof qtyStr === 'string' ? parseInt(qtyStr, 10) : 0;
    
    if (qty > 0) {
      const unitPrice = Number(ticket.priceCents);
      const total = unitPrice * qty;
      selectedTickets.push({
        id: ticket.id,
        name: ticket.name,
        qty,
        unitPrice,
        total,
      });
      subtotalCents += total;
    }
  }

  if (selectedTickets.length === 0) {
    redirect(`/e/${event.id}/tickets`);
  }

  // Handle Checkout Action
  async function handleCheckout() {
    'use server';
    
    const order = await prisma.order.create({
      data: {
        organizationId: event!.organizationId,
        eventId: event!.id,
        status: 'pending',
        subtotalCents: BigInt(subtotalCents),
        feesCents: BigInt(0),
        taxCents: BigInt(0),
        discountCents: BigInt(0),
        totalCents: BigInt(subtotalCents),
        currency: event!.currency,
      }
    });

    for (const item of selectedTickets) {
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          ticketTypeId: item.id,
          qty: item.qty,
          unitPriceCents: BigInt(item.unitPrice),
        }
      });
    }
    
    if (subtotalCents === 0) {
      // Free ticket, complete instantly
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'completed' }
      });
      redirect(`/e/${event!.id}/success?orderId=${order.id}`);
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (stripeKey) {
      const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: selectedTickets.map((t) => ({
          price_data: {
            currency: event!.currency,
            product_data: { name: t.name },
            unit_amount: t.unitPrice,
          },
          quantity: t.qty,
        })),
        metadata: { orderId: order.id },
        success_url: `http://localhost:3000/e/${event!.id}/success?orderId=${order.id}`,
        cancel_url: `http://localhost:3000/e/${event!.id}/tickets`,
      });
      
      if (session.url) {
        redirect(session.url);
      }
    }
    
    // Mock checkout flow if no Stripe key is configured
    redirect(`/e/${event!.id}/success?orderId=${order.id}`);
  }

  return (
    <div className="min-h-screen py-16 px-6 animate-fade-in-up" style={{ background: 'var(--ef-bg)' }}>
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-start">
        {/* Buyer information form */}
        <div className="flex-1 ef-card bg-white shadow-lg p-8 border border-slate-100">
          <div className="border-b border-slate-100 pb-5 mb-6">
            <h1 className="text-xl font-bold text-slate-900">Review & Checkout</h1>
            <p className="text-xs font-semibold mt-1" style={{ color: 'var(--ef-text-muted)' }}>{event.name}</p>
          </div>

          <form action={handleCheckout} className="space-y-6">
            {/* Summary card inline */}
            <div className="border border-slate-100 rounded-xl p-5 bg-slate-50/50">
              <h3 className="font-bold text-xs uppercase tracking-wider mb-3 text-slate-400">Order Summary</h3>
              <ul className="divide-y divide-slate-100">
                {selectedTickets.map(t => (
                  <li key={t.id} className="py-2.5 flex justify-between text-xs font-semibold text-slate-950">
                    <span>{t.qty}x {t.name}</span>
                    <span>${(t.total / 100).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-slate-200 mt-3 pt-3 flex justify-between font-extrabold text-sm text-indigo-600">
                <span>Total Due</span>
                <span>${(subtotalCents / 100).toFixed(2)}</span>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div>
                <label className="ef-label">Buyer Full Name</label>
                <input type="text" required className="ef-input" placeholder="John Doe" />
              </div>
              
              <div>
                <label className="ef-label">Email Address</label>
                <input type="email" required className="ef-input" placeholder="john@example.com" />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
              <Link href={`/e/${event.id}/tickets`} className="text-xs font-semibold hover:underline" style={{ color: 'var(--ef-text-secondary)' }}>
                &larr; Change Selection
              </Link>
              <button type="submit" className="ef-btn-primary text-sm px-6 py-2.5">
                Pay ${(subtotalCents / 100).toFixed(2)}
              </button>
            </div>
          </form>
        </div>
        
        {/* Sidebar Info */}
        <div className="w-full md:w-80 ef-card bg-white shadow-sm p-6 border border-slate-100/80">
          <h3 className="font-bold text-xs uppercase tracking-wider mb-3 text-slate-400">Event Details</h3>
          <div className="text-xs text-slate-600 space-y-2">
            <p className="font-bold text-slate-900">{event.name}</p>
            {event.startsAt && (
              <p>📅 {new Date(event.startsAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            )}
            <p className="capitalize">🏷️ {event.type.replace('_', ' ')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
