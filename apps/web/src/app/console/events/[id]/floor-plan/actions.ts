'use server';

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@eventforge/db';
import { revalidatePath } from 'next/cache';

// Save/update Floor Plan
export async function saveFloorPlan(
  eventId: string,
  floorPlanId: string | null,
  data: {
    name: string;
    layout: any;
    bgImageUrl: string | null;
  }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    const floorPlan = floorPlanId
      ? await prisma.floorPlan.update({
          where: { id: floorPlanId },
          data: {
            name: data.name,
            layout: data.layout,
            bgImageUrl: data.bgImageUrl,
          },
        })
      : await prisma.floorPlan.create({
          data: {
            eventId,
            name: data.name,
            layout: data.layout,
            bgImageUrl: data.bgImageUrl,
          },
        });

    revalidatePath(`/console/events/${eventId}/floor-plan`);
    return { success: true, data: floorPlan };
  } catch (error) {
    console.error('Failed to save floor plan:', error);
    return { success: false, error: 'Failed to save floor plan.' };
  }
}
// TS refresh

