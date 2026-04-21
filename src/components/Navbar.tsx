"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, Sun, Moon, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

const NAV_LINKS_ES = [
  { href: "/es", label: "Inicio", anchor: null },
  { href: "/es/apartamentos", label: "Apartamentos", anchor: null },
  { href: "/es#galeria", label: "Galería", anchor: "galeria" },
  { href: "/es/contacto", label: "Contacto", anchor: null },
  { href: "/es/blog", label: "Blog", anchor: null },
];

const NAV_LINKS_EN = [
  { href: "/en", label: "Home", anchor: null },
  { href: "/en/apartments", label: "Apartments", anchor: null },
  { href: "/en#gallery", label: "Gallery", anchor: "gallery" },
  { href: "/en/contact", label: "Contact", anchor: null },
  { href: "/en/blog", label: "Blog", anchor: null },
];

export function Navbar() {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const isEN = pathname.startsWith('/en');
  const NAV_LINKS = isEN ? NAV_LINKS_EN : NAV_LINKS_ES;
  const bookHref = isEN ? "/en/apartments" : "/es/apartamentos";
  const oppositeLangLabel = isEN ? "ES" : "EN";

  // Map current path to equivalent in the other language
  const getOppositePath = useCallback(() => {
    const pathMap: Record<string, string> = {
      "/es": "/en",
      "/en": "/es",
      "/es/apartamentos": "/en/apartments",
      "/en/apartments": "/es/apartamentos",
      "/es/contacto": "/en/contact",
      "/en/contact": "/es/contacto",
      "/es/galeria": "/en/gallery",
      "/en/gallery": "/es/galeria",
      "/es/reserva": "/en/book",
      "/en/book": "/es/reserva",
      "/es/terminos": "/en/terms",
      "/en/terms": "/es/terminos",
      "/es/blog": "/en/blog",
      "/en/blog": "/es/blog",
    };
    // Handle dynamic slug pages like /es/apartamentos/suite or /en/apartments/studio
    const apartamentoMatch = pathname.match(/^\/es\/apartamentos\/(.+)$/);
    if (apartamentoMatch) return `/en/apartments/${apartamentoMatch[1]}`;
    const apartmentMatch = pathname.match(/^\/en\/apartments\/(.+)$/);
    if (apartmentMatch) return `/es/apartamentos/${apartmentMatch[1]}`;
    const blogEsMatch = pathname.match(/^\/es\/blog\/(.+)$/);
    if (blogEsMatch) return `/en/blog/${blogEsMatch[1]}`;
    const blogEnMatch = pathname.match(/^\/en\/blog\/(.+)$/);
    if (blogEnMatch) return `/es/blog/${blogEnMatch[1]}`;
    return pathMap[pathname] ?? (isEN ? "/es" : "/en");
  }, [pathname, isEN]);

  const handleLangSwitch = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    // Save scroll position ratio (works across pages of different heights)
    const scrollRatio = window.scrollY / document.documentElement.scrollHeight;
    sessionStorage.setItem("langSwitchScroll", String(scrollRatio));
    router.push(getOppositePath());
  }, [getOppositePath, router]);

  // Restore scroll position after language switch
  useEffect(() => {
    const saved = sessionStorage.getItem("langSwitchScroll");
    if (saved) {
      sessionStorage.removeItem("langSwitchScroll");
      const ratio = parseFloat(saved);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo({ top: ratio * document.documentElement.scrollHeight, behavior: "instant" as ScrollBehavior });
        });
      });
    }
  }, [pathname]);

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

  return (
    <nav
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-48px)] max-w-[960px] transition-all duration-300"
      style={{ top: visible ? "24px" : "-80px" }}
    >
      <div className="bg-background/90 backdrop-blur-md rounded-full px-5 py-3 flex items-center justify-between border border-border shadow-lg">
        {/* Left: language + theme toggles */}
        <div className="flex items-center gap-2">
          <a
            href={getOppositePath()}
            onClick={handleLangSwitch}
            className="text-[12px] font-semibold text-muted-foreground hover:text-foreground border border-border rounded-full px-3 py-1 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Globe className="w-3 h-3" />
            {oppositeLangLabel}
          </a>
          <button
            onClick={toggle}
            className="p-2 rounded-full border border-border text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right: CTA + mobile hamburger */}
        <div className="flex items-center gap-2">
          <Link href={bookHref} className="hidden md:block">
            <Button className="!py-2 !px-4 !text-xs !rounded-full !bg-accent !text-accent-foreground hover:!opacity-90">
              {isEN ? "Book now" : "Reservar"}
            </Button>
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden p-2 h-auto w-auto">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
          <SheetContent side="right" className="w-full bg-background pt-16 px-8">
            <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
            <div className="flex flex-col gap-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-2xl font-serif text-foreground text-left"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-3 mt-4">
                <Link href={bookHref} onClick={() => setOpen(false)}>
                  <Button className="bg-accent text-accent-foreground hover:opacity-90">
                    {isEN ? "See apartments" : "Ver apartamentos"}
                  </Button>
                </Link>
              </div>
            </div>
          </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}



