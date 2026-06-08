import ClinicalHeader from "@/components/layout/ClinicalHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import {
  Shield, AlertTriangle, Phone, XCircle,
  HeartPulse, Wind, Brain, Eye, Droplets, Activity,
  ShieldCheck, Lock, FileText,
} from "lucide-react";
import Link from "next/link";

const criticalSymptoms = [
  { n:"01", label:"\"FAST\" Signs of Stroke",            desc:"Facial drooping, arm weakness, speech difficulty — call emergency services immediately." },
  { n:"02", label:"Severe abdominal pain",                desc:"Persistent and rapidly worsening pain that cannot be explained by known conditions." },
  { n:"03", label:"High fever with stiff neck",          desc:"High fever unresponsive to medication or accompanied by neck stiffness." },
  { n:"04", label:"Sudden confusion or disorientation",  desc:"Sudden confusion, disorientation, or inability to stay awake or respond normally." },
  { n:"05", label:"Chest pain or pressure",              desc:"Any form of chest pain, tightness, or pressure — particularly radiating to the arm." },
  { n:"06", label:"Uncontrollable bleeding",             desc:"Wounds that cannot be stopped with direct pressure within a few minutes." },
];

const emergencySymptoms = [
  { icon: HeartPulse, label: "Chest pain or pressure",      desc: "Signs of potential cardiac or lung distress." },
  { icon: Wind,       label: "Severe breathing difficulty", desc: "Inability to breathe or audible wheezing." },
  { icon: Brain,      label: "Stroke symptoms",             desc: "Face drooping, arm weakness, speech difficulty." },
  { icon: Eye,        label: "Loss of consciousness",       desc: "Any fainting or sudden unexplained collapse." },
  { icon: Droplets,   label: "Severe bleeding",             desc: "Wounds uncontrolled by direct pressure." },
  { icon: Activity,   label: "Mental health crisis",        desc: "Suicidal thoughts or intent to self-harm." },
];

const protocols = [
  {
    number:"1.1",
    icon: FileText,
    title:"Scope of Service",
    desc:"All reviews within MedReview are AI-assisted triage guidance. These outputs represent structured urgency classification only, not clinical diagnosis or professional medical opinion.",
  },
  {
    number:"2.4",
    icon: Shield,
    title:"Data Integrity",
    desc:"Verification through GenLayer's on-chain nodes ensures the authenticity of every review result. Users must exercise their own professional judgment alongside any triage output.",
  },
  {
    number:"5.9",
    icon: Lock,
    title:"Legal Indemnity",
    desc:"By using this platform, users agree that MedReview shall not be held liable for any decisions made based on information retrieved from the platform's triage output or review history.",
  },
];

export default function SafetyPage() {
  return (
    <>
      <ClinicalHeader />

      <main>

        {/* Header */}
        <section className="max-w-5xl mx-auto px-5 sm:px-8 pt-12 pb-8">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color:"var(--color-accent-dark)" }}>Healthcare Safety</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-3" style={{ fontFamily:"var(--font-heading)", color:"var(--color-ink)" }}>
            Safety &amp; Disclaimers
          </h1>
          <p className="text-base max-w-xl" style={{ color:"var(--color-ink-secondary)" }}>
            MedReview is an AI-powered triage platform. Before interacting with any clinical data or using
            decision-support features, please review these critical safety protocols.
          </p>
        </section>

        {/* Emergency + Platform Limitations */}
        <div className="max-w-5xl mx-auto px-5 sm:px-8 mb-6 grid md:grid-cols-3 gap-5">

          {/* Emergency Response (2 cols) */}
          <div className="md:col-span-2 rounded-2xl border-2 p-7"
            style={{ borderColor:"var(--color-emergency-red)", backgroundColor:"#FEF2F2" }}>
            <div className="flex items-start gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor:"#FEE2E2" }}>
                <AlertTriangle className="w-4 h-4" style={{ color:"var(--color-emergency-red)" }} />
              </div>
              <div>
                <h2 className="text-xl font-bold" style={{ fontFamily:"var(--font-heading)", color:"var(--color-emergency-red)" }}>
                  Immediate Emergency Response
                </h2>
                <p className="text-sm mt-0.5" style={{ color:"#7F1D1D" }}>Are you experiencing a medical crisis right now?</p>
              </div>
            </div>

            {/* Big call buttons */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <a href="tel:911" className="rounded-xl p-5 text-center text-white flex flex-col items-center gap-2 hover:opacity-90 transition-opacity"
                style={{ backgroundColor:"var(--color-emergency-red)" }}>
                <Phone className="w-6 h-6" />
                <p className="text-[10px] font-bold uppercase tracking-wider">Call Emergency (USA/CAN)</p>
                <p className="text-4xl font-extrabold" style={{ fontFamily:"var(--font-heading)" }}>911</p>
              </a>
              <a href="tel:112" className="rounded-xl p-5 text-center text-white flex flex-col items-center gap-2 hover:opacity-90 transition-opacity"
                style={{ backgroundColor:"var(--color-emergency-red)" }}>
                <Phone className="w-6 h-6" />
                <p className="text-[10px] font-bold uppercase tracking-wider">Call Emergency (EU/Global)</p>
                <p className="text-4xl font-extrabold" style={{ fontFamily:"var(--font-heading)" }}>112</p>
              </a>
            </div>

            {/* When to call list */}
            <div className="rounded-xl p-4" style={{ backgroundColor:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.2)" }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color:"#991B1B" }}>When to call immediately:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {["Difficulty breathing or choking","Chest pain or pressure","Sudden numbness or weakness","Uncontrollable bleeding","Severe allergic reaction","Loss of consciousness"].map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm" style={{ color:"#7F1D1D" }}>
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor:"var(--color-emergency-red)" }} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Platform Limitations (1 col) */}
          <div className="rounded-2xl p-7 flex flex-col gap-5"
            style={{ background:"linear-gradient(160deg, #1E1B4B, #312E81)", border:"1px solid #3730A3" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor:"rgba(99,102,241,0.25)" }}>
              <Shield className="w-5 h-5" style={{ color:"#818CF8" }} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily:"var(--font-heading)" }}>Platform Limitations</h3>
              <p className="text-sm leading-relaxed mb-5" style={{ color:"#A5B4FC" }}>
                MedReview is <strong className="text-white">NOT</strong> a substitute for
                professional medical advice, diagnosis, or treatment.
              </p>
              <div className="space-y-2.5">
                {["No direct patient care","No prescribing authority","No diagnostic services"].map(item => (
                  <div key={item} className="flex items-center gap-2.5 text-sm font-medium" style={{ color:"#C7D2FE" }}>
                    <XCircle className="w-4 h-4 shrink-0" style={{ color:"#F87171" }} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <Link href="/consent"
              className="mt-auto w-full flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity"
              style={{ background:"linear-gradient(135deg, var(--color-accent-dark), #818CF8)" }}>
              Read Consent Notice
            </Link>
          </div>
        </div>

        {/* Protocol cards */}
        <div className="max-w-5xl mx-auto px-5 sm:px-8 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {protocols.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="rounded-2xl p-6"
                style={{ backgroundColor:"var(--color-surface)", border:"1px solid var(--color-border)", boxShadow:"var(--shadow-card)" }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background:"linear-gradient(135deg, rgba(79,70,229,0.1), rgba(129,140,248,0.1))", border:"1px solid rgba(99,102,241,0.15)" }}>
                    <Icon className="w-5 h-5" style={{ color:"var(--color-accent-dark)" }} />
                  </div>
                  <span className="text-[10px] px-2 py-1 rounded-lg font-bold"
                    style={{ backgroundColor:"rgba(99,102,241,0.08)", color:"var(--color-accent-dark)" }}>
                    PROTOCOL {p.number}
                  </span>
                </div>
                <p className="font-bold mb-2" style={{ fontFamily:"var(--font-heading)", color:"var(--color-ink)" }}>{p.title}</p>
                <p className="text-sm leading-relaxed" style={{ color:"var(--color-ink-secondary)" }}>{p.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Recognizing Critical Symptoms: image + numbered list */}
        <div className="max-w-5xl mx-auto px-5 sm:px-8 mb-6 grid md:grid-cols-2 gap-8 items-center">
          {/* Image panel */}
          <div className="rounded-3xl overflow-hidden relative flex items-center justify-center"
            style={{ minHeight:"320px", background:"linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)" }}>
            <div className="absolute inset-0 opacity-20 pointer-events-none"
              style={{ background:"radial-gradient(circle at 50% 30%, #6366F1, transparent 60%)" }} />
            <div className="relative flex flex-col items-center justify-center text-center px-8 py-12 gap-6">
              <div className="grid grid-cols-3 gap-3">
                {[HeartPulse, Wind, Brain, Eye, Droplets, Activity].map((Icon, i) => (
                  <div key={i} className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor:"rgba(99,102,241,0.2)", border:"1px solid rgba(99,102,241,0.3)" }}>
                    <Icon className="w-5 h-5" style={{ color:"#818CF8" }} />
                  </div>
                ))}
              </div>
              <div>
                <p className="text-white font-bold text-base" style={{ fontFamily:"var(--font-heading)" }}>Emergency Symptom Awareness</p>
                <p className="text-sm mt-1" style={{ color:"#A5B4FC" }}>Recognise the signs that require immediate care</p>
              </div>
            </div>
          </div>

          {/* Numbered list */}
          <div>
            <h2 className="text-2xl font-extrabold mb-2" style={{ fontFamily:"var(--font-heading)", color:"var(--color-ink)" }}>
              Recognising Critical Symptoms
            </h2>
            <p className="text-sm mb-6" style={{ color:"var(--color-ink-secondary)" }}>
              If you observe these symptoms in yourself or others, stop using this platform and seek professional medical help immediately.
            </p>
            <div className="space-y-3">
              {criticalSymptoms.map((s) => (
                <div key={s.n} className="flex items-start gap-4">
                  <span className="text-xs font-bold shrink-0 w-7 mt-0.5" style={{ color:"var(--color-accent-dark)" }}>{s.n}</span>
                  <div>
                    <p className="text-sm font-semibold italic mb-0.5" style={{ color:"var(--color-ink)" }}>{s.label}</p>
                    <p className="text-sm" style={{ color:"var(--color-ink-secondary)" }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Emergency symptom cards grid */}
        <div className="max-w-5xl mx-auto px-5 sm:px-8 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {emergencySymptoms.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex items-start gap-3 p-4 rounded-xl"
                  style={{ backgroundColor:"#FEF2F2", border:"1px solid #FECACA" }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor:"#FEE2E2" }}>
                    <Icon className="w-4 h-4" style={{ color:"var(--color-emergency-red)" }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-0.5" style={{ color:"#991B1B" }}>{s.label}</p>
                    <p className="text-xs" style={{ color:"#B91C1C" }}>{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Compliance badges */}
        <div className="max-w-5xl mx-auto px-5 sm:px-8 mb-16">
          <div className="rounded-2xl p-5 flex flex-wrap items-center justify-center gap-8"
            style={{ backgroundColor:"var(--color-surface)", border:"1px solid var(--color-border)" }}>
            {[
              { icon:ShieldCheck, label:"Privacy Protected",   sub:"End-to-end encryption" },
              { icon:Shield,      label:"GenLayer Verified",   sub:"On-chain audit trail" },
              { icon:Lock,        label:"Zero-Knowledge",      sub:"Data stays anonymous" },
            ].map(b => {
              const Icon = b.icon;
              return (
                <div key={b.label} className="flex flex-col items-center gap-1.5 text-center">
                  <Icon className="w-6 h-6" style={{ color:"var(--color-accent-dark)" }} />
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color:"var(--color-ink)" }}>{b.label}</p>
                  <p className="text-xs" style={{ color:"var(--color-ink-muted)" }}>{b.sub}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-5xl mx-auto px-5 sm:px-8 pb-16 flex flex-wrap gap-3">
          <Link href="/review"
            className="px-6 py-3 rounded-xl text-sm font-bold text-white shadow-sm transition-all hover:scale-105"
            style={{ background:"linear-gradient(135deg, var(--color-accent-dark), #818CF8)", fontFamily:"var(--font-heading)" }}>
            Start a Review
          </Link>
          <Link href="/consent"
            className="px-6 py-3 rounded-xl text-sm font-semibold border transition-colors hover:bg-[var(--color-surface-soft)]"
            style={{ borderColor:"var(--color-border)", color:"var(--color-ink-secondary)" }}>
            Clinical Method
          </Link>
        </div>

      </main>
      <SiteFooter />
    </>
  );
}
