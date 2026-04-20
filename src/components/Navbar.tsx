"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { href: "#propiedad", label: "Propiedad" },
  { href: "#galeria", label: "Galería" },
  { href: "#ubicacion", label: "Ubicación" },
  { href: "#resenas", label: "Reseñas" },
  { href: "#blog", label: "Blog" },
];

export function Navbar() {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 100) {
        setVisible(currentScrollY < lastScrollY);
      } else {
        setVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleLinkClick = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) {
      const offset = 100;
      const pos = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: pos, behavior: "smooth" });
    }
  };

  return (
    <nav
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-48px)] max-w-[900px] transition-all duration-300"
      style={{ top: visible ? "24px" : "-80px" }}
    >
      <div className="bg-white/90 backdrop-blur-md rounded-full px-6 py-3 flex items-center justify-between border border-warm-border/40 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] transition-shadow duration-300">
        <a
          href="#"
          className="font-serif text-lg text-primary tracking-tight"
        >
          Casa La Maria
        </a>
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleLinkClick(link.href)}
              className="text-[13px] font-medium text-warm-muted hover:text-primary transition-colors"
            >
              {link.label}
            </button>
          ))}
          <Button
            onClick={() => handleLinkClick("#reserva")}
            className="!py-2.5 !px-5 !text-xs !rounded-full !bg-primary !text-white hover:!bg-primary/90"
          >
            Reservar
          </Button>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden p-2 h-auto w-auto"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-full bg-background pt-16 px-8"
          >
            <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
            <div className="flex flex-col gap-6">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleLinkClick(link.href)}
                  className="text-2xl font-serif text-primary text-left"
                >
                  {link.label}
                </button>
              ))}
              <Button
                onClick={() => handleLinkClick("#reserva")}
                className="mt-4 bg-primary text-white hover:bg-primary/90"
              >
                Reservar Ahora
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
