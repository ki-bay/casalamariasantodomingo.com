"use client";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const locale = useLocale();

  async function handleLogout() {
    await fetch("/api/admin-logout", { method: "POST" });
    router.push(`/${locale}/admin/login`);
    router.refresh();
  }

  return (
    <div className="relative">
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors bg-card border border-border rounded-lg px-3 py-1.5 shadow-sm"
          aria-label="Logout"
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </button>
      </div>
      {children}
    </div>
  );
}
