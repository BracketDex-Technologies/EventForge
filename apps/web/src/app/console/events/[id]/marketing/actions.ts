'use server';

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@eventforge/db';
import { revalidatePath } from 'next/cache';

export async function createCampaign(
  eventId: string,
  data: {
    name: string;
    subject: string;
    bodyHtml: string;
    status: string;
    scheduledAt: string | null;
    channel: string;
  }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    await prisma.campaign.create({
      data: {
        eventId,
        name: data.name,
        subject: { en: data.subject },
        bodyHtml: data.bodyHtml,
        status: data.status || 'draft',
        channel: data.channel || 'email',
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      },
    });

    revalidatePath(`/console/events/${eventId}/marketing`);
    return { success: true };
  } catch (error) {
    console.error('Failed to create campaign:', error);
    return { success: false, error: 'Failed to create campaign.' };
  }
}

export async function updateCampaignStatus(
  campaignId: string,
  eventId: string,
  status: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    const updateData: Record<string, unknown> = { status };
    if (status === 'sent') {
      updateData.sentAt = new Date();
    }

    await prisma.campaign.update({
      where: { id: campaignId },
      data: updateData,
    });

    revalidatePath(`/console/events/${eventId}/marketing`);
    return { success: true };
  } catch (error) {
    console.error('Failed to update campaign:', error);
    return { success: false, error: 'Failed to update campaign status.' };
  }
}

export async function deleteCampaign(campaignId: string, eventId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    await prisma.campaign.delete({ where: { id: campaignId } });
    revalidatePath(`/console/events/${eventId}/marketing`);
    return { success: true };
  } catch (error) {
    console.error('Failed to delete campaign:', error);
    return { success: false, error: 'Failed to delete campaign.' };
  }
}
// TS refresh

