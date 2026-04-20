"use client";

import { useLocale } from "next-intl";
import { MessageCircle, Mail } from "lucide-react";
import Link from "next/link";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export function Footer() {
  const locale = useLocale();
  const isEN = locale === "en";

  const navLinks = [
    { href: `/${locale}/apartamentos`, label: isEN ? "Apartments" : "Apartamentos" },
    { href: `/${locale}#galeria`, label: isEN ? "Gallery" : "Galería" },
    { href: `/${locale}#ubicacion`, label: isEN ? "Location" : "Ubicación" },
    { href: `/${locale}/blog`, label: "Blog" },
    { href: `/${locale}/contacto`, label: isEN ? "Contact" : "Contacto" },
  ];

  const infoLinks = [
    { href: "#", label: isEN ? "Cancellation policy" : "Política de cancelación" },
    { href: "#", label: isEN ? "Terms & conditions" : "Términos y condiciones" },
    { href: "#", label: isEN ? "Privacy policy" : "Política de privacidad" },
    { href: "#", label: "FAQ" },
  ];

  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link href={`/${locale}`} className="font-serif text-lg text-foreground">
              Casa La Maria
            </Link>
            <p className="text-xs text-muted-foreground font-light mt-2 leading-relaxed max-w-[220px]">
              {isEN
                ? "Five boutique apartments in the heart of Santo Domingo's Colonial Zone."
                : "Cinco apartamentos boutique en el corazón de la Zona Colonial de Santo Domingo."}
            </p>
            <a
              href="mailto:info@casalamariazonacolonial.com"
              className="flex items-center gap-1.5 mt-3 text-xs text-accent hover:underline"
            >
              <Mail className="w-3.5 h-3.5" />
              info@casalamariazonacolonial.com
            </a>
          </div>
          <div>
            <p className="text-xs font-medium tracking-wider uppercase text-muted-foreground mb-4">
              {isEN ? "Navigation" : "Navegación"}
            </p>
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium tracking-wider uppercase text-muted-foreground mb-4">
              {isEN ? "Information" : "Información"}
            </p>
            <div className="space-y-2">
              {infoLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium tracking-wider uppercase text-muted-foreground mb-4">
              {isEN ? "Secure payments" : "Pagos seguros"}
            </p>
            <div className="flex gap-2 flex-wrap">
              {["Stripe", "PayPal", "Visa", "MC"].map((p) => (
                <div key={p} className="bg-muted border border-border rounded-md px-3 py-2 text-xs font-medium text-foreground">
                  {p}
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-green-500" />
              <span className="text-xs text-muted-foreground">
                {isEN ? "100% secure payments" : "Pagos 100% seguros"}
              </span>
            </div>
          </div>
        </div>
        <div className="border-t border-border mb-6" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            {isEN
              ? "© 2025 Casa La Maria — Colonial Zone. All rights reserved."
              : "© 2025 Casa La Maria — Zona Colonial. Todos los derechos reservados."}
          </p>
          <div className="flex items-center gap-4">
            <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-foreground transition-colors">
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a href="#" aria-label="Facebook" className="text-muted-foreground hover:text-foreground transition-colors">
              <FacebookIcon className="w-4 h-4" />
            </a>
            <a href="https://wa.me/18290000000" aria-label="WhatsApp" className="text-muted-foreground hover:text-green-500 transition-colors">
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
