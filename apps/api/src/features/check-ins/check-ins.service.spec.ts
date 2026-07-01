import { describe, expect, it, vi } from 'vitest';
import { CheckInsService } from './check-ins.service.js';

const ctx = {
  organizationId: '00000000-0000-4000-8000-000000000001',
  user: {
    id: '00000000-0000-4000-8000-000000000010',
    email: 'staff@example.com',
  },
  role: 'staff',
  isSuperAdmin: false,
  requestId: 'req_1',
} as any;

function createPrismaMock() {
  return {
    client: {
      event: { findFirst: vi.fn() },
      checkIn: {
        findFirst: vi.fn(),
        create: vi.fn(),
        count: vi.fn(),
        findMany: vi.fn(),
      },
      ticket: {
        findUnique: vi.fn(),
        update: vi.fn(),
        count: vi.fn(),
      },
      eventMetricHourly: { upsert: vi.fn() },
    },
  };
}

describe('CheckInsService', () => {
  it('returns the existing check-in for the same event and idempotency key', async () => {
    const prisma = createPrismaMock();
    prisma.client.event.findFirst.mockResolvedValue({
      id: '00000000-0000-4000-8000-000000000100',
      organizationId: ctx.organizationId,
    });
    prisma.client.checkIn.findFirst.mockResolvedValue({
      id: 'checkin_1',
      eventId: '00000000-0000-4000-8000-000000000100',
      idempotencyKey: 'scan-key-123',
    });
    const service = new CheckInsService(
      prisma as any,
      { record: vi.fn() } as any,
    );

    const result = await service.checkIn(ctx, {
      eventId: '00000000-0000-4000-8000-000000000100',
      ticketCode: 'TKT-123',
      channel: 'organizer_app',
      method: 'qr',
      idempotencyKey: 'scan-key-123',
    });

    expect(result.id).toBe('checkin_1');
    expect(prisma.client.ticket.findUnique).not.toHaveBeenCalled();
    expect(prisma.client.checkIn.create).not.toHaveBeenCalled();
  });

  it('records a check-in rollup after a new successful ticket scan', async () => {
    const prisma = createPrismaMock();
    prisma.client.event.findFirst.mockResolvedValue({
      id: '00000000-0000-4000-8000-000000000100',
      organizationId: ctx.organizationId,
    });
    prisma.client.checkIn.findFirst.mockResolvedValue(null);
    prisma.client.ticket.findUnique.mockResolvedValue({
      id: '00000000-0000-4000-8000-000000000200',
      eventId: '00000000-0000-4000-8000-000000000100',
      attendeeId: '00000000-0000-4000-8000-000000000300',
      status: 'valid',
      ticketType: { id: 'ticket_type_1' },
    });
    prisma.client.checkIn.create.mockResolvedValue({
      id: 'checkin_2',
      eventId: '00000000-0000-4000-8000-000000000100',
    });
    const service = new CheckInsService(
      prisma as any,
      { record: vi.fn() } as any,
    );

    await service.checkIn(ctx, {
      eventId: '00000000-0000-4000-8000-000000000100',
      ticketCode: 'TKT-123',
      channel: 'organizer_app',
      method: 'qr',
      idempotencyKey: 'scan-key-456',
    });

    expect(prisma.client.eventMetricHourly.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({ checkIns: 1 }),
        update: expect.objectContaining({ checkIns: { increment: 1 } }),
      }),
    );
  });
});
