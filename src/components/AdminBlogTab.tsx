"use client";

import { useEffect, useState, useCallback } from "react";
import {
  RefreshCw, Plus, Pencil, Trash2, Eye, EyeOff, AlertTriangle, FileText, X,
  Share2, CheckCircle2, XCircle, Clock,
} from "lucide-react";

type SocialShare = {
  id: string;
  blog_post_id: string;
  platform: "facebook" | "instagram" | "linkedin";
  status: "pending" | "posted" | "failed" | "cancelled";
  external_id: string | null;
  external_url: string | null;
  error: string | null;
  attempted_at: string;
  posted_at: string | null;
};

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  og_image: string | null;
  category: string | null;
  read_time: number | null;
  author: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  title_i18n: Record<string, string> | null;
  excerpt_i18n: Record<string, string> | null;
  content_i18n: Record<string, string> | null;
  meta_keywords_i18n: Record<string, string> | null;
  meta_desc_i18n: Record<string, string> | null;
  source: string;
};

type FormState = {
  id: string | null;
  slug: string;
  title_es: string;
  title_en: string;
  excerpt_es: string;
  excerpt_en: string;
  content_es: string;
  content_en: string;
  cover_image: string;
  category: string;
  read_time: number;
  meta_keywords_es: string;
  meta_keywords_en: string;
  meta_desc_es: string;
  meta_desc_en: string;
  published: boolean;
};

const EMPTY_FORM: FormState = {
  id: null,
  slug: "",
  title_es: "",
  title_en: "",
  excerpt_es: "",
  excerpt_en: "",
  content_es: "",
  content_en: "",
  cover_image: "",
  category: "Guía",
  read_time: 5,
  meta_keywords_es: "",
  meta_keywords_en: "",
  meta_desc_es: "",
  meta_desc_en: "",
  published: false,
};

function rowToForm(p: BlogPost): FormState {
  return {
    id: p.id,
    slug: p.slug,
    title_es: p.title_i18n?.es ?? p.title ?? "",
    title_en: p.title_i18n?.en ?? "",
    excerpt_es: p.excerpt_i18n?.es ?? p.excerpt ?? "",
    excerpt_en: p.excerpt_i18n?.en ?? "",
    content_es: p.content_i18n?.es ?? p.content ?? "",
    content_en: p.content_i18n?.en ?? "",
    cover_image: p.cover_image ?? "",
    category: p.category ?? "Guía",
    read_time: p.read_time ?? 5,
    meta_keywords_es: p.meta_keywords_i18n?.es ?? "",
    meta_keywords_en: p.meta_keywords_i18n?.en ?? "",
    meta_desc_es: p.meta_desc_i18n?.es ?? "",
    meta_desc_en: p.meta_desc_i18n?.en ?? "",
    published: p.published,
  };
}

function formToBody(f: FormState) {
  return {
    slug: f.slug.trim(),
    title: f.title_es.trim(),
    excerpt: f.excerpt_es.trim(),
    content: f.content_es,
    cover_image: f.cover_image.trim() || null,
    category: f.category.trim() || null,
    read_time: f.read_time,
    published: f.published,
    title_i18n: { es: f.title_es.trim(), en: f.title_en.trim() },
    excerpt_i18n: { es: f.excerpt_es.trim(), en: f.excerpt_en.trim() },
    content_i18n: { es: f.content_es, en: f.content_en },
    meta_keywords_i18n: { es: f.meta_keywords_es.trim(), en: f.meta_keywords_en.trim() },
    meta_desc_i18n: { es: f.meta_desc_es.trim(), en: f.meta_desc_en.trim() },
  };
}

export function AdminBlogTab() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [shares, setShares] = useState<SocialShare[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<FormState | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [postsRes, sharesRes] = await Promise.all([
        fetch("/api/admin/blog-posts", { credentials: "include" }),
        fetch("/api/admin/social-shares", { credentials: "include" }),
      ]);
      if (postsRes.status === 401) {
        window.location.href = "/es/admin/login?next=/es/admin";
        return;
      }
      if (!postsRes.ok) throw new Error(`HTTP ${postsRes.status}`);
      const d = (await postsRes.json()) as { posts: BlogPost[] };
      setPosts(d.posts ?? []);
      if (sharesRes.ok) {
        const sd = (await sharesRes.json()) as { shares: SocialShare[] };
        setShares(sd.shares ?? []);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const retryShare = async (shareId: string) => {
    const r = await fetch(`/api/admin/social-shares?id=${encodeURIComponent(shareId)}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "retry" }),
    });
    if (r.ok) void load();
  };

  const cancelShare = async (shareId: string) => {
    const r = await fetch(`/api/admin/social-shares?id=${encodeURIComponent(shareId)}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "cancel" }),
    });
    if (r.ok) void load();
  };

  const save = async (f: FormState) => {
    const body = formToBody(f);
    const url = f.id ? `/api/admin/blog-posts?id=${encodeURIComponent(f.id)}` : "/api/admin/blog-posts";
    const method = f.id ? "PATCH" : "POST";
    const r = await fetch(url, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!r.ok) {
      const d = (await r.json().catch(() => ({}))) as { error?: string };
      throw new Error(d.error ?? `HTTP ${r.status}`);
    }
    setEditing(null);
    void load();
  };

  const togglePublish = async (p: BlogPost) => {
    const r = await fetch(`/api/admin/blog-posts?id=${encodeURIComponent(p.id)}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !p.published }),
    });
    if (r.ok) void load();
  };

  const del = async (p: BlogPost) => {
    if (!confirm(`Eliminar "${p.title}"? Esto no se puede deshacer.`)) return;
    const r = await fetch(`/api/admin/blog-posts?id=${encodeURIComponent(p.id)}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (r.ok) void load();
  };

  return (
    <>
      <div className="mb-4 p-3 rounded-lg border border-blue-300 bg-blue-50 text-sm text-blue-900 flex items-start gap-2 dark:bg-blue-950/30 dark:text-blue-200 dark:border-blue-800">
        <FileText className="w-4 h-4 mt-0.5 shrink-0" />
        <div>
          <p className="font-medium">Posts publicados aparecen en producción tras el siguiente build.</p>
          <p className="text-xs mt-0.5 opacity-80">
            Cloudflare Pages se redespliega al hacer push a <code className="font-mono">main</code>.
            Hasta entonces los cambios sólo son visibles en el admin.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg border border-red-300 bg-red-50 text-sm text-red-800 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="bg-card border border-warm-border rounded-xl overflow-hidden">
        <div className="p-5 border-b border-warm-border flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <h2 className="font-serif text-lg">Blog posts</h2>
          <span className="ml-auto text-xs text-muted-foreground">{posts.length} totales</span>
          <button
            onClick={() => void load()}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-full border border-warm-border px-3 py-1.5 text-xs font-medium bg-card hover:bg-muted disabled:opacity-60"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setEditing({ ...EMPTY_FORM })}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium hover:opacity-90"
          >
            <Plus className="w-3 h-3" /> Nuevo
          </button>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <p className="p-5 text-sm text-muted-foreground">Cargando…</p>
          ) : posts.length === 0 ? (
            <p className="p-5 text-sm text-muted-foreground">
              No hay posts en la base de datos. Los posts hechos a mano (5) viven en <code className="font-mono text-xs">src/app/[locale]/blog/</code>.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/30 text-xs text-muted-foreground uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">Título</th>
                  <th className="px-4 py-3 text-left">Slug</th>
                  <th className="px-4 py-3 text-left">Estado</th>
                  <th className="px-4 py-3 text-left">Redes sociales</th>
                  <th className="px-4 py-3 text-left">Origen</th>
                  <th className="px-4 py-3 text-left">Actualizado</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {posts.map((p) => {
                  const postShares = shares.filter((s) => s.blog_post_id === p.id);
                  return (
                    <tr key={p.id} className="border-t border-warm-border">
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">{p.title || "(sin título)"}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{p.excerpt}</p>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">{p.slug}</td>
                      <td className="px-4 py-3">
                        {p.published ? (
                          <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-700">Publicado</span>
                        ) : (
                          <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-amber-100 text-amber-700">Borrador</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <SocialBadges shares={postShares} onRetry={retryShare} onCancel={cancelShare} />
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{p.source}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(p.updated_at).toLocaleDateString("es-DO", { day: "numeric", month: "short" })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex gap-1.5">
                          <button
                            onClick={() => void togglePublish(p)}
                            className="inline-flex items-center gap-1 rounded-md border border-warm-border hover:bg-muted px-2 py-1 text-xs"
                            title={p.published ? "Despublicar" : "Publicar"}
                          >
                            {p.published ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </button>
                          <button
                            onClick={() => setEditing(rowToForm(p))}
                            className="inline-flex items-center gap-1 rounded-md border border-warm-border hover:bg-muted px-2 py-1 text-xs"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => void del(p)}
                            className="inline-flex items-center gap-1 rounded-md border border-red-300 text-red-700 hover:bg-red-50 px-2 py-1 text-xs"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {editing && <EditorModal initial={editing} onClose={() => setEditing(null)} onSave={save} />}
    </>
  );
}

function EditorModal({
  initial, onClose, onSave,
}: { initial: FormState; onClose: () => void; onSave: (f: FormState) => Promise<void> }) {
  const [f, setF] = useState<FormState>(initial);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      await onSave(f);
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Error desconocido");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
      <form
        onSubmit={submit}
        className="bg-card border border-warm-border rounded-xl max-w-3xl w-full max-h-[92vh] overflow-y-auto"
      >
        <div className="p-5 border-b border-warm-border flex items-center gap-2 sticky top-0 bg-card z-10">
          <FileText className="w-5 h-5 text-primary" />
          <h2 className="font-serif text-lg">{f.id ? "Editar post" : "Nuevo post"}</h2>
          <button type="button" onClick={onClose} className="ml-auto p-1 rounded-md hover:bg-muted">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {err && (
            <div className="p-3 rounded-lg border border-red-300 bg-red-50 text-sm text-red-800">{err}</div>
          )}

          <Field label="Slug (URL)" hint="ej: como-llegar-aeropuerto-zona-colonial">
            <input
              required
              value={f.slug}
              onChange={(e) => setF({ ...f, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-") })}
              className="w-full rounded-md border border-warm-border px-3 py-2 text-sm font-mono"
            />
          </Field>

          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Título (ES)">
              <input required value={f.title_es} onChange={(e) => setF({ ...f, title_es: e.target.value })}
                className="w-full rounded-md border border-warm-border px-3 py-2 text-sm" />
            </Field>
            <Field label="Title (EN)">
              <input value={f.title_en} onChange={(e) => setF({ ...f, title_en: e.target.value })}
                className="w-full rounded-md border border-warm-border px-3 py-2 text-sm" />
            </Field>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Resumen (ES)">
              <textarea required rows={3} value={f.excerpt_es} onChange={(e) => setF({ ...f, excerpt_es: e.target.value })}
                className="w-full rounded-md border border-warm-border px-3 py-2 text-sm" />
            </Field>
            <Field label="Excerpt (EN)">
              <textarea rows={3} value={f.excerpt_en} onChange={(e) => setF({ ...f, excerpt_en: e.target.value })}
                className="w-full rounded-md border border-warm-border px-3 py-2 text-sm" />
            </Field>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <Field label="Imagen de portada (URL)">
              <input value={f.cover_image} onChange={(e) => setF({ ...f, cover_image: e.target.value })}
                placeholder="https://res.cloudinary.com/..."
                className="w-full rounded-md border border-warm-border px-3 py-2 text-sm" />
            </Field>
            <Field label="Categoría">
              <input value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })}
                className="w-full rounded-md border border-warm-border px-3 py-2 text-sm" />
            </Field>
            <Field label="Lectura (min)">
              <input type="number" min={1} max={60} value={f.read_time}
                onChange={(e) => setF({ ...f, read_time: Number(e.target.value) || 5 })}
                className="w-full rounded-md border border-warm-border px-3 py-2 text-sm" />
            </Field>
          </div>

          <Field label="Contenido ES (markdown)">
            <textarea required rows={10} value={f.content_es} onChange={(e) => setF({ ...f, content_es: e.target.value })}
              className="w-full rounded-md border border-warm-border px-3 py-2 text-sm font-mono"
              placeholder="## Encabezado&#10;&#10;Texto del párrafo..." />
          </Field>

          <Field label="Content EN (markdown)" hint="Opcional — si está vacío, la página /en mostrará el español">
            <textarea rows={10} value={f.content_en} onChange={(e) => setF({ ...f, content_en: e.target.value })}
              className="w-full rounded-md border border-warm-border px-3 py-2 text-sm font-mono" />
          </Field>

          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Meta keywords (ES)">
              <input value={f.meta_keywords_es} onChange={(e) => setF({ ...f, meta_keywords_es: e.target.value })}
                placeholder="zona colonial, santo domingo, ..." className="w-full rounded-md border border-warm-border px-3 py-2 text-sm" />
            </Field>
            <Field label="Meta keywords (EN)">
              <input value={f.meta_keywords_en} onChange={(e) => setF({ ...f, meta_keywords_en: e.target.value })}
                className="w-full rounded-md border border-warm-border px-3 py-2 text-sm" />
            </Field>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Meta description (ES)">
              <textarea rows={2} value={f.meta_desc_es} onChange={(e) => setF({ ...f, meta_desc_es: e.target.value })}
                className="w-full rounded-md border border-warm-border px-3 py-2 text-sm" />
            </Field>
            <Field label="Meta description (EN)">
              <textarea rows={2} value={f.meta_desc_en} onChange={(e) => setF({ ...f, meta_desc_en: e.target.value })}
                className="w-full rounded-md border border-warm-border px-3 py-2 text-sm" />
            </Field>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={f.published} onChange={(e) => setF({ ...f, published: e.target.checked })} />
            <span>Publicado (visible en el blog tras el siguiente build)</span>
          </label>
        </div>

        <div className="p-5 border-t border-warm-border flex gap-3 sticky bottom-0 bg-card">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border border-warm-border text-sm hover:bg-muted">
            Cancelar
          </button>
          <button type="submit" disabled={busy}
            className="ml-auto inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-60">
            {busy ? "Guardando…" : f.id ? "Guardar cambios" : "Crear post"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
      {hint && <span className="block text-[11px] text-muted-foreground/80 mt-0.5">{hint}</span>}
      <div className="mt-1">{children}</div>
    </label>
  );
}

const PLATFORM_ABBR: Record<SocialShare["platform"], string> = {
  facebook: "FB",
  instagram: "IG",
  linkedin: "LI",
};

const STATUS_STYLE: Record<SocialShare["status"], { icon: React.ComponentType<{ className?: string }>; bg: string; label: string }> = {
  pending:   { icon: Clock,        bg: "bg-amber-100 text-amber-700",   label: "En cola" },
  posted:    { icon: CheckCircle2, bg: "bg-emerald-100 text-emerald-700", label: "Publicado" },
  failed:    { icon: XCircle,      bg: "bg-red-100 text-red-700",       label: "Falló" },
  cancelled: { icon: X,            bg: "bg-muted text-muted-foreground", label: "Cancelado" },
};

function SocialBadges({
  shares, onRetry, onCancel,
}: { shares: SocialShare[]; onRetry: (id: string) => void; onCancel: (id: string) => void }) {
  if (shares.length === 0) {
    return <span className="text-[11px] text-muted-foreground italic">—</span>;
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {shares.map((s) => {
        const abbr = PLATFORM_ABBR[s.platform];
        const style = STATUS_STYLE[s.status];
        const StatusIcon = style.icon;
        const tooltip = s.error
          ? `${s.platform}: ${style.label}. ${s.error}`
          : `${s.platform}: ${style.label}`;
        return (
          <div key={s.id} className="group relative inline-flex items-center" title={tooltip}>
            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${style.bg}`}>
              {abbr}
              <StatusIcon className="w-2.5 h-2.5" />
            </span>
            {(s.status === "failed" || s.status === "cancelled") && (
              <button
                onClick={() => onRetry(s.id)}
                className="ml-0.5 p-0.5 rounded hover:bg-muted opacity-0 group-hover:opacity-100 transition"
                title="Reintentar"
              >
                <RefreshCw className="w-2.5 h-2.5" />
              </button>
            )}
            {s.status === "pending" && (
              <button
                onClick={() => onCancel(s.id)}
                className="ml-0.5 p-0.5 rounded hover:bg-muted opacity-0 group-hover:opacity-100 transition"
                title="Cancelar"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            )}
            {s.status === "posted" && s.external_url && (
              <a
                href={s.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-0.5 p-0.5 rounded hover:bg-muted opacity-0 group-hover:opacity-100 transition"
                title="Abrir post"
              >
                <Share2 className="w-2.5 h-2.5" />
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}
