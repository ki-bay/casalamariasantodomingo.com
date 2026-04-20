import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SchemaMarkup } from "@/components/SchemaMarkup";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Casa La Maria — Apartamento Boutique en Zona Colonial, Santo Domingo",
  description:
    "Alquila Casa La Maria, un apartamento boutique de 1 dormitorio en el corazón de la Zona Colonial de Santo Domingo. WiFi, AC, cocina completa. Reserva directa online.",
  keywords: [
    "alquiler santo domingo",
    "zona colonial",
    "apartamento boutique",
    "casa la maria",
    "airbnb santo domingo",
    "hotel colonial zona colonial",
  ],
  icons: { icon: "/logo.svg" },
  openGraph: {
    title: "Casa La Maria — Apartamento Boutique en Zona Colonial",
    description:
      "1 dormitorio. Ubicación inmejorable. Experiencia auténtica en el corazón histórico de Santo Domingo.",
    type: "website",
    url: "https://casalamariard.com/",
    images: [
      { url: "https://picsum.photos/seed/casalamaria-hero/1200/630.jpg" },
    ],
    locale: "es_DO",
  },
  twitter: {
    card: "summary_large_image",
    title: "Casa La Maria — Zona Colonial",
    description:
      "Apartamento boutique de 1 dormitorio en el corazón histórico de Santo Domingo.",
    images: ["https://picsum.photos/seed/casalamaria-hero/1200/630.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-background text-foreground`}
      >
        <SchemaMarkup />
        <div className="paper-texture" />
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
