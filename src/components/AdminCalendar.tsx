"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type CalendarBooking = {
  id: number;
  lodgify_property_id: number;
  arrival: string;    // YYYY-MM-DD
  departure: string;  // YYYY-MM-DD (checkout day; not occupied that day)
  guest_first_name: string | null;
  guest_last_name: string | null;
  status: string;
};

const UNITS: { id: number; label: string }[] = [
  { id: 674788, label: "1A" },
  { id: 674789, label: "2A" },
  { id: 674785, label: "1B" },
  { id: 674786, label: "2B" },
  { id: 674787, label: "3B" },
];

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function fmtYMD(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function AdminCalendar({ bookings }: { bookings: CalendarBooking[] }) {
  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const totalDays = daysInMonth(year, month);
  const days = useMemo(
    () => Array.from({ length: totalDays }, (_, i) => i + 1),
    [totalDays],
  );

  const monthStartYMD = fmtYMD(new Date(year, month, 1));
  const monthEndYMD = fmtYMD(new Date(year, month, totalDays));

  // Index bookings by property
  const byUnit = useMemo(() => {
    const m: Record<number, CalendarBooking[]> = {};
    for (const b of bookings) {
      if (b.status === "cancelled") continue;
      // overlap with this month?
      if (b.departure <= monthStartYMD) continue;
      if (b.arrival > monthEndYMD) continue;
      (m[b.lodgify_property_id] ||= []).push(b);
    }
    return m;
  }, [bookings, monthStartYMD, monthEndYMD]);

  const goto = (delta: number) => {
    setCursor(new Date(year, month + delta, 1));
  };

  const todayYMD = fmtYMD(today);

  return (
    <div className="bg-card border border-warm-border rounded-xl overflow-hidden">
      <div className="p-4 border-b border-warm-border flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => goto(-1)}
            aria-label="Mes anterior"
            className="p-1.5 rounded-md hover:bg-muted"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h2 className="font-serif text-lg">
            {MONTH_NAMES[month]} {year}
          </h2>
          <button
            type="button"
            onClick={() => goto(1)}
            aria-label="Mes siguiente"
            className="p-1.5 rounded-md hover:bg-muted"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <button
          type="button"
          onClick={() => setCursor(new Date(today.getFullYear(), today.getMonth(), 1))}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Hoy
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-fit">
          {/* Day-of-month header */}
          <div className="grid sticky top-0 bg-card border-b border-warm-border" style={{ gridTemplateColumns: `80px repeat(${totalDays}, 28px)` }}>
            <div className="px-3 py-2 text-xs font-medium text-muted-foreground">Unidad</div>
            {days.map((d) => {
              const ymd = fmtYMD(new Date(year, month, d));
              const isToday = ymd === todayYMD;
              const dow = new Date(year, month, d).getDay();
              const isWeekend = dow === 0 || dow === 6;
              return (
                <div
                  key={d}
                  className={`text-[10px] text-center py-2 ${
                    isToday
                      ? "bg-accent/15 text-accent font-semibold"
                      : isWeekend
                        ? "text-muted-foreground/70"
                        : "text-muted-foreground"
                  }`}
                >
                  {d}
                </div>
              );
            })}
          </div>

          {UNITS.map((unit) => {
            const list = byUnit[unit.id] ?? [];
            return (
              <div
                key={unit.id}
                className="grid border-b border-warm-border last:border-b-0 hover:bg-muted/20"
                style={{ gridTemplateColumns: `80px repeat(${totalDays}, 28px)` }}
              >
                <div className="px-3 py-3 text-sm font-medium text-foreground border-r border-warm-border flex items-center">
                  {unit.label}
                </div>
                {/* Day cells (background grid) */}
                {days.map((d) => {
                  const ymd = fmtYMD(new Date(year, month, d));
                  const isToday = ymd === todayYMD;
                  const dow = new Date(year, month, d).getDay();
                  const isWeekend = dow === 0 || dow === 6;
                  return (
                    <div
                      key={d}
                      className={`h-10 border-l border-warm-border/30 ${
                        isToday
                          ? "bg-accent/5"
                          : isWeekend
                            ? "bg-muted/10"
                            : ""
                      }`}
                    />
                  );
                })}
                {/* Booking bars overlaid via absolute positioning inside a relative wrapper */}
                <div className="col-span-full relative -mt-10 h-10 pointer-events-none" style={{ marginLeft: 80 }}>
                  {list.map((b) => {
                    const arr = new Date(b.arrival + "T00:00:00");
                    const dep = new Date(b.departure + "T00:00:00");
                    const startDay = arr.getMonth() === month && arr.getFullYear() === year ? arr.getDate() : 1;
                    const endDayExclusive =
                      dep.getMonth() === month && dep.getFullYear() === year ? dep.getDate() : totalDays + 1;
                    const span = endDayExclusive - startDay;
                    if (span <= 0) return null;
                    const left = (startDay - 1) * 28;
                    const width = span * 28 - 2;
                    const name = [b.guest_first_name, b.guest_last_name].filter(Boolean).join(" ").trim() || "Reserva";
                    const colour =
                      b.status === "confirmed"
                        ? "bg-emerald-500/85 text-white"
                        : b.status === "pending"
                          ? "bg-amber-500/85 text-white"
                          : "bg-red-500/85 text-white";
                    return (
                      <div
                        key={b.id}
                        title={`${name} · ${b.arrival} → ${b.departure}`}
                        className={`absolute top-1.5 h-7 rounded-md ${colour} px-2 text-[11px] font-medium overflow-hidden whitespace-nowrap flex items-center shadow-sm pointer-events-auto`}
                        style={{ left, width }}
                      >
                        {name}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="p-3 border-t border-warm-border flex items-center gap-4 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500/85" /> Confirmada</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-amber-500/85" /> Pendiente</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-red-500/85" /> Falló</span>
        <span className="ml-auto">Día de check-out no está ocupado</span>
      </div>
    </div>
  );
}
