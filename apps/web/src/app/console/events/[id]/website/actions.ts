'use server';

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@eventforge/db';
import { revalidatePath } from 'next/cache';

// Save website page blocks draft
export async function savePageDraft(
  eventId: string,
  slug: string,
  builderDoc: any
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    const page = await prisma.eventPage.upsert({
      where: {
        eventId_slug: { eventId, slug },
      },
      update: {
        builderDoc,
      },
      create: {
        eventId,
        slug,
        builderDoc,
      },
    });

    revalidatePath(`/console/events/${eventId}/website`);
    return { success: true, data: page };
  } catch (error) {
    console.error('Failed to save page draft:', error);
    return { success: false, error: 'Failed to save page draft.' };
  }
}

// Publish page draft to public view
export async function publishPage(eventId: string, slug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    const page = await prisma.eventPage.findUnique({
      where: {
        eventId_slug: { eventId, slug },
      },
    });

    if (!page) return { success: false, error: 'Page not found. Save draft first.' };

    const updatedPage = await prisma.eventPage.update({
      where: { id: page.id },
      data: {
        publishedDoc: page.builderDoc ?? undefined,
        version: { increment: 1 },
      },
    });

    revalidatePath(`/console/events/${eventId}/website`);
    revalidatePath(`/e/${eventId}`);
    return { success: true, data: updatedPage };
  } catch (error) {
    console.error('Failed to publish page:', error);
    return { success: false, error: 'Failed to publish page.' };
  }
}
