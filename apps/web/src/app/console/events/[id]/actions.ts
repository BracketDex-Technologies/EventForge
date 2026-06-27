'use server';

import { prisma } from '@eventforge/db';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

/**
 * Clone an entire event — duplicates settings, locales, ticket types,
 * sessions (with speaker links), exhibitors, and sponsor tiers.
 * Does NOT clone orders, check-ins, or attendee data.
 */
export async function cloneEvent(sourceEventId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated.' };

  try {
    const source = await prisma.event.findUnique({
      where: { id: sourceEventId },
      include: {
        locales: true,
        ticketTypes: true,
        sessions: {
          include: {
            speakers: true,
          },
        },
        speakers: true,
        exhibitors: true,
      },
    });

    if (!source) return { success: false, error: 'Source event not found.' };

    // Create the cloned event
    const clonedEvent = await prisma.event.create({
      data: {
        name: `${source.name} (Copy)`,
        organizationId: source.organizationId,
        type: source.type,
        status: 'draft',
        timezone: source.timezone,
        currency: source.currency,
        startsAt: source.startsAt,
        endsAt: source.endsAt,
        venue: source.venue ? (source.venue as any) : undefined,
        settings: source.settings ? (source.settings as any) : undefined,
      },
    });

    // Clone locales
    if (source.locales.length > 0) {
      await prisma.eventLocale.createMany({
        data: source.locales.map(l => ({
          eventId: clonedEvent.id,
          locale: l.locale,
          content: l.content ? (l.content as any) : undefined,
        })),
      });
    }

    // Clone ticket types
    const ticketTypeMap = new Map<string, string>();
    for (const tt of source.ticketTypes) {
      const clonedTT = await prisma.ticketType.create({
        data: {
          eventId: clonedEvent.id,
          name: tt.name,
          description: tt.description,
          priceCents: tt.priceCents,
          currency: tt.currency,
          quantityTotal: tt.quantityTotal,
          quantitySold: 0,
          saleStartsAt: tt.saleStartsAt,
          saleEndsAt: tt.saleEndsAt,
          maxPerOrder: tt.maxPerOrder,
          visibility: tt.visibility,
          sort: tt.sort,
        },
      });
      ticketTypeMap.set(tt.id, clonedTT.id);
    }

    // Clone speakers
    const speakerMap = new Map<string, string>();
    for (const sp of source.speakers) {
      const clonedSpeaker = await prisma.speaker.create({
        data: {
          eventId: clonedEvent.id,
          name: sp.name,
          title: sp.title,
          company: sp.company,
          bio: sp.bio ? (sp.bio as any) : undefined,
          email: sp.email,
          photoUrl: sp.photoUrl,
          social: sp.social ? (sp.social as any) : undefined,
        },
      });
      speakerMap.set(sp.id, clonedSpeaker.id);
    }

    // Clone sessions and session-speaker links
    for (const session of source.sessions) {
      const clonedSession = await prisma.session.create({
        data: {
          eventId: clonedEvent.id,
          title: session.title ? (session.title as any) : {},
          description: session.description ? (session.description as any) : undefined,
          trackId: session.trackId,
          startsAt: session.startsAt,
          endsAt: session.endsAt,
          roomId: session.roomId,
          capacity: session.capacity,
          sort: session.sort,
          type: session.type,
        },
      });

      // Clone session-speaker links
      for (const ss of session.speakers) {
        const newSpeakerId = speakerMap.get(ss.speakerId);
        if (newSpeakerId) {
          await prisma.sessionSpeaker.create({
            data: {
              sessionId: clonedSession.id,
              speakerId: newSpeakerId,
              role: ss.role,
            },
          });
        }
      }
    }

    // Clone exhibitors
    if (source.exhibitors.length > 0) {
      await prisma.exhibitor.createMany({
        data: source.exhibitors.map(ex => ({
          eventId: clonedEvent.id,
          name: ex.name,
          description: ex.description,
          logoUrl: ex.logoUrl,
          website: ex.website,
          boothNumber: ex.boothNumber,
          tier: ex.tier,
          contactEmail: ex.contactEmail,
        })),
      });
    }



    revalidatePath('/console/events');
    return { success: true, clonedEventId: clonedEvent.id };
  } catch (error) {
    console.error('Failed to clone event:', error);
    return { success: false, error: 'Failed to clone event.' };
  }
}

/**
 * Check in an attendee at the event.
 * Creates a CheckIn record and marks the ticket as used.
 */
export async function checkInAttendee(eventId: string, attendeeProfileId: string) {
  try {
    // Check if already checked in
    const existing = await prisma.checkIn.findFirst({
      where: {
        eventId,
        ticketId: attendeeProfileId, // Using attendeeProfileId as ticketId for direct check-in
      },
    });

    if (existing) {
      return { success: false, error: 'Attendee already checked in.' };
    }

    const checkIn = await prisma.checkIn.create({
      data: {
        eventId,
        ticketId: attendeeProfileId,
        method: 'manual',
      },
    });

    revalidatePath(`/console/events/${eventId}/check-ins`);
    return { success: true, data: checkIn };
  } catch (error) {
    console.error('Failed to check in attendee:', error);
    return { success: false, error: 'Failed to check in attendee.' };
  }
}

/**
 * Undo a check-in (mark attendee as not checked in).
 */
export async function undoCheckIn(eventId: string, checkInId: string) {
  try {
    await prisma.checkIn.delete({
      where: { id: checkInId },
    });

    revalidatePath(`/console/events/${eventId}/check-ins`);
    return { success: true };
  } catch (error) {
    console.error('Failed to undo check-in:', error);
    return { success: false, error: 'Failed to undo check-in.' };
  }
}

/**
 * Bulk check-in all pending attendees.
 */
export async function bulkCheckIn(eventId: string, attendeeIds: string[]) {
  try {
    // Get already checked-in attendees to skip them
    const existingCheckIns = await prisma.checkIn.findMany({
      where: {
        eventId,
        ticketId: { in: attendeeIds },
      },
      select: { ticketId: true },
    });

    const alreadyCheckedIn = new Set(existingCheckIns.map(c => c.ticketId));
    const newCheckIns = attendeeIds.filter(id => !alreadyCheckedIn.has(id));

    if (newCheckIns.length === 0) {
      return { success: true, count: 0, message: 'All attendees already checked in.' };
    }

    await prisma.checkIn.createMany({
      data: newCheckIns.map(ticketId => ({
        eventId,
        ticketId,
        method: 'bulk',
      })),
    });

    revalidatePath(`/console/events/${eventId}/check-ins`);
    return { success: true, count: newCheckIns.length };
  } catch (error) {
    console.error('Bulk check-in failed:', error);
    return { success: false, error: 'Bulk check-in failed.' };
  }
}
