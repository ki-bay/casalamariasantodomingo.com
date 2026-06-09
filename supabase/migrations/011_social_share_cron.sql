-- pg_cron schedule that drains the social-share queue every 10 minutes.
--
-- Prerequisites (one-time):
--   1. pg_cron + pg_net extensions enabled (Dashboard → Database → Extensions)
--   2. ALTER DATABASE postgres SET app.cron_secret = '<YOUR_CRON_SECRET>';
--      (same secret as drive-blog-sync; can be set once)
--
-- Why 10 minutes and not hourly: a freshly published blog post should hit
-- social in a few minutes, not the next hour. The worker itself is cheap;
-- it no-ops when no rows are pending.

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'social_share_worker_10min') THEN
    PERFORM cron.unschedule('social_share_worker_10min');
  END IF;
END $$;

SELECT cron.schedule(
  'social_share_worker_10min',
  '*/10 * * * *',
  $$
    SELECT net.http_post(
      url := 'https://casalamariazonacolonial.com/api/social-share-worker',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.cron_secret', true)
      ),
      body := '{}'::jsonb,
      timeout_milliseconds := 120000
    ) AS request_id;
  $$
);
