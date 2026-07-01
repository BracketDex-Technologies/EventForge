# EventForge Zoho Competitive Design

Date: 2026-07-01
Status: Approved for first implementation slice

## Goal

EventForge will compete with Zoho Backstage as an AI-first enterprise event operating system. The product must match the expected event-management baseline while differentiating through operational intelligence, predictive guidance, and reliable high-scale execution.

## Competitive Baseline

Zoho Backstage publicly positions around event planning, ticketing, onsite solutions, expo, analytics, branded event websites, marketing automation, mobile apps, attendee engagement, AI-powered matchmaking, floor planning, lead capture, gamification, webhooks, CRM integrations, certificate builder, custom domains, and white-labeled attendee apps.

The EventForge codebase already contains a broad foundation: Next.js public/console surfaces, NestJS modules for auth, organizations, events, tickets, orders, sessions, check-ins, polls, analytics, marketing, billing, Prisma models for many Backstage-equivalent areas, and worker scaffolding. The current risk is depth: many feature surfaces exist, but enterprise reliability, coverage, worker execution, scale testing, and AI workflows need hardening.

## Product Pillars

### Plan

Organizers create events, agendas, speakers, CFPs, sponsors, exhibitors, website pages, venue plans, rooms, floor plans, multilingual content, custom domains, and cloned event structures.

### Sell

Attendees and buyers use ticket groups, paid/free/add-on/companion tickets, RSVP invitations, approval workflows, promo codes, waitlists, embedded ticket widgets, tax invoices, refunds, transfers, and abandoned checkout recovery.

### Operate

Staff run QR check-in, kiosk mode, badge design and printing, session and zone access control, offline scan queues, live capacity monitoring, incident response, push announcements, and organizer PWA/mobile workflows.

### Engage

Attendees use personal agendas, bookmarks, polls, Q&A, chat, discussion channels, networking lounges, AI matchmaking, scheduled meetings, gamification, certificates, session recordings, and post-event community features.

### Grow

Organizers run email, WhatsApp, and push campaigns; automation workflows; affiliate tracking; CRM sync; exhibitor lead capture; lead privacy controls; attribution; revenue analytics; and post-event executive reports.

## AI Differentiators

1. Event Copilot: creates a draft event, agenda, tickets, landing page, and campaigns from natural language.
2. Agenda Optimizer: detects speaker conflicts, room overcapacity, weak session timing, and attendee-interest mismatches.
3. Predictive Ticketing: forecasts sellout risk, recommends promo timing, and suggests waitlist actions.
4. Ops Command Center: predicts check-in congestion, badge printer backlog, session crowding, and no-show risk.
5. Sponsor ROI Intelligence: ranks captured leads, summarizes booth performance, and drafts follow-ups.
6. Attendee Concierge: recommends agenda items, networking targets, directions, and reminders.
7. Post-Event Executive Report: generates a PDF or slide-ready summary with revenue, engagement, sponsor ROI, feedback, and next-event recommendations.

## First Implementation Slice

The first build slice is enterprise reliability for sell and operate:

1. Make checkout idempotent by `organizationId` and `idempotencyKey`.
2. Finalize orders transactionally so ticket creation, inventory increments, and order completion succeed or fail together.
3. Enforce ticket sale windows and per-order quantity limits.
4. Apply promo codes with use limits, date windows, and percent/flat discounts.
5. Make check-in idempotent by `idempotencyKey`, not only by ticket uniqueness.
6. Record analytics rollups when orders complete and attendees check in.

This slice is intentionally narrower than the full competitive vision. It strengthens the money path and onsite path before adding more AI and Zoho-parity surface area.

## Non-Goals For First Slice

The first slice does not build companion tickets, white-label mobile apps, session recordings, CRM sync, WhatsApp delivery, live AI agents, or floor-plan monetization. Those require stable orders, attendees, check-ins, workers, and analytics first.

## Success Criteria

1. Web, API, and worker builds pass.
2. API typecheck passes.
3. Order service tests prove idempotency, transactional finalization, promo-code discounts, sale-window enforcement, and inventory limits.
4. Check-in service tests prove idempotency and duplicate-ticket protection.
5. Existing public and console routes still build.
6. No unrelated user changes are reverted.
