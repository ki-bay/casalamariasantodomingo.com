"use client";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import {
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

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Consulta general",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("¡Mensaje enviado! Te responderemos pronto.");
    setFormData({ name: "", email: "", subject: "Consulta general", message: "" });
  };

  return (
    <main className="relative z-10 min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-28 pb-16 px-6 md:px-12 flex-1">
        <div className="max-w-[1200px] mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-xs font-medium tracking-widest uppercase text-secondary mb-3">
                Contacto
              </p>
              <h1 className="font-serif text-3xl md:text-4xl tracking-tight mb-4">
                ¿Tienes alguna <em className="italic">pregunta</em>?
              </h1>
              <p className="text-warm-muted font-light max-w-lg mx-auto">
                Estamos aquí para ayudarte. Escríbenos y responderemos en menos
                de 2 horas.
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
                      <p className="text-xs text-secondary">Dirección</p>
                      <p className="text-sm font-medium">
                        Calle Las Damas, Zona Colonial, Santo Domingo 10210
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <a
                    href="#"
                    className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center border border-warm-border hover:border-primary hover:bg-primary hover:text-white transition-all"
                  >
                    <SocialInstagram className="w-4 h-4" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center border border-warm-border hover:border-primary hover:bg-primary hover:text-white transition-all"
                  >
                    <SocialFacebook className="w-4 h-4" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center border border-warm-border hover:border-primary hover:bg-primary hover:text-white transition-all"
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
                    title="Ubicación de Casa La Maria"
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
                      Nombre
                    </Label>
                    <Input
                      required
                      placeholder="Tu nombre"
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
                    Asunto
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
                      <SelectItem value="Consulta general">
                        Consulta general
                      </SelectItem>
                      <SelectItem value="Disponibilidad">
                        Disponibilidad
                      </SelectItem>
                      <SelectItem value="Precios">Precios</SelectItem>
                      <SelectItem value="Problema con reserva">
                        Problema con reserva
                      </SelectItem>
                      <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs font-medium text-secondary mb-1.5">
                    Mensaje
                  </Label>
                  <Textarea
                    required
                    rows={6}
                    placeholder="¿En qué podemos ayudarte?"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="bg-white border-warm-border resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg py-3.5 font-medium text-sm"
                >
                  Enviar Mensaje <Send className="w-4 h-4 ml-1" />
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
