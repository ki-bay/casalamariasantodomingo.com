"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  { href: "/", label: "Inicio", anchor: null },
  { href: "/apartamentos", label: "Apartamentos", anchor: null },
  { href: "/#galeria", label: "Galería", anchor: "galeria" },
  { href: "/#ubicacion", label: "Ubicación", anchor: "ubicacion" },
  { href: "/blog", label: "Blog", anchor: null },
];

const NAV_LINKS_EN = [
  { href: "/en", label: "Home", anchor: null },
  { href: "/en/apartments", label: "Apartments", anchor: null },
  { href: "/en#gallery", label: "Gallery", anchor: "gallery" },
  { href: "/en#location", label: "Location", anchor: "location" },
  { href: "/en/blog", label: "Blog", anchor: null },
];

export function Navbar() {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const pathname = usePathname();
  const isEN = pathname.startsWith('/en');
  const NAV_LINKS = isEN ? NAV_LINKS_EN : NAV_LINKS_ES;
  const bookHref = isEN ? "/en/book" : "/reserva";
  const oppositeLang = isEN ? pathname.replace(/^\/en/, '') || '/' : `/en${pathname}`;
  const oppositeLangLabel = isEN ? "ES" : "EN";

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

  const handleAnchorClick = (anchor: string | null) => {
    setOpen(false);
    if (!anchor) return;
    const el = document.querySelector(`#${anchor}`);
    if (el) {
      const pos = el.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: pos, behavior: "smooth" });
    }
  };

  return (
    <nav
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-48px)] max-w-[960px] transition-all duration-300"
      style={{ top: visible ? "24px" : "-80px" }}
    >
      <div className="bg-background/90 backdrop-blur-md rounded-full px-5 py-3 flex items-center justify-between border border-border shadow-lg">
        <Link href={isEN ? "/en" : "/"} className="font-serif text-lg text-foreground tracking-tight shrink-0">
          Casa La Maria
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-5">
          {NAV_LINKS.map((link) => (
            link.anchor ? (
              <button
                key={link.href}
                onClick={() => handleAnchorClick(link.anchor)}
                className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            )
          ))}
        </div>

        {/* Right controls */}
        <div className="hidden md:flex items-center gap-2">
          {/* Language toggle */}
          <Link
            href={oppositeLang}
            className="text-[12px] font-semibold text-muted-foreground hover:text-foreground border border-border rounded-full px-3 py-1 transition-colors flex items-center gap-1"
          >
            <Globe className="w-3 h-3" />
            {oppositeLangLabel}
          </Link>
          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="p-2 rounded-full border border-border text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
          {/* CTA */}
          <Link href={bookHref}>
            <Button className="!py-2 !px-4 !text-xs !rounded-full !bg-accent !text-accent-foreground hover:!opacity-90">
              {isEN ? "Book now" : "Reservar"}
            </Button>
          </Link>
        </div>

        {/* Mobile hamburger */}
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
                link.anchor ? (
                  <button
                    key={link.href}
                    onClick={() => handleAnchorClick(link.anchor)}
                    className="text-2xl font-serif text-foreground text-left"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-2xl font-serif text-foreground text-left"
                  >
                    {link.label}
                  </Link>
                )
              ))}
              <div className="flex items-center gap-3 mt-4">
                <Link href={bookHref} onClick={() => setOpen(false)}>
                  <Button className="bg-accent text-accent-foreground hover:opacity-90">
                    {isEN ? "Book now" : "Reservar ahora"}
                  </Button>
                </Link>
                <Link href={oppositeLang} onClick={() => setOpen(false)}
                  className="text-sm font-semibold border border-border rounded-full px-3 py-2 flex items-center gap-1 text-muted-foreground">
                  <Globe className="w-3.5 h-3.5" /> {oppositeLangLabel}
                </Link>
                <button onClick={toggle} className="p-2 border border-border rounded-full text-muted-foreground">
                  {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}



