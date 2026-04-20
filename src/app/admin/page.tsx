"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import {
  CalendarDays,
  Mail,
  Users,
  FileText,
  BarChart3,
  TrendingUp,
  Eye,
} from "lucide-react";

const MOCK_RESERVATIONS = [
  {
    id: "CLM-LK8F2A",
    guest: "María Rodríguez",
    email: "maria@email.com",
    checkIn: "2025-02-14",
    checkOut: "2025-02-18",
    nights: 4,
    total: 425,
    status: "confirmed",
  },
  {
    id: "CLM-M9X3PB",
    guest: "James Lewis",
    email: "james@email.com",
    checkIn: "2025-03-01",
    checkOut: "2025-03-07",
    nights: 6,
    total: 620,
    status: "pending",
  },
  {
    id: "CLM-Q4R7YZ",
    guest: "Sophie Gauthier",
    email: "sophie@email.com",
    checkIn: "2025-01-15",
    checkOut: "2025-01-20",
    nights: 5,
    total: 530,
    status: "completed",
  },
];

const MOCK_CONTACTS = [
  {
    name: "Carlos Méndez",
    email: "carlos@email.com",
    subject: "Disponibilidad",
    date: "12 Nov 2024",
  },
  {
    name: "Ana Martínez",
    email: "ana@email.com",
    subject: "Precios",
    date: "10 Nov 2024",
  },
];

export default function AdminPage() {
  return (
    <main className="relative z-10 min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-28 pb-16 px-6 md:px-12 flex-1">
        <div className="max-w-[1200px] mx-auto">
          <ScrollReveal>
            <div className="mb-10">
              <p className="text-xs font-medium tracking-widest uppercase text-secondary mb-3">
                Administración
              </p>
              <h1 className="font-serif text-3xl md:text-4xl tracking-tight">
                Dashboard
              </h1>
            </div>
          </ScrollReveal>

          {/* Stats */}
          <ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div className="bg-white border border-warm-border rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center">
                    <CalendarDays className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs text-secondary">Reservas</span>
                </div>
                <p className="text-2xl font-semibold">3</p>
                <p className="text-xs text-secondary mt-1">Este mes</p>
              </div>
              <div className="bg-white border border-warm-border rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs text-secondary">Ingresos</span>
                </div>
                <p className="text-2xl font-semibold">$1,575</p>
                <p className="text-xs text-secondary mt-1">Este mes</p>
              </div>
              <div className="bg-white border border-warm-border rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs text-secondary">Mensajes</span>
                </div>
                <p className="text-2xl font-semibold">2</p>
                <p className="text-xs text-secondary mt-1">Sin leer</p>
              </div>
              <div className="bg-white border border-warm-border rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs text-secondary">Suscriptores</span>
                </div>
                <p className="text-2xl font-semibold">47</p>
                <p className="text-xs text-secondary mt-1">Newsletter</p>
              </div>
            </div>
          </ScrollReveal>

          {/* Reservations Table */}
          <ScrollReveal>
            <div className="bg-white border border-warm-border rounded-xl overflow-hidden mb-8">
              <div className="p-5 border-b border-warm-border flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-primary" />
                <h2 className="font-serif text-lg">Reservas Recientes</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-surface text-xs text-secondary uppercase tracking-wider">
                      <th className="px-5 py-3 text-left">ID</th>
                      <th className="px-5 py-3 text-left">Huésped</th>
                      <th className="px-5 py-3 text-left">Check-in</th>
                      <th className="px-5 py-3 text-left">Check-out</th>
                      <th className="px-5 py-3 text-left">Noches</th>
                      <th className="px-5 py-3 text-left">Total</th>
                      <th className="px-5 py-3 text-left">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_RESERVATIONS.map((res) => (
                      <tr
                        key={res.id}
                        className="border-t border-warm-border"
                      >
                        <td className="px-5 py-3 font-mono text-xs">
                          {res.id}
                        </td>
                        <td className="px-5 py-3">
                          <div>
                            <p className="font-medium">{res.guest}</p>
                            <p className="text-xs text-secondary">
                              {res.email}
                            </p>
                          </div>
                        </td>
                        <td className="px-5 py-3">{res.checkIn}</td>
                        <td className="px-5 py-3">{res.checkOut}</td>
                        <td className="px-5 py-3">{res.nights}</td>
                        <td className="px-5 py-3 font-medium">
                          ${res.total}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                              res.status === "confirmed"
                                ? "bg-green-accent/10 text-green-accent"
                                : res.status === "pending"
                                ? "bg-amber-star/10 text-amber-star"
                                : "bg-surface text-secondary"
                            }`}
                          >
                            {res.status === "confirmed"
                              ? "Confirmada"
                              : res.status === "pending"
                              ? "Pendiente"
                              : "Completada"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </ScrollReveal>

          {/* Contact Messages */}
          <ScrollReveal>
            <div className="bg-white border border-warm-border rounded-xl overflow-hidden">
              <div className="p-5 border-b border-warm-border flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                <h2 className="font-serif text-lg">Mensajes Recientes</h2>
              </div>
              <div className="divide-y divide-warm-border">
                {MOCK_CONTACTS.map((contact, i) => (
                  <div key={i} className="p-5 flex items-center gap-4">
                    <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center text-xs font-semibold text-primary">
                      {contact.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{contact.name}</p>
                        <span className="text-xs text-secondary">
                          · {contact.date}
                        </span>
                      </div>
                      <p className="text-xs text-secondary">
                        {contact.email} · {contact.subject}
                      </p>
                    </div>
                    <div className="w-2 h-2 bg-green-accent rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
      <Footer />
    </main>
  );
}
