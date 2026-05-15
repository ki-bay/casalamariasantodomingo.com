"use client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { AdminCalendar, type CalendarBooking } from "@/components/AdminCalendar";
import {
  CalendarDays, TrendingUp, Bed, Webhook, AlertTriangle, RefreshCw,
  CalendarRange, MessageSquare, X, Check, Trash2, Mail,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";

type Booking = {
  id: number;
  created_at: string;
  stripe_payment_intent_id: string | null;
  lodgify_booking_id: number | null;
  lodgify_property_id: number;
  arrival: string;
  departure: string;
  guest_first_name: string | null;
  guest_last_name: string | null;
  guest_email: string | null;
  guest_phone: string | null;
  people: number | null;
  total_amount: number | null;
  currency: string | null;
  source: string;
  status: string;
  lodgify_error: string | null;
  cancelled_at: string | null;
  stripe_refund_id: string | null;
};
type WebhookEvent = {
  id: number;
  received_at: string;
  event_type: string | null;
  lodgify_booking_id: number | null;
  lodgify_property_id: number | null;
};
type ContactMessage = {
  id: number;
  created_at: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  locale: string | null;
  read: boolean;
  email_sent: boolean;
  email_error: string | null;
};

const UNIT_LABELS: Record<number, string> = {
  674785: "1B (TwoBedRoom)", 674786: "2B (TwoBedRoom)", 674787: "3B (TwoBedRoom)",
  674788: "1A (OneBedRoom)", 674789: "2A (OneBedRoom)",
};
const nights = (a: string, b: string) =>
  Math.max(0, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000));
const fmtDate = (s: string) => new Date(s).toLocaleDateString("es-DO", { day: "numeric", month: "short", year: "numeric" });
const fmtDateTime = (s: string) => new Date(s).toLocaleString("es-DO", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

type Tab = "reservas" | "calendario" | "mensajes";

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("reservas");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/admin/bookings", { credentials: "include" });
      if (r.status === 401) { window.location.href = "/es/admin/login?next=/es/admin"; return; }
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const d = (await r.json()) as { bookings: Booking[]; events: WebhookEvent[]; messages: ContactMessage[] };
      setBookings(d.bookings ?? []);
      setEvents(d.events ?? []);
      setMessages(d.messages ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const now = new Date();
  const monthly = bookings.filter((b) => {
    const d = new Date(b.created_at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && b.status !== "cancelled";
  });
  const monthlyRevenue = monthly.filter((b) => b.status === "confirmed").reduce((s, b) => s + Number(b.total_amount ?? 0), 0);
  const failedCount = bookings.filter((b) => b.status === "pending" || b.status === "lodgify_failed").length;
  const unreadMessages = messages.filter((m) => !m.read).length;

  const calBookings: CalendarBooking[] = bookings.map((b) => ({
    id: b.id, lodgify_property_id: b.lodgify_property_id,
    arrival: b.arrival, departure: b.departure,
    guest_first_name: b.guest_first_name, guest_last_name: b.guest_last_name,
    status: b.status,
  }));

  return (
    <main className="relative z-10 min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-28 pb-16 px-6 md:px-12 flex-1">
        <div className="max-w-[1200px] mx-auto">
          <ScrollReveal>
            <div className="flex items-center justify-between mb-6 gap-3">
              <div>
                <p className="text-xs font-medium tracking-widest uppercase text-secondary mb-3">Administración</p>
                <h1 className="font-serif text-3xl md:text-4xl tracking-tight">Dashboard</h1>
              </div>
              <button onClick={load} disabled={loading} className="inline-flex items-center gap-1.5 rounded-full border border-warm-border px-4 py-2 text-sm font-medium bg-card hover:bg-muted disabled:opacity-60">
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refrescar
              </button>
            </div>
          </ScrollReveal>

          {error && (
            <div className="mb-6 p-4 rounded-lg border border-red-300 bg-red-50 text-sm text-red-800 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <div><p className="font-medium">Error cargando datos</p><p className="text-xs mt-0.5">{error}</p></div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard icon={<CalendarDays className="w-5 h-5 text-primary" />} label="Reservas este mes" value={monthly.length} sub="Activas (no canceladas)" />
            <StatCard icon={<TrendingUp className="w-5 h-5 text-primary" />} label="Ingresos este mes" value={`$${Math.round(monthlyRevenue).toLocaleString()}`} sub="Solo confirmadas" />
            <StatCard icon={<Bed className="w-5 h-5 text-primary" />} label="Total reservas" value={bookings.length} sub="Histórico completo" />
            <StatCard icon={<MessageSquare className={`w-5 h-5 ${unreadMessages > 0 ? "text-amber-600" : "text-primary"}`} />} label="Mensajes sin leer" value={unreadMessages} sub={`${messages.length} totales`} />
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-warm-border mb-6">
            <TabButton active={tab === "reservas"} onClick={() => setTab("reservas")} icon={<CalendarDays className="w-4 h-4" />} label="Reservas" count={bookings.length} />
            <TabButton active={tab === "calendario"} onClick={() => setTab("calendario")} icon={<CalendarRange className="w-4 h-4" />} label="Calendario" />
            <TabButton active={tab === "mensajes"} onClick={() => setTab("mensajes")} icon={<MessageSquare className="w-4 h-4" />} label="Mensajes" count={unreadMessages > 0 ? unreadMessages : undefined} badge={unreadMessages > 0} />
          </div>

          {tab === "reservas" && (
            <ReservasTab bookings={bookings} events={events} loading={loading} failedCount={failedCount} onRequestCancel={setCancelTarget} />
          )}
          {tab === "calendario" && <AdminCalendar bookings={calBookings} />}
          {tab === "mensajes" && (
            <MessagesTab messages={messages} loading={loading} onUpdate={load} />
          )}
        </div>
      </div>
      <Footer />

      {cancelTarget && (
        <CancelModal
          booking={cancelTarget}
          onClose={() => setCancelTarget(null)}
          onDone={() => { setCancelTarget(null); void load(); }}
        />
      )}
    </main>
  );
}

function TabButton({ active, onClick, icon, label, count, badge }: {
  active: boolean; onClick: () => void; icon: React.ReactNode; label: string; count?: number; badge?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition ${
        active ? "border-accent text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon} {label}
      {count != null && (
        <span className={`text-[11px] rounded-full px-1.5 py-0.5 ${badge ? "bg-amber-500 text-white" : "bg-muted text-muted-foreground"}`}>
          {count}
        </span>
      )}
    </button>
  );
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: number | string; sub: string }) {
  return (
    <div className="bg-card border border-warm-border rounded-xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">{icon}</div>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-2xl font-semibold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{sub}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { es: string; cls: string }> = {
    confirmed: { es: "Confirmada", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" },
    pending: { es: "Pendiente", cls: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300" },
    lodgify_failed: { es: "Lodgify falló", cls: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300" },
    cancelled: { es: "Cancelada", cls: "bg-muted text-muted-foreground" },
  };
  const m = map[status] ?? { es: status, cls: "bg-muted text-muted-foreground" };
  return <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${m.cls}`}>{m.es}</span>;
}

function ReservasTab({
  bookings, events, loading, failedCount, onRequestCancel,
}: {
  bookings: Booking[]; events: WebhookEvent[]; loading: boolean; failedCount: number;
  onRequestCancel: (b: Booking) => void;
}) {
  return (
    <>
      {failedCount > 0 && (
        <div className="mb-4 p-3 rounded-lg border border-amber-300 bg-amber-50 text-sm text-amber-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{failedCount} reserva{failedCount === 1 ? "" : "s"} requieren revisión (pendiente o falló al sincronizar con Lodgify)</span>
        </div>
      )}

      <div className="bg-card border border-warm-border rounded-xl overflow-hidden mb-8">
        <div className="p-5 border-b border-warm-border flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-primary" />
          <h2 className="font-serif text-lg">Reservas recientes</h2>
          <span className="ml-auto text-xs text-muted-foreground">{bookings.length} totales</span>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <p className="p-5 text-sm text-muted-foreground">Cargando…</p>
          ) : bookings.length === 0 ? (
            <p className="p-5 text-sm text-muted-foreground">
              No hay reservas todavía. Las que lleguen vía Stripe aparecerán aquí automáticamente.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/30 text-xs text-muted-foreground uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">Huésped</th>
                  <th className="px-4 py-3 text-left">Unidad</th>
                  <th className="px-4 py-3 text-left">Check-in → Check-out</th>
                  <th className="px-4 py-3 text-right">Noches</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-left">Estado</th>
                  <th className="px-4 py-3 text-left">Origen</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => {
                  const fullName = [b.guest_first_name, b.guest_last_name].filter(Boolean).join(" ").trim() || "—";
                  const canCancel = b.status !== "cancelled";
                  return (
                    <tr key={b.id} className="border-t border-warm-border">
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">{fullName}</p>
                        <p className="text-xs text-muted-foreground">{b.guest_email || "(sin email)"}</p>
                        {b.guest_phone && <p className="text-xs text-muted-foreground">{b.guest_phone}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{UNIT_LABELS[b.lodgify_property_id] ?? b.lodgify_property_id}</p>
                        {b.people != null && (
                          <p className="text-xs text-muted-foreground">{b.people} huésped{b.people === 1 ? "" : "es"}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <p>{fmtDate(b.arrival)}</p>
                        <p className="text-xs text-muted-foreground">→ {fmtDate(b.departure)}</p>
                      </td>
                      <td className="px-4 py-3 text-right">{nights(b.arrival, b.departure)}</td>
                      <td className="px-4 py-3 text-right font-medium whitespace-nowrap">
                        {b.total_amount != null ? `$${Number(b.total_amount).toFixed(0)}` : "—"}
                        {b.currency && <span className="text-xs text-muted-foreground ml-1">{b.currency}</span>}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={b.status} />
                        {b.lodgify_error && (
                          <p className="text-[10px] text-red-600 mt-1 max-w-[200px] truncate" title={b.lodgify_error}>
                            {b.lodgify_error}
                          </p>
                        )}
                        {b.stripe_refund_id && (
                          <p className="text-[10px] text-muted-foreground mt-1 font-mono" title={b.stripe_refund_id}>
                            ↺ {b.stripe_refund_id.slice(0, 12)}…
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        <p>{b.source}</p>
                        {b.lodgify_booking_id && <p className="font-mono">#{b.lodgify_booking_id}</p>}
                      </td>
                      <td className="px-4 py-3">
                        {canCancel && (
                          <button
                            type="button"
                            onClick={() => onRequestCancel(b)}
                            className="inline-flex items-center gap-1.5 rounded-md border border-red-300 text-red-700 hover:bg-red-50 px-2.5 py-1 text-xs font-medium dark:border-red-700/40 dark:text-red-300 dark:hover:bg-red-950/30"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Cancelar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="bg-card border border-warm-border rounded-xl overflow-hidden">
        <div className="p-5 border-b border-warm-border flex items-center gap-2">
          <Webhook className="w-5 h-5 text-primary" />
          <h2 className="font-serif text-lg">Actividad Lodgify (webhooks)</h2>
          <span className="ml-auto text-xs text-muted-foreground">Reservas externas (Booking.com, Airbnb…)</span>
        </div>
        <div className="divide-y divide-warm-border">
          {loading ? (
            <p className="p-5 text-sm text-muted-foreground">Cargando…</p>
          ) : events.length === 0 ? (
            <p className="p-5 text-sm text-muted-foreground">
              Sin eventos todavía. Cuando Lodgify envíe webhooks a <code className="font-mono text-xs">/api/lodgify-webhook</code> los verás aquí.
            </p>
          ) : (
            events.map((e) => (
              <div key={e.id} className="p-4 flex items-center gap-4 text-sm">
                <span className="text-xs font-mono text-muted-foreground w-32">{fmtDateTime(e.received_at)}</span>
                <span className="font-medium">{e.event_type ?? "evento"}</span>
                {e.lodgify_booking_id && (
                  <span className="text-xs text-muted-foreground font-mono">booking #{e.lodgify_booking_id}</span>
                )}
                {e.lodgify_property_id && (
                  <span className="text-xs text-muted-foreground ml-auto">
                    {UNIT_LABELS[e.lodgify_property_id] ?? e.lodgify_property_id}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

function MessagesTab({ messages, loading, onUpdate }: { messages: ContactMessage[]; loading: boolean; onUpdate: () => void }) {
  const [busy, setBusy] = useState<number | null>(null);
  const toggleRead = async (id: number, read: boolean) => {
    setBusy(id);
    try {
      await fetch("/api/admin/mark-message-read", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, read }),
      });
      onUpdate();
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="bg-card border border-warm-border rounded-xl overflow-hidden">
      <div className="p-5 border-b border-warm-border flex items-center gap-2">
        <Mail className="w-5 h-5 text-primary" />
        <h2 className="font-serif text-lg">Mensajes del formulario de contacto</h2>
        <span className="ml-auto text-xs text-muted-foreground">{messages.length} totales</span>
      </div>
      <div className="divide-y divide-warm-border">
        {loading ? (
          <p className="p-5 text-sm text-muted-foreground">Cargando…</p>
        ) : messages.length === 0 ? (
          <p className="p-5 text-sm text-muted-foreground">No hay mensajes todavía.</p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`p-5 ${!m.read ? "bg-amber-50/40 dark:bg-amber-950/10" : ""}`}>
              <div className="flex items-start gap-3 mb-2">
                <div className="w-9 h-9 bg-muted rounded-full flex items-center justify-center text-xs font-semibold text-foreground shrink-0">
                  {m.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-foreground">{m.name}</p>
                    {!m.read && <span className="w-2 h-2 bg-amber-500 rounded-full" />}
                    <span className="text-xs text-muted-foreground">· {fmtDateTime(m.created_at)}</span>
                    {m.locale && <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{m.locale}</span>}
                    {!m.email_sent && (
                      <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-100 text-red-700">email no enviado</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <a href={`mailto:${m.email}`} className="hover:text-accent">{m.email}</a>
                    {m.subject && <> · <span className="italic">{m.subject}</span></>}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleRead(m.id, !m.read)}
                  disabled={busy === m.id}
                  className="text-xs rounded-md border border-warm-border px-2.5 py-1 hover:bg-muted disabled:opacity-60 inline-flex items-center gap-1"
                  title={m.read ? "Marcar como no leído" : "Marcar como leído"}
                >
                  {m.read ? "No leído" : <><Check className="w-3 h-3" /> Leído</>}
                </button>
              </div>
              <p className="text-sm text-foreground/90 whitespace-pre-wrap pl-12 leading-relaxed">{m.message}</p>
              {m.email_error && (
                <p className="text-[11px] text-red-600 mt-2 pl-12 font-mono" title={m.email_error}>
                  {m.email_error.slice(0, 200)}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function CancelModal({ booking, onClose, onDone }: { booking: Booking; onClose: () => void; onDone: () => void }) {
  const [note, setNote] = useState("");
  const [refund, setRefund] = useState(Boolean(booking.stripe_payment_intent_id));
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; errors?: string[]; refund_id?: string | null } | null>(null);
  const name = [booking.guest_first_name, booking.guest_last_name].filter(Boolean).join(" ").trim() || "Reserva";

  const submit = async () => {
    setSubmitting(true);
    try {
      const r = await fetch("/api/admin/cancel-booking", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: booking.id, refund, note }),
      });
      const data = await r.json();
      setResult(data);
      if (data.ok) {
        setTimeout(onDone, 1200);
      }
    } catch (e) {
      setResult({ ok: false, errors: [e instanceof Error ? e.message : "Unknown error"] });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 px-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl p-6">
        <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Cerrar">
          <X className="w-4 h-4" />
        </button>
        <h2 className="font-serif text-xl mb-1">Cancelar reserva</h2>
        <p className="text-sm text-muted-foreground mb-4">
          <span className="font-medium text-foreground">{name}</span> · {UNIT_LABELS[booking.lodgify_property_id] ?? booking.lodgify_property_id}
        </p>

        {!result && (
          <>
            <ul className="text-xs text-muted-foreground space-y-1 mb-5 list-disc pl-5">
              <li>
                {booking.stripe_payment_intent_id ? (
                  <>Stripe PaymentIntent <code className="font-mono">{booking.stripe_payment_intent_id.slice(0,16)}…</code> {refund ? "será reembolsado en su totalidad" : "NO será reembolsado"}</>
                ) : "Sin PaymentIntent de Stripe asociado"}
              </li>
              <li>
                {booking.lodgify_booking_id ? (
                  <>Lodgify booking <code className="font-mono">#{booking.lodgify_booking_id}</code> será eliminado (soft-delete)</>
                ) : "Sin reserva en Lodgify asociada"}
              </li>
              <li>El estado en la base de datos se marcará como <span className="font-medium">cancelada</span></li>
            </ul>

            {booking.stripe_payment_intent_id && (
              <label className="flex items-center gap-2 mb-4 text-sm">
                <input type="checkbox" checked={refund} onChange={(e) => setRefund(e.target.checked)} className="accent-accent" />
                <span>Procesar reembolso completo en Stripe</span>
              </label>
            )}

            <label className="block mb-4">
              <span className="text-xs text-muted-foreground">Nota interna (opcional)</span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                maxLength={500}
                placeholder="Motivo de cancelación, contexto, etc."
                className="mt-1 w-full text-sm rounded-md border border-warm-border bg-background px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
            </label>

            <div className="flex gap-2">
              <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-warm-border text-sm font-medium hover:bg-muted">
                No, mantener
              </button>
              <button
                onClick={submit}
                disabled={submitting}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium disabled:opacity-60 inline-flex items-center justify-center gap-1.5"
              >
                {submitting ? "Procesando…" : <><Trash2 className="w-4 h-4" /> Cancelar reserva</>}
              </button>
            </div>
          </>
        )}

        {result && (
          <div className={`p-3 rounded-lg text-sm ${result.ok ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
            {result.ok ? (
              <p className="flex items-center gap-2"><Check className="w-4 h-4" /> Reserva cancelada{result.refund_id ? ` · refund ${result.refund_id.slice(0,16)}…` : ""}</p>
            ) : (
              <>
                <p className="font-medium mb-1">Cancelación parcial</p>
                <ul className="text-xs list-disc pl-5 space-y-0.5">
                  {result.errors?.map((e, i) => <li key={i} className="font-mono">{e}</li>)}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
