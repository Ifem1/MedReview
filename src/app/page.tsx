import Link from "next/link";
import ClinicalHeader from "@/components/layout/ClinicalHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import ConsentGate from "@/components/layout/ConsentGate";
import {
  ArrowRight, Brain, Shield, ChevronRight,
  Stethoscope, FileText, Pill, Baby, HeartPulse, RefreshCw,
  CheckCircle, Lock, Zap,
} from "lucide-react";

const reviewTypes = [
  { icon: Stethoscope, title: "Symptom Review",       desc: "Describe symptoms and receive a structured urgency triage recommendation based on clinical patterns.",    href: "/review/symptoms", color: "var(--color-accent-dark)" },
  { icon: FileText,    title: "Report Review",         desc: "Understand lab results, scans, or discharge notes using plain language explanations.",                    href: "/review/report",   color: "#6366F1" },
  { icon: Pill,        title: "Medication Concern",    desc: "Questions about side effects, interactions, or missed doses for your current prescriptions.",             href: "/review/medication",color: "#8B5CF6" },
  { icon: Baby,        title: "Child Symptom",         desc: "Extra-caution review specifically designed for children under 12 years of age.",                          href: "/review/child",    color: "#F59E0B", badge: true },
  { icon: HeartPulse,  title: "Pregnancy Concern",     desc: "Lower-threshold triage for symptoms occurring during any stage of pregnancy.",                            href: "/review/pregnancy",color: "#EC4899", badge: true },
  { icon: RefreshCw,   title: "Follow-up Review",      desc: "Update a previous session if your symptoms have changed, improved, or worsened since your last review.",  href: "/dashboard",       color: "#14B8A6" },
];

const steps = [
  { n: "1", title: "Submit context",   desc: "Describe symptoms or paste a report summary using our clinical-grade engine." },
  { n: "2", title: "GenLayer reviews", desc: "Intelligent contract checks red flags and urgency patterns against clinical safety benchmarks." },
  { n: "3", title: "Urgency level",    desc: "Clear classification from Self-Monitor to Emergency using our proprietary urgency matrix." },
  { n: "4", title: "Next steps",       desc: "Know whether to monitor, book a doctor, or seek emergency care immediately." },
];

const features = [
  { icon: Zap,          label: "Deterministic",          desc: "Auditable AI execution logs" },
  { icon: Lock,         label: "Private",                 desc: "Zero-knowledge proofs for data" },
  { icon: CheckCircle,  label: "Verifiable",              desc: "On-chain verification active" },
  { icon: Brain,        label: "Language-aware",          desc: "Understands clinical context" },
];

export default function HomePage() {
  return (
    <>
      <ConsentGate><div /></ConsentGate>
      <ClinicalHeader />

      <main>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden" style={{ background: "linear-gradient(160deg, #C8CCFF 0%, var(--color-bg) 55%, #CDD2FF 100%)" }}>
          <div className="absolute top-0 right-0 w-[520px] h-[520px] rounded-full pointer-events-none opacity-25"
            style={{ background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)", transform: "translate(30%,-30%)" }} />
          <div className="absolute bottom-0 left-0 w-[320px] h-[320px] rounded-full pointer-events-none opacity-15"
            style={{ background: "radial-gradient(circle, #818CF8 0%, transparent 70%)", transform: "translate(-40%,40%)" }} />

          <div className="relative max-w-5xl mx-auto px-5 sm:px-8 pt-20 pb-28 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-[64px] font-extrabold leading-none tracking-tight mb-6 max-w-4xl mx-auto"
              style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}>
              Healthcare triage{" "}
              <span style={{ color: "var(--color-accent-dark)" }}>reviewed by AI</span>
              , not guesswork.
            </h1>

            <p className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10" style={{ color: "var(--color-ink-secondary)" }}>
              Submit symptoms or a report summary and receive structured triage guidance:
              urgency levels, red flag checks, and next step recommendations.
              Built for triage, <em>not diagnosis.</em>
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
              <Link href="/review/symptoms"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl font-bold text-base text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                style={{ background: "linear-gradient(135deg, var(--color-accent-dark), #818CF8)", fontFamily: "var(--font-heading)" }}>
                Start Symptom Review <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/review/report"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl font-bold text-base border-2 transition-all hover:scale-105"
                style={{ borderColor: "var(--color-accent)", color: "var(--color-accent-dark)", backgroundColor: "var(--color-surface)", fontFamily: "var(--font-heading)" }}>
                Review a Report
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-5 text-xs font-semibold" style={{ color: "var(--color-ink-muted)" }}>
              {["Private by default", "Triage only — not diagnosis", "GenLayer verified", "No public health data"].map(b => (
                <span key={b} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--color-accent-dark)" }} />
                  {b}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Emergency strip ── */}
        <div className="py-3.5 px-5 sm:px-8" style={{ backgroundColor: "#FEF2F2", borderTop: "1px solid #FCA5A5", borderBottom: "1px solid #FCA5A5" }}>
          <p className="text-sm text-center font-semibold" style={{ color: "#B91C1C" }}>
            🚨 If this is an emergency, <strong>do not use MedReview</strong>.{" "}
            Seek emergency care immediately —{" "}
            <a href="tel:112" className="underline">Call 112</a> or{" "}
            <a href="tel:911" className="underline">Call 911</a>.
          </p>
        </div>

        {/* ── How it works ── */}
        <section className="py-20" style={{ backgroundColor: "var(--color-surface)" }}>
          <div className="max-w-5xl mx-auto px-5 sm:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-3" style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}>
                How MedReview works
              </h2>
              <p style={{ color: "var(--color-ink-secondary)" }}>A structured, transparent triage process powered by GenLayer.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {steps.map((s) => (
                <div key={s.n} className="rounded-2xl p-5 flex flex-col gap-4"
                  style={{ backgroundColor: "var(--color-bg)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: "linear-gradient(135deg, var(--color-accent-dark), #818CF8)" }}>
                    {s.n}
                  </div>
                  <div>
                    <p className="font-bold mb-1" style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}>{s.title}</p>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--color-ink-secondary)" }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Problem flow ── */}
        <section className="py-16" style={{ backgroundColor: "var(--color-bg)" }}>
          <div className="max-w-4xl mx-auto px-5 sm:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold mb-2" style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}>
                The problem with symptoms today
              </h2>
              <p style={{ color: "var(--color-ink-secondary)" }}>Most people don&apos;t know how urgent their symptoms are.</p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 text-sm font-semibold">
              {[
                { t: "Symptoms appear",     c: "var(--color-ink-secondary)" },
                null,
                { t: "Internet search",     c: "var(--color-soon-amber)" },
                null,
                { t: "Anxiety & confusion", c: "var(--color-urgent-orange)" },
                null,
                { t: "Delayed care",        c: "var(--color-emergency-red)" },
              ].map((item, i) =>
                item === null ? (
                  <ChevronRight key={i} className="w-4 h-4" style={{ color: "var(--color-ink-light)" }} />
                ) : (
                  <div key={i} className="px-4 py-2.5 rounded-xl border text-sm"
                    style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)", color: item.c }}>
                    {item.t}
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* ── Review types ── */}
        <section className="py-20" style={{ backgroundColor: "var(--color-surface)" }}>
          <div className="max-w-5xl mx-auto px-5 sm:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-3" style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}>
                Triage categories
              </h2>
              <p style={{ color: "var(--color-ink-secondary)" }}>Submit the right type of context for the most accurate guidance.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {reviewTypes.map((rt) => {
                const Icon = rt.icon;
                return (
                  <Link key={rt.href} href={rt.href}>
                    <div className="rounded-2xl p-5 h-full cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg flex flex-col gap-4"
                      style={{ backgroundColor: "var(--color-bg)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}>
                      <div className="flex items-start justify-between">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${rt.color}18` }}>
                          <Icon className="w-5 h-5" style={{ color: rt.color }} />
                        </div>
                        <div className="flex items-center gap-2">
                          {rt.badge && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide"
                              style={{ backgroundColor: "#FEF3C7", color: "#D97706" }}>
                              Extra Caution
                            </span>
                          )}
                          <ArrowRight className="w-4 h-4" style={{ color: "var(--color-ink-light)" }} />
                        </div>
                      </div>
                      <div>
                        <p className="font-bold mb-1.5" style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}>{rt.title}</p>
                        <p className="text-sm leading-relaxed" style={{ color: "var(--color-ink-secondary)" }}>{rt.desc}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Why GenLayer ── */}
        <section className="py-20" style={{ backgroundColor: "var(--color-bg)" }}>
          <div className="max-w-5xl mx-auto px-5 sm:px-8">
            <div className="rounded-3xl overflow-hidden grid md:grid-cols-2 gap-0"
              style={{ backgroundColor: "#1E1B4B", border: "1px solid #312E81" }}>
              <div className="p-10 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full mb-5 w-fit"
                  style={{ backgroundColor: "rgba(139,92,246,0.25)", color: "#A78BFA" }}>
                  <Brain className="w-3.5 h-3.5" /> Why GenLayer?
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                  Healthcare triage requires language understanding, not just rules
                </h2>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "#A5B4FC" }}>
                  Healthcare involves natural language, uncertainty, and safety reasoning.
                  GenLayer can review subjective health descriptions and return explainable structured
                  recommendations with on-chain verification that the AI review actually happened.
                </p>
                <div className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full w-fit"
                  style={{ backgroundColor: "rgba(16,185,129,0.2)", color: "#34D399" }}>
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  On-chain verification active
                </div>
              </div>
              <div className="p-8 grid grid-cols-2 gap-4 content-center">
                {features.map(f => {
                  const Icon = f.icon;
                  return (
                    <div key={f.label} className="rounded-2xl p-4" style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                      <Icon className="w-5 h-5 mb-3" style={{ color: "#818CF8" }} />
                      <p className="font-bold text-white text-sm mb-1" style={{ fontFamily: "var(--font-heading)" }}>{f.label}</p>
                      <p className="text-xs" style={{ color: "#94A3B8" }}>{f.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="py-20 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, var(--color-accent-dark) 0%, #818CF8 60%, #A5B4FC 100%)" }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.12) 0%, transparent 60%)" }} />
          <div className="relative max-w-2xl mx-auto px-5 sm:px-8 text-center">
            <Shield className="w-10 h-10 text-white mx-auto mb-5 opacity-90" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Know how urgent it is before guessing what to do next.
            </h2>
            <p className="text-lg text-white mb-8" style={{ opacity: 0.85 }}>
              Submit symptoms. Review the context. Understand urgency. Take the safer next step with MedReview.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/review/symptoms"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl font-bold text-base bg-white transition-all hover:scale-105"
                style={{ color: "var(--color-accent-dark)", fontFamily: "var(--font-heading)" }}>
                Start Symptom Review <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl font-bold text-base text-white border-2 border-white transition-all hover:bg-white hover:text-[var(--color-accent-dark)]"
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
