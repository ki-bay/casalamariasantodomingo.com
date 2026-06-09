-- Supabase pg_cron schedule that triggers the Drive→blog draft pipeline.
--
-- The cron job POSTs to the Pages Function endpoint hourly. The endpoint
-- itself handles idempotency (skips files already mapped to a blog_posts
-- row via source_ref), so duplicate firings are harmless.
--
-- HOW TO APPLY (one-time setup):
--
-- 1. In the Supabase Dashboard → Database → Extensions, enable:
--      - pg_cron
--      - pg_net
--
-- 2. Set the cron secret as a database-level setting (only the postgres
--    superuser can do this; run it from the SQL editor):
--      ALTER DATABASE postgres SET app.cron_secret = '<YOUR_CRON_SECRET>';
--
-- 3. Apply this migration:  supabase db push
--
-- 4. Verify in the SQL editor:
--      SELECT * FROM cron.job WHERE jobname = 'drive_blog_sync_hourly';
--      SELECT * FROM cron.job_run_details ORDER BY end_time DESC LIMIT 10;
--
-- The endpoint runs at most ~5 minutes; we schedule every hour. New images
-- typically appear within an hour of being dropped into Drive.

-- Idempotent: unschedule if it already exists so this migration can be
-- re-applied without erroring.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'drive_blog_sync_hourly') THEN
    PERFORM cron.unschedule('drive_blog_sync_hourly');
  END IF;
END $$;

SELECT cron.schedule(
  'drive_blog_sync_hourly',
  '0 * * * *',  -- top of every hour
  $$
    SELECT net.http_post(
      url := 'https://casalamariazonacolonial.com/api/drive-blog-sync',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.cron_secret', true)
      ),
      body := '{}'::jsonb,
      timeout_milliseconds := 300000
    ) AS request_id;
  $$
);
