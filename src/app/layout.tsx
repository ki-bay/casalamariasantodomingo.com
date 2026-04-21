import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Casa La Maria — Apartamentos Boutique en Zona Colonial, Santo Domingo",
  description: "Cinco apartamentos boutique en el Callejón Regina, Zona Colonial de Santo Domingo. WiFi, AC, cocina completa. Reserva directa online.",
  keywords: ["casa la maria santo domingo zona colonial", "alquiler zona colonial", "apartamento boutique zona colonial", "callejon regina", "airbnb zona colonial", "hotel zona colonial santo domingo"],
  icons: { icon: "/logo.svg" },
  openGraph: {
    title: "Casa La Maria — Zona Colonial, Santo Domingo",
    description: "Cinco apartamentos boutique en el corazón de la primera ciudad de América.",
    type: "website",
    url: "https://casalamariazonacolonial.com/",
    images: [{ url: "https://picsum.photos/seed/casalamaria-hero/1200/630.jpg" }],
    locale: "es_DO",
  },
  twitter: {
    card: "summary_large_image",
    title: "Casa La Maria — Zona Colonial",
    description: "Cinco apartamentos boutique en el corazón histórico de Santo Domingo.",
    images: ["https://picsum.photos/seed/casalamaria-hero/1200/630.jpg"],
  },
  alternates: {
    canonical: "https://casalamariazonacolonial.com/",
    languages: {
      "es": "https://casalamariazonacolonial.com/",
      "en": "https://casalamariazonacolonial.com/en",
    }
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Sync theme from localStorage BEFORE paint to prevent flash */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('casalamaria-theme');if(t==='light'){document.documentElement.classList.remove('dark');}}catch(e){}})()` }} />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
