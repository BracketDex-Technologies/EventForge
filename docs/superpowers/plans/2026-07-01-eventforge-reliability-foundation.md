# EventForge Reliability Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Harden EventForge checkout, order finalization, promo-code application, check-in idempotency, and analytics rollups so the platform can safely support larger paid events.

**Architecture:** Keep the current NestJS module boundaries and add focused behavior inside `OrdersService`, `CheckInsService`, and `AnalyticsService`. Use Prisma transactions for money/inventory writes and small pure helpers for discount and validation logic that can be tested through service behavior.

**Tech Stack:** NestJS 11, Prisma 6, Vitest for API unit tests, TypeScript, Supabase/Postgres data model.

---

## File Structure

- Modify: `apps/api/src/features/orders/orders.service.ts`
  - Owns checkout validation, idempotent order creation, promo-code application, Stripe checkout creation, and transactional finalization.
- Add: `apps/api/src/features/orders/orders.service.spec.ts`
  - Tests order idempotency, sale-window checks, quantity limits, promo-code discounts, and transactional finalization behavior.
- Modify: `apps/api/src/features/check-ins/check-ins.service.ts`
  - Owns idempotent check-in creation and analytics rollup after successful check-in.
- Add: `apps/api/src/features/check-ins/check-ins.service.spec.ts`
  - Tests check-in idempotency and duplicate ticket handling.
- Modify: `packages/db/prisma/schema.prisma`
  - Adds the minimal idempotency uniqueness needed for check-ins if the existing schema lacks it.
- Regenerate: Prisma client with `pnpm --filter @eventforge/db db:generate`.

## Task 1: Order Idempotency Test

**Files:**
- Create: `apps/api/src/features/orders/orders.service.spec.ts`
- Modify: `apps/api/src/features/orders/orders.service.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { BadRequestException, ConflictException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { OrdersService } from './orders.service.js';

const ctx = {
  organizationId: 'org_1',
  user: { id: 'user_1', email: 'buyer@example.com' },
  role: 'owner',
  isSuperAdmin: false,
  requestId: 'req_1',
} as any;

function createPrismaMock() {
  return {
    client: {
      event: { findFirst: vi.fn() },
      order: { findFirst: vi.fn(), create: vi.fn(), update: vi.fn() },
      ticketType: { findFirst: vi.fn(), update: vi.fn() },
      orderItem: { create: vi.fn() },
      ticket: { create: vi.fn() },
      promoCode: { findFirst: vi.fn(), update: vi.fn() },
      eventMetricHourly: { upsert: vi.fn() },
      $transaction: vi.fn(async (callback: any) => callback(createPrismaMock().client)),
    },
  };
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
      eventId: 'event_1',
      stripeCheckoutSessionId: null,
    });
    const service = createService(prisma);

    const result = await service.createCheckout(ctx, {
      eventId: 'event_1',
      idempotencyKey: 'same-key-123',
      items: [{ ticketTypeId: 'ticket_1', qty: 1 }],
    });

    expect(result).toEqual({
      orderId: 'order_existing',
      status: 'pending',
      checkoutUrl: null,
    });
    expect(prisma.client.event.findFirst).not.toHaveBeenCalled();
    expect(prisma.client.order.create).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @eventforge/api test -- apps/api/src/features/orders/orders.service.spec.ts`

Expected: FAIL because `createCheckout` does not check for an existing order before creating a new one.

- [ ] **Step 3: Implement minimal idempotency**

In `OrdersService.createCheckout`, before loading the event, add:

```ts
const existingOrder = await this.prisma.client.order.findFirst({
  where: {
    organizationId: ctx.organizationId,
    idempotencyKey: input.idempotencyKey,
  },
});
if (existingOrder) {
  return {
    orderId: existingOrder.id,
    status:
      existingOrder.status === 'completed'
        ? 'completed'
        : existingOrder.stripeCheckoutSessionId
          ? 'pending_payment'
          : existingOrder.status,
    checkoutUrl: null,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @eventforge/api test -- apps/api/src/features/orders/orders.service.spec.ts`

Expected: PASS.

## Task 2: Ticket Sale Rules And Promo Code Tests

**Files:**
- Modify: `apps/api/src/features/orders/orders.service.spec.ts`
- Modify: `apps/api/src/features/orders/orders.service.ts`

- [ ] **Step 1: Add failing tests**

Add these tests inside the existing `describe('OrdersService')` block:

```ts
it('rejects a ticket before its sale window opens', async () => {
  const prisma = createPrismaMock();
  prisma.client.order.findFirst.mockResolvedValue(null);
  prisma.client.event.findFirst.mockResolvedValue({ id: 'event_1', currency: 'usd' });
  prisma.client.ticketType.findFirst.mockResolvedValue({
    id: 'ticket_1',
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
      eventId: 'event_1',
      idempotencyKey: 'future-sale-123',
      items: [{ ticketTypeId: 'ticket_1', qty: 1 }],
    }),
  ).rejects.toThrow(BadRequestException);
});

it('applies a percent promo code to the order total', async () => {
  const prisma = createPrismaMock();
  prisma.client.order.findFirst.mockResolvedValue(null);
  prisma.client.event.findFirst.mockResolvedValue({ id: 'event_1', currency: 'usd' });
  prisma.client.ticketType.findFirst.mockResolvedValue({
    id: 'ticket_1',
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

  await service.createCheckout(ctx, {
    eventId: 'event_1',
    idempotencyKey: 'promo-save20',
    promoCode: 'SAVE20',
    items: [{ ticketTypeId: 'ticket_1', qty: 1 }],
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
```

- [ ] **Step 2: Run tests to verify failure**

Run: `pnpm --filter @eventforge/api test -- apps/api/src/features/orders/orders.service.spec.ts`

Expected: FAIL because sale windows and promo-code discounts are not enforced in `createCheckout`.

- [ ] **Step 3: Implement sale rules and promo application**

In `OrdersService`, add private helpers:

```ts
private assertTicketCanBeSold(ticketType: {
  name: string;
  minPerOrder: number;
  maxPerOrder: number;
  saleStartsAt: Date | null;
  saleEndsAt: Date | null;
}, qty: number): void {
  const now = new Date();
  if (qty < ticketType.minPerOrder || qty > ticketType.maxPerOrder) {
    throw new BadRequestException(
      `${ticketType.name} must be ordered between ${ticketType.minPerOrder} and ${ticketType.maxPerOrder} tickets at a time`,
    );
  }
  if (ticketType.saleStartsAt && ticketType.saleStartsAt > now) {
    throw new BadRequestException(`${ticketType.name} is not on sale yet`);
  }
  if (ticketType.saleEndsAt && ticketType.saleEndsAt < now) {
    throw new BadRequestException(`${ticketType.name} sales have ended`);
  }
}

private calculateDiscount(
  subtotalCents: number,
  promo: { kind: string; value: number } | null,
): number {
  if (!promo) {
    return 0;
  }
  if (promo.kind === 'percent') {
    return Math.min(subtotalCents, Math.floor((subtotalCents * promo.value) / 100));
  }
  return Math.min(subtotalCents, Math.round(promo.value * 100));
}
```

Inside the ticket loop, call:

```ts
this.assertTicketCanBeSold(ticketType, item.qty);
```

After subtotal calculation, load and apply promo:

```ts
const promo = input.promoCode
  ? await this.prisma.client.promoCode.findFirst({
      where: {
        eventId: input.eventId,
        code: input.promoCode.toUpperCase(),
      },
    })
  : null;
if (input.promoCode && !promo) {
  throw new BadRequestException('Promo code is invalid');
}
if (promo) {
  const now = new Date();
  if ((promo.validFrom && promo.validFrom > now) || (promo.validTo && promo.validTo < now)) {
    throw new BadRequestException('Promo code is not active');
  }
  if (promo.maxUses > 0 && promo.uses >= promo.maxUses) {
    throw new BadRequestException('Promo code usage limit reached');
  }
}
const discountCents = this.calculateDiscount(subtotalCents, promo);
const totalCents = subtotalCents - discountCents;
```

Set `discountCents` and `promoCodeId` on order creation.

- [ ] **Step 4: Run tests to verify pass**

Run: `pnpm --filter @eventforge/api test -- apps/api/src/features/orders/orders.service.spec.ts`

Expected: PASS.

## Task 3: Transactional Finalization Test

**Files:**
- Modify: `apps/api/src/features/orders/orders.service.spec.ts`
- Modify: `apps/api/src/features/orders/orders.service.ts`

- [ ] **Step 1: Add failing test**

Add:

```ts
it('finalizes an order inside a transaction and records analytics', async () => {
  const prisma = createPrismaMock();
  const tx = createPrismaMock().client;
  prisma.client.$transaction.mockImplementation(async (callback: any) => callback(tx));
  tx.order.findFirst.mockResolvedValue({
    id: 'order_1',
    organizationId: ctx.organizationId,
    eventId: 'event_1',
    status: 'pending',
    totalCents: 10000n,
    items: [
      {
        id: 'item_1',
        ticketTypeId: 'ticket_1',
        qty: 2,
        ticketType: { id: 'ticket_1', name: 'General' },
      },
    ],
    event: { id: 'event_1' },
  });
  tx.ticket.create.mockResolvedValue({});
  tx.ticketType.update.mockResolvedValue({});
  tx.order.update.mockResolvedValue({ id: 'order_1', status: 'completed', tickets: [], items: [] });
  const service = createService(prisma);

  await service.finalizeOrder(ctx, 'order_1');

  expect(prisma.client.$transaction).toHaveBeenCalledTimes(1);
  expect(tx.ticket.create).toHaveBeenCalledTimes(2);
  expect(tx.eventMetricHourly.upsert).toHaveBeenCalledWith(
    expect.objectContaining({
      create: expect.objectContaining({ registrations: 2, revenueCents: 10000n }),
      update: expect.objectContaining({
        registrations: { increment: 2 },
        revenueCents: { increment: 10000n },
      }),
    }),
  );
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `pnpm --filter @eventforge/api test -- apps/api/src/features/orders/orders.service.spec.ts`

Expected: FAIL because `finalizeOrder` does not use `$transaction` and does not record analytics.

- [ ] **Step 3: Implement transactional finalization**

Wrap `finalizeOrder` reads and writes in:

```ts
const updated = await this.prisma.client.$transaction(async (tx) => {
  const order = await tx.order.findFirst({
    where: { id: orderId, organizationId: ctx.organizationId },
    include: { items: { include: { ticketType: true } }, event: true },
  });
  if (!order) {
    throw new NotFoundException('Order not found');
  }
  if (order.status === 'completed') {
    return order;
  }

  let ticketCount = 0;
  for (const item of order.items) {
    for (let i = 0; i < item.qty; i++) {
      const code = this.generateTicketCode();
      await tx.ticket.create({
        data: {
          orderItemId: item.id,
          ticketTypeId: item.ticketTypeId,
          orderId: order.id,
          eventId: order.eventId,
          organizationId: order.organizationId,
          code,
          qrSecret: this.generateQrSecret(code),
        },
      });
      ticketCount += 1;
    }
    await tx.ticketType.update({
      where: { id: item.ticketTypeId },
      data: { quantitySold: { increment: item.qty } },
    });
  }

  await this.recordHourlyMetric(tx, order.eventId, {
    registrations: ticketCount,
    revenueCents: order.totalCents,
  });

  return tx.order.update({
    where: { id: orderId },
    data: { status: 'completed' },
    include: { tickets: true, items: true },
  });
});
```

Add helper:

```ts
private async recordHourlyMetric(
  tx: any,
  eventId: string,
  metric: { registrations?: number; revenueCents?: bigint; checkIns?: number; refundsCents?: bigint },
) {
  const hourBucket = new Date();
  hourBucket.setMinutes(0, 0, 0);
  return tx.eventMetricHourly.upsert({
    where: { eventId_hourBucket: { eventId, hourBucket } },
    create: {
      eventId,
      hourBucket,
      registrations: metric.registrations ?? 0,
      revenueCents: metric.revenueCents ?? 0n,
      checkIns: metric.checkIns ?? 0,
      refundsCents: metric.refundsCents ?? 0n,
    },
    update: {
      registrations: { increment: metric.registrations ?? 0 },
      revenueCents: { increment: metric.revenueCents ?? 0n },
      checkIns: { increment: metric.checkIns ?? 0 },
      refundsCents: { increment: metric.refundsCents ?? 0n },
    },
  });
}
```

- [ ] **Step 4: Run test to verify pass**

Run: `pnpm --filter @eventforge/api test -- apps/api/src/features/orders/orders.service.spec.ts`

Expected: PASS.

## Task 4: Check-In Idempotency Test

**Files:**
- Create: `apps/api/src/features/check-ins/check-ins.service.spec.ts`
- Modify: `apps/api/src/features/check-ins/check-ins.service.ts`
- Modify: `packages/db/prisma/schema.prisma`

- [ ] **Step 1: Write failing test**

```ts
import { describe, expect, it, vi } from 'vitest';
import { CheckInsService } from './check-ins.service.js';

const ctx = {
  organizationId: 'org_1',
  user: { id: 'staff_1', email: 'staff@example.com' },
  role: 'staff',
  isSuperAdmin: false,
  requestId: 'req_1',
} as any;

function createPrismaMock() {
  return {
    client: {
      event: { findFirst: vi.fn() },
      checkIn: { findFirst: vi.fn(), create: vi.fn(), count: vi.fn(), findMany: vi.fn() },
      ticket: { findUnique: vi.fn(), update: vi.fn(), count: vi.fn() },
      eventMetricHourly: { upsert: vi.fn() },
    },
  };
}

describe('CheckInsService', () => {
  it('returns the existing check-in for the same event and idempotency key', async () => {
    const prisma = createPrismaMock();
    prisma.client.event.findFirst.mockResolvedValue({ id: 'event_1', organizationId: ctx.organizationId });
    prisma.client.checkIn.findFirst.mockResolvedValue({
      id: 'checkin_1',
      eventId: 'event_1',
      idempotencyKey: 'scan-key-123',
    });
    const service = new CheckInsService(prisma as any, { record: vi.fn() } as any);

    const result = await service.checkIn(ctx, {
      eventId: 'event_1',
      ticketCode: 'TKT-123',
      channel: 'organizer_app',
      method: 'qr',
      idempotencyKey: 'scan-key-123',
    });

    expect(result.id).toBe('checkin_1');
    expect(prisma.client.ticket.findUnique).not.toHaveBeenCalled();
    expect(prisma.client.checkIn.create).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `pnpm --filter @eventforge/api test -- apps/api/src/features/check-ins/check-ins.service.spec.ts`

Expected: FAIL because `CheckInsService` does not query by idempotency key.

- [ ] **Step 3: Add schema support if missing**

In `packages/db/prisma/schema.prisma`, ensure `CheckIn` includes:

```prisma
  idempotencyKey String? @map("idempotency_key")

  @@unique([eventId, idempotencyKey])
```

Run: `pnpm --filter @eventforge/db db:generate`

- [ ] **Step 4: Implement service idempotency and check-in analytics**

At the start of `CheckInsService.checkIn`, after `ensureEventInTenant`, add:

```ts
const existing = await this.prisma.client.checkIn.findFirst({
  where: {
    eventId: input.eventId,
    idempotencyKey: input.idempotencyKey,
  },
});
if (existing) {
  return existing;
}
```

When creating the check-in, set:

```ts
idempotencyKey: input.idempotencyKey,
```

After successful creation, record the rollup:

```ts
await this.recordHourlyMetric(input.eventId, { checkIns: 1 });
```

Add helper:

```ts
private async recordHourlyMetric(eventId: string, metric: { checkIns?: number }) {
  const hourBucket = new Date();
  hourBucket.setMinutes(0, 0, 0);
  return this.prisma.client.eventMetricHourly.upsert({
    where: { eventId_hourBucket: { eventId, hourBucket } },
    create: {
      eventId,
      hourBucket,
      registrations: 0,
      revenueCents: 0n,
      checkIns: metric.checkIns ?? 0,
      refundsCents: 0n,
    },
    update: {
      checkIns: { increment: metric.checkIns ?? 0 },
    },
  });
}
```

- [ ] **Step 5: Run test to verify pass**

Run: `pnpm --filter @eventforge/api test -- apps/api/src/features/check-ins/check-ins.service.spec.ts`

Expected: PASS.

## Task 5: Verification

**Files:**
- No new files.

- [ ] **Step 1: Regenerate Prisma client**

Run: `pnpm --filter @eventforge/db db:generate`

Expected: Prisma Client generated successfully.

- [ ] **Step 2: Run API tests**

Run: `pnpm --filter @eventforge/api test`

Expected: All API tests pass.

- [ ] **Step 3: Run typechecks**

Run: `pnpm --filter @eventforge/api typecheck`

Expected: `tsc --noEmit` exits successfully.

Run: `pnpm --filter web typecheck`

Expected: `tsc --noEmit` exits successfully.

- [ ] **Step 4: Run production build**

Run: `pnpm build`

Expected: API, workers, and web build successfully. Next.js may warn that `middleware` is deprecated in favor of `proxy`; that warning is known and outside this slice.

## Self-Review

Spec coverage: this plan covers the approved first implementation slice: idempotent checkout, transactional order finalization, ticket sale rules, promo discounts, check-in idempotency, and analytics rollups.

Placeholder scan: no task uses TBD, TODO, or unspecified “handle later” language.

Type consistency: the plan uses existing service names, existing DTO fields, and Prisma models. The only schema addition is `CheckIn.idempotencyKey`.
