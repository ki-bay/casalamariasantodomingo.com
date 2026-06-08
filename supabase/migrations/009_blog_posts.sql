-- Extend the existing blog_posts table (created in 001_initial_schema.sql)
-- with the metadata needed for SEO, social sharing, and the Drive→LLM
-- automation pipeline. Bilingual content lives in the *_i18n JSONB columns
-- that already exist; we keep the flat title/excerpt/content columns as the
-- ES default (and as a fallback when *_i18n is empty).

ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS og_image          TEXT,
  ADD COLUMN IF NOT EXISTS meta_keywords_i18n JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS meta_desc_i18n    JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS schema_blocks     JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS source            TEXT NOT NULL DEFAULT 'manual',  -- 'manual' | 'drive_auto' | 'admin'
  ADD COLUMN IF NOT EXISTS source_ref        TEXT,                            -- Drive file ID, etc.
  ADD COLUMN IF NOT EXISTS llm_model         TEXT,
  ADD COLUMN IF NOT EXISTS llm_prompt_hash   TEXT;

-- read_time + category already added in an earlier ad-hoc migration; ensure they exist.
ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS read_time INT,
  ADD COLUMN IF NOT EXISTS category  TEXT,
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS author       TEXT;

CREATE INDEX IF NOT EXISTS blog_posts_published_idx
  ON blog_posts (published, published_at DESC) WHERE published = true;
CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON blog_posts (slug);

-- Social share log: which platforms posted what, and the resulting URL.
-- Phase 3 (Facebook / Instagram / LinkedIn) writes here.
CREATE TABLE IF NOT EXISTS blog_social_shares (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_post_id   UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  platform       TEXT NOT NULL,        -- 'facebook' | 'instagram' | 'linkedin'
  status         TEXT NOT NULL,        -- 'pending' | 'posted' | 'failed'
  external_id    TEXT,                 -- platform post ID
  external_url   TEXT,                 -- canonical URL on the platform
  error          TEXT,
  attempted_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  posted_at      TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS blog_social_shares_post_idx ON blog_social_shares (blog_post_id);

ALTER TABLE blog_social_shares ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access blog_social_shares"
  ON blog_social_shares FOR ALL
  USING (true)
  WITH CHECK (true);
