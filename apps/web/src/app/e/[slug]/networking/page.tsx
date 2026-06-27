import { prisma } from '@eventforge/db';
import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import NetworkingPortal from './NetworkingPortal';

export default async function AttendeeNetworkingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);

  // Load Event
  const event = await prisma.event.findFirst({
    where: isUuid ? { id: slug, deletedAt: null } : { id: slug, deletedAt: null },
  });

  if (!event) notFound();

  // Check authentication
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // If not authenticated, redirect to the event's landing page or a sign-in gateway
    // We can redirect to `/login?redirectTo=/e/${event.id}/networking`
    redirect(`/login?redirectTo=/e/${event.id}/networking`);
  }

  // Load current attendee's profile for this event
  const currentProfile = await prisma.attendeeProfile.findUnique({
    where: {
      eventId_userId: { eventId: event.id, userId: user.id },
    },
  });

  // Load other public profiles
  const otherAttendees = await prisma.attendeeProfile.findMany({
    where: {
      eventId: event.id,
      visibility: 'public',
      NOT: { userId: user.id },
    },
    orderBy: { displayName: 'asc' },
  });

  // Load current meetings
  let sentMeetings: any[] = [];
  let receivedMeetings: any[] = [];

  if (currentProfile) {
    sentMeetings = await prisma.meeting.findMany({
      where: {
        eventId: event.id,
        aAttendeeId: currentProfile.id,
      },
      include: {
        bAttendee: true,
      },
      orderBy: { slot: 'asc' },
    });

    receivedMeetings = await prisma.meeting.findMany({
      where: {
        eventId: event.id,
        bAttendeeId: currentProfile.id,
      },
      include: {
        aAttendee: true,
      },
      orderBy: { slot: 'asc' },
    });
  }

  // Formatted data
  const formattedMeetings = {
    sent: sentMeetings.map(m => ({
      id: m.id,
      slot: m.slot.toISOString(),
      status: m.status as any,
      roomUrl: m.roomUrl,
      notes: m.notes,
      bAttendee: {
        id: m.bAttendee.id,
        displayName: m.bAttendee.displayName,
        title: m.bAttendee.title,
        company: m.bAttendee.company,
        bio: m.bAttendee.bio,
        interests: m.bAttendee.interests,
        photoUrl: m.bAttendee.photoUrl,
        social: m.bAttendee.social,
      },
    })),
    received: receivedMeetings.map(m => ({
      id: m.id,
      slot: m.slot.toISOString(),
      status: m.status as any,
      roomUrl: m.roomUrl,
      notes: m.notes,
      aAttendee: {
        id: m.aAttendee.id,
        displayName: m.aAttendee.displayName,
        title: m.aAttendee.title,
        company: m.aAttendee.company,
        bio: m.aAttendee.bio,
        interests: m.aAttendee.interests,
        photoUrl: m.aAttendee.photoUrl,
        social: m.aAttendee.social,
      },
    })),
  };

  const formattedProfile = currentProfile ? {
    id: currentProfile.id,
    displayName: currentProfile.displayName,
    title: currentProfile.title,
    company: currentProfile.company,
    bio: currentProfile.bio,
    interests: currentProfile.interests,
    photoUrl: currentProfile.photoUrl,
    social: currentProfile.social,
    visibility: currentProfile.visibility as any,
  } : null;

  const formattedOtherAttendees = otherAttendees.map(a => ({
    id: a.id,
    displayName: a.displayName,
    title: a.title,
    company: a.company,
    bio: a.bio,
    interests: a.interests,
    photoUrl: a.photoUrl,
    social: a.social,
  }));

  return (
    <div className="bg-slate-50 min-h-screen">
      <NetworkingPortal
        eventId={event.id}
        initialProfile={formattedProfile}
        initialAttendees={formattedOtherAttendees}
        initialMeetings={formattedMeetings}
      />
    </div>
  );
}
