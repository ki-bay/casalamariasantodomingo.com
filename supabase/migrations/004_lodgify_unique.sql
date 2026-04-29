-- Add unique constraint on lodgify_property_id so ON CONFLICT works
-- in the lodgify-sync Edge Function upsert.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'apartments_lodgify_property_id_key'
  ) THEN
    ALTER TABLE apartments
      ADD CONSTRAINT apartments_lodgify_property_id_key
      UNIQUE (lodgify_property_id);
  END IF;
END $$;
