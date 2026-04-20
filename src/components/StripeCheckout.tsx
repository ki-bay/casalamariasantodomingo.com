"use client";

import { useState } from "react";
import { Lock, Check, Loader2 } from "lucide-react";
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
}

export function StripeCheckout({
  open,
  onOpenChange,
  checkIn,
  checkOut,
  guests,
  booking,
}: StripeCheckoutProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [reservationId, setReservationId] = useState("");

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("es-DO", {
      month: "short",
      day: "numeric",
    });
  };

  const handlePayment = async (method: "stripe" | "paypal") => {
    if (!name.trim() || !email.trim()) {
      toast.error("Por favor, completa tu nombre y email");
      return;
    }

    setProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2500));

    const resId = "CLM-" + Date.now().toString(36).toUpperCase();
    setReservationId(resId);
    setProcessing(false);
    setSuccess(true);
    toast.success("¡Reserva confirmada exitosamente!");
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset after animation
    setTimeout(() => {
      setSuccess(false);
      setProcessing(false);
      setName("");
      setEmail("");
      setPhone("");
      setNotes("");
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[480px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            Completar Reserva
          </DialogTitle>
          <p className="text-sm text-secondary">
            Casa La Maria · {formatDate(checkIn)} — {formatDate(checkOut)}
          </p>
        </DialogHeader>

        {!processing && !success && (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-medium text-secondary">
                Nombre completo
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Como aparece en tu documento"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-secondary">
                Email
              </Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-secondary">
                Teléfono (WhatsApp)
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
                Petición especial (opcional)
              </Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Late check-in, alergias, etc."
                rows={2}
                className="mt-1.5 resize-none"
              />
            </div>

            <div className="bg-surface rounded-xl p-4 space-y-2 border border-warm-border">
              <div className="flex justify-between text-sm">
                <span className="text-warm-muted">
                  ${Math.round(booking.nightsTotal / booking.nights)} ×{" "}
                  {booking.nights} noches
                </span>
                <span className="font-medium">
                  ${booking.nightsTotal.toFixed(0)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-warm-muted">Limpieza</span>
                <span className="font-medium">${PROPERTY.cleaningFee}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-warm-muted">Servicio (8%)</span>
                <span className="font-medium">
                  ${booking.serviceFee.toFixed(0)}
                </span>
              </div>
              <div className="gradient-divider my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${booking.total.toFixed(0)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                onClick={() => handlePayment("stripe")}
                className="w-full py-3.5 bg-gradient-to-r from-[#635BFF] to-[#7A73FF] hover:opacity-90 text-white rounded-lg font-medium text-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(99,91,255,0.4)]"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-7.076-2.19l-.894 5.549C4.726 22.825 8.004 24 11.276 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-7.153-7.305z" />
                </svg>
                Pagar con Stripe
              </Button>
              <Button
                onClick={() => handlePayment("paypal")}
                className="w-full py-3.5 bg-[#FFC439] hover:bg-[#F0B723] text-[#003087] rounded-lg font-semibold text-sm transition-all hover:-translate-y-0.5"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="#003087"
                >
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c1.655 2.89.496 6.643-3.39 7.752l.006-.01c-.49.14-1.03.22-1.61.22h-2.19a1.06 1.06 0 0 0-1.047.903l-1.12 7.106-.322 2.034a.556.556 0 0 0 .548.642h3.882c.46 0 .85-.334.922-.788l.038-.188.734-4.642.047-.254a.931.931 0 0 1 .922-.789h.582c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471-.28-.32-.626-.585-1.016-.788z" />
                </svg>
                Pagar con PayPal
              </Button>
            </div>

            <div className="flex items-center gap-2 text-xs text-secondary">
              <Lock className="w-3 h-3" />
              <span>Pago seguro y encriptado. No almacenamos tus datos.</span>
            </div>
          </div>
        )}

        {processing && (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 border-3 border-warm-border border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-medium">Procesando tu reserva...</p>
            <p className="text-xs text-secondary mt-1">
              Esto puede tomar unos segundos
            </p>
          </div>
        )}

        {success && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-accent" />
            </div>
            <h3 className="font-serif text-xl mb-2">¡Reserva Confirmada!</h3>
            <p className="text-sm text-warm-muted font-light mb-4">
              Te hemos enviado un email con los detalles y el código de acceso.
            </p>
            <p className="text-xs text-secondary">
              ID de reserva:{" "}
              <span className="font-mono font-medium">{reservationId}</span>
            </p>
            <Button
              onClick={handleClose}
              className="mt-6 bg-primary hover:bg-primary/90 text-white"
            >
              Cerrar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
