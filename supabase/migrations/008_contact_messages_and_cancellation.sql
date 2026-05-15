-- Contact form submissions (so the admin panel can show them and we can
-- backfill leads even when transactional email delivery is delayed).
CREATE TABLE IF NOT EXISTS contact_messages (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  subject     TEXT,
  message     TEXT NOT NULL,
  locale      TEXT,
  read        BOOLEAN NOT NULL DEFAULT false,
  email_sent  BOOLEAN NOT NULL DEFAULT false,
  email_error TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  read_at     TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS contact_messages_created_idx ON contact_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS contact_messages_unread_idx ON contact_messages (read) WHERE read = false;

-- Track cancellations on bookings so the admin panel can show refund state
-- and the Lodgify-side delete result without losing the original row.
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS cancelled_at        TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS stripe_refund_id    TEXT,
  ADD COLUMN IF NOT EXISTS lodgify_cancel_status INT,
  ADD COLUMN IF NOT EXISTS cancel_note         TEXT;
