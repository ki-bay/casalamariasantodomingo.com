"use client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { CalendarDays, TrendingUp, Bed, Webhook, AlertTriangle, RefreshCw } from "lucide-react";
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
};

type WebhookEvent = {
  id: number;
  received_at: string;
  event_type: string | null;
  lodgify_booking_id: number | null;
  lodgify_property_id: number | null;
};

const UNIT_LABELS: Record<number, string> = {
  674785: "1B (TwoBedRoom)",
  674786: "2B (TwoBedRoom)",
  674787: "3B (TwoBedRoom)",
  674788: "1A (OneBedRoom)",
  674789: "2A (OneBedRoom)",
};

function nights(checkIn: string, checkOut: string) {
  return Math.max(0, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86_400_000));
}

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString("es-DO", { day: "numeric", month: "short", year: "numeric" });
}
function fmtDateTime(s: string) {
  return new Date(s).toLocaleString("es-DO", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/admin/bookings", { credentials: "include" });
      if (r.status === 401) {
        window.location.href = "/es/admin/login?next=/es/admin";
        return;
      }
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = (await r.json()) as { bookings: Booking[]; events: WebhookEvent[] };
      setBookings(data.bookings ?? []);
      setEvents(data.events ?? []);
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
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const monthlyRevenue = monthly
    .filter((b) => b.status === "confirmed")
    .reduce((s, b) => s + Number(b.total_amount ?? 0), 0);
  const failedCount = bookings.filter((b) => b.status === "lodgify_failed" || b.status === "pending").length;

  return (
    <main className="relative z-10 min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-28 pb-16 px-6 md:px-12 flex-1">
        <div className="max-w-[1200px] mx-auto">
          <ScrollReveal>
            <div className="flex items-center justify-between mb-10 gap-3">
              <div>
                <p className="text-xs font-medium tracking-widest uppercase text-secondary mb-3">
                  Administración
                </p>
                <h1 className="font-serif text-3xl md:text-4xl tracking-tight">Reservas</h1>
              </div>
              <button
                onClick={load}
                disabled={loading}
                className="inline-flex items-center gap-1.5 rounded-full border border-warm-border px-4 py-2 text-sm font-medium bg-card hover:bg-muted disabled:opacity-60"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                Refrescar
              </button>
            </div>
          </ScrollReveal>

          {error && (
            <div className="mb-6 p-4 rounded-lg border border-red-300 bg-red-50 text-sm text-red-800 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Error cargando datos</p>
                <p className="text-xs mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Stats */}
          <ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <StatCard icon={<CalendarDays className="w-5 h-5 text-primary" />} label="Reservas este mes" value={monthly.length} sub="Creadas en mes actual" />
              <StatCard icon={<TrendingUp className="w-5 h-5 text-primary" />} label="Ingresos este mes" value={`$${Math.round(monthlyRevenue).toLocaleString()}`} sub="Solo confirmadas" />
              <StatCard icon={<Bed className="w-5 h-5 text-primary" />} label="Total reservas" value={bookings.length} sub="Histórico completo" />
              <StatCard icon={<AlertTriangle className={`w-5 h-5 ${failedCount > 0 ? "text-amber-600" : "text-primary"}`} />} label="Requieren revisión" value={failedCount} sub="Pendientes o fallidas" />
            </div>
          </ScrollReveal>

          {/* Bookings table */}
          <ScrollReveal>
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
                    No hay reservas todavía. Las que lleguen vía Stripe (web directo) aparecerán aquí automáticamente.
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
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b) => {
                        const fullName = [b.guest_first_name, b.guest_last_name].filter(Boolean).join(" ").trim() || "—";
                        return (
                          <tr key={b.id} className="border-t border-warm-border">
                            <td className="px-4 py-3">
                              <div>
                                <p className="font-medium text-foreground">{fullName}</p>
                                <p className="text-xs text-muted-foreground">{b.guest_email || "(sin email)"}</p>
                                {b.guest_phone && (
                                  <p className="text-xs text-muted-foreground">{b.guest_phone}</p>
                                )}
                              </div>
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
                            </td>
                            <td className="px-4 py-3 text-xs text-muted-foreground">
                              <p>{b.source}</p>
                              {b.lodgify_booking_id && (
                                <p className="font-mono">#{b.lodgify_booking_id}</p>
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
          </ScrollReveal>

          {/* Lodgify webhook events feed */}
          <ScrollReveal>
            <div className="bg-card border border-warm-border rounded-xl overflow-hidden">
              <div className="p-5 border-b border-warm-border flex items-center gap-2">
                <Webhook className="w-5 h-5 text-primary" />
                <h2 className="font-serif text-lg">Actividad Lodgify (webhooks)</h2>
                <span className="ml-auto text-xs text-muted-foreground">
                  Reservas externas (Booking.com, Airbnb…)
                </span>
              </div>
              <div className="divide-y divide-warm-border">
                {loading ? (
                  <p className="p-5 text-sm text-muted-foreground">Cargando…</p>
                ) : events.length === 0 ? (
                  <p className="p-5 text-sm text-muted-foreground">
                    Sin eventos todavía. Cuando Lodgify configure los webhooks salientes hacia
                    <code className="font-mono text-xs ml-1">/api/lodgify-webhook</code> los eventos aparecerán aquí.
                  </p>
                ) : (
                  events.map((e) => (
                    <div key={e.id} className="p-4 flex items-center gap-4 text-sm">
                      <span className="text-xs font-mono text-muted-foreground w-32">{fmtDateTime(e.received_at)}</span>
                      <span className="font-medium">{e.event_type ?? "evento"}</span>
                      {e.lodgify_booking_id && (
                        <span className="text-xs text-muted-foreground font-mono">
                          booking #{e.lodgify_booking_id}
                        </span>
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
          </ScrollReveal>
        </div>
      </div>
      <Footer />
    </main>
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
  return (
    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${m.cls}`}>
      {m.es}
    </span>
  );
}
