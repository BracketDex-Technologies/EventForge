'use server';

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@eventforge/db';
import { revalidatePath } from 'next/cache';

export async function createPromoCode(
  eventId: string,
  data: {
    code: string;
    kind: string;
    value: number;
    maxUses: number;
    validFrom?: string | null;
    validTo?: string | null;
  }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    // Check if code already exists for this event
    const existing = await prisma.promoCode.findUnique({
      where: {
        eventId_code: {
          eventId,
          code: data.code.toUpperCase().trim(),
        },
      },
    });

    if (existing) {
      return { success: false, error: 'Promo code already exists for this event.' };
    }

    await prisma.promoCode.create({
      data: {
        eventId,
        code: data.code.toUpperCase().trim(),
        kind: data.kind,
        value: data.value,
        maxUses: data.maxUses || 0,
        validFrom: data.validFrom ? new Date(data.validFrom) : null,
        validTo: data.validTo ? new Date(data.validTo) : null,
      },
    });

    revalidatePath(`/console/events/${eventId}/tickets/promos`);
    return { success: true };
  } catch (error) {
    console.error('Failed to create promo code:', error);
    return { success: false, error: 'Failed to create promo code.' };
  }
}

export async function deletePromoCode(promoCodeId: string, eventId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    await prisma.promoCode.delete({
      where: { id: promoCodeId },
    });

    revalidatePath(`/console/events/${eventId}/tickets/promos`);
    return { success: true };
  } catch (error) {
    console.error('Failed to delete promo code:', error);
    return { success: false, error: 'Failed to delete promo code.' };
  }
}
