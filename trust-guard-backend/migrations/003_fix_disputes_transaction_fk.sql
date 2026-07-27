-- Fix: disputes.transaction_id is used throughout the application as a
-- reference to trades.id (see server.js dispute-detail route: JOIN trades t
-- ON t.id = d.transaction_id, and TradeDetail.jsx passing trade.id when
-- creating a dispute) — but the foreign key was pointing at transactions.id
-- instead. This meant raising a dispute failed with a FK violation any time
-- the trade's UUID didn't coincidentally match a row in `transactions`,
-- i.e. essentially always. Correcting the constraint to match actual usage.

BEGIN;

ALTER TABLE disputes DROP CONSTRAINT disputes_transaction_id_fkey;

ALTER TABLE disputes
  ADD CONSTRAINT disputes_transaction_id_fkey
  FOREIGN KEY (transaction_id) REFERENCES trades(id);

COMMIT;
