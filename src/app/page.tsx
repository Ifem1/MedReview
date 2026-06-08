import Link from "next/link";
import ClinicalHeader from "@/components/layout/ClinicalHeader";
import ConsentGate from "@/components/layout/ConsentGate";
import { ArrowRight, Brain, Shield, ChevronRight } from "lucide-react";

const reviewTypes = [
  { emoji: "🩺", title: "Symptom Review",       desc: "Describe symptoms for structured urgency triage",         href: "/review/symptoms" },
  { emoji: "📄", title: "Report Review",         desc: "Understand lab results, scans, or discharge notes",       href: "/review/report"   },
  { emoji: "💊", title: "Medication Concern",    desc: "Questions about side effects or missed doses",            href: "/review/medication"},
  { emoji: "👶", title: "Child Symptom Review",  desc: "Extra-caution review for children under 12",             href: "/review/child"    },
  { emoji: "🤰", title: "Pregnancy Concern",     desc: "Lower-threshold triage for pregnancy symptoms",           href: "/review/pregnancy"},
  { emoji: "🔄", title: "Follow-up Review",      desc: "Update a previous session if symptoms changed",          href: "/dashboard"       },
];

const steps = [
  { n: "1", title: "Submit context",   desc: "Describe symptoms or paste a report summary" },
  { n: "2", title: "GenLayer reviews", desc: "Intelligent contract checks red flags and urgency patterns" },
  { n: "3", title: "Urgency level",    desc: "Clear classification from Self-Monitor to Emergency" },
  { n: "4", title: "Next steps",       desc: "Know whether to monitor, book a doctor, or seek emergency care" },
];

export default function HomePage() {
  return (
    <>
      <ConsentGate><div /></ConsentGate>
      <ClinicalHeader />

      <main>
        {/* ── Hero ── */}
        <section
          className="relative overflow-hidden"
          style={{ background: "linear-gradient(160deg, #C8CCFF 0%, var(--color-bg) 50%, #CDD2FF 100%)" }}
        >
          {/* Decorative blobs */}
          <div
            className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-30"
            style={{ background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)", transform: "translate(30%, -30%)" }}
          />
          <div
            className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full pointer-events-none opacity-20"
            style={{ background: "radial-gradient(circle, #818CF8 0%, transparent 70%)", transform: "translate(-40%, 40%)" }}
          />

          <div className="relative max-w-5xl mx-auto px-5 sm:px-8 pt-20 pb-24 text-center">
            <h1
              className="text-4xl sm:text-5xl md:text-[64px] font-extrabold leading-none tracking-tight mb-6 max-w-4xl mx-auto"
              style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}
            >
              Healthcare triage{" "}
              <span
                className="relative inline-block"
                style={{ color: "var(--color-accent-dark)" }}
              >
                reviewed by AI
              </span>
              , not guesswork.
            </h1>

            <p
              className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
              style={{ color: "var(--color-ink-secondary)" }}
            >
              Submit symptoms or a report summary and receive structured triage guidance:
              urgency levels, red flag checks, and next step recommendations.
              Built for triage, <em>not diagnosis.</em>
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/review/symptoms"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl font-bold text-base text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                style={{
                  background: "linear-gradient(135deg, var(--color-accent-dark) 0%, #818CF8 100%)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Start Symptom Review <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/review/report"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl font-bold text-base border-2 transition-all hover:scale-105"
                style={{
                  borderColor: "var(--color-accent)",
                  color: "var(--color-accent-dark)",
                  backgroundColor: "var(--color-surface)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Review a Report
              </Link>
            </div>

            {/* Trust badges */}
            <div
              className="flex flex-wrap justify-center gap-4 mt-10 text-xs font-semibold"
              style={{ color: "var(--color-ink-muted)" }}
            >
              {["Private by default", "Triage — not diagnosis", "GenLayer verified", "No public health data"].map((b) => (
                <span key={b} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--color-accent)" }} />
                  {b}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Emergency strip ── */}
        <div
          className="py-3.5 px-5 sm:px-8"
          style={{
            backgroundColor: "#FEF2F2",
            borderTop: "1px solid #FCA5A5",
            borderBottom: "1px solid #FCA5A5",
          }}
        >
          <p className="text-sm text-center font-semibold" style={{ color: "#B91C1C" }}>
            🚨 If this is an emergency, <strong>do not use MedReview</strong>.{" "}
            Seek emergency care immediately —{" "}
            <a href="tel:112" className="underline">Call 112</a> or{" "}
            <a href="tel:911" className="underline">911</a>.
          </p>
        </div>

        {/* ── Problem section ── */}
        <section className="py-20" style={{ backgroundColor: "var(--color-surface)" }}>
          <div className="max-w-4xl mx-auto px-5 sm:px-8">
            <div className="text-center mb-12">
              <h2
                className="text-3xl sm:text-4xl font-extrabold mb-3"
                style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}
              >
                The problem with symptoms today
              </h2>
              <p className="text-base" style={{ color: "var(--color-ink-secondary)" }}>
                Most people don&apos;t know how urgent their symptoms are.
              </p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 text-sm font-semibold">
              {[
                { t: "Symptoms appear",      c: "var(--color-ink-secondary)" },
                null,
                { t: "Internet search",      c: "var(--color-soon-amber)" },
                null,
                { t: "Anxiety & confusion",  c: "var(--color-urgent-orange)" },
                null,
                { t: "Delayed care",         c: "var(--color-emergency-red)" },
              ].map((item, i) =>
                item === null ? (
                  <ChevronRight key={i} className="w-4 h-4" style={{ color: "var(--color-ink-light)" }} />
                ) : (
                  <div
                    key={i}
                    className="px-4 py-2.5 rounded-xl border text-sm"
                    style={{
                      borderColor: "var(--color-border)",
                      backgroundColor: "var(--color-surface-soft)",
                      color: item.c,
                    }}
                  >
                    {item.t}
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="py-20" style={{ backgroundColor: "var(--color-bg)" }}>
          <div className="max-w-4xl mx-auto px-5 sm:px-8">
            <div className="text-center mb-12">
              <h2
                className="text-3xl sm:text-4xl font-extrabold mb-3"
                style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}
              >
                How MedReview works
              </h2>
              <p style={{ color: "var(--color-ink-secondary)" }}>
                A structured, transparent triage process powered by GenLayer.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {steps.map((s) => (
                <div
                  key={s.n}
                  className="rounded-2xl p-5 flex flex-col gap-4"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    boxShadow: "var(--shadow-card)",
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: "linear-gradient(135deg, var(--color-accent-dark), #818CF8)" }}
                  >
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

        {/* ── Why GenLayer ── */}
        <section className="py-20" style={{ backgroundColor: "var(--color-surface)" }}>
          <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
            <div
              className="inline-flex items-center gap-2 text-xs font-bold px-3.5 py-1.5 rounded-full mb-5"
              style={{ backgroundColor: "var(--color-accent)", color: "var(--color-accent-deeper)" }}
            >
              <Brain className="w-3.5 h-3.5" /> Why GenLayer?
            </div>
            <h2
              className="text-3xl sm:text-4xl font-extrabold mb-5"
              style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}
            >
              Healthcare triage requires language understanding, not just rules
            </h2>
            <p className="text-base leading-relaxed" style={{ color: "var(--color-ink-secondary)" }}>
              Healthcare involves natural language, uncertainty, context, and safety reasoning.
              GenLayer can review subjective health descriptions and return explainable structured
              recommendations — with on-chain verification that the AI review actually happened.
            </p>
          </div>
        </section>

        {/* ── Review types ── */}
        <section className="py-20" style={{ backgroundColor: "var(--color-bg)" }}>
          <div className="max-w-4xl mx-auto px-5 sm:px-8">
            <div className="text-center mb-10">
              <h2
                className="text-3xl sm:text-4xl font-extrabold mb-3"
                style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}
              >
                Triage categories
              </h2>
              <p style={{ color: "var(--color-ink-secondary)" }}>
                Submit the right type of context for the most accurate guidance.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {reviewTypes.map((rt) => (
                <Link key={rt.href} href={rt.href}>
                  <div
                    className="rounded-2xl p-5 h-full cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg"
                    style={{
                      backgroundColor: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      boxShadow: "var(--shadow-card)",
                    }}
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl mb-4"
                      style={{ backgroundColor: "var(--color-surface-soft)" }}
                    >
                      {rt.emoji}
                    </div>
                    <p className="font-bold mb-1.5" style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}>
                      {rt.title}
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--color-ink-secondary)" }}>
                      {rt.desc}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section
          className="py-20 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, var(--color-accent-dark) 0%, #818CF8 60%, #A5B4FC 100%)" }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.12) 0%, transparent 60%)" }}
          />
          <div className="relative max-w-2xl mx-auto px-5 sm:px-8 text-center">
            <Shield className="w-10 h-10 text-white mx-auto mb-5 opacity-90" />
            <h2
              className="text-3xl sm:text-4xl font-extrabold text-white mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Know how urgent it is before guessing what to do next.
            </h2>
            <p className="text-lg text-white mb-8" style={{ opacity: 0.85 }}>
              Submit symptoms. Review the context. Understand urgency. Take the safer next step.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/review/symptoms"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl font-bold text-base bg-white transition-all hover:scale-105"
                style={{ color: "var(--color-accent-dark)", fontFamily: "var(--font-heading)" }}
              >
                Start Symptom Review <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/review/report"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl font-bold text-base text-white border-2 border-white transition-all hover:bg-white hover:text-[var(--color-accent-dark)]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Review a Report
              </Link>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer
          className="py-8 border-t text-center text-sm"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
            color: "var(--color-ink-muted)",
          }}
        >
          <p className="max-w-xl mx-auto px-4 mb-3">
            MedReview provides AI-assisted triage guidance only. It does not provide a medical
            diagnosis, prescription, or emergency service.
          </p>
          <div className="flex justify-center gap-5 text-xs">
            <Link href="/safety"   className="hover:underline" style={{ color: "var(--color-accent-dark)" }}>Safety Info</Link>
            <Link href="/consent"  className="hover:underline" style={{ color: "var(--color-accent-dark)" }}>Consent &amp; Limitations</Link>
            <Link href="/settings" className="hover:underline" style={{ color: "var(--color-accent-dark)" }}>Privacy</Link>
          </div>
        </footer>
      </main>
    </>
  );
}
