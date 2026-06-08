"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface Props {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
  badgeColor?: string;
}

export default function ReviewTypeCard({
  href,
  icon: Icon,
  title,
  description,
  badge,
  badgeColor,
}: Props) {
  return (
    <Link href={href}>
      <div
        className="rounded-2xl border p-5 h-full flex flex-col gap-3 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg group"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
          boxShadow: "0 1px 4px var(--color-panel-shadow)",
        }}
      >
        <div className="flex items-start justify-between">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "var(--color-surface-soft)" }}
          >
            <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" style={{ color: "var(--color-teal)" }} />
          </div>
          {badge && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{
                backgroundColor: (badgeColor || "var(--color-teal)") + "20",
                color: badgeColor || "var(--color-teal)",
              }}
            >
              {badge}
            </span>
          )}
        </div>
        <div>
          <p
            className="font-semibold text-base"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}
          >
            {title}
          </p>
          <p className="text-sm mt-1 leading-relaxed" style={{ color: "var(--color-ink-secondary)" }}>
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}
