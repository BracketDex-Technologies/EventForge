import { prisma } from '@eventforge/db';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import LiveEngagement from './LiveEngagement';

export default async function PublicPollsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
  
  const event = await prisma.event.findFirst({
    where: isUuid ? { id: slug, deletedAt: null } : { id: slug, deletedAt: null },
    include: {
      locales: { where: { locale: 'en' } }
    }
  });

  if (!event) notFound();

  // Find all sessions for the event
  const sessions = await prisma.session.findMany({
    where: { eventId: event.id },
    include: {
      polls: {
        where: { status: 'active' },
        include: {
          votes: true,
        },
      },
    },
    orderBy: { startsAt: 'asc' },
  });

  const sessionIds = sessions.map(s => s.id);

  // Load visible Q&A messages for these sessions
  const qaMessages = await prisma.qaMessage.findMany({
    where: {
      sessionId: { in: sessionIds },
      status: 'visible',
    },
    orderBy: { votes: 'desc' },
  });

  // Load attendee profiles for those who asked questions
  const attendeeIds = qaMessages.map(q => q.attendeeId);
  const attendeeProfiles = await prisma.attendeeProfile.findMany({
    where: { id: { in: attendeeIds } },
    select: { id: true, displayName: true },
  });

  const attendeeMap = new Map(attendeeProfiles.map(p => [p.id, p]));

  // Map Q&A messages with attendee details
  const formattedQaMessages = qaMessages.map(q => ({
    id: q.id,
    text: q.text,
    votes: q.votes,
    isAnonymous: q.isAnonymous,
    createdAt: q.createdAt.toISOString(),
    sessionId: q.sessionId,
    attendee: attendeeMap.get(q.attendeeId) ? {
      displayName: attendeeMap.get(q.attendeeId)!.displayName,
    } : undefined,
  }));

  // Group Q&A messages by session ID
  const sessionsWithEngagement = sessions.map(s => {
    const sessionQa = formattedQaMessages.filter(q => q.sessionId === s.id);
    return {
      id: s.id,
      title: s.title,
      polls: s.polls.map(p => ({
        id: p.id,
        question: p.question,
        options: p.options,
        votes: p.votes.map(v => ({
          id: v.id,
          optionId: v.optionId,
          attendeeId: v.attendeeId,
        })),
      })),
      qaMessages: sessionQa,
    };
  });

  // Check if current user is logged in and has an attendee profile
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let currentAttendeeId: string | null = null;
  if (user) {
    const profile = await prisma.attendeeProfile.findUnique({
      where: {
        eventId_userId: { eventId: event.id, userId: user.id },
      },
    });
    if (profile) {
      currentAttendeeId = profile.id;
    } else {
      // Create a default profile on the fly so they can engage
      const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
      const newProfile = await prisma.attendeeProfile.create({
        data: {
          eventId: event.id,
          userId: user.id,
          displayName: dbUser?.displayName || user.email?.split('@')[0] || 'Attendee',
          visibility: 'public',
          interests: [],
        },
      });
      currentAttendeeId = newProfile.id;
    }
  }

  return (
    <div className="max-w-4xl mx-auto w-full py-12 px-6">
      <div className="text-center space-y-2 mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Live Engagement Hub</h1>
        <p className="text-xs font-semibold text-slate-500">
          Cast your votes in live polls and submit questions directly to the speaker in real-time.
        </p>
      </div>

      {sessionsWithEngagement.length === 0 ? (
        <div className="ef-card p-16 text-center bg-white shadow-sm border border-slate-100">
          <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto text-xl mb-4">
            🗳️
          </div>
          <p className="font-bold text-slate-800 text-sm">No sessions scheduled yet</p>
          <p className="text-xs text-slate-400 mt-1">
            Agenda sessions and live engagement boards will appear here.
          </p>
        </div>
      ) : (
        <LiveEngagement
          eventId={event.id}
          sessions={sessionsWithEngagement}
          currentAttendeeId={currentAttendeeId}
        />
      )}
    </div>
  );
}
