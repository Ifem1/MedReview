import ClinicalHeader from "@/components/layout/ClinicalHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import {
  Shield, AlertTriangle, Phone, CheckCircle, XCircle,
  HeartPulse, Wind, Brain, Eye, Droplets, Activity,
} from "lucide-react";
import Link from "next/link";

const emergencySymptoms = [
  { icon: HeartPulse, label: "Chest pain or pressure",    desc: "Signs of potential cardiac distress or lung issues." },
  { icon: Wind,       label: "Severe breathing difficulty", desc: "Inability to catch breath or audible wheezing." },
  { icon: Brain,      label: "Stroke symptoms",            desc: "Facial drooping, arm weakness, or speech difficulty." },
  { icon: Eye,        label: "Loss of consciousness",      desc: "Any fainting or sudden unexplained collapse." },
  { icon: Droplets,   label: "Severe bleeding",            desc: "Wounds that cannot be controlled with direct pressure." },
  { icon: Activity,   label: "Mental crisis",              desc: "Suicidal thoughts or intent to cause self-harm." },
];

const isItems  = ["Urgency classification", "Red flag identification", "Triage guidance only", "Structured next steps"];
const notItems = ["Not a diagnosis", "Not for medication", "Not an emergency service", "Not a substitute for a doctor"];

export default function SafetyPage() {
  return (
    <>
      <ClinicalHeader />

      <main>
        {/* Header */}
        <section className="max-w-4xl mx-auto px-5 sm:px-8 pt-12 pb-8">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--color-accent-dark)" }}>Healthcare Safety</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-3" style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}>
            Safety &amp; Disclaimers
          </h1>
          <p className="text-base max-w-xl" style={{ color: "var(--color-ink-secondary)" }}>
            Please read before using MedReview. Your safety is our first priority. This platform is
            designed for clinical triage assistance, not definitive medical diagnosis.
          </p>
        </section>

        {/* Emergency callout */}
        <div className="max-w-4xl mx-auto px-5 sm:px-8 mb-8">
          <div className="rounded-2xl border-2 p-6" style={{ borderColor: "var(--color-emergency-red)", backgroundColor: "#FEF2F2" }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#FEE2E2" }}>
                  <AlertTriangle className="w-5 h-5" style={{ color: "var(--color-emergency-red)" }} />
                </div>
                <div>
                  <h2 className="text-lg font-bold mb-1" style={{ fontFamily: "var(--font-heading)", color: "var(--color-emergency-red)" }}>
                    Having a medical emergency?
                  </h2>
                  <p className="text-sm" style={{ color: "#991B1B" }}>
                    Do not use MedReview if you are in immediate danger. Call local emergency services immediately for life-threatening situations.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 shrink-0">
                <a href="tel:112" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-sm"
                  style={{ backgroundColor: "var(--color-emergency-red)" }}>
                  <Phone className="w-4 h-4" /> Call 112
                </a>
                <a href="tel:911" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-sm"
                  style={{ backgroundColor: "var(--color-emergency-red)" }}>
                  <Phone className="w-4 h-4" /> Call 911
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Is / Is not + Clinical Protocol */}
        <div className="max-w-4xl mx-auto px-5 sm:px-8 mb-8 grid md:grid-cols-3 gap-5">
          <div className="md:col-span-2 rounded-2xl p-6" style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}>
            <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}>
              What MedReview is — and is not
            </h2>
            <p className="text-sm mb-5" style={{ color: "var(--color-ink-secondary)" }}>
              MedReview provides AI-assisted triage guidance only. It serves as a preliminary classification
              system based on clinical patterns, helping users understand urgency levels.
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {isItems.map(item => (
                <div key={item} className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium"
                  style={{ backgroundColor: "#F0FDF4", color: "#15803D" }}>
                  <CheckCircle className="w-4 h-4 shrink-0" style={{ color: "#16A34A" }} />
                  {item}
                </div>
              ))}
              {notItems.map(item => (
                <div key={item} className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium"
                  style={{ backgroundColor: "#FEF2F2", color: "#991B1B" }}>
                  <XCircle className="w-4 h-4 shrink-0" style={{ color: "#EF4444" }} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Protocol card */}
          <div className="rounded-2xl p-6 flex flex-col justify-between"
            style={{ background: "linear-gradient(160deg, #1E1B4B, #312E81)", border: "1px solid #3730A3" }}>
            <div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(99,102,241,0.25)" }}>
                <Shield className="w-5 h-5" style={{ color: "#818CF8" }} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>Clinical Protocol</h3>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "#A5B4FC" }}>
                In any emergency, contact services — not MedReview. Follow-up care is always
                mandatory after any triage review.
              </p>
            </div>
            <Link href="/consent"
              className="w-full flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, var(--color-accent-dark), #818CF8)" }}>
              Read Consent Notice
            </Link>
          </div>
        </div>

        {/* Emergency symptoms grid */}
        <div className="max-w-4xl mx-auto px-5 sm:px-8 mb-8">
          <div className="rounded-2xl p-6" style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5" style={{ color: "var(--color-emergency-red)" }} />
              <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}>
                Symptoms requiring emergency care
              </h2>
            </div>
            <p className="text-sm mb-6" style={{ color: "var(--color-ink-secondary)" }}>
              If you experience any of these, seek emergency care immediately. Do not submit to MedReview first.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {emergencySymptoms.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="flex items-start gap-3 p-4 rounded-xl"
                    style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA" }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#FEE2E2" }}>
                      <Icon className="w-4 h-4" style={{ color: "var(--color-emergency-red)" }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-0.5" style={{ color: "#991B1B" }}>{s.label}</p>
                      <p className="text-xs" style={{ color: "#B91C1C" }}>{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs mt-4 italic" style={{ color: "var(--color-ink-muted)" }}>
              And many others… when in doubt, seek emergency care.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-4xl mx-auto px-5 sm:px-8 pb-16 flex flex-wrap gap-3">
          <Link href="/review"
            className="px-6 py-3 rounded-xl text-sm font-bold text-white shadow-sm transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, var(--color-accent-dark), #818CF8)", fontFamily: "var(--font-heading)" }}>
            Start a Review
          </Link>
          <Link href="/consent"
            className="px-6 py-3 rounded-xl text-sm font-semibold border transition-colors hover:bg-[var(--color-surface-soft)]"
            style={{ borderColor: "var(--color-border)", color: "var(--color-ink-secondary)" }}>
            Clinical Method
          </Link>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
