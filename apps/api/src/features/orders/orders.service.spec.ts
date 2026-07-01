import { BadRequestException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { OrdersService } from './orders.service.js';

const ctx = {
  organizationId: '00000000-0000-4000-8000-000000000001',
  user: {
    id: '00000000-0000-4000-8000-000000000010',
    email: 'buyer@example.com',
  },
  role: 'owner',
  isSuperAdmin: false,
  requestId: 'req_1',
} as any;

function createPrismaMock() {
  const client = {
    event: { findFirst: vi.fn() },
    order: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    ticketType: { findFirst: vi.fn(), update: vi.fn() },
    orderItem: { create: vi.fn() },
    ticket: { create: vi.fn(), updateMany: vi.fn() },
    promoCode: { findFirst: vi.fn(), update: vi.fn() },
    eventMetricHourly: { upsert: vi.fn() },
    $transaction: vi.fn(),
  };
  client.$transaction.mockImplementation(async (callback: any) =>
    callback(client),
  );
  return { client };
}

function createService(prisma = createPrismaMock()) {
  return new OrdersService(
    prisma as any,
    { record: vi.fn() } as any,
    { get: vi.fn(() => undefined) } as any,
  );
}

describe('OrdersService', () => {
  it('returns an existing pending order for the same organization and idempotency key', async () => {
    const prisma = createPrismaMock();
    prisma.client.order.findFirst.mockResolvedValue({
      id: 'order_existing',
      status: 'pending',
      organizationId: ctx.organizationId,
      eventId: '00000000-0000-4000-8000-000000000100',
      stripeCheckoutSessionId: null,
    });
    const service = createService(prisma);

    const result = await service.createCheckout(ctx, {
      eventId: '00000000-0000-4000-8000-000000000100',
      idempotencyKey: 'same-key-123',
      items: [
        {
          ticketTypeId: '00000000-0000-4000-8000-000000000200',
          qty: 1,
        },
      ],
    });

    expect(result).toEqual({
      orderId: 'order_existing',
      status: 'pending',
      checkoutUrl: null,
    });
    expect(prisma.client.event.findFirst).not.toHaveBeenCalled();
    expect(prisma.client.order.create).not.toHaveBeenCalled();
  });

  it('rejects a ticket before its sale window opens without creating an order', async () => {
    const prisma = createPrismaMock();
    prisma.client.order.findFirst.mockResolvedValue(null);
    prisma.client.event.findFirst.mockResolvedValue({
      id: '00000000-0000-4000-8000-000000000100',
      currency: 'usd',
    });
    prisma.client.ticketType.findFirst.mockResolvedValue({
      id: '00000000-0000-4000-8000-000000000200',
      name: 'Early Bird',
      priceCents: 5000n,
      quantityTotal: 100,
      quantitySold: 0,
      minPerOrder: 1,
      maxPerOrder: 4,
      saleStartsAt: new Date(Date.now() + 60_000),
      saleEndsAt: null,
    });
    const service = createService(prisma);

    await expect(
      service.createCheckout(ctx, {
        eventId: '00000000-0000-4000-8000-000000000100',
        idempotencyKey: 'future-sale-123',
        items: [
          {
            ticketTypeId: '00000000-0000-4000-8000-000000000200',
            qty: 1,
          },
        ],
      }),
    ).rejects.toThrow('Early Bird is not on sale yet');
    expect(prisma.client.order.create).not.toHaveBeenCalled();
  });

  it('applies a percent promo code to the order total', async () => {
    const prisma = createPrismaMock();
    prisma.client.order.findFirst.mockResolvedValue(null);
    prisma.client.event.findFirst.mockResolvedValue({
      id: '00000000-0000-4000-8000-000000000100',
      currency: 'usd',
    });
    prisma.client.ticketType.findFirst.mockResolvedValue({
      id: '00000000-0000-4000-8000-000000000200',
      name: 'General',
      priceCents: 10000n,
      quantityTotal: 100,
      quantitySold: 0,
      minPerOrder: 1,
      maxPerOrder: 4,
      saleStartsAt: null,
      saleEndsAt: null,
    });
    prisma.client.promoCode.findFirst.mockResolvedValue({
      id: 'promo_1',
      code: 'SAVE20',
      kind: 'percent',
      value: 20,
      maxUses: 10,
      uses: 0,
      validFrom: null,
      validTo: null,
    });
    prisma.client.order.create.mockResolvedValue({
      id: 'order_1',
      totalCents: 8000n,
      status: 'pending',
      items: [],
    });
    const service = createService(prisma);
    (service as any).stripe = {
      checkout: {
        sessions: {
          create: vi.fn().mockResolvedValue({ id: 'cs_1', url: 'https://checkout.test' }),
        },
      },
    };

    await service.createCheckout(ctx, {
      eventId: '00000000-0000-4000-8000-000000000100',
      idempotencyKey: 'promo-save20',
      promoCode: 'SAVE20',
      items: [
        {
          ticketTypeId: '00000000-0000-4000-8000-000000000200',
          qty: 1,
        },
      ],
    });

    expect(prisma.client.order.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          subtotalCents: 10000n,
          discountCents: 2000n,
          totalCents: 8000n,
          promoCodeId: 'promo_1',
        }),
      }),
    );
  });

  it('finalizes an order inside a transaction and records analytics', async () => {
    const prisma = createPrismaMock();
    const tx = createPrismaMock().client;
    prisma.client.$transaction.mockImplementation(async (callback: any) =>
      callback(tx),
    );
    tx.order.findFirst.mockResolvedValue({
      id: 'order_1',
      organizationId: ctx.organizationId,
      eventId: '00000000-0000-4000-8000-000000000100',
      status: 'pending',
      totalCents: 10000n,
      items: [
        {
          id: 'item_1',
          ticketTypeId: '00000000-0000-4000-8000-000000000200',
          qty: 2,
          ticketType: {
            id: '00000000-0000-4000-8000-000000000200',
            name: 'General',
          },
        },
      ],
      event: { id: '00000000-0000-4000-8000-000000000100' },
    });
    tx.ticket.create.mockResolvedValue({});
    tx.ticketType.update.mockResolvedValue({});
    tx.order.update.mockResolvedValue({
      id: 'order_1',
      status: 'completed',
      tickets: [],
      items: [],
    });
    const service = createService(prisma);

    await service.finalizeOrder(ctx, 'order_1');

    expect(prisma.client.$transaction).toHaveBeenCalledTimes(1);
    expect(tx.ticket.create).toHaveBeenCalledTimes(2);
    expect(tx.eventMetricHourly.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({
          registrations: 2,
          revenueCents: 10000n,
        }),
        update: expect.objectContaining({
          registrations: { increment: 2 },
          revenueCents: { increment: 10000n },
        }),
      }),
    );
  });
});
