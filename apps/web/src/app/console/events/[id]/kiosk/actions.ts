'use server';

import { prisma } from '@eventforge/db';
import { revalidatePath } from 'next/cache';

export async function kioskCheckIn(eventId: string, ticketCode: string) {
  try {
    const ticket = await prisma.ticket.findFirst({
      where: {
        eventId,
        code: ticketCode.toUpperCase().trim(),
        status: { in: ['valid', 'checked_in'] },
      },
      include: {
        ticketType: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!ticket) {
      return { success: false, error: 'Invalid ticket code. Please try again.' };
    }

    if (ticket.status === 'checked_in') {
      const attendeeData = (ticket.attendeeData as any) || {};
      const attendeeName = attendeeData.name || attendeeData.displayName || 'Attendee';
      return {
        success: true,
        alreadyCheckedIn: true,
        attendeeName,
        ticketType: ticket.ticketType.name,
      };
    }

    // Perform check-in
    await prisma.ticket.update({
      where: { id: ticket.id },
      data: {
        status: 'checked_in',
        checkedInAt: new Date(),
      },
    });

    // Create a CheckIn row
    await prisma.checkIn.create({
      data: {
        eventId,
        ticketId: ticket.id,
        channel: 'kiosk',
        method: 'lookup',
        meta: { device: 'Kiosk Terminal' },
      },
    });

    const attendeeData = (ticket.attendeeData as any) || {};
    const attendeeName = attendeeData.name || attendeeData.displayName || 'Attendee';

    revalidatePath(`/console/events/${eventId}/check-ins`);
    return {
      success: true,
      alreadyCheckedIn: false,
      attendeeName,
      ticketType: ticket.ticketType.name,
    };
  } catch (error) {
    console.error('Kiosk check-in error:', error);
    return { success: false, error: 'Server error during check-in.' };
  }
}
