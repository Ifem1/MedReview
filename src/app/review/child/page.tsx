"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import ClinicalHeader from "@/components/layout/ClinicalHeader";
import EmergencyBanner from "@/components/layout/EmergencyBanner";
import SafetyNotice from "@/components/triage/SafetyNotice";
import SeveritySlider from "@/components/review/SeveritySlider";
import DurationPicker from "@/components/review/DurationPicker";
import LoadingReviewState from "@/components/ui/LoadingReviewState";
import { detectEmergencyKeywords, generateReviewId } from "@/lib/utils";
import { useSubmitReview } from "@/hooks/useSubmitReview";
import { Baby, Plus, X, ArrowRight } from "lucide-react";

const inputCls = "w-full text-sm px-3.5 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-[var(--color-accent-dark)]";
const inputStyle = { borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)", color: "var(--color-ink)" };

export default function ChildSymptomPage() {
  const router = useRouter();
  const { address } = useAccount();
  const { submitReview, isWriting } = useSubmitReview();

  const [title, setTitle]               = useState("");
  const [childAge, setChildAge]         = useState("");
  const [freeText, setFreeText]         = useState("");
  const [symptomInput, setSymptomInput] = useState("");
  const [symptoms, setSymptoms]         = useState<string[]>([]);
  const [duration, setDuration]         = useState("");
  const [severity, setSeverity]         = useState(4);
  const [existingConditions, setExistingConditions] = useState("");
  const [medications, setMedications]   = useState("");
  const [submitting, setSubmitting]     = useState(false);
  const [error, setError]               = useState("");

  const emergencyDetected = detectEmergencyKeywords(freeText) || symptoms.some(s => detectEmergencyKeywords(s));

  function addSymptom() {
    const t = symptomInput.trim();
    if (t && !symptoms.includes(t)) setSymptoms([...symptoms, t]);
    setSymptomInput("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!freeText.trim() && symptoms.length === 0) { setError("Please describe the child's symptoms."); return; }
    setError("");
    setSubmitting(true);

    const reviewId = generateReviewId();
    const reviewPayload = {
      review_id: reviewId,
      user_address: address || "0x0000",
      review_type: "child_symptom",
      title: title || "Child Symptom Review",
      age_range: childAge ? `child_${childAge}` : "child",
      symptoms,
      duration,
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
    <><ClinicalHeader /><main className="max-w-2xl mx-auto px-5 py-12"><LoadingReviewState message="Submitting child symptom review to GenLayer…" /></main></>
  );

  return (
    <>
      <ClinicalHeader />
      <main className="max-w-2xl mx-auto px-5 sm:px-8 py-12 space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #F59E0B, #EF4444)" }}>
              <Baby className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#EA580C" }}>Extra Caution</p>
              <h1 className="text-2xl font-extrabold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}>Child Symptom Review</h1>
            </div>
          </div>
          <p className="text-sm" style={{ color: "var(--color-ink-secondary)" }}>
            Specialised caution review for children under 12. Lower threshold for urgent care recommendations.
          </p>
        </div>

        <div className="rounded-xl border-2 p-4 text-sm font-medium" style={{ backgroundColor: "#FFEDD5", borderColor: "#FDBA74", color: "#9A3412" }}>
          ⚠️ Extra caution applied. Always consult a clinician for any child health concern — do not delay if you are worried.
        </div>

        {emergencyDetected && <EmergencyBanner inline />}
        <SafetyNotice />

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Child Details */}
          <div className="rounded-2xl p-5 space-y-4" style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-ink-muted)" }}>Child Details</p>

            <div className="space-y-1">
              <label className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>Title <span style={{ color: "var(--color-ink-light)" }}>(optional)</span></label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. 4-year-old with high fever and rash" className={inputCls} style={inputStyle} />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>Child's Age <span style={{ color: "var(--color-ink-light)" }}>(optional)</span></label>
              <input type="text" value={childAge} onChange={e => setChildAge(e.target.value)} placeholder="e.g. 4 years, 8 months" className={inputCls} style={inputStyle} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>Symptoms</label>
              <div className="flex gap-2">
                <input type="text" value={symptomInput} onChange={e => setSymptomInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addSymptom(); } }}
                  placeholder="e.g. high fever, rash, coughing" className={inputCls + " flex-1"} style={inputStyle} />
                <button type="button" onClick={addSymptom} className="px-3.5 py-2.5 rounded-xl text-white font-bold" style={{ background: "linear-gradient(135deg, var(--color-accent-dark), #818CF8)" }}>
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {symptoms.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {symptoms.map(s => (
                    <span key={s} className="inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-full" style={{ backgroundColor: "var(--color-accent)", color: "var(--color-accent-deeper)" }}>
                      {s} <button type="button" onClick={() => setSymptoms(symptoms.filter(x => x !== s))}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>Describe the child's symptoms <span style={{ color: "var(--color-emergency-red)" }}>*</span></label>
              <textarea rows={5} value={freeText} onChange={e => setFreeText(e.target.value)}
                placeholder="Onset, how long, what makes it better or worse, what you've tried…"
                className={inputCls + " resize-none"} style={inputStyle} />
            </div>
          </div>

          {/* Duration & Severity */}
          <div className="rounded-2xl p-5 space-y-5" style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-ink-muted)" }}>Duration &amp; Severity</p>
            <DurationPicker value={duration} onChange={setDuration} />
            <SeveritySlider value={severity} onChange={setSeverity} />
          </div>

          {/* Medical Context */}
          <div className="rounded-2xl p-5 space-y-4" style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-ink-muted)" }}>Medical Context</p>
            <div className="space-y-1">
              <label className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>Existing Conditions <span style={{ color: "var(--color-ink-light)" }}>(optional)</span></label>
              <input type="text" value={existingConditions} onChange={e => setExistingConditions(e.target.value)} placeholder="e.g. asthma, eczema" className={inputCls} style={inputStyle} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>Current Medications <span style={{ color: "var(--color-ink-light)" }}>(optional)</span></label>
              <input type="text" value={medications} onChange={e => setMedications(e.target.value)} placeholder="e.g. salbutamol inhaler, antihistamine" className={inputCls} style={inputStyle} />
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
            style={{ background: "linear-gradient(135deg, #F59E0B, #EF4444)", fontFamily: "var(--font-heading)" }}>
            {isWriting ? "Confirm in wallet…" : submitting ? "Submitting…" : <> Submit Child Symptom Review <ArrowRight className="w-4 h-4" /> </>}
          </button>
        </form>
      </main>
    </>
  );
}
