import ClinicalHeader from "@/components/layout/ClinicalHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import Link from "next/link";
import {
  Stethoscope, FileText, Pill, Baby,
  HeartPulse, RefreshCw, ArrowRight, AlertTriangle,
  ShieldCheck, Lock,
} from "lucide-react";

const reviewTypes = [
  {
    href: "/review/symptoms",
    icon: Stethoscope,
    color: "var(--color-accent-dark)",
    bg: "rgba(79,70,229,0.08)",
    title: "Symptom Review",
    description: "Describe your symptoms and receive a structured urgency triage recommendation based on clinical patterns.",
  },
  {
    href: "/review/report",
    icon: FileText,
    color: "#6366F1",
    bg: "rgba(99,102,241,0.08)",
    title: "Report Review",
    description: "Paste or summarise a lab result, scan report, discharge note, or medical letter for clinical clarity.",
  },
  {
    href: "/review/medication",
    icon: Pill,
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.08)",
    title: "Medication Concern",
    description: "Questions about side effects, interactions, or missed doses that need urgent review.",
  },
  {
    href: "/review/child",
    icon: Baby,
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.08)",
    title: "Child Symptom Review",
    description: "Specialised caution review for children under 12. Employs a lower threshold for urgent care recommendations.",
    badge: "Extra Caution",
  },
  {
    href: "/review/pregnancy",
    icon: HeartPulse,
    color: "#EC4899",
    bg: "rgba(236,72,153,0.08)",
    title: "Pregnancy Concern Review",
    description: "Lower-threshold triage for pregnancy symptoms. Dismissal of serious symptoms is strictly not permitted in this mode.",
    badge: "Extra Caution",
  },
  {
    href: "/dashboard",
    icon: RefreshCw,
    color: "#14B8A6",
    bg: "rgba(20,184,166,0.08)",
    title: "Follow-up Review",
    description: "Update a previous session if your symptoms have changed, improved, or worsened since your last review.",
  },
];

export default function ReviewPage() {
  return (
    <>
      <ClinicalHeader />

      <main>
        {/* Header */}
        <section className="py-12 px-5 sm:px-8 max-w-5xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-2" style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}>
            Choose Review Type
          </h1>
          <p className="text-base" style={{ color: "var(--color-ink-secondary)" }}>
            Select the type of triage review that best fits your situation for clinically-aligned precision.
          </p>
        </section>

        {/* Safety notice */}
        <div className="max-w-5xl mx-auto px-5 sm:px-8 mb-6">
          <div className="rounded-2xl border-l-4 p-4 flex items-start gap-3"
            style={{ backgroundColor: "var(--color-surface)", borderLeftColor: "var(--color-emergency-red)", border: "1px solid var(--color-border)", borderLeft: "4px solid var(--color-emergency-red)" }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#FEE2E2" }}>
              <AlertTriangle className="w-4 h-4" style={{ color: "var(--color-emergency-red)" }} />
            </div>
            <div>
              <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--color-ink)" }}>Healthcare Safety Notice</p>
              <p className="text-sm" style={{ color: "var(--color-ink-secondary)" }}>
                MedReview provides AI-assisted triage guidance only. <strong>It does not provide a medical diagnosis, prescription, or emergency service.</strong>{" "}
                If symptoms are severe, sudden, worsening, or life-threatening,{" "}
                <a href="tel:112" className="font-semibold underline" style={{ color: "var(--color-emergency-red)" }}>seek emergency medical care immediately.</a>
              </p>
            </div>
          </div>
        </div>

        {/* Cards grid */}
        <div className="max-w-5xl mx-auto px-5 sm:px-8 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {reviewTypes.map((rt) => {
              const Icon = rt.icon;
              return (
                <Link key={rt.href} href={rt.href}>
                  <div className="rounded-2xl p-5 h-full cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg flex flex-col gap-4"
                    style={{
                      backgroundColor: "var(--color-surface)",
                      border: rt.badge ? `1px solid ${rt.color}40` : "1px solid var(--color-border)",
                      boxShadow: "var(--shadow-card)",
                    }}>
                    <div className="flex items-start justify-between">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: rt.bg }}>
                        <Icon className="w-5 h-5" style={{ color: rt.color }} />
                      </div>
                      <div className="flex items-center gap-2">
                        {rt.badge && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide"
                            style={{ backgroundColor: "#FEF3C7", color: "#D97706" }}>
                            {rt.badge}
                          </span>
                        )}
                        <ArrowRight className="w-4 h-4" style={{ color: "var(--color-ink-light)" }} />
                      </div>
                    </div>
                    <div>
                      <p className="font-bold mb-1.5" style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}>{rt.title}</p>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--color-ink-secondary)" }}>{rt.description}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom banner */}
        <section className="mx-4 sm:mx-8 mb-16 rounded-3xl overflow-hidden"
          style={{ background: "linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)" }}>
          <div className="max-w-5xl mx-auto px-8 sm:px-12 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-lg">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                Precise AI Triage for every stage of care.
              </h2>
              <p className="text-sm leading-relaxed mb-6" style={{ color: "#A5B4FC" }}>
                Our models are trained on institutional medical data to ensure that every review meets
                the highest standards of safety and clinical relevance.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "#34D399" }}>
                  <ShieldCheck className="w-4 h-4" /> GenLayer Verified
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "#A5B4FC" }}>
                  <Lock className="w-4 h-4" /> Private by default
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 shrink-0">
              <Link href="/review/symptoms"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, var(--color-accent-dark), #818CF8)", fontFamily: "var(--font-heading)" }}>
                Start Symptom Review <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white border border-white/30 transition-all hover:bg-white/10"
                style={{ fontFamily: "var(--font-heading)" }}>
                View Dashboard
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
