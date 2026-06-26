'use server';

import { createClient } from '@/lib/supabase/server';
import { prisma, Prisma } from '@eventforge/db';
import { revalidatePath } from 'next/cache';

export async function createSpeaker(
  eventId: string,
  data: {
    name: string;
    email: string;
    title: string;
    company: string;
    bio: string;
    photoUrl: string;
    status: string;
  }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    await prisma.speaker.create({
      data: {
        eventId,
        name: data.name,
        email: data.email || null,
        title: data.title || null,
        company: data.company || null,
        bio: data.bio ? { en: data.bio } : Prisma.DbNull,
        photoUrl: data.photoUrl || null,
        status: data.status || 'invited',
      },
    });

    revalidatePath(`/console/events/${eventId}/speakers`);
    return { success: true };
  } catch (error) {
    console.error('Failed to create speaker:', error);
    return { success: false, error: 'Failed to create speaker.' };
  }
}

export async function updateSpeaker(
  speakerId: string,
  eventId: string,
  data: {
    name: string;
    email: string;
    title: string;
    company: string;
    bio: string;
    photoUrl: string;
    status: string;
  }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    await prisma.speaker.update({
      where: { id: speakerId },
      data: {
        name: data.name,
        email: data.email || null,
        title: data.title || null,
        company: data.company || null,
        bio: data.bio ? { en: data.bio } : Prisma.DbNull,
        photoUrl: data.photoUrl || null,
        status: data.status,
      },
    });

    revalidatePath(`/console/events/${eventId}/speakers`);
    return { success: true };
  } catch (error) {
    console.error('Failed to update speaker:', error);
    return { success: false, error: 'Failed to update speaker.' };
  }
}

export async function deleteSpeaker(speakerId: string, eventId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    await prisma.speaker.delete({ where: { id: speakerId } });
    revalidatePath(`/console/events/${eventId}/speakers`);
    return { success: true };
  } catch (error) {
    console.error('Failed to delete speaker:', error);
    return { success: false, error: 'Failed to delete speaker.' };
  }
}
