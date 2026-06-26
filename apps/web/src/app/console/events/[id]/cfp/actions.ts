'use server';

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@eventforge/db';
import { revalidatePath } from 'next/cache';

// Save/update CFP Config
export async function saveCfpConfig(
  eventId: string,
  data: {
    status: string;
    opensAt: string | null;
    closesAt: string | null;
    guidelines: string | null;
    maxSubmissions: number;
    reviewCriteria: any[];
    blindReview: boolean;
  }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    const config = await prisma.cfpConfig.upsert({
      where: { eventId },
      update: {
        status: data.status,
        opensAt: data.opensAt ? new Date(data.opensAt) : null,
        closesAt: data.closesAt ? new Date(data.closesAt) : null,
        guidelines: data.guidelines,
        maxSubmissions: data.maxSubmissions,
        reviewCriteria: data.reviewCriteria,
        blindReview: data.blindReview,
      },
      create: {
        eventId,
        status: data.status,
        opensAt: data.opensAt ? new Date(data.opensAt) : null,
        closesAt: data.closesAt ? new Date(data.closesAt) : null,
        guidelines: data.guidelines,
        maxSubmissions: data.maxSubmissions,
        reviewCriteria: data.reviewCriteria,
        blindReview: data.blindReview,
      },
    });

    revalidatePath(`/console/events/${eventId}/cfp`);
    return { success: true, data: config };
  } catch (error) {
    console.error('Failed to save CFP config:', error);
    return { success: false, error: 'Failed to save CFP configuration.' };
  }
}

// Submit a new Abstract (Public form)
export async function submitAbstract(
  eventId: string,
  data: {
    title: string;
    description: string;
    authorName: string;
    authorEmail: string;
    authorBio?: string;
    sessionType: string;
    tags: string[];
    attachmentUrl?: string;
  }
) {
  try {
    const config = await prisma.cfpConfig.findUnique({
      where: { eventId },
    });

    if (config && config.status !== 'open') {
      return { success: false, error: 'Call for papers is currently closed.' };
    }

    const abstract = await prisma.abstract.create({
      data: {
        eventId,
        title: data.title,
        description: data.description,
        authorName: data.authorName,
        authorEmail: data.authorEmail,
        authorBio: data.authorBio || null,
        sessionType: data.sessionType,
        tags: data.tags,
        attachmentUrl: data.attachmentUrl || null,
        status: 'submitted',
      },
    });

    revalidatePath(`/console/events/${eventId}/cfp`);
    return { success: true, data: abstract };
  } catch (error) {
    console.error('Failed to submit abstract:', error);
    return { success: false, error: 'Failed to submit abstract.' };
  }
}

// Submit a review for an abstract
export async function submitAbstractReview(
  eventId: string,
  abstractId: string,
  data: {
    scores: Record<string, number>;
    comment: string | null;
    recommend: string; // accept | reject | neutral
  }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    const review = await prisma.abstractReview.upsert({
      where: {
        abstractId_reviewerId: {
          abstractId,
          reviewerId: user.id,
        },
      },
      update: {
        scores: data.scores,
        comment: data.comment,
        recommend: data.recommend,
      },
      create: {
        abstractId,
        reviewerId: user.id,
        scores: data.scores,
        comment: data.comment,
        recommend: data.recommend,
      },
    });

    // Update average score on abstract
    const allReviews = await prisma.abstractReview.findMany({
      where: { abstractId },
    });

    let totalScoreSum = 0;
    let criteriaCount = 0;

    allReviews.forEach((r) => {
      const scores = (r.scores as Record<string, number>) || {};
      Object.values(scores).forEach((val) => {
        totalScoreSum += Number(val);
        criteriaCount++;
      });
    });

    const avgScore = criteriaCount > 0 ? totalScoreSum / allReviews.length : 0;

    await prisma.abstract.update({
      where: { id: abstractId },
      data: { avgScore, status: 'under_review' },
    });

    revalidatePath(`/console/events/${eventId}/cfp`);
    revalidatePath(`/console/events/${eventId}/cfp/${abstractId}`);
    return { success: true, data: review };
  } catch (error) {
    console.error('Failed to submit review:', error);
    return { success: false, error: 'Failed to submit review.' };
  }
}

// Update abstract status (Accept/Reject)
export async function updateAbstractStatus(
  eventId: string,
  abstractId: string,
  status: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    const abstract = await prisma.abstract.update({
      where: { id: abstractId },
      data: { status },
    });

    revalidatePath(`/console/events/${eventId}/cfp`);
    revalidatePath(`/console/events/${eventId}/cfp/${abstractId}`);
    return { success: true, data: abstract };
  } catch (error) {
    console.error('Failed to update abstract status:', error);
    return { success: false, error: 'Failed to update abstract status.' };
  }
}

// Convert abstract to event session + speaker
export async function convertToSession(eventId: string, abstractId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    const abstract = await prisma.abstract.findUnique({
      where: { id: abstractId },
    });

    if (!abstract) return { success: false, error: 'Abstract not found' };
    if (abstract.status !== 'accepted') {
      return { success: false, error: 'Only accepted abstracts can be converted to sessions.' };
    }

    // 1. Create speaker if not already exists for the event
    let speaker = await prisma.speaker.findFirst({
      where: { eventId, email: abstract.authorEmail },
    });

    if (!speaker) {
      speaker = await prisma.speaker.create({
        data: {
          eventId,
          name: abstract.authorName,
          email: abstract.authorEmail,
          bio: abstract.authorBio ? { en: abstract.authorBio } : {},
          status: 'confirmed',
        },
      });
    }

    // 2. Create the Session
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { startsAt: true },
    });

    const sessionStarts = event?.startsAt || new Date();
    const sessionEnds = new Date(sessionStarts.getTime() + 60 * 60 * 1000); // +1 hour fallback

    const session = await prisma.session.create({
      data: {
        eventId,
        title: { en: abstract.title },
        description: abstract.description ? { en: abstract.description } : {},
        startsAt: sessionStarts,
        endsAt: sessionEnds,
        type: abstract.sessionType || 'talk',
        trackId: abstract.trackId,
      },
    });

    // 3. Link speaker to session
    await prisma.sessionSpeaker.create({
      data: {
        sessionId: session.id,
        speakerId: speaker.id,
      },
    });

    // 4. Update the abstract with session id
    await prisma.abstract.update({
      where: { id: abstractId },
      data: { convertedSessionId: session.id },
    });

    revalidatePath(`/console/events/${eventId}/cfp`);
    revalidatePath(`/console/events/${eventId}/cfp/${abstractId}`);
    revalidatePath(`/console/events/${eventId}/agenda`);
    return { success: true, sessionId: session.id };
  } catch (error) {
    console.error('Failed to convert abstract to session:', error);
    return { success: false, error: 'Failed to convert to session.' };
  }
}
