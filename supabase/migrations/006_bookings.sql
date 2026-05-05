-- Direct booking log: every successful Stripe payment that gets pushed to
-- Lodgify is recorded here. Used for idempotency (Stripe retries the same
-- webhook) and as our local source of truth for direct bookings.

CREATE TABLE IF NOT EXISTS bookings (
  id                       BIGSERIAL PRIMARY KEY,
  stripe_payment_intent_id TEXT UNIQUE NOT NULL,
  lodgify_booking_id       BIGINT,
  lodgify_property_id      BIGINT NOT NULL,
  lodgify_room_type_id     BIGINT,
  arrival                  DATE NOT NULL,
  departure                DATE NOT NULL,
  guest_first_name         TEXT,
  guest_last_name          TEXT,
  guest_email              TEXT,
  guest_phone              TEXT,
  people                   INT,
  total_amount             NUMERIC(10,2),
  currency                 TEXT DEFAULT 'USD',
  notes                    TEXT,
  source                   TEXT NOT NULL DEFAULT 'website',
  status                   TEXT NOT NULL DEFAULT 'pending',
  lodgify_error            TEXT,
  raw_stripe_event         JSONB,
  raw_lodgify_response     JSONB,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS bookings_arrival_idx       ON bookings (arrival);
CREATE INDEX IF NOT EXISTS bookings_lodgify_id_idx    ON bookings (lodgify_booking_id);
CREATE INDEX IF NOT EXISTS bookings_property_idx      ON bookings (lodgify_property_id);

-- Webhook events from Lodgify (external bookings via Booking.com / Airbnb /
-- direct Lodgify). Stored raw so we can replay or audit later.
CREATE TABLE IF NOT EXISTS lodgify_webhook_events (
  id                  BIGSERIAL PRIMARY KEY,
  event_type          TEXT,
  lodgify_booking_id  BIGINT,
  lodgify_property_id BIGINT,
  payload             JSONB NOT NULL,
  received_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at        TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS lodgify_webhook_booking_idx
  ON lodgify_webhook_events (lodgify_booking_id);
