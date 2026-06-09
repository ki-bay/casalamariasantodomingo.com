// Drive → blog draft pipeline orchestrator.
//
// POST /api/drive-blog-sync
//   Authorization: Bearer <CRON_SECRET>
//
// Triggered by Supabase pg_cron on a schedule. Scans the configured Drive
// folder, finds image files we haven't processed yet (matched by file ID
// in blog_posts.source_ref), and for each new file:
//   1. Downloads the bytes
//   2. Uploads to Supabase Storage (blog-images bucket)
//   3. Calls Claude with keywords (from filename) + image URL → bilingual
//      blog draft
//   4. Inserts blog_posts row with published=false (admin reviews + flips)
//
// Returns a summary so pg_cron can log it.
//
// Idempotency: a Drive file_id never produces more than one row.
// Failures: per-file errors are captured and returned; the run continues
// for the rest. The endpoint always returns 200 unless auth fails or
// configuration is missing — pg_cron retries are not useful here since
// the failure is usually a stale image URL or LLM JSON parse error.

import { createClient } from "@supabase/supabase-js";
import { getGoogleAccessToken } from "../_lib/google-auth";
import {
  DRIVE_READ_SCOPE,
  downloadDriveFile,
  filenameToKeywords,
  filenameToSlug,
  listDriveFolderImages,
  type DriveFile,
} from "../_lib/drive";
import { generateBlogDraft, type BlogDraft } from "../_lib/blog-llm";

interface Env {
  CRON_SECRET: string;
  GCP_SERVICE_ACCOUNT_JSON: string;
  DRIVE_FOLDER_ID: string;
  ANTHROPIC_API_KEY: string;
  NEXT_PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

const BUCKET = "blog-images";
const MAX_FILES_PER_RUN = 3; // keep each cron tick well under CF Pages CPU limit

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Cache-Control": "no-store", "Content-Type": "application/json" },
  });

function ext(mime: string, fallbackName: string): string {
  const fromMime = mime.split("/")[1]?.split(";")[0];
  if (fromMime && /^(jpe?g|png|webp|avif|gif)$/i.test(fromMime)) {
    return fromMime === "jpeg" ? "jpg" : fromMime.toLowerCase();
  }
  const m = fallbackName.match(/\.([a-z0-9]+)$/i);
  return (m?.[1] ?? "jpg").toLowerCase();
}

async function uploadToSupabaseStorage(
  env: Env,
  path: string,
  bytes: ArrayBuffer,
  contentType: string,
): Promise<string> {
  const url = `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/${BUCKET}/${encodeURIComponent(path)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      "Content-Type": contentType,
      "x-upsert": "true",
    },
    body: bytes,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Storage upload failed (HTTP ${res.status}): ${body.slice(0, 300)}`);
  }
  return `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${encodeURIComponent(path)}`;
}

interface FileResult {
  file_id: string;
  file_name: string;
  status: "created" | "skipped_duplicate" | "error";
  slug?: string;
  blog_post_id?: string;
  error?: string;
}

async function processFile(env: Env, file: DriveFile, accessToken: string, sb: ReturnType<typeof createClient>): Promise<FileResult> {
  try {
    // Idempotency: have we already processed this Drive file?
    const { data: existing } = await sb
      .from("blog_posts")
      .select("id, slug")
      .eq("source_ref", file.id)
      .maybeSingle();
    if (existing) {
      return {
        file_id: file.id,
        file_name: file.name,
        status: "skipped_duplicate",
        slug: existing.slug as string,
      };
    }

    const slug = filenameToSlug(file.name);
    const keywords = filenameToKeywords(file.name);

    // 1. Download from Drive
    const { bytes, contentType } = await downloadDriveFile(accessToken, file.id);

    // 2. Upload to Supabase Storage. We key by slug so re-runs don't accumulate
    // garbage even if our DB record is missing.
    const storagePath = `${slug}.${ext(contentType, file.name)}`;
    const publicUrl = await uploadToSupabaseStorage(env, storagePath, bytes, contentType);

    // 3. LLM generation (vision-capable so we pass the image URL)
    const draft: BlogDraft = await generateBlogDraft(env.ANTHROPIC_API_KEY, keywords, publicUrl);

    // 4. Insert as draft (published=false). Admin reviews in Blog tab.
    const row = {
      slug,
      title: draft.title_es,
      excerpt: draft.excerpt_es,
      content: draft.content_es,
      cover_image: publicUrl,
      og_image: publicUrl,
      category: draft.category_es,
      read_time: draft.read_time_min,
      author: "Casa La Maria",
      published: false,
      title_i18n: { es: draft.title_es, en: draft.title_en },
      excerpt_i18n: { es: draft.excerpt_es, en: draft.excerpt_en },
      content_i18n: { es: draft.content_es, en: draft.content_en },
      meta_keywords_i18n: { es: draft.meta_keywords_es, en: draft.meta_keywords_en },
      meta_desc_i18n: { es: draft.meta_desc_es, en: draft.meta_desc_en },
      source: "drive_auto",
      source_ref: file.id,
      llm_model: draft.llm_model,
    };

    const { data: inserted, error } = await sb
      .from("blog_posts")
      .insert(row)
      .select("id")
      .single();
    if (error) throw new Error(`Insert failed: ${error.message}`);

    return {
      file_id: file.id,
      file_name: file.name,
      status: "created",
      slug,
      blog_post_id: inserted?.id as string,
    };
  } catch (e) {
    return {
      file_id: file.id,
      file_name: file.name,
      status: "error",
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const env = context.env;

  // Auth: shared-secret Bearer. pg_cron sends this; nobody else should be
  // able to trigger drafts.
  const auth = context.request.headers.get("Authorization") ?? "";
  const expected = `Bearer ${env.CRON_SECRET}`;
  if (!env.CRON_SECRET || auth !== expected) {
    return json({ error: "Unauthorized" }, 401);
  }

  for (const k of [
    "GCP_SERVICE_ACCOUNT_JSON",
    "DRIVE_FOLDER_ID",
    "ANTHROPIC_API_KEY",
    "NEXT_PUBLIC_SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
  ] as const) {
    if (!env[k]) return json({ error: `Missing env: ${k}` }, 500);
  }

  let accessToken: string;
  try {
    accessToken = await getGoogleAccessToken(env.GCP_SERVICE_ACCOUNT_JSON, [DRIVE_READ_SCOPE]);
  } catch (e) {
    return json({ error: `Google auth failed: ${e instanceof Error ? e.message : "unknown"}` }, 500);
  }

  let files: DriveFile[];
  try {
    files = await listDriveFolderImages(accessToken, env.DRIVE_FOLDER_ID, 50);
  } catch (e) {
    return json({ error: `Drive list failed: ${e instanceof Error ? e.message : "unknown"}` }, 500);
  }

  const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Filter to files we haven't processed; take the newest N.
  const candidateIds = files.map((f) => f.id);
  let processedIds = new Set<string>();
  if (candidateIds.length > 0) {
    const { data } = await sb
      .from("blog_posts")
      .select("source_ref")
      .in("source_ref", candidateIds);
    processedIds = new Set((data ?? []).map((r) => r.source_ref as string));
  }

  const queue = files.filter((f) => !processedIds.has(f.id)).slice(0, MAX_FILES_PER_RUN);

  const results: FileResult[] = [];
  for (const f of queue) {
    results.push(await processFile(env, f, accessToken, sb));
  }

  return json({
    scanned: files.length,
    already_processed: processedIds.size,
    new_this_run: queue.length,
    truncated: files.length - processedIds.size > MAX_FILES_PER_RUN,
    results,
  });
};

// Manual GET trigger for the admin to test (still requires CRON_SECRET).
export const onRequestGet: PagesFunction<Env> = (context) => onRequestPost(context);
