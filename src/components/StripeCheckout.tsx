"use client";

import { useState, useEffect } from "react";
import { Lock, Check, Loader2 } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PROPERTY } from "@/lib/data";
import { toast } from "sonner";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface BookingResult {
  nights: number;
  nightsTotal: number;
  serviceFee: number;
  total: number;
  discount: number;
}

interface StripeCheckoutProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  checkIn: string;
  checkOut: string;
  guests: string;
  booking: BookingResult;
  locale?: string;
}

// Inner form that uses Stripe hooks — must be inside <Elements>
function PaymentForm({
  isEN,
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  notes,
  setNotes,
  booking,
  checkIn,
  checkOut,
  guests,
  onSuccess,
}: {
  isEN: boolean;
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
  booking: BookingResult;
  checkIn: string;
  checkOut: string;
  guests: string;
  onSuccess: (id: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (!name.trim() || !email.trim()) {
      toast.error(
        isEN
          ? "Please fill in your name and email"
          : "Por favor, completa tu nombre y email"
      );
      return;
    }

    setProcessing(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href,
        receipt_email: email,
        payment_method_data: {
          billing_details: { name, email, phone },
        },
      },
      redirect: "if_required",
    });

    if (error) {
      toast.error(error.message ?? (isEN ? "Payment failed" : "Pago fallido"));
      setProcessing(false);
    } else if (paymentIntent?.status === "succeeded") {
      onSuccess("CLM-" + paymentIntent.id.slice(-8).toUpperCase());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs font-medium text-secondary">
            {isEN ? "Full name" : "Nombre completo"}
          </Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={isEN ? "Your full name" : "Tu nombre completo"}
            required
            className="mt-1.5"
          />
        </div>
        <div>
          <Label className="text-xs font-medium text-secondary">Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
            className="mt-1.5"
          />
        </div>
      </div>
      <div>
        <Label className="text-xs font-medium text-secondary">
          {isEN ? "Phone (WhatsApp, optional)" : "Teléfono (WhatsApp, opcional)"}
        </Label>
        <Input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+1 (829) 000-0000"
          className="mt-1.5"
        />
      </div>
      <div>
        <Label className="text-xs font-medium text-secondary">
          {isEN ? "Special request (optional)" : "Petición especial (opcional)"}
        </Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={isEN ? "Late check-in, allergies, etc." : "Late check-in, alergias, etc."}
          rows={2}
          className="mt-1.5 resize-none"
        />
      </div>

      {/* Price summary */}
      <div className="bg-surface rounded-xl p-4 space-y-2 border border-warm-border">
        <div className="flex justify-between text-sm">
          <span className="text-warm-muted">
            ${Math.round(booking.nightsTotal / booking.nights)} ×{" "}
            {booking.nights} {isEN ? "nights" : "noches"}
          </span>
          <span className="font-medium">${booking.nightsTotal.toFixed(0)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-warm-muted">{isEN ? "Cleaning" : "Limpieza"}</span>
          <span className="font-medium">${PROPERTY.cleaningFee}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-warm-muted">{isEN ? "Service (8%)" : "Servicio (8%)"}</span>
          <span className="font-medium">${booking.serviceFee.toFixed(0)}</span>
        </div>
        <div className="gradient-divider my-2" />
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>${booking.total.toFixed(0)}</span>
        </div>
      </div>

      {/* Stripe card element */}
      <div className="rounded-lg border border-warm-border p-3 bg-card">
        <PaymentElement
          options={{
            layout: "tabs",
            fields: { billingDetails: { name: "never", email: "never" } },
          }}
        />
      </div>

      <Button
        type="submit"
        disabled={!stripe || processing}
        className="w-full py-3.5 bg-gradient-to-r from-[#635BFF] to-[#7A73FF] hover:opacity-90 text-white rounded-lg font-medium text-sm"
      >
        {processing ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <Lock className="w-3.5 h-3.5 mr-1.5" />
            {isEN
              ? `Pay $${booking.total.toFixed(0)}`
              : `Pagar $${booking.total.toFixed(0)}`}
          </>
        )}
      </Button>

      <p className="text-center text-xs text-secondary flex items-center justify-center gap-1">
        <Lock className="w-3 h-3" />
        {isEN
          ? "Secured by Stripe. We never store your card data."
          : "Protegido por Stripe. No guardamos tu tarjeta."}
      </p>
    </form>
  );
}

export function StripeCheckout({
  open,
  onOpenChange,
  checkIn,
  checkOut,
  guests,
  booking,
  locale = "es",
}: StripeCheckoutProps) {
  const isEN = locale === "en";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadingIntent, setLoadingIntent] = useState(false);
  const [success, setSuccess] = useState(false);
  const [reservationId, setReservationId] = useState("");

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString(isEN ? "en-US" : "es-DO", {
      month: "short",
      day: "numeric",
    });
  };

  // Create PaymentIntent when dialog opens
  useEffect(() => {
    if (!open || clientSecret) return;
    setLoadingIntent(true);
    const amountCents = Math.round(booking.total * 100);
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: amountCents,
        nights: booking.nights,
        checkIn,
        checkOut,
        guests,
        guestName: name,
        guestEmail: email,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.clientSecret) setClientSecret(data.clientSecret);
        else toast.error(isEN ? "Could not initialize payment" : "No se pudo inicializar el pago");
      })
      .catch(() =>
        toast.error(isEN ? "Network error" : "Error de red")
      )
      .finally(() => setLoadingIntent(false));
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setSuccess(false);
      setClientSecret(null);
      setName("");
      setEmail("");
      setPhone("");
      setNotes("");
    }, 300);
  };

  const handleSuccess = (id: string) => {
    setReservationId(id);
    setSuccess(true);
    toast.success(isEN ? "Booking confirmed!" : "¡Reserva confirmada!");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[520px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            {isEN ? "Complete Booking" : "Completar Reserva"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Casa La Maria · {formatDate(checkIn)} — {formatDate(checkOut)}
          </p>
        </DialogHeader>

        {/* Loading PaymentIntent */}
        {loadingIntent && (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-primary" />
            <p className="text-sm text-muted-foreground">
              {isEN ? "Preparing secure checkout..." : "Preparando pago seguro..."}
            </p>
          </div>
        )}

        {/* Payment form */}
        {!loadingIntent && !success && clientSecret && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "stripe",
                variables: {
                  colorPrimary: "#2B2B2B",
                  borderRadius: "8px",
                  fontFamily: "Inter, sans-serif",
                },
              },
            }}
          >
            <PaymentForm
              isEN={isEN}
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              phone={phone}
              setPhone={setPhone}
              notes={notes}
              setNotes={setNotes}
              booking={booking}
              checkIn={checkIn}
              checkOut={checkOut}
              guests={guests}
              onSuccess={handleSuccess}
            />
          </Elements>
        )}

        {/* No publishable key configured */}
        {!loadingIntent && !success && !clientSecret && (
          <div className="text-center py-8 text-sm text-muted-foreground">
            {isEN
              ? "Payment system not configured. Please contact us directly."
              : "Sistema de pago no configurado. Contáctanos directamente."}
          </div>
        )}

        {/* Success screen */}
        {success && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-accent" />
            </div>
            <h3 className="font-serif text-xl mb-2">
              {isEN ? "Booking Confirmed!" : "¡Reserva Confirmada!"}
            </h3>
            <p className="text-sm text-warm-muted font-light mb-4">
              {isEN
                ? "A confirmation has been sent to your email."
                : "Te hemos enviado una confirmación por email."}
            </p>
            <div className="bg-surface rounded-xl border border-warm-border p-4 text-left space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-warm-muted font-medium">Check-in</span>
                <span className="font-semibold">{formatDate(checkIn)} · 3:00 PM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-warm-muted font-medium">Check-out</span>
                <span className="font-semibold">{formatDate(checkOut)} · 11:00 AM</span>
              </div>
            </div>
            <p className="text-xs text-secondary">
              {isEN ? "Booking ID:" : "ID de reserva:"}{" "}
              <span className="font-mono font-medium">{reservationId}</span>
            </p>
            <Button
              onClick={handleClose}
              className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isEN ? "Close" : "Cerrar"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
