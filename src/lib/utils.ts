import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function calculateNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

export function getDiscountRate(nights: number): number {
  if (nights >= 28) return 0.2;
  if (nights >= 14) return 0.15;
  if (nights >= 7) return 0.1;
  return 0;
}

export function calculateTotal(
  nights: number,
  pricePerNight: number = 89,
  cleaningFee: number = 35,
  serviceFeeRate: number = 0.08
): {
  subtotal: number;
  discount: number;
  discountRate: number;
  discountedSubtotal: number;
  cleaningFee: number;
  serviceFee: number;
  total: number;
} {
  const subtotal = nights * pricePerNight;
  const discountRate = getDiscountRate(nights);
  const discount = subtotal * discountRate;
  const discountedSubtotal = subtotal - discount;
  const serviceFee = discountedSubtotal * serviceFeeRate;
  const total = discountedSubtotal + cleaningFee + serviceFee;

  return {
    subtotal,
    discount,
    discountRate,
    discountedSubtotal,
    cleaningFee,
    serviceFee,
    total,
  };
}

export function formatDate(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-DO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getTodayString(): string {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

export function getMinCheckoutString(checkIn: string): string {
  if (!checkIn) return "";
  const date = new Date(checkIn);
  date.setDate(date.getDate() + 1);
  return date.toISOString().split("T")[0];
}
