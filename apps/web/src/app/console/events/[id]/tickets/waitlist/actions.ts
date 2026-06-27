'use server';

import { prisma } from '@eventforge/db';
import { revalidatePath } from 'next/cache';

/**
 * Join the waitlist for a sold-out ticket type.
 */
export async function joinWaitlist(eventId: string, ticketTypeId: string, email: string) {
  try {
    // Check if already on waitlist
    const existing = await prisma.waitlistEntry.findFirst({
      where: { eventId, ticketTypeId, email },
    });

    if (existing) {
      return { success: false, error: 'You are already on the waitlist.' };
    }

    // Get position (last + 1)
    const lastEntry = await prisma.waitlistEntry.findFirst({
      where: { eventId, ticketTypeId },
      orderBy: { position: 'desc' },
    });

    const position = (lastEntry?.position || 0) + 1;

    const entry = await prisma.waitlistEntry.create({
      data: {
        eventId,
        ticketTypeId,
        email,
        position,
      },
    });

    revalidatePath(`/console/events/${eventId}/tickets/waitlist`);
    return { success: true, data: entry };
  } catch (error) {
    console.error('Failed to join waitlist:', error);
    return { success: false, error: 'Failed to join waitlist.' };
  }
}

/**
 * Promote a waitlist entry — release the ticket to this person.
 */
export async function promoteWaitlistEntry(eventId: string, entryId: string) {
  try {
    const entry = await prisma.waitlistEntry.update({
      where: { id: entryId },
      data: {
        promotedAt: new Date(),
      },
    });

    revalidatePath(`/console/events/${eventId}/tickets/waitlist`);
    return { success: true, data: entry };
  } catch (error) {
    console.error('Failed to promote entry:', error);
    return { success: false, error: 'Failed to promote entry.' };
  }
}

/**
 * Remove from waitlist.
 */
export async function removeFromWaitlist(eventId: string, entryId: string) {
  try {
    await prisma.waitlistEntry.delete({
      where: { id: entryId },
    });

    revalidatePath(`/console/events/${eventId}/tickets/waitlist`);
    return { success: true };
  } catch (error) {
    console.error('Failed to remove from waitlist:', error);
    return { success: false, error: 'Failed to remove from waitlist.' };
  }
}
