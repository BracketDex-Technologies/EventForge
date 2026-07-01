CREATE TABLE IF NOT EXISTS "approval_policies" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "event_id" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "request_type" TEXT NOT NULL,
  "mode" TEXT NOT NULL DEFAULT 'conditional',
  "blocked_domains" JSONB NOT NULL DEFAULT '[]',
  "review_domains" JSONB NOT NULL DEFAULT '[]',
  "rules" JSONB,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "approval_policies_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "approval_policies_event_id_fkey"
    FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "approval_policies_event_id_request_type_is_active_idx"
ON "approval_policies"("event_id", "request_type", "is_active");

CREATE TABLE IF NOT EXISTS "approval_requests" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "event_id" UUID NOT NULL,
  "order_id" UUID,
  "ticket_id" UUID,
  "request_type" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "decision_reason" TEXT,
  "requester_email" TEXT,
  "payload" JSONB,
  "reviewed_by" UUID,
  "reviewed_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "approval_requests_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "approval_requests_event_id_fkey"
    FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "approval_requests_order_id_fkey"
    FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "approval_requests_ticket_id_fkey"
    FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "approval_requests_event_id_status_idx"
ON "approval_requests"("event_id", "status");

CREATE INDEX IF NOT EXISTS "approval_requests_order_id_idx"
ON "approval_requests"("order_id");

CREATE INDEX IF NOT EXISTS "approval_requests_ticket_id_idx"
ON "approval_requests"("ticket_id");
