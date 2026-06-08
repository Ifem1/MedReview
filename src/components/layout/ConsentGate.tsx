"use client";

import { useState, useEffect } from "react";
import { Shield, AlertTriangle, CheckCircle, ChevronRight } from "lucide-react";
import Link from "next/link";

interface ConsentGateProps {
  children: React.ReactNode;
}

export default function ConsentGate({ children }: ConsentGateProps) {
  const [consented, setConsented] = useState<boolean | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("medreview_consent");
    setConsented(stored === "true"); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  // While checking localStorage, render nothing (prevents flash)
  if (consented === null) return null;
  if (consented) return <>{children}</>;

  function accept() {
    if (!checked) return;
    localStorage.setItem("medreview_consent", "true");
    setConsented(true);
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(16, 42, 67, 0.7)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="w-full max-w-lg rounded-2xl shadow-2xl p-6 sm:p-8 animate-fadeIn"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "var(--color-surface-soft)" }}
          >
            <Shield className="w-5 h-5" style={{ color: "var(--color-teal)" }} />
          </div>
          <div>
            <h2
              className="text-xl font-bold"
              style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}
            >
              Healthcare Limitation Notice
            </h2>
            <p className="text-sm" style={{ color: "var(--color-ink-muted)" }}>
              Please read before using MedReview
            </p>
          </div>
        </div>

        <div
          className="rounded-xl p-4 mb-4 border"
          style={{ backgroundColor: "#FFF7ED", borderColor: "#FDE68A" }}
        >
          <div className="flex gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#D97706" }} />
            <div className="text-sm" style={{ color: "#92400E" }}>
              <strong>MedReview is NOT an emergency service.</strong> If you are experiencing a
              medical emergency, call emergency services immediately.
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-6 text-sm" style={{ color: "var(--color-ink-secondary)" }}>
          {[
            "MedReview provides AI-assisted triage guidance only",
            "It does not provide medical diagnosis, prescriptions, or treatment plans",
            "It does not replace a qualified healthcare professional",
            "Always consult a clinician for medical decisions",
            "Your health data is stored privately and not shared publicly",
          ].map((item) => (
            <div key={item} className="flex gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--color-teal)" }} />
              <span>{item}</span>
            </div>
          ))}
        </div>

        <label className="flex items-start gap-3 cursor-pointer mb-6">
          <input
            type="checkbox"
            className="mt-0.5 w-4 h-4 rounded"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
          <span className="text-sm" style={{ color: "var(--color-ink)" }}>
            I understand that MedReview provides triage guidance only, is not a diagnosis
            service, and does not replace emergency care or professional medical advice.
          </span>
        </label>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={accept}
            disabled={!checked}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed text-white"
            style={{
              backgroundColor: checked ? "var(--color-teal)" : "var(--color-ink-muted)",
              fontFamily: "var(--font-heading)",
            }}
          >
            I Understand — Continue <ChevronRight className="w-4 h-4" />
          </button>
          <Link
            href="/safety"
            className="flex items-center justify-center gap-1 py-3 px-4 rounded-xl font-medium text-sm border transition-colors"
            style={{ borderColor: "var(--color-border)", color: "var(--color-ink-secondary)" }}
          >
            Read Safety Info
          </Link>
        </div>
      </div>
    </div>
  );
}
