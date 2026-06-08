"use client";

import { AlertTriangle, Phone } from "lucide-react";

interface EmergencyBannerProps {
  message?: string;
  inline?: boolean;
}

export default function EmergencyBanner({
  message,
  inline = false,
}: EmergencyBannerProps) {
  return (
    <div
      className={`${inline ? "rounded-xl" : "w-full"} border-2 animate-pulse-emergency`}
      style={{
        backgroundColor: "#FEF2F2",
        borderColor: "var(--color-emergency-red)",
        color: "var(--color-emergency-red)",
      }}
      role="alert"
    >
      <div className="px-4 py-4 flex gap-3">
        <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p
            className="font-bold text-base"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            ⚠️ Emergency Symptoms Detected
          </p>
          <p className="text-sm mt-1 font-medium">
            {message ||
              "Based on what you have described, you may need emergency medical care immediately."}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href="tel:112"
              className="inline-flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-lg text-white"
              style={{ backgroundColor: "var(--color-emergency-red)" }}
            >
              <Phone className="w-4 h-4" /> Call Emergency Services (112)
            </a>
            <a
              href="tel:911"
              className="inline-flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-lg text-white"
              style={{ backgroundColor: "var(--color-emergency-red)" }}
            >
              <Phone className="w-4 h-4" /> Call 911
            </a>
          </div>
          <p className="text-xs mt-2 font-medium opacity-80">
            Do not wait. Do not use MedReview as your first response to an emergency.
          </p>
        </div>
      </div>
    </div>
  );
}
