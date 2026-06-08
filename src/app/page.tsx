import Link from "next/link";
import ClinicalHeader from "@/components/layout/ClinicalHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import ConsentGate from "@/components/layout/ConsentGate";
import {
  ArrowRight, Brain, Shield, ShieldCheck, FileText,
  Stethoscope, Pill, Baby, HeartPulse, RefreshCw,
  Lock, Activity, Zap, CheckCircle,
} from "lucide-react";

function TriageMockup() {
  return (
    <div className="relative w-full max-w-[420px] mx-auto">
      <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ background: "linear-gradient(135deg, #1E1B4B, #0F0D2A)", border: "2px solid #312E81" }}>
        {/* Header bar */}
        <div className="px-5 py-3.5 flex items-center justify-between" style={{ backgroundColor: "#1E1B4B", borderBottom: "1px solid #312E81" }}>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #4F46E5, #818CF8)" }}>
              <Activity className="w-3 h-3 text-white" />
            </div>
            <span className="text-white text-xs font-bold tracking-wide">MedReview</span>
          </div>
          <div className="flex gap-1.5">
            {["#EF4444","#F59E0B","#22C55E"].map(c => (
              <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2.5 p-4" style={{ backgroundColor: "#0F0D2A" }}>
          {[{ label:"Reviews",value:"24",color:"#818CF8" },{ label:"High Risk",value:"3",color:"#EF4444" },{ label:"Completed",value:"21",color:"#34D399" }].map(s => (
            <div key={s.label} className="rounded-xl p-3 text-center" style={{ backgroundColor:"rgba(79,70,229,0.12)", border:"1px solid rgba(79,70,229,0.25)" }}>
              <p className="text-[10px] mb-1" style={{ color:"#64748B" }}>{s.label}</p>
              <p className="text-xl font-bold" style={{ color:s.color, fontFamily:"var(--font-heading)" }}>{s.value}</p>
            </div>
          ))}
        </div>
        {/* Review rows */}
        <div className="px-4 pb-3 space-y-2" style={{ backgroundColor:"#0F0D2A" }}>
          {[
            { label:"Chest pain, shortness of breath", badge:"HIGH RISK", bc:"#EF4444" },
            { label:"Medication interaction check",    badge:"MEDIUM",    bc:"#F59E0B" },
            { label:"Post-op follow-up review",        badge:"ROUTINE",   bc:"#34D399" },
          ].map((r,i) => (
            <div key={i} className="flex items-center justify-between rounded-xl p-3" style={{ backgroundColor:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-[11px]" style={{ color:"#CBD5E1" }}>{r.label}</p>
              <span className="text-[9px] px-2 py-0.5 rounded-full font-bold ml-2 shrink-0" style={{ backgroundColor:`${r.bc}20`, color:r.bc }}>{r.badge}</span>
            </div>
          ))}
        </div>
        {/* Live badge */}
        <div className="mx-4 mb-4 rounded-xl p-3 flex items-center gap-2.5" style={{ backgroundColor:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.25)" }}>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
          <div>
            <p className="text-[10px] font-bold" style={{ color:"#34D399" }}>LIVE ANALYSIS</p>
            <p className="text-[10px]" style={{ color:"#64748B" }}>AI triage session active</p>
          </div>
        </div>
      </div>
      {/* Glow */}
      <div className="absolute -inset-6 -z-10 rounded-3xl opacity-20 blur-3xl pointer-events-none"
        style={{ background:"radial-gradient(circle, var(--color-accent-dark), transparent)" }} />
    </div>
  );
}

const triageCategories = [
  {
    badge:"HIGH RISK / IMMEDIATE", badgeColor:"#EF4444", badgeBg:"#FEF2F2",
    icon: HeartPulse, iconColor:"#EF4444",
    title:"Cardiovascular & Respiratory",
    desc:"Immediate assessment for acute chest pain, dyspnea, and respiratory distress using integrated triage pathways.",
    tags:["Symptom Review","Child Review"],
    href:"/review/symptoms",
  },
  {
    badge:"URGENT", badgeColor:"#F59E0B", badgeBg:"#FFFBEB",
    icon: Brain, iconColor:"#F59E0B",
    title:"Neurological & Pregnancy",
    desc:"Fast-track triage for stroke protocols and maternal health with lower urgency thresholds applied automatically.",
    tags:["Pregnancy Concern","Symptom Review"],
    href:"/review/pregnancy",
  },
  {
    badge:"STANDARD", badgeColor:"#6366F1", badgeBg:"rgba(99,102,241,0.08)",
    icon: Stethoscope, iconColor:"#6366F1",
    title:"General Medicine",
    desc:"Symptomatic reviews for infections, skin issues, metabolic follow-ups, and medication concerns.",
    tags:["Symptom Review","Medication"],
    href:"/review/symptoms",
  },
];

const steps = [
  { n:"1", icon:FileText,    title:"Input Vitals",     desc:"Provide current symptoms, medical history, and context through our secure clinical intake form." },
  { n:"2", icon:Brain,       title:"AI Synthesis",     desc:"GenLayer's intelligent contract checks red flags and urgency patterns against clinical safety benchmarks." },
  { n:"3", icon:ShieldCheck, title:"Verified Report",  desc:"Receive a structured triage report with urgency classification, red flags, and recommended next steps." },
];

const trustItems = [
  { icon:Shield,       title:"On-chain Verification", desc:"Every AI review is cryptographically verified on GenLayer — tamper-proof, auditable results." },
  { icon:Lock,         title:"Private by Default",    desc:"Zero-knowledge architecture keeps your health data encrypted and completely anonymous." },
  { icon:Zap,          title:"Deterministic AI",      desc:"Auditable execution logs mean every triage decision can be independently traced and reviewed." },
  { icon:CheckCircle,  title:"Clinical Benchmarks",   desc:"Continuous updates from the latest clinical guidelines ensuring adherence to current standards." },
];

export default function HomePage() {
  return (
    <>
      <ConsentGate><div /></ConsentGate>
      <ClinicalHeader />

      <main>

        {/* ── Two-column Hero ── */}
        <section className="py-16 sm:py-24" style={{ backgroundColor:"var(--color-bg)" }}>
          <div className="max-w-6xl mx-auto px-5 sm:px-8 grid md:grid-cols-2 gap-14 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-5"
                style={{ fontFamily:"var(--font-heading)", color:"var(--color-ink)" }}>
                Healthcare triage reviewed by AI,{" "}
                <span style={{ color:"var(--color-accent-dark)" }}>not guesswork.</span>
              </h1>
              <p className="text-lg leading-relaxed mb-8" style={{ color:"var(--color-ink-secondary)" }}>
                MedReview uses clinical-grade neural networks to analyse symptoms and prioritise care
                pathways with verifiable on-chain accuracy.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link href="/review/symptoms"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl font-bold text-base text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                  style={{ background:"linear-gradient(135deg, var(--color-accent-dark), #818CF8)", fontFamily:"var(--font-heading)" }}>
                  <Stethoscope className="w-4 h-4" /> Start Symptom Review
                </Link>
                <Link href="/review/report"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl font-bold text-base border-2 transition-all hover:scale-105"
                  style={{ borderColor:"var(--color-accent)", color:"var(--color-accent-dark)", backgroundColor:"var(--color-surface)", fontFamily:"var(--font-heading)" }}>
                  <FileText className="w-4 h-4" /> Review a Report
                </Link>
              </div>
              <div className="flex flex-wrap gap-4 text-xs font-semibold" style={{ color:"var(--color-ink-muted)" }}>
                {["Private by default","Triage only — not diagnosis","GenLayer verified","No public health data"].map(b => (
                  <span key={b} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor:"var(--color-accent-dark)" }} />
                    {b}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex justify-center md:justify-end">
              <TriageMockup />
            </div>
          </div>
        </section>

        {/* ── Emergency strip ── */}
        <div className="py-3.5 px-5 sm:px-8" style={{ backgroundColor:"#FEF2F2", borderTop:"1px solid #FCA5A5", borderBottom:"1px solid #FCA5A5" }}>
          <p className="text-sm text-center font-semibold" style={{ color:"#B91C1C" }}>
            🚨 If this is an emergency, <strong>do not use MedReview</strong>.{" "}
            Seek emergency care immediately —{" "}
            <a href="tel:112" className="underline">Call 112</a> or{" "}
            <a href="tel:911" className="underline">Call 911</a>.
          </p>
        </div>

        {/* ── Triage Categories ── */}
        <section className="py-20" style={{ backgroundColor:"var(--color-surface)" }}>
          <div className="max-w-5xl mx-auto px-5 sm:px-8">
            <div className="mb-10">
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-2" style={{ fontFamily:"var(--font-heading)", color:"var(--color-ink)" }}>
                Triage Categories
              </h2>
              <p style={{ color:"var(--color-ink-secondary)" }}>Expert-system logic applied across all major clinical domains.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {triageCategories.map((tc) => {
                const Icon = tc.icon;
                return (
                  <Link key={tc.title} href={tc.href}>
                    <div className="rounded-2xl p-5 h-full cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg flex flex-col gap-4"
                      style={{ backgroundColor:"var(--color-bg)", border:"1px solid var(--color-border)", boxShadow:"var(--shadow-card)" }}>
                      <div className="flex items-start justify-between">
                        <span className="text-[10px] px-2.5 py-1 rounded-full font-bold"
                          style={{ backgroundColor:tc.badgeBg, color:tc.badgeColor }}>
                          {tc.badge}
                        </span>
                        <Icon className="w-5 h-5" style={{ color:tc.iconColor }} />
                      </div>
                      <div>
                        <p className="font-bold text-base mb-1.5" style={{ fontFamily:"var(--font-heading)", color:"var(--color-ink)" }}>{tc.title}</p>
                        <p className="text-sm leading-relaxed mb-3" style={{ color:"var(--color-ink-secondary)" }}>{tc.desc}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {tc.tags.map(t => (
                            <span key={t} className="text-[10px] px-2 py-0.5 rounded-lg font-medium"
                              style={{ backgroundColor:"rgba(99,102,241,0.08)", color:"var(--color-accent-dark)" }}>
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            {/* Safety layer banner */}
            <div className="rounded-2xl p-6 flex items-center justify-between gap-4 flex-wrap"
              style={{ background:"linear-gradient(135deg, var(--color-accent-dark), #818CF8)" }}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor:"rgba(255,255,255,0.15)" }}>
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-white text-base mb-0.5" style={{ fontFamily:"var(--font-heading)" }}>Built-in Safety Layer</p>
                  <p className="text-sm" style={{ color:"rgba(255,255,255,0.8)" }}>
                    Every AI assessment is cross-referenced against clinical safety benchmarks in real-time — no vital diagnostic possibility is overlooked.
                  </p>
                </div>
              </div>
              <Link href="/safety"
                className="shrink-0 flex items-center gap-1.5 text-sm font-bold text-white border border-white/30 px-4 py-2.5 rounded-xl hover:bg-white/10 transition-colors">
                Learn more <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── How MedReview Works ── */}
        <section className="py-20" style={{ backgroundColor:"var(--color-bg)" }}>
          <div className="max-w-4xl mx-auto px-5 sm:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-3" style={{ fontFamily:"var(--font-heading)", color:"var(--color-ink)" }}>
                How MedReview Works
              </h2>
              <p style={{ color:"var(--color-ink-secondary)" }}>
                A three-step process designed to bridge the gap between patient symptoms and clinical decisions.
              </p>
            </div>
            <div className="relative">
              {/* Dashed connector line */}
              <div className="hidden md:block absolute top-10 left-[calc(16.67%+28px)] right-[calc(16.67%+28px)] h-px border-t-2 border-dashed"
                style={{ borderColor:"var(--color-border)" }} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {steps.map((s, i) => {
                  const Icon = s.icon;
                  const active = i === 1;
                  return (
                    <div key={s.n} className="flex flex-col items-center text-center gap-4">
                      <div className="relative w-20 h-20 rounded-full flex items-center justify-center z-10 shadow-md"
                        style={{
                          background: active ? "linear-gradient(135deg, var(--color-accent-dark), #818CF8)" : "var(--color-surface)",
                          border: active ? "none" : "2px solid var(--color-border)",
                        }}>
                        <Icon className="w-8 h-8" style={{ color: active ? "white" : "var(--color-accent-dark)" }} />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color:"var(--color-accent-dark)" }}>{s.n}.</p>
                        <p className="font-bold text-base mb-1.5" style={{ fontFamily:"var(--font-heading)", color:"var(--color-ink)" }}>{s.title}</p>
                        <p className="text-sm leading-relaxed" style={{ color:"var(--color-ink-secondary)" }}>{s.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── Why Trust MedReview ── */}
        <section className="py-20" style={{ backgroundColor:"var(--color-surface)" }}>
          <div className="max-w-5xl mx-auto px-5 sm:px-8 grid md:grid-cols-2 gap-12 items-center">
            {/* Image panel */}
            <div className="rounded-3xl overflow-hidden relative flex items-center justify-center"
              style={{ minHeight:"360px", background:"linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)" }}>
              <div className="absolute inset-0 pointer-events-none opacity-30"
                style={{ background:"radial-gradient(circle at 50% 40%, #6366F1, transparent 70%)" }} />
              <div className="relative text-center px-10 py-12 flex flex-col items-center gap-6">
                <div className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ background:"rgba(255,255,255,0.08)", border:"2px solid rgba(255,255,255,0.15)" }}>
                  <Brain className="w-10 h-10" style={{ color:"#818CF8" }} />
                </div>
                <div>
                  <p className="text-white font-bold text-xl mb-2" style={{ fontFamily:"var(--font-heading)" }}>AI-Powered Triage</p>
                  <p className="text-sm leading-relaxed" style={{ color:"#A5B4FC" }}>Clinical intelligence secured on GenLayer&apos;s verifiable blockchain network</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
                  style={{ backgroundColor:"rgba(16,185,129,0.12)", border:"1px solid rgba(16,185,129,0.3)" }}>
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-bold" style={{ color:"#34D399" }}>On-chain Verification Active</span>
                </div>
              </div>
            </div>
            {/* Trust items */}
            <div>
              <h2 className="text-3xl font-extrabold mb-2" style={{ fontFamily:"var(--font-heading)", color:"var(--color-ink)" }}>
                Why Providers Trust MedReview
              </h2>
              <p className="text-base mb-8" style={{ color:"var(--color-ink-secondary)" }}>
                Built on verifiable AI infrastructure to ensure every triage decision meets clinical safety standards.
              </p>
              <div className="space-y-5">
                {trustItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background:"linear-gradient(135deg, rgba(79,70,229,0.1), rgba(129,140,248,0.1))", border:"1px solid rgba(99,102,241,0.2)" }}>
                        <Icon className="w-5 h-5" style={{ color:"var(--color-accent-dark)" }} />
                      </div>
                      <div>
                        <p className="font-bold mb-0.5" style={{ fontFamily:"var(--font-heading)", color:"var(--color-ink)" }}>{item.title}</p>
                        <p className="text-sm leading-relaxed" style={{ color:"var(--color-ink-secondary)" }}>{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="py-20 relative overflow-hidden"
          style={{ background:"linear-gradient(135deg, var(--color-accent-dark) 0%, #818CF8 60%, #A5B4FC 100%)" }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background:"radial-gradient(circle at 80% 50%, rgba(255,255,255,0.12) 0%, transparent 60%)" }} />
          <div className="relative max-w-2xl mx-auto px-5 sm:px-8 text-center">
            <Shield className="w-10 h-10 text-white mx-auto mb-5 opacity-90" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4" style={{ fontFamily:"var(--font-heading)" }}>
              Know how urgent it is before guessing what to do next.
            </h2>
            <p className="text-lg text-white mb-8" style={{ opacity:0.85 }}>
              Submit symptoms. Review the context. Understand urgency. Take the safer next step with MedReview.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/review/symptoms"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl font-bold text-base bg-white transition-all hover:scale-105"
                style={{ color:"var(--color-accent-dark)", fontFamily:"var(--font-heading)" }}>
                Start Symptom Review <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl font-bold text-base text-white border-2 border-white transition-all hover:bg-white/10"
                style={{ fontFamily:"var(--font-heading)" }}>
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
