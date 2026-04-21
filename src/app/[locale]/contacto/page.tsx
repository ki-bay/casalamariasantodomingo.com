"use client";
import { useState } from "react";
import { useLocale } from "next-intl";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Send,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

function SocialInstagram({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function SocialFacebook({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function ThankYouModal({ isEN, onClose }: { isEN: boolean; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero image — vertical on mobile (natural ratio), horizontal on desktop */}
        <div className="relative w-full aspect-[9/16] md:aspect-[16/9] overflow-hidden bg-muted">
          <img
            src="https://res.cloudinary.com/dspogotur/image/upload/v1776748961/Casa-la-maria-santo-domingo-zona-colonial_vertical_tpzitq.webp"
            alt="Casa La Maria"
            className="w-full h-full object-cover md:hidden"
          />
          <img
            src="https://res.cloudinary.com/dspogotur/image/upload/v1776748962/air-bnb-Casa-la-maria-santo-domingo-zona-colonial-_horizontal_cdtw33.webp"
            alt="Casa La Maria"
            className="w-full h-full object-cover hidden md:block"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h2 className="font-serif text-2xl md:text-3xl mb-2">
              {isEN
                ? "Thank you for contacting Casa La Maria Zona Colonial."
                : "Gracias por contactar a Casa La Maria Zona Colonial."}
            </h2>
            <p className="text-white/80 text-sm font-light mb-4">
              {isEN
                ? "We normally respond within 12 hours. In case of emergency, reach us directly on WhatsApp:"
                : "Normalmente respondemos en 12 horas. En caso de emergencia, escríbenos directamente por WhatsApp:"}
            </p>
            <a
              href="https://wa.me/18494067269"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold py-3.5 px-6 rounded-xl transition-colors text-sm"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.852L.057 23.8a.5.5 0 0 0 .61.633l6.155-1.612A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.814 9.814 0 0 1-5.01-1.374l-.36-.214-3.732.977.998-3.645-.235-.374A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182c5.43 0 9.818 4.388 9.818 9.818 0 5.43-4.388 9.818-9.818 9.818z"/>
              </svg>
              +1 (849) 406-7269
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactoPage() {
  const locale = useLocale();
  const isEN = locale === "en";
  const [showModal, setShowModal] = useState(false);

  const defaultSubject = isEN ? "General inquiry" : "Consulta general";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: defaultSubject,
    message: "",
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, locale }),
      });
    } catch {
      // fail silently — show success regardless (email may still send)
    } finally {
      setSending(false);
      setFormData({ name: "", email: "", subject: defaultSubject, message: "" });
      setShowModal(true);
    }
  };

  return (
    <main className="relative z-10 min-h-screen flex flex-col">
      {showModal && <ThankYouModal isEN={isEN} onClose={() => setShowModal(false)} />}
      <Navbar />
      <div className="pt-28 pb-16 px-6 md:px-12 flex-1">
        <div className="max-w-[1200px] mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-xs font-medium tracking-widest uppercase text-secondary mb-3">
                {isEN ? "Contact" : "Contacto"}
              </p>
              <h1 className="font-serif text-3xl md:text-4xl tracking-tight mb-4">
                {isEN ? (
                  <>Do you have a <em className="italic">question</em>?</>
                ) : (
                  <>¿Tienes alguna <em className="italic">pregunta</em>?</>
                )}
              </h1>
              <p className="text-warm-muted font-light max-w-lg mx-auto">
                {isEN
                  ? "We're here to help. Write to us and we'll respond in less than 2 hours."
                  : "Estamos aquí para ayudarte. Escríbenos y responderemos en menos de 2 horas."}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-12">
            <ScrollReveal>
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-secondary">Email</p>
                      <p className="text-sm font-medium">
                        info@casalamariazonacolonial.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-secondary">WhatsApp</p>
                      <p className="text-sm font-medium">+1 (829) 000-0000</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-secondary">
                        {isEN ? "Address" : "Dirección"}
                      </p>
                      <p className="text-sm font-medium">
                        Calle Las Damas, Zona Colonial, Santo Domingo 10210
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <a
                    href="#"
                    className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center border border-warm-border hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    <SocialInstagram className="w-4 h-4" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center border border-warm-border hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    <SocialFacebook className="w-4 h-4" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center border border-warm-border hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>

                {/* Map */}
                <div className="rounded-xl overflow-hidden border border-warm-border h-[300px]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.5!2d-69.8819!3d18.4725!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf89fe4861c0d7%3A0x47c1f2c4c4c3e3e0!2sCalle%20Las%20Damas%2C%20Santo%20Domingo!5e0!3m2!1ses!2sdo!4v1700000000000"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={isEN ? "Location of Casa La Maria" : "Ubicación de Casa La Maria"}
                  />
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl border border-warm-border p-6 md:p-8 space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-medium text-secondary mb-1.5">
                      {isEN ? "Name" : "Nombre"}
                    </Label>
                    <Input
                      required
                      placeholder={isEN ? "Your name" : "Tu nombre"}
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="bg-white border-warm-border"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-secondary mb-1.5">
                      Email
                    </Label>
                    <Input
                      type="email"
                      required
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="bg-white border-warm-border"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs font-medium text-secondary mb-1.5">
                    {isEN ? "Subject" : "Asunto"}
                  </Label>
                  <Select
                    value={formData.subject}
                    onValueChange={(v) =>
                      setFormData({ ...formData, subject: v })
                    }
                  >
                    <SelectTrigger className="bg-white border-warm-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {isEN ? (
                        <>
                          <SelectItem value="General inquiry">General inquiry</SelectItem>
                          <SelectItem value="Availability">Availability</SelectItem>
                          <SelectItem value="Pricing">Pricing</SelectItem>
                          <SelectItem value="Booking issue">Booking issue</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="Consulta general">Consulta general</SelectItem>
                          <SelectItem value="Disponibilidad">Disponibilidad</SelectItem>
                          <SelectItem value="Precios">Precios</SelectItem>
                          <SelectItem value="Problema con reserva">Problema con reserva</SelectItem>
                          <SelectItem value="Otro">Otro</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs font-medium text-secondary mb-1.5">
                    {isEN ? "Message" : "Mensaje"}
                  </Label>
                  <Textarea
                    required
                    rows={6}
                    placeholder={isEN ? "How can we help you?" : "¿En qué podemos ayudarte?"}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="bg-white border-warm-border resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg py-3.5 font-medium text-sm disabled:opacity-60"
                >
                  {sending
                    ? (isEN ? "Sending…" : "Enviando…")
                    : <>{isEN ? "Send Message" : "Enviar Mensaje"} <Send className="w-4 h-4 ml-1" /></>}
                </Button>
              </form>
            </ScrollReveal>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}