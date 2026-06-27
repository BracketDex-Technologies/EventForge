'use server';

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@eventforge/db';
import { revalidatePath } from 'next/cache';

// Helper to get or create attendee profile for voting/Q&A
async function getOrCreateProfile(eventId: string, userId: string) {
  const existing = await prisma.attendeeProfile.findUnique({
    where: { eventId_userId: { eventId, userId } },
  });

  if (existing) return existing;

  // Fetch user details to create profile
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  return await prisma.attendeeProfile.create({
    data: {
      eventId,
      userId,
      displayName: user?.displayName || user?.email.split('@')[0] || 'Attendee',
      visibility: 'public',
      interests: [],
    },
  });
}

// Cast a vote in a poll
export async function submitPollVote(eventId: string, pollId: string, optionId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Please sign in to vote.' };

  try {
    const profile = await getOrCreateProfile(eventId, user.id);

    // Upsert vote
    const vote = await prisma.pollVote.upsert({
      where: {
        pollId_attendeeId: { pollId, attendeeId: profile.id },
      },
      update: {
        optionId,
      },
      create: {
        pollId,
        attendeeId: profile.id,
        optionId,
      },
    });

    revalidatePath(`/e/${eventId}/polls`);
    return { success: true, data: vote };
  } catch (error) {
    console.error('Failed to submit poll vote:', error);
    return { success: false, error: 'Failed to cast vote.' };
  }
}

// Submit a Q&A question
export async function submitQaMessage(
  eventId: string,
  sessionId: string,
  text: string,
  isAnonymous: boolean
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Please sign in to ask questions.' };

  try {
    const profile = await getOrCreateProfile(eventId, user.id);

    const message = await prisma.qaMessage.create({
      data: {
        sessionId,
        attendeeId: profile.id,
        text,
        isAnonymous,
        status: 'visible',
        votes: 1, // Start with self-upvote
      },
    });

    revalidatePath(`/e/${eventId}/polls`);
    return { success: true, data: message };
  } catch (error) {
    console.error('Failed to submit Q&A question:', error);
    return { success: false, error: 'Failed to submit question.' };
  }
}

// Upvote a Q&A question
export async function upvoteQaMessage(eventId: string, qaMessageId: string) {
  try {
    const message = await prisma.qaMessage.update({
      where: { id: qaMessageId },
      data: {
        votes: { increment: 1 },
      },
    });

    revalidatePath(`/e/${eventId}/polls`);
    return { success: true, data: message };
  } catch (error) {
    console.error('Failed to upvote Q&A:', error);
    return { success: false, error: 'Failed to upvote question.' };
  }
}
