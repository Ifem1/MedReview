"use client";

import ClinicalHeader from "@/components/layout/ClinicalHeader";
import { Shield, CheckCircle, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ConsentPage() {
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  function accept() {
    if (!checked) return;
    localStorage.setItem("medreview_consent", "true");
    router.push("/review");
  }

  return (
    <>
      <ClinicalHeader />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div>
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-4"
            style={{ backgroundColor: "var(--color-mint)", color: "var(--color-teal)" }}
          >
            <Shield className="w-3.5 h-3.5" />
            Consent &amp; Limitations
          </div>
          <h1
            className="text-3xl font-bold mb-3"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}
          >
            Healthcare Limitation Notice
          </h1>
          <p style={{ color: "var(--color-ink-secondary)" }}>
            By using MedReview, you agree to the following limitations and terms.
          </p>
        </div>

        <div
          className="rounded-2xl border p-6 space-y-4"
          style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
        >
          {[
            "MedReview provides AI-assisted triage guidance only — it is not a medical diagnosis",
            "MedReview does not prescribe medication or treatment",
            "MedReview does not replace a qualified healthcare professional",
            "In any emergency, you must contact emergency services — not MedReview",
            "Triage outputs carry uncertainty and should not be your sole basis for health decisions",
            "Your health data is private and linked only to your connected wallet address",
            "GenLayer processes and stores review hashes on-chain for verification purposes",
            "You may request data deletion by contacting the protocol administrator",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--color-teal)" }} />
              <p className="text-sm" style={{ color: "var(--color-ink-secondary)" }}>{item}</p>
            </div>
          ))}
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-0.5 w-4 h-4 rounded"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
          <span className="text-sm" style={{ color: "var(--color-ink)" }}>
            I understand and accept these limitations. MedReview is a triage guidance
            tool — not a diagnosis service, prescription service, or emergency service.
          </span>
        </label>

        <div className="flex gap-3">
          <button
            onClick={accept}
            disabled={!checked}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: "var(--color-teal)", fontFamily: "var(--font-heading)" }}
          >
            Accept &amp; Continue <ChevronRight className="w-4 h-4" />
          </button>
          <Link
            href="/safety"
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm border"
            style={{ borderColor: "var(--color-border)", color: "var(--color-ink-secondary)" }}
          >
            Safety Info
          </Link>
        </div>
      </main>
    </>
  );
}
