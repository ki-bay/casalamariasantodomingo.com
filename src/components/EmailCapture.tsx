"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const STORAGE_KEY = "clm_email_capture_v1";
const DISCOUNT_CODE = "DIRECT5";

/**
 * Exit-intent / scroll-trigger email capture.
 *
 * Trigger rules:
 *   - Desktop: cursor leaves through the top of the viewport (classic exit intent)
 *   - Mobile:  scrolls past 60% of the page (no exit intent on touch)
 * Skipped:
 *   - if the user already converted (localStorage) or dismissed
 *   - on /reserva, /book, /admin (don't interrupt booking)
 *   - on /por-que-reservar-directo, /why-book-direct (already in conversion mode)
 *
 * On submit: POSTs to /api/subscribe which adds the contact to Brevo and
 * fires the welcome email + 48-hour itinerary lead-magnet link.
 */
export function EmailCapture() {
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEN = pathname.startsWith("/en");
  const blocked =
    /\/(reserva|book|admin|por-que-reservar-directo|why-book-direct)(\b|\/)/.test(pathname);

  useEffect(() => {
    if (typeof window === "undefined" || blocked) return;
    if (localStorage.getItem(STORAGE_KEY)) return;

    let scrollHandler: (() => void) | null = null;
    let mouseHandler: ((e: MouseEvent) => void) | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const trigger = () => {
      // Re-check storage on each potential trigger so a tab opened after
      // success in another tab doesn't re-pop.
      if (localStorage.getItem(STORAGE_KEY)) return;
      setOpen(true);
      cleanup();
    };

    const cleanup = () => {
      if (scrollHandler) window.removeEventListener("scroll", scrollHandler);
      if (mouseHandler) document.removeEventListener("mouseout", mouseHandler);
      if (timeoutId) clearTimeout(timeoutId);
    };

    const isTouch = window.matchMedia?.("(pointer: coarse)").matches;
    if (isTouch) {
      // Mobile: 60% scroll fallback
      scrollHandler = () => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        if (total > 0 && window.scrollY / total > 0.6) trigger();
      };
      window.addEventListener("scroll", scrollHandler, { passive: true });
      // Hard cap so we still trigger on shorter pages where 60% doesn't hit
      timeoutId = setTimeout(trigger, 45_000);
    } else {
      // Desktop: classic exit-intent (cursor leaves via top of viewport)
      mouseHandler = (e: MouseEvent) => {
        if (e.clientY <= 0 && e.relatedTarget === null) trigger();
      };
      document.addEventListener("mouseout", mouseHandler);
      // Fallback so users who never reach the top edge still see it after 60s
      timeoutId = setTimeout(trigger, 60_000);
    }

    return cleanup;
  }, [blocked]);

  const close = (persist: boolean) => {
    setOpen(false);
    if (persist && typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, success ? "subscribed" : "dismissed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          firstName: firstName.trim(),
          locale: isEN ? "en" : "es",
          source: "exit_intent",
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="email-capture-title"
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 px-4"
      onClick={() => close(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl p-7 md:p-8"
      >
        <button
          type="button"
          onClick={() => close(true)}
          aria-label={isEN ? "Close" : "Cerrar"}
          className="absolute top-3 right-3 p-1.5 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition"
        >
          <X className="w-4 h-4" />
        </button>

        {!success ? (
          <>
            <div className="flex items-center gap-2 text-accent mb-3">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-semibold tracking-[0.18em] uppercase">
                {isEN ? "Direct booking offer" : "Oferta de reserva directa"}
              </span>
            </div>
            <h2 id="email-capture-title" className="font-serif text-2xl md:text-[28px] leading-tight mb-2">
              {isEN ? (
                <>
                  Get <em className="italic">5% off</em> + the Zona Colonial 48-hour itinerary
                </>
              ) : (
                <>
                  <em className="italic">5% de descuento</em> + el itinerario de 48 horas en la Zona Colonial
                </>
              )}
            </h2>
            <p className="text-sm text-muted-foreground mb-5">
              {isEN
                ? "We'll email a discount code (use it at checkout) and a curated walking-and-eating plan with the spots locals send their friends to."
                : "Te enviamos un código de descuento (úsalo al hacer la reserva) y un plan curado de caminata y restaurantes con los sitios que los locales recomiendan."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                type="text"
                placeholder={isEN ? "First name (optional)" : "Nombre (opcional)"}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-background"
                aria-label={isEN ? "First name" : "Nombre"}
              />
              <Input
                type="email"
                required
                placeholder={isEN ? "your@email.com" : "tu@email.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background"
                aria-label="Email"
              />
              {error && (
                <p className="text-xs text-red-500" role="alert">
                  {isEN ? "Couldn't subscribe — please try again." : "No se pudo suscribir — intenta de nuevo."}
                </p>
              )}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                {submitting
                  ? isEN ? "Sending…" : "Enviando…"
                  : isEN ? "Send me the code + itinerary" : "Enviarme el código + itinerario"}
              </Button>
              <p className="text-[11px] text-muted-foreground text-center">
                {isEN
                  ? "No spam. Unsubscribe anytime. We use Brevo to deliver."
                  : "Sin spam. Cancela cuando quieras. Enviamos vía Brevo."}
              </p>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-accent/15 text-accent flex items-center justify-center mx-auto mb-4">
              <Check className="w-7 h-7" />
            </div>
            <h2 className="font-serif text-2xl mb-2">
              {isEN ? "Check your inbox" : "Revisa tu correo"}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              {isEN
                ? "We just sent your discount code and the 48-hour itinerary."
                : "Te acabamos de enviar tu código de descuento y el itinerario de 48 horas."}
            </p>
            <div className="rounded-lg bg-muted/50 border border-border px-4 py-3 mb-4">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">
                {isEN ? "Your code" : "Tu código"}
              </p>
              <p className="font-mono text-lg font-semibold tracking-wider text-foreground">
                {DISCOUNT_CODE}
              </p>
            </div>
            <Button onClick={() => close(true)} className="w-full">
              {isEN ? "Got it" : "Listo"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
