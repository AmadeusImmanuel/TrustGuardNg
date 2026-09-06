-- Two-factor auth: TOTP (Google Authenticator) and email OTP as login's
-- second step. Both are optional and independent — a user can enable
-- either, both, or neither.
ALTER TABLE users ADD COLUMN totp_secret text;
ALTER TABLE users ADD COLUMN totp_enabled boolean DEFAULT false;
ALTER TABLE users ADD COLUMN email_otp_enabled boolean DEFAULT false;

-- Short-lived codes for the email-OTP login step. Codes are hashed at
-- rest (bcrypt, same as passwords) rather than stored in plain text.
CREATE TABLE login_otps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  code_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  consumed boolean DEFAULT false,
  created_date timestamptz DEFAULT now()
);
CREATE INDEX idx_login_otps_user ON login_otps(user_id);
