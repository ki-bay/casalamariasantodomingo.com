"use client";
import { useLocale } from "next-intl";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { BookingWidget } from "@/components/BookingWidget";
import { Gallery } from "@/components/Gallery";
import { Location } from "@/components/Location";
import { Reviews } from "@/components/Reviews";
import { BlogCards } from "@/components/BlogCards";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { FAQS, FAQS_EN } from "@/lib/data";
import { PROPERTY } from "@/lib/data";
import {
  BedDouble,
  Bath,
  Users,
  Ruler,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Send,
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import { useState } from "react";

export default function HomePage() {
  const locale = useLocale();
  const isEN = locale === "en";

  return (
    <main className="relative z-10">
      <Navbar />
      <Hero />

      {/* Quick Stats */}
      <section className="px-6 md:px-12 -mt-8 relative z-10 mb-20">
        <div className="max-w-[1200px] mx-auto">
          <ScrollReveal>
            <div className="bg-white rounded-2xl border border-warm-border p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 shadow-[0_2px_20px_-10px_rgba(0,0,0,0.03)]">
              <div className="text-center">
                <div className="w-10 h-10 mx-auto mb-3 bg-surface rounded-lg flex items-center justify-center">
                  <BedDouble className="w-5 h-5 text-primary" />
                </div>
                <p className="font-semibold text-sm">{isEN ? "1 Bedroom" : "1 Dormitorio"}</p>
                <p className="text-xs text-secondary mt-0.5">{isEN ? "Queen size bed" : "Cama queen size"}</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 mx-auto mb-3 bg-surface rounded-lg flex items-center justify-center">
                  <Bath className="w-5 h-5 text-primary" />
                </div>
                <p className="font-semibold text-sm">{isEN ? "1 Bathroom" : "1 Baño"}</p>
                <p className="text-xs text-secondary mt-0.5">{isEN ? "Hot water" : "Agua caliente"}</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 mx-auto mb-3 bg-surface rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <p className="font-semibold text-sm">{isEN ? "2 Guests" : "2 Huéspedes"}</p>
                <p className="text-xs text-secondary mt-0.5">{isEN ? "Maximum capacity" : "Máximo capacidad"}</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 mx-auto mb-3 bg-surface rounded-lg flex items-center justify-center">
                  <Ruler className="w-5 h-5 text-primary" />
                </div>
                <p className="font-semibold text-sm">55 m²</p>
                <p className="text-xs text-secondary mt-0.5">{isEN ? "Private space" : "Espacio privado"}</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <BookingWidget />
      <GradientDivider />
      <Gallery />
      <GradientDivider />
      <Location />
      <GradientDivider />
      <Reviews />
      <GradientDivider />
      <BlogCards />
      <GradientDivider />
      <FAQSection isEN={isEN} />
      <GradientDivider />
      <ContactSection isEN={isEN} />
      <NewsletterSection isEN={isEN} />
      <Footer />
    </main>
  );
}

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

function GradientDivider() {
  return <div className="gradient-divider max-w-[1200px] mx-auto" />;
}

function FAQSection({ isEN }: { isEN: boolean }) {
  const faqs = isEN ? FAQS_EN : FAQS;
  return (
    <section className="px-6 md:px-12 py-16 md:py-24">
      <div className="max-w-[700px] mx-auto">
        <ScrollReveal>
          <div className="text-center mb-10">
            <p className="text-xs font-medium tracking-widest uppercase text-secondary mb-3">
              {isEN ? "Frequently Asked Questions" : "Preguntas Frecuentes"}
            </p>
            <h2 className="font-serif text-2xl md:text-[30px] tracking-tight">
              {isEN ? (
                <>Have any <em className="italic">questions</em>?</>
              ) : (
                <>¿Tienes <em className="italic">dudas</em>?</>
              )}
            </h2>
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border border-warm-border rounded-xl overflow-hidden bg-white px-5 data-[state=open]:border-primary"
              >
                <AccordionTrigger className="text-sm font-medium text-left py-5 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-warm-muted font-light leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollReveal>
      </div>
    </section>
  );
}

function ContactSection({ isEN }: { isEN: boolean }) {
  const defaultSubject = isEN ? "General inquiry" : "Consulta general";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: defaultSubject,
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(
      isEN
        ? "Message sent! We'll get back to you shortly."
        : "¡Mensaje enviado! Te responderemos pronto."
    );
    setFormData({ name: "", email: "", subject: defaultSubject, message: "" });
  };

  return (
    <section id="contacto" className="px-6 md:px-12 py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-12">
        <ScrollReveal>
          <div>
            <p className="text-xs font-medium tracking-widest uppercase text-secondary mb-3">
              {isEN ? "Contact" : "Contacto"}
            </p>
            <h2 className="font-serif text-2xl md:text-[30px] tracking-tight mb-6">
              {isEN ? (
                <>Do you have a <em className="italic">question</em>?</>
              ) : (
                <>¿Tienes alguna <em className="italic">pregunta</em>?</>
              )}
            </h2>
            <p className="text-sm text-warm-muted font-light leading-relaxed mb-8">
              {isEN
                ? "We're here to help. Write to us and we'll respond in less than 2 hours."
                : "Estamos aquí para ayudarte. Escríbenos y responderemos en menos de 2 horas."}
            </p>

            <div className="space-y-4 mb-8">
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
                  <p className="text-xs text-secondary">{isEN ? "Address" : "Dirección"}</p>
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
                rows={4}
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
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg py-3.5 font-medium text-sm"
            >
              {isEN ? "Send Message" : "Enviar Mensaje"} <Send className="w-4 h-4 ml-1" />
            </Button>
          </form>
        </ScrollReveal>
      </div>
    </section>
  );
}

function NewsletterSection({ isEN }: { isEN: boolean }) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(
      isEN
        ? "Subscribed! Check your email for the discount code."
        : "¡Suscripción exitosa! Revisa tu email para el código de descuento."
    );
    setEmail("");
  };

  return (
    <section className="px-6 md:px-12 pb-16 md:pb-24">
      <div className="max-w-[600px] mx-auto text-center">
        <ScrollReveal>
          <div className="bg-primary rounded-2xl p-8 md:p-10 text-primary-foreground">
            <Mail className="w-8 h-8 mx-auto mb-4 text-primary-foreground/60" />
            <h3 className="font-serif text-xl mb-2">
              {isEN ? "Receive exclusive offers" : "Recibe ofertas exclusivas"}
            </h3>
            <p className="text-sm text-primary-foreground/60 font-light mb-6">
              {isEN
                ? "Subscribe and get 10% off your first booking"
                : "Suscríbete y obtén un 10% de descuento en tu primera reserva"}
            </p>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                type="email"
                required
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 focus:border-primary-foreground/50 rounded-lg"
              />
              <Button
                type="submit"
                className="bg-primary-foreground text-primary px-5 rounded-lg text-sm font-medium hover:bg-primary-foreground/90 flex-shrink-0"
              >
                {isEN ? "Subscribe" : "Suscribir"}
              </Button>
            </form>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
