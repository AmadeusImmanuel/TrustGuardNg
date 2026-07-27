-- Phase 1: status normalization, DB-level constraints, legacy column cleanup
BEGIN;

-- ── 1. Normalize dispute status casing ─────────────────────────────────────
UPDATE disputes SET status = UPPER(status) WHERE status IS NOT NULL;
ALTER TABLE disputes ALTER COLUMN status SET DEFAULT 'OPEN';

-- ── 2. CHECK constraints ─────────────────────────────────────────────────────
ALTER TABLE disputes
  ADD CONSTRAINT disputes_status_check
  CHECK (status IN ('OPEN', 'UNDER_REVIEW', 'RESOLVED'));

-- Includes Pending_Acceptance (confirmed live in DB), plus Rejected and
-- Modification_Requested (no live rows yet, but tradeSellerActions in
-- base44Client.js already calls /trades/:id/reject and
-- /trades/:id/request-modification — the API supports these transitions
-- even though the frontend has no UI for them yet. See Phase 2 note below.
ALTER TABLE trades
  ADD CONSTRAINT trades_status_check
  CHECK (status IN (
    'Pending_Acceptance', 'Rejected', 'Modification_Requested',
    'Awaiting_Payment', 'Funded', 'Shipped', 'Confirmed',
    'Disputed', 'Resolved', 'Cancelled'
  ));

ALTER TABLE payouts
  ADD CONSTRAINT payouts_status_check
  CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled'));

ALTER TABLE transactions
  ADD CONSTRAINT transactions_status_check
  CHECK (status IN ('pending', 'completed', 'failed', 'reversed'));

ALTER TABLE support_tickets
  ADD CONSTRAINT support_tickets_status_check
  CHECK (status IN ('open', 'answered', 'closed'));

ALTER TABLE webhook_events
  ADD CONSTRAINT webhook_events_status_check
  CHECK (status IN ('received', 'processed', 'failed'));

-- ── 3. Unique trade reference ────────────────────────────────────────────────
ALTER TABLE trades
  ADD CONSTRAINT trades_reference_unique UNIQUE (reference);

-- ── 4. Drop confirmed-unused legacy columns ──────────────────────────────────
-- Verified: 0 non-null rows across all six columns before this migration ran.
ALTER TABLE trades
  DROP COLUMN IF EXISTS asset,
  DROP COLUMN IF EXISTS type,
  DROP COLUMN IF EXISTS quantity,
  DROP COLUMN IF EXISTS price,
  DROP COLUMN IF EXISTS settled_at,
  DROP COLUMN IF EXISTS user_id;

COMMIT;
