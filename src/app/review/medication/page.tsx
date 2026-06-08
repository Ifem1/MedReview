"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import ClinicalHeader from "@/components/layout/ClinicalHeader";
import SafetyNotice from "@/components/triage/SafetyNotice";
import LoadingReviewState from "@/components/ui/LoadingReviewState";
import { generateReviewId } from "@/lib/utils";
import { useSubmitReview } from "@/hooks/useSubmitReview";
import { Pill, ArrowRight } from "lucide-react";

const AGE_RANGES = ["Under 18","18–24","25–34","35–44","45–54","55–64","65–74","75+"];

const inputCls = "w-full text-sm px-3.5 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-[var(--color-accent-dark)]";
const inputStyle = { borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)", color: "var(--color-ink)" };

export default function MedicationConcernPage() {
  const router = useRouter();
  const { address } = useAccount();
  const { submitReview, isWriting } = useSubmitReview();

  const [title, setTitle]                       = useState("");
  const [medicationName, setMedicationName]     = useState("");
  const [concern, setConcern]                   = useState("");
  const [ageRange, setAgeRange]                 = useState("");
  const [allergies, setAllergies]               = useState("");
  const [existingConditions, setExistingConditions] = useState("");
  const [otherMedications, setOtherMedications] = useState("");
  const [submitting, setSubmitting]             = useState(false);
  const [error, setError]                       = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!concern.trim()) { setError("Please describe your medication concern."); return; }
    setError("");
    setSubmitting(true);

    const reviewId = generateReviewId();
    const reviewPayload = {
      review_id: reviewId,
      user_address: address || "0x0000",
      review_type: "medication_concern",
      title: title || `Medication concern: ${medicationName}`,
      medication_name: medicationName,
      free_text: concern,
      age_range: ageRange,
      allergies: allergies ? allergies.split(",").map(s => s.trim()) : [],
      existing_conditions: existingConditions ? existingConditions.split(",").map(s => s.trim()) : [],
      other_medications: otherMedications ? otherMedications.split(",").map(s => s.trim()) : [],
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

      const txHash = await submitReview("submit_report_review", [reviewId, JSON.stringify(reviewPayload)]);

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
    <><ClinicalHeader /><main className="max-w-2xl mx-auto px-5 py-12"><LoadingReviewState message="Submitting medication concern to GenLayer…" /></main></>
  );

  return (
    <>
      <ClinicalHeader />
      <main className="max-w-2xl mx-auto px-5 sm:px-8 py-12 space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--color-accent-dark), #818CF8)" }}>
              <Pill className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}>Medication Concern</h1>
          </div>
          <p className="text-sm" style={{ color: "var(--color-ink-secondary)" }}>
            Questions about side effects, missed doses, or drug interactions reviewed by GenLayer AI.
          </p>
        </div>

        <div className="rounded-xl border p-4 text-sm" style={{ backgroundColor: "#FFF7ED", borderColor: "#FDE68A", color: "#92400E" }}>
          MedReview does not prescribe, recommend dosage changes, or replace pharmacist or physician advice.
        </div>

        <SafetyNotice />

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Medication Details */}
          <div className="rounded-2xl p-5 space-y-4" style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-ink-muted)" }}>Medication Details</p>

            <div className="space-y-1">
              <label className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>Title <span style={{ color: "var(--color-ink-light)" }}>(optional)</span></label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Side effects of metformin" className={inputCls} style={inputStyle} />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>Medication Name <span style={{ color: "var(--color-emergency-red)" }}>*</span></label>
              <input type="text" value={medicationName} onChange={e => setMedicationName(e.target.value)} placeholder="e.g. Metformin 500mg" className={inputCls} style={inputStyle} />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>Describe your concern <span style={{ color: "var(--color-emergency-red)" }}>*</span></label>
              <textarea rows={5} value={concern} onChange={e => setConcern(e.target.value)}
                placeholder="Describe the side effects, missed dose situation, or interaction concern…"
                className={inputCls + " resize-none"} style={inputStyle} />
            </div>
          </div>

          {/* Patient Context */}
          <div className="rounded-2xl p-5 space-y-4" style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-ink-muted)" }}>Patient Context</p>

            <div className="space-y-1">
              <label className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>Age Range <span style={{ color: "var(--color-ink-light)" }}>(optional)</span></label>
              <div className="flex flex-wrap gap-2">
                {AGE_RANGES.map(a => (
                  <button key={a} type="button" onClick={() => setAgeRange(a === ageRange ? "" : a)}
                    className="text-xs px-3 py-1.5 rounded-full border font-medium transition-colors"
                    style={ageRange === a
                      ? { backgroundColor: "var(--color-accent-dark)", borderColor: "var(--color-accent-dark)", color: "#fff" }
                      : { backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", color: "var(--color-ink-secondary)" }}>
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>Known Allergies <span style={{ color: "var(--color-ink-light)" }}>(optional)</span></label>
              <input type="text" value={allergies} onChange={e => setAllergies(e.target.value)} placeholder="e.g. penicillin, sulfa" className={inputCls} style={inputStyle} />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>Existing Conditions <span style={{ color: "var(--color-ink-light)" }}>(optional)</span></label>
              <input type="text" value={existingConditions} onChange={e => setExistingConditions(e.target.value)} placeholder="e.g. diabetes, kidney disease" className={inputCls} style={inputStyle} />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>Other Medications <span style={{ color: "var(--color-ink-light)" }}>(optional)</span></label>
              <input type="text" value={otherMedications} onChange={e => setOtherMedications(e.target.value)} placeholder="e.g. lisinopril 10mg, aspirin 75mg" className={inputCls} style={inputStyle} />
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
            style={{ background: "linear-gradient(135deg, var(--color-accent-dark), #818CF8)", fontFamily: "var(--font-heading)" }}>
            {isWriting ? "Confirm in wallet…" : submitting ? "Submitting…" : <> Submit Medication Concern <ArrowRight className="w-4 h-4" /> </>}
          </button>
        </form>
      </main>
    </>
  );
}
