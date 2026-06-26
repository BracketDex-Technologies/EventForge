'use server';

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@eventforge/db';
import { revalidatePath } from 'next/cache';

export async function createExhibitor(
  eventId: string,
  data: {
    name: string;
    tier: string;
    description?: string;
    logoUrl?: string;
    boothNumber?: string;
    contactEmail?: string;
    website?: string;
  }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    await prisma.exhibitor.create({
      data: {
        eventId,
        name: data.name,
        tier: data.tier || 'standard',
        description: data.description || null,
        logoUrl: data.logoUrl || null,
        boothNumber: data.boothNumber || null,
        contactEmail: data.contactEmail || null,
        website: data.website || null,
      },
    });

    revalidatePath(`/console/events/${eventId}/exhibitors`);
    return { success: true };
  } catch (error) {
    console.error('Failed to create exhibitor:', error);
    return { success: false, error: 'Failed to create exhibitor.' };
  }
}

export async function updateExhibitor(
  exhibitorId: string,
  eventId: string,
  data: {
    name: string;
    tier: string;
    description?: string;
    logoUrl?: string;
    boothNumber?: string;
    contactEmail?: string;
    website?: string;
  }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    await prisma.exhibitor.update({
      where: { id: exhibitorId },
      data: {
        name: data.name,
        tier: data.tier,
        description: data.description || null,
        logoUrl: data.logoUrl || null,
        boothNumber: data.boothNumber || null,
        contactEmail: data.contactEmail || null,
        website: data.website || null,
      },
    });

    revalidatePath(`/console/events/${eventId}/exhibitors`);
    return { success: true };
  } catch (error) {
    console.error('Failed to update exhibitor:', error);
    return { success: false, error: 'Failed to update exhibitor.' };
  }
}

export async function deleteExhibitor(exhibitorId: string, eventId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    await prisma.exhibitor.delete({
      where: { id: exhibitorId },
    });

    revalidatePath(`/console/events/${eventId}/exhibitors`);
    return { success: true };
  } catch (error) {
    console.error('Failed to delete exhibitor:', error);
    return { success: false, error: 'Failed to delete exhibitor.' };
  }
}
