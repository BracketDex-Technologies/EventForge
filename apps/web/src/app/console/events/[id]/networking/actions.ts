'use server';

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@eventforge/db';
import { revalidatePath } from 'next/cache';

export async function updateMeetingStatus(
  meetingId: string,
  eventId: string,
  status: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    await prisma.meeting.update({
      where: { id: meetingId },
      data: { status },
    });

    revalidatePath(`/console/events/${eventId}/networking`);
    return { success: true };
  } catch (error) {
    console.error('Failed to update meeting status:', error);
    return { success: false, error: 'Failed to update meeting status.' };
  }
}
