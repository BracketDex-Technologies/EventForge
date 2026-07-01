/**
 * EventForge database seed script.
 *
 * Creates a deterministic demo organization, event, tickets, orders,
 * check-ins, engagement, exhibitors, and analytics for local demos.
 *
 * Usage:
 *   pnpm db:seed
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEMO_ORG_ID = '00000000-0000-4000-8000-000000000001';
const DEMO_USER_ID = '00000000-0000-4000-8000-000000000002';
const DEMO_EVENT_ID = '00000000-0000-4000-8000-000000000100';

const ids = {
  generalTicket: '00000000-0000-4000-8000-000000000201',
  vipTicket: '00000000-0000-4000-8000-000000000202',
  workshopTicket: '00000000-0000-4000-8000-000000000203',
  trackMain: '00000000-0000-4000-8000-000000000301',
  trackGrowth: '00000000-0000-4000-8000-000000000302',
  speakerA: '00000000-0000-4000-8000-000000000401',
  speakerB: '00000000-0000-4000-8000-000000000402',
  speakerC: '00000000-0000-4000-8000-000000000403',
  sessionA: '00000000-0000-4000-8000-000000000501',
  sessionB: '00000000-0000-4000-8000-000000000502',
  sessionC: '00000000-0000-4000-8000-000000000503',
  exhibitorA: '00000000-0000-4000-8000-000000000601',
  exhibitorB: '00000000-0000-4000-8000-000000000602',
  attendeeA: '00000000-0000-4000-8000-000000000701',
  attendeeB: '00000000-0000-4000-8000-000000000702',
  attendeeC: '00000000-0000-4000-8000-000000000703',
  orderA: '00000000-0000-4000-8000-000000000801',
  orderB: '00000000-0000-4000-8000-000000000802',
  itemA: '00000000-0000-4000-8000-000000000811',
  itemB: '00000000-0000-4000-8000-000000000812',
  ticketA: '00000000-0000-4000-8000-000000000821',
  ticketB: '00000000-0000-4000-8000-000000000822',
  ticketC: '00000000-0000-4000-8000-000000000823',
  pollA: '00000000-0000-4000-8000-000000000901',
  approvalPolicyA: '00000000-0000-4000-8000-000000001001',
  approvalRequestA: '00000000-0000-4000-8000-000000001002',
};

async function resetDemoEvent() {
  const eventId = DEMO_EVENT_ID;
  await prisma.leadCapture.deleteMany({
    where: { exhibitor: { eventId } },
  });
  await prisma.meeting.deleteMany({ where: { eventId } });
  await prisma.pollVote.deleteMany({
    where: { poll: { session: { eventId } } },
  });
  await prisma.poll.deleteMany({ where: { session: { eventId } } });
  await prisma.qaMessage.deleteMany({ where: { sessionId: { in: [ids.sessionA, ids.sessionB, ids.sessionC] } } });
  await prisma.checkIn.deleteMany({ where: { eventId } });
  await prisma.approvalRequest.deleteMany({ where: { eventId } });
  await prisma.approvalPolicy.deleteMany({ where: { eventId } });
  await prisma.ticket.deleteMany({ where: { eventId } });
  await prisma.orderItem.deleteMany({ where: { order: { eventId } } });
  await prisma.order.deleteMany({ where: { eventId } });
  await prisma.sessionSpeaker.deleteMany({
    where: { session: { eventId } },
  });
  await prisma.session.deleteMany({ where: { eventId } });
  await prisma.speaker.deleteMany({ where: { eventId } });
  await prisma.track.deleteMany({ where: { eventId } });
  await prisma.ticketType.deleteMany({ where: { eventId } });
  await prisma.promoCode.deleteMany({ where: { eventId } });
  await prisma.badgeTemplate.deleteMany({ where: { eventId } });
  await prisma.exhibitor.deleteMany({ where: { eventId } });
  await prisma.attendeeProfile.deleteMany({ where: { eventId } });
  await prisma.campaign.deleteMany({ where: { eventId } });
  await prisma.eventMetricHourly.deleteMany({ where: { eventId } });
  await prisma.eventLocale.deleteMany({ where: { eventId } });
  await prisma.eventPage.deleteMany({ where: { eventId } });
  await prisma.event.deleteMany({ where: { id: eventId } });
}

async function main() {
  console.log('Seeding EventForge demo data...');

  await resetDemoEvent();

  const org = await prisma.organization.upsert({
    where: { id: DEMO_ORG_ID },
    update: {
      name: 'EventForge Demo Organization',
      slug: 'eventforge-demo',
      plan: 'enterprise',
      brand: { primaryColor: '#0f1629', accentColor: '#4f46e5' },
    },
    create: {
      id: DEMO_ORG_ID,
      name: 'EventForge Demo Organization',
      slug: 'eventforge-demo',
      defaultCurrency: 'usd',
      defaultLocale: 'en',
      brand: { primaryColor: '#0f1629', accentColor: '#4f46e5' },
      plan: 'enterprise',
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'demo@eventforge.app' },
    update: {
      email: 'demo@eventforge.app',
      displayName: 'EventForge Demo Admin',
    },
    create: {
      id: DEMO_USER_ID,
      email: 'demo@eventforge.app',
      displayName: 'EventForge Demo Admin',
      avatarUrl: null,
    },
  });

  await prisma.organizationMember.upsert({
    where: {
      organizationId_userId: {
        organizationId: org.id,
        userId: user.id,
      },
    },
    update: { role: 'owner', status: 'active' },
    create: {
      organizationId: org.id,
      userId: user.id,
      role: 'owner',
      status: 'active',
      joinedAt: new Date(),
    },
  });

  const event = await prisma.event.create({
    data: {
      id: DEMO_EVENT_ID,
      organizationId: org.id,
      name: 'EventForge Summit 2026',
      type: 'hybrid',
      status: 'published',
      startsAt: new Date('2026-09-15T09:00:00Z'),
      endsAt: new Date('2026-09-17T18:00:00Z'),
      timezone: 'America/New_York',
      currency: 'usd',
      localeDefault: 'en',
      venue: {
        name: 'Grand Convention Center',
        address: { city: 'New York', country: 'USA' },
        capacity: 1200,
      },
      settings: {
        demo: true,
        aiOps: {
          riskScore: 18,
          checkInForecast: 'Main entrance queue peaks at 9:20 AM. Open two extra scanner lanes.',
          revenueForecast: 'Projected sellout in 13 days at current conversion velocity.',
        },
      },
      publishedAt: new Date(),
    },
  });

  await prisma.eventLocale.create({
    data: {
      eventId: event.id,
      locale: 'en',
      title: 'EventForge Summit 2026',
      summary:
        'A hybrid conference demo showing AI-powered ticketing, onsite operations, networking, expo, and analytics.',
      content: {
        ctaText: 'Register for the Demo Summit',
        aboutHtml:
          '<p>EventForge Summit is a production-style demo event with ticketing, check-ins, live engagement, sponsors, and AI operations intelligence.</p>',
      },
      seo: {
        title: 'EventForge Summit 2026',
        description: 'AI-first enterprise event operations demo.',
      },
    },
  });

  const [general, vip] = await Promise.all([
    prisma.ticketType.create({
      data: {
        id: ids.generalTicket,
        eventId: event.id,
        name: 'General Admission',
        kind: 'paid',
        priceCents: 19900n,
        currency: 'usd',
        quantityTotal: 900,
        quantitySold: 642,
        maxPerOrder: 10,
        sort: 0,
      },
    }),
    prisma.ticketType.create({
      data: {
        id: ids.vipTicket,
        eventId: event.id,
        name: 'VIP Experience',
        kind: 'paid',
        priceCents: 59900n,
        currency: 'usd',
        quantityTotal: 120,
        quantitySold: 91,
        maxPerOrder: 4,
        sort: 1,
      },
    }),
    prisma.ticketType.create({
      data: {
        id: ids.workshopTicket,
        eventId: event.id,
        name: 'AI Workshop Add-on',
        kind: 'addon',
        priceCents: 14900n,
        currency: 'usd',
        quantityTotal: 180,
        quantitySold: 143,
        maxPerOrder: 2,
        sort: 2,
      },
    }),
  ]);

  await prisma.promoCode.create({
    data: {
      eventId: event.id,
      code: 'SUMMIT20',
      kind: 'percent',
      value: 20,
      maxUses: 300,
      uses: 118,
      validFrom: new Date('2026-06-01T00:00:00Z'),
      validTo: new Date('2026-08-01T00:00:00Z'),
    },
  });

  const [mainTrack, growthTrack] = await Promise.all([
    prisma.track.create({
      data: { id: ids.trackMain, eventId: event.id, name: 'AI Operations', color: '#4f46e5', sort: 0 },
    }),
    prisma.track.create({
      data: { id: ids.trackGrowth, eventId: event.id, name: 'Revenue Growth', color: '#059669', sort: 1 },
    }),
  ]);

  const [speakerA, speakerB, speakerC] = await Promise.all([
    prisma.speaker.create({
      data: {
        id: ids.speakerA,
        eventId: event.id,
        name: 'Maya Chen',
        title: 'VP Event Operations',
        company: 'Northstar Cloud',
        bio: { en: 'Builds event operations systems for global conferences.' },
        status: 'confirmed',
      },
    }),
    prisma.speaker.create({
      data: {
        id: ids.speakerB,
        eventId: event.id,
        name: 'Rohan Mehta',
        title: 'Head of Growth',
        company: 'LaunchGrid',
        bio: { en: 'Turns event funnels into revenue systems.' },
        status: 'confirmed',
      },
    }),
    prisma.speaker.create({
      data: {
        id: ids.speakerC,
        eventId: event.id,
        name: 'Elena Park',
        title: 'AI Product Lead',
        company: 'SignalWorks',
        bio: { en: 'Designs AI agents for field teams.' },
        status: 'confirmed',
      },
    }),
  ]);

  const [sessionA, sessionB, sessionC] = await Promise.all([
    prisma.session.create({
      data: {
        id: ids.sessionA,
        eventId: event.id,
        trackId: mainTrack.id,
        title: { en: 'AI Command Centers for Live Events' },
        description: { en: 'How AI predicts bottlenecks, risk, and event-day action.' },
        startsAt: new Date('2026-09-15T10:00:00Z'),
        endsAt: new Date('2026-09-15T11:00:00Z'),
        type: 'keynote',
        capacity: 900,
        requiresRsvp: false,
        sort: 0,
      },
    }),
    prisma.session.create({
      data: {
        id: ids.sessionB,
        eventId: event.id,
        trackId: growthTrack.id,
        title: { en: 'Predictive Ticketing and Promo Timing' },
        description: { en: 'Using signals to price, promote, and fill rooms.' },
        startsAt: new Date('2026-09-15T13:00:00Z'),
        endsAt: new Date('2026-09-15T14:00:00Z'),
        type: 'workshop',
        capacity: 180,
        requiresRsvp: true,
        sort: 1,
      },
    }),
    prisma.session.create({
      data: {
        id: ids.sessionC,
        eventId: event.id,
        trackId: mainTrack.id,
        title: { en: 'Sponsor ROI in the Age of Intelligent Events' },
        description: { en: 'Lead scoring, booth analytics, and post-event follow-up.' },
        startsAt: new Date('2026-09-16T15:00:00Z'),
        endsAt: new Date('2026-09-16T16:00:00Z'),
        type: 'panel',
        capacity: 500,
        requiresRsvp: false,
        sort: 2,
      },
    }),
  ]);

  await prisma.sessionSpeaker.createMany({
    data: [
      { sessionId: sessionA.id, speakerId: speakerA.id, role: 'speaker' },
      { sessionId: sessionB.id, speakerId: speakerB.id, role: 'speaker' },
      { sessionId: sessionC.id, speakerId: speakerC.id, role: 'moderator' },
    ],
  });

  const [attendeeA, attendeeB, attendeeC] = await Promise.all([
    prisma.attendeeProfile.create({
      data: {
        id: ids.attendeeA,
        eventId: event.id,
        displayName: 'Alex Rivers',
        title: 'Senior Frontend Engineer',
        company: 'Vercel',
        interests: ['Next.js', 'AI', 'event apps'],
        points: 420,
      },
    }),
    prisma.attendeeProfile.create({
      data: {
        id: ids.attendeeB,
        eventId: event.id,
        displayName: 'Emily Watson',
        title: 'Product Manager',
        company: 'Stripe',
        interests: ['payments', 'ticketing', 'growth'],
        points: 360,
      },
    }),
    prisma.attendeeProfile.create({
      data: {
        id: ids.attendeeC,
        eventId: event.id,
        displayName: 'Jordan Lee',
        title: 'Sponsor Success Lead',
        company: 'HubSpot',
        interests: ['sponsor ROI', 'CRM', 'lead scoring'],
        points: 310,
      },
    }),
  ]);

  const [orderA, orderB] = await Promise.all([
    prisma.order.create({
      data: {
        id: ids.orderA,
        organizationId: org.id,
        eventId: event.id,
        buyerId: user.id,
        status: 'completed',
        subtotalCents: 39800n,
        discountCents: 7960n,
        totalCents: 31840n,
        currency: 'usd',
        idempotencyKey: 'seed-order-a',
      },
    }),
    prisma.order.create({
      data: {
        id: ids.orderB,
        organizationId: org.id,
        eventId: event.id,
        buyerId: user.id,
        status: 'completed',
        subtotalCents: 59900n,
        discountCents: 0n,
        totalCents: 59900n,
        currency: 'usd',
        idempotencyKey: 'seed-order-b',
      },
    }),
  ]);

  const [itemA, itemB] = await Promise.all([
    prisma.orderItem.create({
      data: {
        id: ids.itemA,
        orderId: orderA.id,
        ticketTypeId: general.id,
        qty: 2,
        unitPriceCents: general.priceCents,
      },
    }),
    prisma.orderItem.create({
      data: {
        id: ids.itemB,
        orderId: orderB.id,
        ticketTypeId: vip.id,
        qty: 1,
        unitPriceCents: vip.priceCents,
      },
    }),
  ]);

  await prisma.ticket.createMany({
    data: [
      {
        id: ids.ticketA,
        orderItemId: itemA.id,
        ticketTypeId: general.id,
        attendeeId: attendeeA.id,
        orderId: orderA.id,
        eventId: event.id,
        organizationId: org.id,
        status: 'checked_in',
        code: 'TKT-DEMO-ALEX',
        qrSecret: 'sig_demo_alex',
        attendeeData: { name: attendeeA.displayName, company: attendeeA.company },
        checkedInAt: new Date('2026-09-15T08:52:00Z'),
        checkedInBy: user.id,
      },
      {
        id: ids.ticketB,
        orderItemId: itemA.id,
        ticketTypeId: general.id,
        attendeeId: attendeeB.id,
        orderId: orderA.id,
        eventId: event.id,
        organizationId: org.id,
        status: 'checked_in',
        code: 'TKT-DEMO-EMILY',
        qrSecret: 'sig_demo_emily',
        attendeeData: { name: attendeeB.displayName, company: attendeeB.company },
        checkedInAt: new Date('2026-09-15T09:05:00Z'),
        checkedInBy: user.id,
      },
      {
        id: ids.ticketC,
        orderItemId: itemB.id,
        ticketTypeId: vip.id,
        attendeeId: attendeeC.id,
        orderId: orderB.id,
        eventId: event.id,
        organizationId: org.id,
        status: 'valid',
        code: 'TKT-DEMO-JORDAN',
        qrSecret: 'sig_demo_jordan',
        attendeeData: { name: attendeeC.displayName, company: attendeeC.company },
      },
    ],
  });

  await prisma.checkIn.createMany({
    data: [
      {
        eventId: event.id,
        ticketId: ids.ticketA,
        attendeeId: attendeeA.id,
        channel: 'organizer_app',
        method: 'qr',
        location: 'North Entrance',
        staffId: user.id,
        idempotencyKey: 'seed-checkin-alex',
        at: new Date('2026-09-15T08:52:00Z'),
      },
      {
        eventId: event.id,
        ticketId: ids.ticketB,
        attendeeId: attendeeB.id,
        channel: 'kiosk',
        method: 'qr',
        location: 'Self-service Kiosk 2',
        staffId: user.id,
        idempotencyKey: 'seed-checkin-emily',
        at: new Date('2026-09-15T09:05:00Z'),
      },
    ],
  });

  const [exhibitorA, exhibitorB] = await Promise.all([
    prisma.exhibitor.create({
      data: {
        id: ids.exhibitorA,
        eventId: event.id,
        name: 'SignalWorks AI',
        tier: 'platinum',
        boothNumber: 'A-01',
        leadsCaptured: 47,
        contactEmail: 'sponsors@signalworks.example',
        description: 'AI operations intelligence for high-scale live events.',
      },
    }),
    prisma.exhibitor.create({
      data: {
        id: ids.exhibitorB,
        eventId: event.id,
        name: 'LaunchGrid CRM',
        tier: 'gold',
        boothNumber: 'B-14',
        leadsCaptured: 32,
        contactEmail: 'events@launchgrid.example',
        description: 'Revenue workflows and CRM sync for event teams.',
      },
    }),
  ]);

  await prisma.leadCapture.createMany({
    data: [
      {
        exhibitorId: exhibitorA.id,
        attendeeId: attendeeA.id,
        ticketCode: 'TKT-DEMO-ALEX',
        notes: 'High intent: asked for AI check-in forecasting.',
        meta: { score: 92, nextBestAction: 'Send ops command center deck' },
      },
      {
        exhibitorId: exhibitorB.id,
        attendeeId: attendeeC.id,
        ticketCode: 'TKT-DEMO-JORDAN',
        notes: 'Interested in sponsor lead scoring.',
        meta: { score: 87, nextBestAction: 'Offer CRM integration demo' },
      },
    ],
  });

  await prisma.approvalPolicy.create({
    data: {
      id: ids.approvalPolicyA,
      eventId: event.id,
      name: 'Enterprise registration review',
      requestType: 'registration',
      mode: 'conditional',
      blockedDomains: ['blocked.example'],
      reviewDomains: ['enterprise.example', 'partner.example'],
      rules: {
        requireApprovalForQuantityAbove: 5,
        autoRouteTo: 'registration-ops',
      },
      isActive: true,
    },
  });

  await prisma.approvalRequest.create({
    data: {
      id: ids.approvalRequestA,
      eventId: event.id,
      orderId: orderB.id,
      requestType: 'registration',
      status: 'pending',
      requesterEmail: 'procurement@enterprise.example',
      decisionReason: 'Email domain requires organizer review.',
      payload: {
        attendeeCount: 4,
        company: 'Enterprise Example',
        requestedTicket: 'VIP Experience',
        aiSummary: 'Likely group buyer with sponsor meeting intent. Approve after procurement contact is confirmed.',
      },
    },
  });

  await prisma.meeting.create({
    data: {
      eventId: event.id,
      aAttendeeId: attendeeA.id,
      bAttendeeId: attendeeB.id,
      slot: new Date('2026-09-15T16:00:00Z'),
      status: 'accepted',
      roomUrl: 'https://meet.eventforge.local/demo-room',
      notes: 'AI matched: ticketing, payments, and event app workflows.',
    },
  });

  const poll = await prisma.poll.create({
    data: {
      id: ids.pollA,
      sessionId: sessionA.id,
      question: { en: 'Which event-day bottleneck should AI solve first?' },
      options: [
        { id: 'checkin', text: 'Check-in queues' },
        { id: 'badges', text: 'Badge printing' },
        { id: 'rooms', text: 'Room crowding' },
      ],
      status: 'live',
    },
  });

  await prisma.pollVote.createMany({
    data: [
      { pollId: poll.id, attendeeId: attendeeA.id, optionId: 'checkin' },
      { pollId: poll.id, attendeeId: attendeeB.id, optionId: 'badges' },
      { pollId: poll.id, attendeeId: attendeeC.id, optionId: 'checkin' },
    ],
  });

  await prisma.qaMessage.createMany({
    data: [
      {
        sessionId: sessionA.id,
        attendeeId: attendeeA.id,
        text: 'Can the ops command center forecast badge printer bottlenecks before doors open?',
        votes: 18,
      },
      {
        sessionId: sessionB.id,
        attendeeId: attendeeB.id,
        text: 'How does predictive ticketing decide whether to extend an early-bird offer?',
        votes: 11,
      },
    ],
  });

  await prisma.campaign.createMany({
    data: [
      {
        eventId: event.id,
        name: 'Early-bird conversion push',
        subject: { en: 'Your Summit discount ends soon' },
        bodyHtml: '<p>Use SUMMIT20 before the early-bird window closes.</p>',
        channel: 'email',
        status: 'sent',
        sentAt: new Date('2026-07-01T10:00:00Z'),
        recipientCount: 1840,
        openCount: 1088,
        clickCount: 342,
        bounceCount: 9,
      },
      {
        eventId: event.id,
        name: 'WhatsApp keynote reminder',
        subject: { en: 'AI Command Center starts in 20 minutes' },
        bodyHtml: '<p>Join the keynote in Hall A.</p>',
        channel: 'whatsapp',
        status: 'scheduled',
        scheduledAt: new Date('2026-09-15T09:40:00Z'),
        recipientCount: 736,
      },
    ],
  });

  await prisma.badgeTemplate.create({
    data: {
      eventId: event.id,
      name: 'Executive Summit Badge',
      paperSize: 'cr80',
      isDefault: true,
      layout: {
        elements: [
          { type: 'qr', x: 10, y: 10, size: 80 },
          { type: 'text', field: 'attendeeName', x: 100, y: 30, fontSize: 18 },
          { type: 'text', field: 'company', x: 100, y: 55, fontSize: 12 },
        ],
      },
    },
  });

  const baseHour = new Date('2026-09-15T09:00:00Z');
  await prisma.eventMetricHourly.createMany({
    data: [
      {
        eventId: event.id,
        hourBucket: new Date(baseHour.getTime() - 2 * 60 * 60 * 1000),
        registrations: 46,
        revenueCents: 916000n,
        checkIns: 0,
        pageViews: 640,
      },
      {
        eventId: event.id,
        hourBucket: new Date(baseHour.getTime() - 60 * 60 * 1000),
        registrations: 71,
        revenueCents: 1473000n,
        checkIns: 38,
        pageViews: 980,
      },
      {
        eventId: event.id,
        hourBucket: baseHour,
        registrations: 58,
        revenueCents: 1226000n,
        checkIns: 142,
        pageViews: 850,
      },
    ],
  });

  console.log('Demo data ready.');
  console.log(`Public event: /e/${event.id}`);
  console.log('Demo command center: /demo');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
