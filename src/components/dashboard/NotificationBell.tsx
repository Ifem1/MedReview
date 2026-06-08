"use client";

import { Bell } from "lucide-react";
import { useState, useEffect } from "react";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Stable server placeholder — no interactivity until mounted
  if (!mounted) {
    return (
      <div
        className="w-9 h-9 flex items-center justify-center rounded-lg border"
        style={{ borderColor: "var(--color-border)" }}
      >
        <Bell className="w-4 h-4" style={{ color: "var(--color-ink-secondary)" }} />
      </div>
    );
  }

  const unread = 0;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative w-9 h-9 flex items-center justify-center rounded-lg border transition-colors hover:bg-[var(--color-surface-soft)]"
        style={{ borderColor: "var(--color-border)" }}
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" style={{ color: "var(--color-ink-secondary)" }} />
        {unread > 0 && (
          <span
            className="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold rounded-full flex items-center justify-center text-white"
            style={{ backgroundColor: "var(--color-emergency-red)" }}
          >
            {unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-full mt-1 w-72 rounded-xl shadow-lg border py-3 z-50"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            <p
              className="px-4 text-sm font-medium pb-2 border-b mb-2"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-ink)",
                borderColor: "var(--color-border)",
              }}
            >
              Notifications
            </p>
            <p className="px-4 text-sm" style={{ color: "var(--color-ink-muted)" }}>
              No notifications
            </p>
          </div>
        </>
      )}
    </div>
  );
}
