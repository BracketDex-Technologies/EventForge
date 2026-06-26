'use server';

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@eventforge/db';
import { revalidatePath } from 'next/cache';

// Save/update Certificate Template
export async function saveCertificateTemplate(
  eventId: string,
  templateId: string | null,
  data: {
    name: string;
    style: string;
    layout: any;
    isDefault: boolean;
  }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    if (data.isDefault) {
      // Unset previous default templates
      await prisma.certificateTemplate.updateMany({
        where: { eventId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const template = templateId
      ? await prisma.certificateTemplate.update({
          where: { id: templateId },
          data: {
            name: data.name,
            style: data.style,
            layout: data.layout,
            isDefault: data.isDefault,
          },
        })
      : await prisma.certificateTemplate.create({
          data: {
            eventId,
            name: data.name,
            style: data.style,
            layout: data.layout,
            isDefault: data.isDefault,
          },
        });

    revalidatePath(`/console/events/${eventId}/certificates`);
    return { success: true, data: template };
  } catch (error) {
    console.error('Failed to save certificate template:', error);
    return { success: false, error: 'Failed to save certificate template.' };
  }
}

// Issue certificates to all event ticket holders / checked-in attendees
export async function issueCertificates(eventId: string, templateId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    const template = await prisma.certificateTemplate.findUnique({
      where: { id: templateId },
    });
    if (!template) return { success: false, error: 'Template not found' };

    // Fetch all valid tickets for this event
    const tickets = await prisma.ticket.findMany({
      where: { eventId, status: { in: ['valid', 'checked_in'] } },
    });

    if (tickets.length === 0) {
      return { success: false, error: 'No ticket holders found to issue certificates to.' };
    }

    let issuedCount = 0;

    for (const ticket of tickets) {
      const attendeeData = (ticket.attendeeData as any) || {};
      const attendeeName = attendeeData.name || attendeeData.displayName || 'Attendee';
      const attendeeEmail = attendeeData.email || 'attendee@example.com';

      // Check if certificate already issued
      const existing = await prisma.certificate.findFirst({
        where: { eventId, templateId, attendeeEmail },
      });

      if (!existing) {
        // Generate random unique verification code (8 chars alphanumeric uppercase)
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let verificationCode = '';
        let isUnique = false;

        while (!isUnique) {
          verificationCode = Array.from({ length: 8 }, () =>
            characters.charAt(Math.floor(Math.random() * characters.length))
          ).join('');

          const codeCheck = await prisma.certificate.findUnique({
            where: { verificationCode },
          });
          if (!codeCheck) isUnique = true;
        }

        // Mock PDF URL using a standard printable endpoint path
        const pdfUrl = `/e/${eventId}/verify/${verificationCode}/download`;

        await prisma.certificate.create({
          data: {
            eventId,
            templateId,
            attendeeName,
            attendeeEmail,
            verificationCode,
            pdfUrl,
          },
        });
        issuedCount++;
      }
    }

    revalidatePath(`/console/events/${eventId}/certificates`);
    return { success: true, issuedCount };
  } catch (error) {
    console.error('Failed to issue certificates:', error);
    return { success: false, error: 'Failed to bulk-issue certificates.' };
  }
}
