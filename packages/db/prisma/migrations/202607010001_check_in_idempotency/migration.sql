ALTER TABLE "check_ins"
ADD COLUMN IF NOT EXISTS "idempotency_key" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "check_ins_event_id_idempotency_key_key"
ON "check_ins"("event_id", "idempotency_key");
