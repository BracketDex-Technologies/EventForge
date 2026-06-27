'use server';

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@eventforge/db';
import { revalidatePath } from 'next/cache';

// Fetch current attendee profile
export async function getAttendeeProfile(eventId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    const profile = await prisma.attendeeProfile.findUnique({
      where: {
        eventId_userId: { eventId, userId: user.id },
      },
    });

    return { success: true, data: profile };
  } catch (error) {
    console.error('Failed to get attendee profile:', error);
    return { success: false, error: 'Failed to load profile.' };
  }
}

// Upsert current attendee profile
export async function saveAttendeeProfile(
  eventId: string,
  data: {
    displayName: string;
    title: string | null;
    company: string | null;
    bio: string | null;
    interests: string[];
    visibility: 'public' | 'limited' | 'private';
  }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    const profile = await prisma.attendeeProfile.upsert({
      where: {
        eventId_userId: { eventId, userId: user.id },
      },
      update: {
        displayName: data.displayName,
        title: data.title,
        company: data.company,
        bio: data.bio,
        interests: data.interests,
        visibility: data.visibility,
      },
      create: {
        eventId,
        userId: user.id,
        displayName: data.displayName,
        title: data.title,
        company: data.company,
        bio: data.bio,
        interests: data.interests,
        visibility: data.visibility,
      },
    });

    revalidatePath(`/e/${eventId}/networking`);
    return { success: true, data: profile };
  } catch (error) {
    console.error('Failed to save attendee profile:', error);
    return { success: false, error: 'Failed to save profile.' };
  }
}

// Get other attendees
export async function getOtherAttendees(eventId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    const attendees = await prisma.attendeeProfile.findMany({
      where: {
        eventId,
        visibility: 'public',
        NOT: { userId: user.id },
      },
      orderBy: { displayName: 'asc' },
    });

    return { success: true, data: attendees };
  } catch (error) {
    console.error('Failed to get other attendees:', error);
    return { success: false, error: 'Failed to load attendees.' };
  }
}

// Book a 1:1 meeting request
export async function bookMeeting(
  eventId: string,
  recipientAttendeeId: string,
  slotIso: string,
  notes?: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    const initiator = await prisma.attendeeProfile.findUnique({
      where: {
        eventId_userId: { eventId, userId: user.id },
      },
    });

    if (!initiator) {
      return { success: false, error: 'Create your profile before scheduling meetings.' };
    }

    const meeting = await prisma.meeting.create({
      data: {
        eventId,
        aAttendeeId: initiator.id,
        bAttendeeId: recipientAttendeeId,
        slot: new Date(slotIso),
        status: 'pending',
        notes: notes || null,
        roomUrl: `https://meet.jit.si/eventforge-${eventId}-${Math.random().toString(36).substr(2, 9)}`,
      },
    });

    revalidatePath(`/e/${eventId}/networking`);
    return { success: true, data: meeting };
  } catch (error) {
    console.error('Failed to book meeting:', error);
    return { success: false, error: 'Failed to send meeting request.' };
  }
}

// Respond to meeting request
export async function respondMeeting(meetingId: string, eventId: string, status: 'accepted' | 'declined') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    const profile = await prisma.attendeeProfile.findUnique({
      where: {
        eventId_userId: { eventId, userId: user.id },
      },
    });

    if (!profile) return { success: false, error: 'Profile not found.' };

    const meeting = await prisma.meeting.findUnique({
      where: { id: meetingId },
    });

    if (!meeting || meeting.bAttendeeId !== profile.id) {
      return { success: false, error: 'Unauthorized to respond to this meeting.' };
    }

    const updated = await prisma.meeting.update({
      where: { id: meetingId },
      data: { status },
    });

    revalidatePath(`/e/${eventId}/networking`);
    return { success: true, data: updated };
  } catch (error) {
    console.error('Failed to respond to meeting:', error);
    return { success: false, error: 'Failed to update meeting status.' };
  }
}

// Get attendee meetings
export async function getAttendeeMeetings(eventId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    const profile = await prisma.attendeeProfile.findUnique({
      where: {
        eventId_userId: { eventId, userId: user.id },
      },
    });

    if (!profile) return { success: true, data: { sent: [], received: [] } };

    const sent = await prisma.meeting.findMany({
      where: {
        eventId,
        aAttendeeId: profile.id,
      },
      include: {
        bAttendee: true,
      },
      orderBy: { slot: 'asc' },
    });

    const received = await prisma.meeting.findMany({
      where: {
        eventId,
        bAttendeeId: profile.id,
      },
      include: {
        aAttendee: true,
      },
      orderBy: { slot: 'asc' },
    });

    return { success: true, data: { sent, received } };
  } catch (error) {
    console.error('Failed to load meetings:', error);
    return { success: false, error: 'Failed to load meetings.' };
  }
}
