"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import ClinicalHeader from "@/components/layout/ClinicalHeader";
import EmergencyBanner from "@/components/layout/EmergencyBanner";
import SafetyNotice from "@/components/triage/SafetyNotice";
import SeveritySlider from "@/components/review/SeveritySlider";
import LoadingReviewState from "@/components/ui/LoadingReviewState";
import { detectEmergencyKeywords, generateReviewId } from "@/lib/utils";
import { useSubmitReview } from "@/hooks/useSubmitReview";
import { HeartPulse, Plus, X, ArrowRight } from "lucide-react";

const AGE_RANGES = ["Under 18","18–24","25–34","35–44","45+"];

const inputCls = "w-full text-sm px-3.5 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-[var(--color-accent-dark)]";
const inputStyle = { borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)", color: "var(--color-ink)" };

export default function PregnancyConcernPage() {
  const router = useRouter();
  const { address } = useAccount();
  const { submitReview, isWriting } = useSubmitReview();

  const [title, setTitle]                       = useState("");
  const [freeText, setFreeText]                 = useState("");
  const [symptomInput, setSymptomInput]         = useState("");
  const [symptoms, setSymptoms]                 = useState<string[]>([]);
  const [gestationalAge, setGestationalAge]     = useState("");
  const [ageRange, setAgeRange]                 = useState("");
  const [severity, setSeverity]                 = useState(4);
  const [existingConditions, setExistingConditions] = useState("");
  const [medications, setMedications]           = useState("");
  const [submitting, setSubmitting]             = useState(false);
  const [error, setError]                       = useState("");

  const emergencyDetected = detectEmergencyKeywords(freeText) || symptoms.some(s => detectEmergencyKeywords(s));

  function addSymptom() {
    const t = symptomInput.trim();
    if (t && !symptoms.includes(t)) setSymptoms([...symptoms, t]);
    setSymptomInput("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!freeText.trim() && symptoms.length === 0) { setError("Please describe your symptoms."); return; }
    setError("");
    setSubmitting(true);

    const reviewId = generateReviewId();
    const reviewPayload = {
      review_id: reviewId,
      user_address: address || "0x0000",
      review_type: "pregnancy_concern",
      title: title || "Pregnancy Concern Review",
      pregnancy_status: "pregnant",
      gestational_age: gestationalAge,
      age_range: ageRange,
      symptoms,
      severity,
      free_text: freeText,
      existing_conditions: existingConditions ? existingConditions.split(",").map(s => s.trim()) : [],
      medications: medications ? medications.split(",").map(s => s.trim()) : [],
      status: "submitted",
      created_at: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewPayload, walletAddress: address }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");

      const txHash = await submitReview("submit_symptom_review", [reviewId, JSON.stringify(reviewPayload)]);

      fetch("/api/genlayer/sync-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewPayload, walletAddress: address, txHash }),
      }).catch(() => {});

      router.push(`/review/${data.reviewId}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Submission failed.");
      setSubmitting(false);
    }
  }

  if (submitting && !isWriting) return (
    <><ClinicalHeader /><main className="max-w-2xl mx-auto px-5 py-12"><LoadingReviewState message="Submitting pregnancy concern to GenLayer with extra caution…" /></main></>
  );

  return (
    <>
      <ClinicalHeader />
      <main className="max-w-2xl mx-auto px-5 sm:px-8 py-12 space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #EC4899, #F43F5E)" }}>
              <HeartPulse className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#BE185D" }}>Extra Caution</p>
              <h1 className="text-2xl font-extrabold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}>Pregnancy Concern Review</h1>
            </div>
          </div>
          <p className="text-sm" style={{ color: "var(--color-ink-secondary)" }}>
            Lower-threshold triage for pregnancy symptoms. Dismissal of serious symptoms is not permitted.
          </p>
        </div>

        <div className="rounded-xl border-2 p-4 text-sm font-medium" style={{ backgroundColor: "#FDF2F8", borderColor: "#F9A8D4", color: "#9D174D" }}>
          ⚠️ Bleeding, severe pain, reduced fetal movement, high blood pressure symptoms, and severe headache require <strong>immediate</strong> medical review — do not wait.
        </div>

        {emergencyDetected && <EmergencyBanner inline />}
        <SafetyNotice />

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Pregnancy Details */}
          <div className="rounded-2xl p-5 space-y-4" style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-ink-muted)" }}>Pregnancy Details</p>

            <div className="space-y-1">
              <label className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>Title <span style={{ color: "var(--color-ink-light)" }}>(optional)</span></label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Severe headache at 28 weeks" className={inputCls} style={inputStyle} />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>Gestational Age <span style={{ color: "var(--color-ink-light)" }}>(optional)</span></label>
              <input type="text" value={gestationalAge} onChange={e => setGestationalAge(e.target.value)} placeholder="e.g. 28 weeks, 7 months, not sure" className={inputCls} style={inputStyle} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>Symptoms</label>
              <div className="flex gap-2">
                <input type="text" value={symptomInput} onChange={e => setSymptomInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addSymptom(); } }}
                  placeholder="e.g. severe headache, swelling, bleeding" className={inputCls + " flex-1"} style={inputStyle} />
                <button type="button" onClick={addSymptom} className="px-3.5 py-2.5 rounded-xl text-white font-bold" style={{ background: "linear-gradient(135deg, #EC4899, #F43F5E)" }}>
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {symptoms.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {symptoms.map(s => (
                    <span key={s} className="inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-full" style={{ backgroundColor: "#FDF2F8", color: "#BE185D" }}>
                      {s} <button type="button" onClick={() => setSymptoms(symptoms.filter(x => x !== s))}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>Describe your concern <span style={{ color: "var(--color-emergency-red)" }}>*</span></label>
              <textarea rows={5} value={freeText} onChange={e => setFreeText(e.target.value)}
                placeholder="Describe your symptoms in detail — onset, severity, duration, what you've tried…"
                className={inputCls + " resize-none"} style={inputStyle} />
            </div>
          </div>

          {/* Severity */}
          <div className="rounded-2xl p-5 space-y-4" style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-ink-muted)" }}>Severity</p>
            <SeveritySlider value={severity} onChange={setSeverity} />
          </div>

          {/* Patient Context */}
          <div className="rounded-2xl p-5 space-y-4" style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-ink-muted)" }}>Patient Context</p>

            <div className="space-y-1">
              <label className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>Your Age Range <span style={{ color: "var(--color-ink-light)" }}>(optional)</span></label>
              <div className="flex flex-wrap gap-2">
                {AGE_RANGES.map(a => (
                  <button key={a} type="button" onClick={() => setAgeRange(a === ageRange ? "" : a)}
                    className="text-xs px-3 py-1.5 rounded-full border font-medium transition-colors"
                    style={ageRange === a
                      ? { backgroundColor: "#EC4899", borderColor: "#EC4899", color: "#fff" }
                      : { backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", color: "var(--color-ink-secondary)" }}>
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>Existing Conditions <span style={{ color: "var(--color-ink-light)" }}>(optional)</span></label>
              <input type="text" value={existingConditions} onChange={e => setExistingConditions(e.target.value)} placeholder="e.g. gestational diabetes, hypertension" className={inputCls} style={inputStyle} />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>Current Medications <span style={{ color: "var(--color-ink-light)" }}>(optional)</span></label>
              <input type="text" value={medications} onChange={e => setMedications(e.target.value)} placeholder="e.g. folic acid, iron supplement, labetalol" className={inputCls} style={inputStyle} />
            </div>
          </div>

          {error && <p className="text-sm font-semibold" style={{ color: "var(--color-emergency-red)" }}>{error}</p>}

          <div className="rounded-xl px-4 py-3 flex items-start gap-2.5 text-sm" style={{ backgroundColor: "var(--color-surface-soft)", border: "1px solid var(--color-border)" }}>
            <span className="text-base shrink-0">⛓️</span>
            <p style={{ color: "var(--color-ink-secondary)" }}>
              <strong style={{ color: "var(--color-ink)" }}>Submitted on GenLayer.</strong>{" "}
              Your wallet will prompt to sign — this triggers the AI triage contract.
            </p>
          </div>

          <button type="submit" disabled={submitting || isWriting}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base text-white transition-all hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
            style={{ background: "linear-gradient(135deg, #EC4899, #F43F5E)", fontFamily: "var(--font-heading)" }}>
            {isWriting ? "Confirm in wallet…" : submitting ? "Submitting…" : <> Submit Pregnancy Concern <ArrowRight className="w-4 h-4" /> </>}
          </button>
        </form>
      </main>
    </>
  );
}
