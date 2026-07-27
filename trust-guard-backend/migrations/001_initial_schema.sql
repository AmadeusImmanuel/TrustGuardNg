-- TrustGuard Nigeria — Initial Schema Snapshot
-- Captured from live database on the date this migration was written.
-- This is a DOCUMENTATION migration: it reflects the schema as it
-- currently exists in production/dev, not a fresh CREATE for an empty DB.
-- Do not run this against a database that already has these tables.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ─── users ──────────────────────────────────────────────────────────────
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email character varying(255) NOT NULL UNIQUE,
  password_hash text NOT NULL,
  full_name character varying(255),
  role character varying(50) DEFAULT 'user',
  status character varying(50) DEFAULT 'active',
  created_date timestamptz DEFAULT now(),
  updated_date timestamptz DEFAULT now(),
  reset_token text,
  reset_token_expires timestamptz,
  wallet_balance numeric DEFAULT 0,
  kyc_status character varying(50) DEFAULT 'none',
  kyc_bvn character varying(20),
  kyc_nin character varying(20),
  phone character varying(20),
  trust_score integer DEFAULT 0,
  trust_level character varying(20) DEFAULT 'Bronze',
  completed_trades integer DEFAULT 0,
  cancelled_trades integer DEFAULT 0,
  total_disputes integer DEFAULT 0,
  rating_sum numeric DEFAULT 0,
  rating_count integer DEFAULT 0,
  risk_score integer DEFAULT 0,
  risk_level character varying(20) DEFAULT 'low',
  flagged boolean DEFAULT false,
  last_login_ip character varying(50),
  notification_email boolean DEFAULT true,
  notification_sms boolean DEFAULT true,
  notification_inapp boolean DEFAULT true,
  profile_public boolean DEFAULT true,
  show_email boolean DEFAULT false
);

-- ─── trades ─────────────────────────────────────────────────────────────
-- NOTE: asset/type/quantity/price/settled_at/user_id appear to be legacy
-- columns from an earlier generic-trading schema. Not used by current
-- escrow application code. Flagged for review/removal in a later phase.
CREATE TABLE trades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),               -- legacy, unused by app
  asset character varying(100),                     -- legacy, unused by app
  type character varying(20),                        -- legacy, unused by app
  quantity numeric,                                   -- legacy, unused by app
  price numeric,                                      -- legacy, unused by app
  status character varying(50) DEFAULT 'open',
  settled_at timestamptz,                             -- legacy, unused by app
  created_date timestamptz DEFAULT now(),
  updated_date timestamptz DEFAULT now(),
  buyer_id uuid REFERENCES users(id),
  seller_id uuid REFERENCES users(id),
  buyer_email character varying(255),
  buyer_name character varying(255),
  seller_email character varying(255),
  seller_name character varying(255),
  item_name character varying(255),
  item_description text,
  calculated_fee numeric,
  fee_payer character varying(20),
  virtual_bank_name character varying(100),
  virtual_account_number character varying(20),
  virtual_account_expires_at timestamptz,
  delivery_deadline date,
  shipped_at timestamptz,
  confirmed_at timestamptz,
  auto_release_at timestamptz,
  dispatch_company character varying(255),
  rider_name character varying(255),
  rider_phone character varying(20),
  tracking_code character varying(100),
  reference character varying(255),                   -- NOT currently unique, should be
  amount numeric,
  release_days integer DEFAULT 2,
  seller_message text,
  accepted_at timestamptz,
  rejected_at timestamptz
);

-- ─── transactions ───────────────────────────────────────────────────────
CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  amount numeric NOT NULL,
  currency character varying(10) DEFAULT 'USD',        -- app uses NGN in practice; verify
  type character varying(50),
  status character varying(50) DEFAULT 'pending',
  reference character varying(255),
  description text,
  metadata jsonb,
  created_date timestamptz DEFAULT now(),
  updated_date timestamptz DEFAULT now(),
  trade_id uuid REFERENCES trades(id),
  trade_reference character varying(255),
  user_name character varying(255),
  fee_collected numeric,
  direction character varying(10)
);

-- ─── disputes ───────────────────────────────────────────────────────────
-- NOTE: DB default status is 'open' (lowercase) but application code
-- consistently uses uppercase values ('OPEN', 'UNDER_REVIEW', 'RESOLVED').
-- This default is misleading and should be corrected — flagged for Phase 1.
CREATE TABLE disputes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid REFERENCES transactions(id),
  user_id uuid REFERENCES users(id),
  reason text,
  status character varying(50) DEFAULT 'open',          -- see note above
  evidence jsonb,
  resolution text,
  amount numeric,
  created_date timestamptz DEFAULT now(),
  updated_date timestamptz DEFAULT now(),
  evidence_files jsonb DEFAULT '[]',
  timeline jsonb DEFAULT '[]',
  admin_notes text,
  appeal_reason text,
  appealed_at timestamptz,
  raised_by_id uuid REFERENCES users(id),
  raised_by_role character varying(10)
);

-- ─── payouts ────────────────────────────────────────────────────────────
CREATE TABLE payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  amount numeric NOT NULL,
  currency character varying(10) DEFAULT 'USD',
  status character varying(50) DEFAULT 'pending',
  bank_account jsonb,
  reference character varying(255),
  scheduled_date timestamptz,
  created_date timestamptz DEFAULT now(),
  updated_date timestamptz DEFAULT now()
);

-- ─── reviews ────────────────────────────────────────────────────────────
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trade_id uuid REFERENCES trades(id),
  reviewer_id uuid REFERENCES users(id),
  reviewee_id uuid REFERENCES users(id),
  rating integer NOT NULL,
  comment text,
  reviewer_role character varying(10),
  created_date timestamptz DEFAULT now()
);
CREATE INDEX idx_reviews_reviewee ON reviews(reviewee_id);
CREATE INDEX idx_reviews_trade ON reviews(trade_id);

-- ─── notifications ──────────────────────────────────────────────────────
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  title character varying(255) NOT NULL,
  message text NOT NULL,
  type character varying(50) DEFAULT 'info',
  read boolean DEFAULT false,
  link character varying(255),
  created_date timestamptz DEFAULT now()
);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, read);

-- ─── support_tickets ────────────────────────────────────────────────────
CREATE TABLE support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  user_email character varying(255),
  subject character varying(255) NOT NULL,
  message text NOT NULL,
  status character varying(20) DEFAULT 'open',
  priority character varying(20) DEFAULT 'normal',
  admin_response text,
  responded_at timestamptz,
  created_date timestamptz DEFAULT now(),
  updated_date timestamptz DEFAULT now()
);
CREATE INDEX idx_support_tickets_user ON support_tickets(user_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);

-- ─── fraud_alerts ───────────────────────────────────────────────────────
CREATE TABLE fraud_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  alert_type character varying(100) NOT NULL,
  severity character varying(20) DEFAULT 'medium',
  description text,
  metadata jsonb,
  resolved boolean DEFAULT false,
  resolved_by uuid REFERENCES users(id),
  created_date timestamptz DEFAULT now()
);
CREATE INDEX idx_fraud_alerts_user ON fraud_alerts(user_id);
CREATE INDEX idx_fraud_alerts_resolved ON fraud_alerts(resolved);

-- ─── blacklist ──────────────────────────────────────────────────────────
CREATE TABLE blacklist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type character varying(20) NOT NULL,
  value character varying(255) NOT NULL UNIQUE,
  reason text,
  added_by uuid REFERENCES users(id),
  created_date timestamptz DEFAULT now()
);
CREATE INDEX idx_blacklist_value ON blacklist(value);

-- ─── audit_logs ─────────────────────────────────────────────────────────
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES users(id),
  admin_email character varying(255),
  action character varying(255) NOT NULL,
  entity_type character varying(50),
  entity_id character varying(255),
  details jsonb,
  ip_address character varying(50),
  created_date timestamptz DEFAULT now()
);
CREATE INDEX idx_audit_logs_admin ON audit_logs(admin_id);
CREATE INDEX idx_audit_logs_date ON audit_logs(created_date);

-- ─── webhook_events ─────────────────────────────────────────────────────
CREATE TABLE webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type character varying(100),
  payload jsonb,
  status character varying(50) DEFAULT 'received',
  source character varying(255),
  retries integer DEFAULT 0,
  created_date timestamptz DEFAULT now(),
  updated_date timestamptz DEFAULT now()
);

-- ─── platform_settings ──────────────────────────────────────────────────
CREATE TABLE platform_settings (
  key character varying(100) PRIMARY KEY,
  value text NOT NULL,
  updated_date timestamptz DEFAULT now()
);
