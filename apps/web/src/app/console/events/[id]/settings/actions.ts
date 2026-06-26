'use server';

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@eventforge/db';
import { revalidatePath } from 'next/cache';

export async function updateEventDetails(
  eventId: string,
  data: {
    name: string;
    type: string;
    status: string;
    timezone: string;
    currency: string;
  }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await prisma.event.update({
      where: { id: eventId },
      data: {
        name: data.name,
        type: data.type,
        status: data.status,
        timezone: data.timezone,
        currency: data.currency,
      },
    });

    revalidatePath(`/console/events/${eventId}/settings`);
    revalidatePath(`/console/events/${eventId}`);
    
    return { success: true };
  } catch (error) {
    console.error('Failed to update event:', error);
    return { success: false, error: 'Failed to update event details.' };
  }
}

export async function updateEventIntegrations(
  eventId: string,
  data: {
    webhookUrl: string;
    webhookSecret: string;
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
      select: { settings: true }
    });

    if (!event) {
      return { success: false, error: 'Event not found' };
    }

    const currentSettings = (event.settings as Record<string, any>) || {};
    
    await prisma.event.update({
      where: { id: eventId },
      data: {
        settings: {
          ...currentSettings,
          webhookUrl: data.webhookUrl,
          webhookSecret: data.webhookSecret,
        }
      },
    });

    revalidatePath(`/console/events/${eventId}/settings`);
    
    return { success: true };
  } catch (error) {
    console.error('Failed to update integrations:', error);
    return { success: false, error: 'Failed to update integrations.' };
  }
}

export async function updateEmailProvider(
  eventId: string,
  data: {
    emailProvider: string;
    emailApiKey: string;
    emailFromAddress: string;
    emailFromName: string;
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
      select: { settings: true }
    });

    if (!event) {
      return { success: false, error: 'Event not found' };
    }

    const currentSettings = (event.settings as Record<string, any>) || {};
    
    await prisma.event.update({
      where: { id: eventId },
      data: {
        settings: {
          ...currentSettings,
          emailProvider: data.emailProvider,
          emailApiKey: data.emailApiKey,
          emailFromAddress: data.emailFromAddress,
          emailFromName: data.emailFromName,
        }
      },
    });

    revalidatePath(`/console/events/${eventId}/settings`);
    
    return { success: true };
  } catch (error) {
    console.error('Failed to update email provider:', error);
    return { success: false, error: 'Failed to update email provider settings.' };
  }
}

export async function updatePrivacySettings(
  eventId: string,
  data: {
    autoDeletePii: boolean;
    piiRetentionDays: number;
    cookieConsentBanner: boolean;
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
      select: { settings: true }
    });

    if (!event) {
      return { success: false, error: 'Event not found' };
    }

    const currentSettings = (event.settings as Record<string, any>) || {};
    
    await prisma.event.update({
      where: { id: eventId },
      data: {
        settings: {
          ...currentSettings,
          autoDeletePii: data.autoDeletePii,
          piiRetentionDays: data.piiRetentionDays,
          cookieConsentBanner: data.cookieConsentBanner,
        }
      },
    });

    revalidatePath(`/console/events/${eventId}/settings`);
    
    return { success: true };
  } catch (error) {
    console.error('Failed to update privacy settings:', error);
    return { success: false, error: 'Failed to update privacy settings.' };
  }
}
