"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import {
  CalendarDays,
  Mail,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

type Reservation = {
  id: string;
  guest_name: string;
  guest_email: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
  status: string;
  created_at: string;
};

type Contact = {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
};

function calculateNights(checkIn: string, checkOut: string) {
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-DO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [resData, conData] = await Promise.all([
          fetch("/api/reservations").then((r) => r.json()),
          fetch("/api/contact").then((r) => r.json()),
        ]);
        setReservations(resData.reservations || []);
        setContacts(conData.submissions || []);
      } catch (e) {
        console.error("Failed to fetch admin data", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const thisMonthReservations = reservations.filter((r) => {
    const d = new Date(r.created_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const thisMonthRevenue = thisMonthReservations.reduce(
    (sum, r) => sum + Number(r.total_price),
    0
  );

  const unreadContacts = contacts.filter((c) => !c.read).length;

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
                <p className="text-2xl font-semibold">{thisMonthReservations.length}</p>
                <p className="text-xs text-secondary mt-1">Este mes</p>
              </div>
              <div className="bg-white border border-warm-border rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs text-secondary">Ingresos</span>
                </div>
                <p className="text-2xl font-semibold">${thisMonthRevenue.toLocaleString()}</p>
                <p className="text-xs text-secondary mt-1">Este mes</p>
              </div>
              <div className="bg-white border border-warm-border rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs text-secondary">Mensajes</span>
                </div>
                <p className="text-2xl font-semibold">{unreadContacts}</p>
                <p className="text-xs text-secondary mt-1">Sin leer</p>
              </div>
              <div className="bg-white border border-warm-border rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs text-secondary">Total reservas</span>
                </div>
                <p className="text-2xl font-semibold">{reservations.length}</p>
                <p className="text-xs text-secondary mt-1">Todas</p>
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
                {loading ? (
                  <p className="p-5 text-sm text-secondary">Cargando...</p>
                ) : reservations.length === 0 ? (
                  <p className="p-5 text-sm text-secondary">No hay reservas aún.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-surface text-xs text-secondary uppercase tracking-wider">
                        <th className="px-5 py-3 text-left">Huésped</th>
                        <th className="px-5 py-3 text-left">Check-in</th>
                        <th className="px-5 py-3 text-left">Check-out</th>
                        <th className="px-5 py-3 text-left">Noches</th>
                        <th className="px-5 py-3 text-left">Total</th>
                        <th className="px-5 py-3 text-left">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservations.map((res) => (
                        <tr key={res.id} className="border-t border-warm-border">
                          <td className="px-5 py-3">
                            <div>
                              <p className="font-medium">{res.guest_name}</p>
                              <p className="text-xs text-secondary">{res.guest_email}</p>
                            </div>
                          </td>
                          <td className="px-5 py-3">{formatDate(res.check_in)}</td>
                          <td className="px-5 py-3">{formatDate(res.check_out)}</td>
                          <td className="px-5 py-3">{calculateNights(res.check_in, res.check_out)}</td>
                          <td className="px-5 py-3 font-medium">${Number(res.total_price).toLocaleString()}</td>
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
                )}
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
                {loading ? (
                  <p className="p-5 text-sm text-secondary">Cargando...</p>
                ) : contacts.length === 0 ? (
                  <p className="p-5 text-sm text-secondary">No hay mensajes aún.</p>
                ) : (
                  contacts.map((contact) => (
                    <div key={contact.id} className="p-5 flex items-center gap-4">
                      <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center text-xs font-semibold text-primary">
                        {contact.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{contact.name}</p>
                          <span className="text-xs text-secondary">
                            · {formatDate(contact.created_at)}
                          </span>
                        </div>
                        <p className="text-xs text-secondary">
                          {contact.email} · {contact.message.substring(0, 60)}...
                        </p>
                      </div>
                      {!contact.read && (
                        <div className="w-2 h-2 bg-green-accent rounded-full" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
      <Footer />
    </main>
  );
}
