"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import ClinicalHeader from "@/components/layout/ClinicalHeader";
import SafetyNotice from "@/components/triage/SafetyNotice";
import SeveritySlider from "@/components/review/SeveritySlider";
import LoadingReviewState from "@/components/ui/LoadingReviewState";
import { generateFollowUpId } from "@/lib/utils";
import { useSubmitReview } from "@/hooks/useSubmitReview";
import { RefreshCw, Plus, X, ArrowRight, CheckCircle, Home } from "lucide-react";
import Link from "next/link";

const CHANGE_OPTIONS = [
  { value: "better", label: "Better", color: "#16A34A" },
  { value: "same", label: "Same", color: "#F59E0B" },
  { value: "worse", label: "Worse", color: "#EA580C" },
  { value: "new_symptoms", label: "New symptoms appeared", color: "#DC2626" },
] as const;

export default function FollowUpPage() {
  const { reviewId } = useParams<{ reviewId: string }>();
  const router = useRouter();
  const { address } = useAccount();

  const { submitReview, isWriting } = useSubmitReview();
  const [symptomChange, setSymptomChange] = useState<"better" | "same" | "worse" | "new_symptoms">("same");
  const [newSymptomInput, setNewSymptomInput] = useState("");
  const [newSymptoms, setNewSymptoms] = useState<string[]>([]);
  const [severity, setSeverity] = useState(5);
  const [freeText, setFreeText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function addNewSymptom() {
    const t = newSymptomInput.trim();
    if (t && !newSymptoms.includes(t)) setNewSymptoms([...newSymptoms, t]);
    setNewSymptomInput("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!freeText.trim()) { setError("Please describe the current symptom status."); return; }
    setError(""); setSubmitting(true);

    const followupId = generateFollowUpId();
    const followupPayload = {
      followup_id: followupId,
      review_id: reviewId,
      user_address: address || "0x0000",
      symptom_change: symptomChange,
      new_symptoms: newSymptoms,
      resolved_symptoms: [],
      current_severity: severity,
      free_text: freeText,
      created_at: new Date().toISOString(),
    };

    try {
      const res = await fetch(`/api/reviews/${reviewId}/follow-up`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followupPayload, walletAddress: address }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");

      await submitReview("submit_follow_up", [reviewId, followupId, JSON.stringify(followupPayload)]);

      // Show success — do not navigate back to old review (its result is unrelated to this follow-up)
      setSubmitted(true);
      setSubmitting(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Submission failed.");
      setSubmitting(false);
    }
  }

  if (submitting && !isWriting) return (
    <><ClinicalHeader />
    <main className="max-w-2xl mx-auto px-4 py-12"><LoadingReviewState message="Submitting follow-up to GenLayer…" /></main></>
  );

  if (submitted) return (
    <>
      <ClinicalHeader />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: "#DCFCE7" }}>
          <CheckCircle className="w-8 h-8" style={{ color: "#16A34A" }} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold mb-2" style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}>Follow-up Submitted</h1>
          <p className="text-sm" style={{ color: "var(--color-ink-secondary)" }}>
            Your follow-up has been recorded on GenLayer. The AI triage contract will process it — results appear in your history once the contract finalises (typically 1–3 minutes).
          </p>
        </div>
        <div className="rounded-xl px-4 py-3 text-sm text-left" style={{ backgroundColor: "var(--color-surface-soft)", border: "1px solid var(--color-border)", color: "var(--color-ink-secondary)" }}>
          Your follow-up result will appear in your review history once the AI has finished processing — this usually takes 1–3 minutes. You do not need to do anything else.
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard" className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold"
            style={{ backgroundColor: "var(--color-teal)" }}>
            <Home className="w-4 h-4" /> Go to Dashboard
          </Link>
          <Link href={`/review/${reviewId}`} className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold border"
            style={{ borderColor: "var(--color-border)", color: "var(--color-ink-secondary)" }}>
            View Original Review
          </Link>
        </div>
      </main>
    </>
  );

  return (
    <>
      <ClinicalHeader />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--color-surface-soft)" }}>
            <RefreshCw className="w-4 h-4" style={{ color: "var(--color-teal)" }} />
          </div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}>Follow-up Review</h1>
        </div>
        <p className="text-sm font-mono" style={{ color: "var(--color-ink-muted)" }}>Original review: {reviewId}</p>

        <SafetyNotice />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>How have your symptoms changed?</label>
            <div className="flex flex-wrap gap-2">
              {CHANGE_OPTIONS.map((opt) => (
                <button key={opt.value} type="button" onClick={() => setSymptomChange(opt.value)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold border transition-colors"
                  style={
                    symptomChange === opt.value
                      ? { backgroundColor: opt.color, borderColor: opt.color, color: "#fff" }
                      : { backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", color: "var(--color-ink-secondary)" }
                  }>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {(symptomChange === "worse" || symptomChange === "new_symptoms") && (
            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>New symptoms (if any)</label>
              <div className="flex gap-2">
                <input type="text" value={newSymptomInput} onChange={(e) => setNewSymptomInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addNewSymptom(); } }}
                  placeholder="e.g. difficulty breathing" className="flex-1 text-sm px-3 py-2.5 rounded-lg border outline-none"
                  style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)", color: "var(--color-ink)" }} />
                <button type="button" onClick={addNewSymptom} className="px-3 py-2.5 rounded-lg text-white" style={{ backgroundColor: "var(--color-teal)" }}>
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {newSymptoms.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {newSymptoms.map(s => (
                    <span key={s} className="inline-flex items-center gap-1 text-sm px-3 py-1 rounded-full" style={{ backgroundColor: "#FEE2E2", color: "#B91C1C" }}>
                      {s} <button type="button" onClick={() => setNewSymptoms(newSymptoms.filter(x => x !== s))}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          <SeveritySlider value={severity} onChange={setSeverity} />

          <div className="space-y-1">
            <label className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>Describe the current situation <span style={{ color: "var(--color-emergency-red)" }}>*</span></label>
            <textarea rows={4} value={freeText} onChange={(e) => setFreeText(e.target.value)}
              placeholder="Describe how you are feeling now compared to before…"
              className="w-full text-sm px-3 py-2.5 rounded-lg border outline-none resize-none"
              style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)", color: "var(--color-ink)" }} />
          </div>

          {error && <p className="text-sm" style={{ color: "var(--color-emergency-red)" }}>{error}</p>}

          <div className="rounded-xl px-4 py-3 flex items-start gap-2.5 text-sm" style={{ backgroundColor: "var(--color-surface-soft)", border: "1px solid var(--color-border)" }}>
            <span className="text-base shrink-0">⛓️</span>
            <p style={{ color: "var(--color-ink-secondary)" }}>
              <strong style={{ color: "var(--color-ink)" }}>Submitted on GenLayer.</strong>{" "}
              Your wallet will prompt to sign — this triggers the AI follow-up triage.
            </p>
          </div>

          <button type="submit" disabled={submitting || isWriting}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ backgroundColor: "var(--color-teal)", fontFamily: "var(--font-heading)" }}>
            {isWriting ? "Confirm in wallet…" : submitting ? "Submitting…" : <> Submit Follow-up to GenLayer <ArrowRight className="w-4 h-4" /> </>}
          </button>
        </form>
      </main>
    </>
  );
}
