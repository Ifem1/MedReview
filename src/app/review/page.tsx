import ClinicalHeader from "@/components/layout/ClinicalHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import Link from "next/link";
import {
  Stethoscope, FileText, Pill, Baby,
  HeartPulse, RefreshCw, ArrowRight, AlertTriangle, ShieldCheck,
} from "lucide-react";

export default function ReviewPage() {
  return (
    <>
      <ClinicalHeader />

      <main>
        {/* Header */}
        <section className="py-12 px-5 sm:px-8 max-w-5xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-2" style={{ fontFamily:"var(--font-heading)", color:"var(--color-ink)" }}>
            How can we help today?
          </h1>
          <p className="text-base max-w-xl" style={{ color:"var(--color-ink-secondary)" }}>
            Select the review type that best matches your current situation. Our clinical triage system will guide you through the appropriate diagnostic flow.
          </p>
        </section>

        {/* Safety notice */}
        <div className="max-w-5xl mx-auto px-5 sm:px-8 mb-6">
          <div className="rounded-2xl p-4 flex items-start gap-3"
            style={{ backgroundColor:"var(--color-surface)", border:"1px solid var(--color-border)", borderLeft:"4px solid var(--color-emergency-red)" }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor:"#FEE2E2" }}>
              <AlertTriangle className="w-4 h-4" style={{ color:"var(--color-emergency-red)" }} />
            </div>
            <div>
              <p className="text-sm font-semibold mb-0.5" style={{ color:"var(--color-ink)" }}>Healthcare Safety Notice</p>
              <p className="text-sm" style={{ color:"var(--color-ink-secondary)" }}>
                MedReview provides AI-assisted triage guidance only.{" "}
                <strong>It does not provide a medical diagnosis, prescription, or emergency service.</strong>{" "}
                If symptoms are severe, sudden, or life-threatening,{" "}
                <a href="tel:112" className="font-semibold underline" style={{ color:"var(--color-emergency-red)" }}>seek emergency medical care immediately.</a>
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-5 sm:px-8 pb-12 space-y-4">

          {/* Row 1: Featured Symptom Review (wide) + Medication */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/review/symptoms" className="md:col-span-2">
              <div className="rounded-2xl p-7 h-full cursor-pointer transition-all hover:scale-[1.01] hover:shadow-lg flex flex-col gap-5"
                style={{ backgroundColor:"var(--color-surface)", border:"1px solid var(--color-border)", boxShadow:"var(--shadow-card)" }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background:"linear-gradient(135deg, rgba(79,70,229,0.12), rgba(99,102,241,0.12))", border:"1px solid rgba(99,102,241,0.2)" }}>
                    <Stethoscope className="w-7 h-7" style={{ color:"var(--color-accent-dark)" }} />
                  </div>
                  <span className="flex items-center gap-1.5 text-sm font-semibold whitespace-nowrap" style={{ color:"var(--color-accent-dark)" }}>
                    Begin Assessment <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
                <div>
                  <p className="text-xl font-bold mb-2" style={{ fontFamily:"var(--font-heading)", color:"var(--color-ink)" }}>Symptom Review</p>
                  <p className="text-sm leading-relaxed" style={{ color:"var(--color-ink-secondary)" }}>
                    For new or worsening physical symptoms. This comprehensive review takes approximately 8–12 minutes and uses clinical-grade triage logic to assess risk levels with full GenLayer verification.
                  </p>
                </div>
              </div>
            </Link>

            <Link href="/review/medication">
              <div className="rounded-2xl p-6 h-full cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg flex flex-col gap-4"
                style={{ backgroundColor:"var(--color-surface)", border:"1px solid var(--color-border)", boxShadow:"var(--shadow-card)" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor:"rgba(139,92,246,0.1)", border:"1px solid rgba(139,92,246,0.2)" }}>
                  <Pill className="w-6 h-6" style={{ color:"#8B5CF6" }} />
                </div>
                <div>
                  <p className="font-bold mb-1.5" style={{ fontFamily:"var(--font-heading)", color:"var(--color-ink)" }}>Medication Concern</p>
                  <p className="text-sm leading-relaxed mb-4" style={{ color:"var(--color-ink-secondary)" }}>
                    Report side effects or clarify dosage instructions for active prescriptions.
                  </p>
                  <span className="flex items-center gap-1.5 text-sm font-semibold" style={{ color:"#8B5CF6" }}>
                    Check Medication <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Row 2: Child, Pregnancy, Report */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { href:"/review/child",     icon:Baby,      color:"#F59E0B", bg:"rgba(245,158,11,0.08)",  border:"rgba(245,158,11,0.3)", title:"Child Symptom Review",  desc:"Specialised pediatric triage for patients under 12.", badge:"Extra Caution" },
              { href:"/review/pregnancy", icon:HeartPulse,color:"#EC4899", bg:"rgba(236,72,153,0.08)",  border:"rgba(236,72,153,0.3)", title:"Pregnancy Concern",      desc:"Focused review for maternal health and fetal concerns.", badge:"Extra Caution" },
              { href:"/review/report",    icon:FileText,  color:"#6366F1", bg:"rgba(99,102,241,0.08)",  border:"var(--color-border)",  title:"Report Review",          desc:"Request clinical interpretation of lab or imaging results.", badge:null },
            ].map((rt) => {
              const Icon = rt.icon;
              return (
                <Link key={rt.href} href={rt.href}>
                  <div className="rounded-2xl p-5 h-full cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg flex flex-col gap-3"
                    style={{ backgroundColor:"var(--color-surface)", border:`1px solid ${rt.border}`, boxShadow:"var(--shadow-card)" }}>
                    <div className="flex items-start justify-between">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor:rt.bg }}>
                        <Icon className="w-5 h-5" style={{ color:rt.color }} />
                      </div>
                      {rt.badge && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide"
                          style={{ backgroundColor:"#FEF3C7", color:"#D97706" }}>
                          {rt.badge}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-bold mb-1" style={{ fontFamily:"var(--font-heading)", color:"var(--color-ink)" }}>{rt.title}</p>
                      <p className="text-sm leading-relaxed" style={{ color:"var(--color-ink-secondary)" }}>{rt.desc}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Row 3: Follow-up full width */}
          <div className="rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap"
            style={{ backgroundColor:"var(--color-surface)", border:"1px solid var(--color-border)", boxShadow:"var(--shadow-card)" }}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor:"rgba(20,184,166,0.1)", border:"1px solid rgba(20,184,166,0.2)" }}>
                <RefreshCw className="w-6 h-6" style={{ color:"#14B8A6" }} />
              </div>
              <div>
                <p className="font-bold mb-0.5" style={{ fontFamily:"var(--font-heading)", color:"var(--color-ink)" }}>Follow-up Review</p>
                <p className="text-sm" style={{ color:"var(--color-ink-secondary)" }}>Continue a previous assessment or check-in after treatment if your condition has changed.</p>
              </div>
            </div>
            <Link href="/dashboard"
              className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border transition-all hover:bg-[var(--color-surface-soft)]"
              style={{ borderColor:"var(--color-border)", color:"var(--color-ink-secondary)", backgroundColor:"var(--color-bg)" }}>
              View History <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Protocol Integrity */}
        <section className="max-w-5xl mx-auto px-5 sm:px-8 pb-16">
          <div className="rounded-3xl overflow-hidden grid md:grid-cols-2"
            style={{ border:"1px solid var(--color-border)", boxShadow:"var(--shadow-card)" }}>
            {/* Left: dark panel */}
            <div className="relative flex items-center justify-center p-10"
              style={{ background:"linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)", minHeight:"220px" }}>
              <div className="absolute inset-0 pointer-events-none opacity-30"
                style={{ background:"radial-gradient(circle at 50% 50%, #6366F1, transparent 70%)" }} />
              <div className="relative text-center flex flex-col items-center gap-5">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor:"rgba(99,102,241,0.2)", border:"1px solid rgba(99,102,241,0.3)" }}>
                  <ShieldCheck className="w-7 h-7" style={{ color:"#818CF8" }} />
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                  {[{ t:"GenLayer Verified", c:"#34D399" },{ t:"Privacy Protected", c:"#A5B4FC" }].map(b => (
                    <div key={b.t} className="flex items-center gap-1.5 text-xs font-bold" style={{ color:b.c }}>
                      <ShieldCheck className="w-3.5 h-3.5" /> {b.t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Right: text */}
            <div className="p-8 flex flex-col justify-center" style={{ backgroundColor:"var(--color-surface)" }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color:"var(--color-accent-dark)" }}>Institutional Standard</p>
              <h3 className="text-2xl font-extrabold mb-3" style={{ fontFamily:"var(--font-heading)", color:"var(--color-ink)" }}>Protocol Integrity</h3>
              <p className="text-sm leading-relaxed mb-5" style={{ color:"var(--color-ink-secondary)" }}>
                MedReview uses validated clinical pathways based on the latest guidelines for digital triage. Every review is processed by our secure, privacy-first infrastructure ensuring your health data remains encrypted and anonymous.
              </p>
              <div className="space-y-2.5">
                {[
                  { label:"Clinically Validated",  desc:"Logic reviewed by specialist clinicians." },
                  { label:"End-to-End Encrypted",  desc:"Zero-knowledge storage for all sessions." },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor:"rgba(79,70,229,0.1)" }}>
                      <ShieldCheck className="w-3.5 h-3.5" style={{ color:"var(--color-accent-dark)" }} />
                    </div>
                    <p className="text-sm">
                      <span className="font-semibold" style={{ color:"var(--color-ink)" }}>{item.label}</span>
                      <span style={{ color:"var(--color-ink-secondary)" }}> — {item.desc}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  );
}
