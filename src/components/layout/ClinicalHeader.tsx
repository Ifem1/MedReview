"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import WalletConnectButton from "@/components/wallet/WalletConnectButton";
import NotificationBell from "@/components/dashboard/NotificationBell";
import { Activity } from "lucide-react";

const navLinks = [
  { href: "/review",    label: "New Review" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/safety",    label: "Safety" },
];

export default function ClinicalHeader() {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        backgroundColor: "var(--color-surface)",
        borderBottom: "1px solid var(--color-border)",
        boxShadow: "0 1px 0 var(--color-border), 0 2px 12px rgba(79,70,229,0.04)",
      }}
    >
      {/* Main nav row */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-[60px] flex items-center gap-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
            style={{ background: "linear-gradient(135deg, var(--color-accent-dark) 0%, #818CF8 100%)" }}
          >
            <Activity className="w-4 h-4 text-white" />
          </div>
          <span
            className="text-[17px] font-bold tracking-tight"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}
          >
            MedReview
          </span>
          <span
            className="hidden sm:block text-[11px] font-semibold px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "var(--color-accent-deeper)",
              letterSpacing: "0.04em",
            }}
          >
            Triage AI
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-0.5 ml-2">
          {navLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all",
                  active
                    ? "text-white"
                    : "text-[var(--color-ink-secondary)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-ink)]"
                )}
                style={active ? { background: "linear-gradient(135deg, var(--color-accent-dark) 0%, #818CF8 100%)" } : {}}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-2">
          <NotificationBell />
          <WalletConnectButton compact />
        </div>
      </div>

      {/* Safety disclaimer strip */}
      <div
        className="px-5 sm:px-8 py-1.5 flex items-center justify-between gap-4 text-xs font-medium"
        style={{
          backgroundColor: "var(--color-surface-soft)",
          borderTop: "1px solid var(--color-border-soft)",
          color: "var(--color-ink-secondary)",
        }}
      >
        <span>
          🛡️ MedReview provides triage guidance only — not a diagnosis. Never for emergencies.
        </span>
        <Link
          href="/safety"
          className="shrink-0 underline-offset-2 hover:underline"
          style={{ color: "var(--color-accent-dark)" }}
        >
          Safety info →
        </Link>
      </div>
    </header>
  );
}
