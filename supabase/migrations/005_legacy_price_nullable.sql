-- Make legacy DOP price columns nullable. New rows synced from Lodgify
-- use price_base_usd and per-day seasonal_rates instead. Existing rows
-- keep their values; future rows can omit them.

ALTER TABLE apartments
  ALTER COLUMN price_standard_dop DROP NOT NULL,
  ALTER COLUMN price_flexible_dop DROP NOT NULL;
