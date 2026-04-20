"use client";

import { MessageCircle } from "lucide-react";
import Link from "next/link";

const NAV_LINKS = [
  { href: "#propiedad", label: "Propiedad" },
  { href: "#galeria", label: "Galería" },
  { href: "#ubicacion", label: "Ubicación" },
  { href: "#resenas", label: "Reseñas" },
  { href: "#blog", label: "Blog" },
];

const INFO_LINKS = [
  { href: "#", label: "Política de cancelación" },
  { href: "#", label: "Términos y condiciones" },
  { href: "#", label: "Política de privacidad" },
  { href: "#", label: "FAQ" },
];

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
  return (
    <footer className="border-t border-warm-border bg-white">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-serif text-lg text-primary">
              Casa La Maria
            </Link>
            <p className="text-xs text-secondary font-light mt-2 leading-relaxed max-w-[220px]">
              Un refugio boutique en el corazón de la primera ciudad de América.
            </p>
          </div>
          <div>
            <p className="text-xs font-medium tracking-wider uppercase text-secondary mb-4">
              Navegación
            </p>
            <div className="space-y-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-warm-muted hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium tracking-wider uppercase text-secondary mb-4">
              Información
            </p>
            <div className="space-y-2">
              {INFO_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block text-sm text-warm-muted hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium tracking-wider uppercase text-secondary mb-4">
              Pagos seguros
            </p>
            <div className="flex gap-2 flex-wrap">
              <div className="bg-surface border border-warm-border rounded-md px-3 py-2 text-xs font-medium">
                Stripe
              </div>
              <div className="bg-surface border border-warm-border rounded-md px-3 py-2 text-xs font-medium">
                PayPal
              </div>
              <div className="bg-surface border border-warm-border rounded-md px-3 py-2 text-xs font-medium">
                Visa
              </div>
              <div className="bg-surface border border-warm-border rounded-md px-3 py-2 text-xs font-medium">
                MC
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-green-accent" />
              <span className="text-xs text-secondary">Pagos 100% seguros</span>
            </div>
          </div>
        </div>
        <div className="gradient-divider mb-6" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-secondary">
            © 2025 Casa La Maria. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-secondary hover:text-primary transition-colors">
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a href="#" className="text-secondary hover:text-primary transition-colors">
              <FacebookIcon className="w-4 h-4" />
            </a>
            <a href="#" className="text-secondary hover:text-primary transition-colors">
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
