'use server';

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@eventforge/db';
import { revalidatePath } from 'next/cache';

export async function createTicketType(
  eventId: string,
  data: {
    name: string;
    kind: string;
    price: number; // in dollars/euros, we will convert to cents
    quantityTotal: number;
    description: string;
  }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { currency: true }
    });

    if (!event) {
      return { success: false, error: 'Event not found' };
    }

    const priceCents = Math.round(data.price * 100);

    await prisma.ticketType.create({
      data: {
        eventId,
        name: data.name,
        kind: data.kind,
        priceCents,
        currency: event.currency,
        quantityTotal: data.quantityTotal,
        description: data.description,
        visibility: 'public',
        minPerOrder: 1,
        maxPerOrder: 10,
      },
    });

    revalidatePath(`/console/events/${eventId}/tickets`);
    
    return { success: true };
  } catch (error) {
    console.error('Failed to create ticket type:', error);
    return { success: false, error: 'Failed to create ticket tier.' };
  }
}
