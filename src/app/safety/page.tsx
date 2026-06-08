import ClinicalHeader from "@/components/layout/ClinicalHeader";
import { Shield, AlertTriangle, Phone, CheckCircle } from "lucide-react";
import Link from "next/link";

const emergencySymptoms = [
  "Chest pain or pressure",
  "Severe difficulty breathing",
  "Stroke-like symptoms (facial drooping, arm weakness, speech difficulty)",
  "Loss of consciousness or fainting",
  "Seizure",
  "Severe bleeding that cannot be controlled",
  "Severe allergic reaction (anaphylaxis)",
  "Suicidal thoughts or intent to self-harm",
  "Severe head injury",
  "Severe abdominal pain with collapse",
  "High fever with confusion or stiff neck",
  "Pregnancy: heavy bleeding or severe pain",
  "Child with breathing distress",
  "Signs of sepsis",
  "Rapidly worsening symptoms of any kind",
];

const disclaimers = [
  "MedReview does not diagnose medical conditions",
  "MedReview does not prescribe medication or treatment",
  "MedReview does not replace a qualified healthcare professional",
  "In any emergency, contact emergency services — not MedReview",
  "Triage outputs carry uncertainty — always consult a clinician",
  "Follow-up care is always recommended after any triage review",
];

export default function SafetyPage() {
  return (
    <>
      <ClinicalHeader />

      <main className="max-w-3xl mx-auto px-5 sm:px-8 py-12">

        {/* Page header */}
        <div className="mb-10">
          <div
            className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full mb-4"
            style={{ backgroundColor: "var(--color-accent)", color: "var(--color-accent-deeper)" }}
          >
            <Shield className="w-3.5 h-3.5" />
            Healthcare Safety
          </div>
          <h1
            className="text-4xl font-extrabold mb-3"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}
          >
            Safety &amp; Disclaimers
          </h1>
          <p className="text-base" style={{ color: "var(--color-ink-secondary)" }}>
            Please read before using MedReview. Your safety is the first priority.
          </p>
        </div>

        <div className="space-y-6">

          {/* Emergency callout — most prominent */}
          <div
            className="rounded-2xl p-6 border-2"
            style={{
              background: "linear-gradient(135deg, #FEF2F2 0%, #FFF5F5 100%)",
              borderColor: "var(--color-emergency-red)",
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: "#FEE2E2" }}
              >
                <AlertTriangle className="w-5 h-5" style={{ color: "var(--color-emergency-red)" }} />
              </div>
              <div className="flex-1">
                <h2
                  className="text-xl font-bold mb-1"
                  style={{ fontFamily: "var(--font-heading)", color: "var(--color-emergency-red)" }}
                >
                  Having a medical emergency?
                </h2>
                <p className="text-sm font-medium mb-4" style={{ color: "#991B1B" }}>
                  Do not use MedReview. Call emergency services immediately.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="tel:112"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white shadow-sm"
                    style={{ backgroundColor: "var(--color-emergency-red)" }}
                  >
                    <Phone className="w-4 h-4" /> Call 112
                  </a>
                  <a
                    href="tel:911"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white shadow-sm"
                    style={{ backgroundColor: "var(--color-emergency-red)" }}
                  >
                    <Phone className="w-4 h-4" /> Call 911
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Primary disclaimer */}
          <div
            className="rounded-2xl p-6"
            style={{ backgroundColor: "var(--color-surface)", boxShadow: "var(--shadow-card)", border: "1px solid var(--color-border)" }}
          >
            <h2
              className="text-xl font-bold mb-4"
              style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}
            >
              What MedReview is — and is not
            </h2>

            {/* The disclaimer box */}
            <div
              className="rounded-xl p-4 mb-5 text-sm leading-relaxed"
              style={{ backgroundColor: "var(--color-surface-soft)", color: "var(--color-ink-secondary)", borderLeft: "3px solid var(--color-accent-dark)" }}
            >
              <strong style={{ color: "var(--color-ink)" }}>
                MedReview provides AI-assisted triage guidance only.
              </strong>{" "}
              It does not provide a medical diagnosis, prescription, or emergency service. If
              symptoms are severe, sudden, worsening, or life-threatening,{" "}
              <strong style={{ color: "var(--color-emergency-red)" }}>seek emergency medical care immediately.</strong>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {disclaimers.map((item) => (
                <div key={item} className="flex items-start gap-2.5 text-sm" style={{ color: "var(--color-ink-secondary)" }}>
                  <CheckCircle
                    className="w-4 h-4 shrink-0 mt-0.5"
                    style={{ color: "var(--color-accent-dark)" }}
                  />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Emergency symptoms grid */}
          <div
            className="rounded-2xl p-6"
            style={{ backgroundColor: "var(--color-surface)", boxShadow: "var(--shadow-card)", border: "1px solid var(--color-border)" }}
          >
            <h2
              className="text-xl font-bold mb-2"
              style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}
            >
              Symptoms requiring emergency care
            </h2>
            <p className="text-sm mb-5" style={{ color: "var(--color-ink-secondary)" }}>
              If you experience any of these, seek emergency care immediately. Do not submit to MedReview first.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {emergencySymptoms.map((s) => (
                <div
                  key={s}
                  className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium"
                  style={{ backgroundColor: "#FEF2F2", color: "#991B1B" }}
                >
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "var(--color-emergency-red)" }} />
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* CTA row */}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/review"
              className="px-6 py-3 rounded-xl text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, var(--color-accent-dark) 0%, #818CF8 100%)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Start a Review
            </Link>
            <Link
              href="/consent"
              className="px-6 py-3 rounded-xl text-sm font-semibold border transition-colors hover:bg-[var(--color-surface-soft)]"
              style={{ borderColor: "var(--color-border)", color: "var(--color-ink-secondary)" }}
            >
              Read Consent Notice
            </Link>
          </div>

        </div>
      </main>
    </>
  );
}
