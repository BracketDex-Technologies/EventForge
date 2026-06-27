'use server';

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@eventforge/db';
import { revalidatePath } from 'next/cache';

// Send a push notification
export async function sendPushNotification(
  eventId: string,
  data: {
    title: string;
    body: string;
    url?: string;
  }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    // Count active subscriptions
    const subCount = await prisma.pushSubscription.count({
      where: { eventId },
    });

    const push = await prisma.pushNotification.create({
      data: {
        eventId,
        title: data.title,
        body: data.body,
        url: data.url || null,
        sentCount: subCount,
        status: 'sent',
        sentAt: new Date(),
      },
    });

    revalidatePath(`/console/events/${eventId}/notifications`);
    return { success: true, data: push };
  } catch (error) {
    console.error('Failed to send push notification:', error);
    return { success: false, error: 'Failed to send push notification.' };
  }
}

// Subscribe to push (Public client side subscription)
export async function subscribeToPush(
  eventId: string,
  data: {
    endpoint: string;
    keysP256dh: string;
    keysAuth: string;
  }
) {
  try {
    // Check if subscription already exists
    const existing = await prisma.pushSubscription.findFirst({
      where: {
        eventId,
        endpoint: data.endpoint,
      },
    });

    if (existing) {
      return { success: true, data: existing };
    }

    const sub = await prisma.pushSubscription.create({
      data: {
        eventId,
        endpoint: data.endpoint,
        keysP256dh: data.keysP256dh,
        keysAuth: data.keysAuth,
      },
    });

    return { success: true, data: sub };
  } catch (error) {
    console.error('Failed to save push subscription:', error);
    return { success: false, error: 'Failed to register subscription.' };
  }
}
// TS refresh

