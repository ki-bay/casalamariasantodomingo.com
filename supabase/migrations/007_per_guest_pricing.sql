-- Per-occupancy nightly pricing in DOP, sourced from Booking.com listings.
-- USD shown to the guest is computed at display time using a constant
-- conversion (≈ 60 DOP/USD) to match the existing format-price helper.
-- 3-guest price is interpolated at runtime as midpoint of 2 and 4 guests.

ALTER TABLE apartments
  ADD COLUMN IF NOT EXISTS price_1guest_dop NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS price_2guest_dop NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS price_4guest_dop NUMERIC(10,2);
