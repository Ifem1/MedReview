"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import ClinicalHeader from "@/components/layout/ClinicalHeader";
import SafetyNotice from "@/components/triage/SafetyNotice";
import LoadingReviewState from "@/components/ui/LoadingReviewState";
import { generateReviewId } from "@/lib/utils";
import { useSubmitReview } from "@/hooks/useSubmitReview";
import { FileText, ArrowRight, AlertTriangle } from "lucide-react";

const REPORT_KINDS = ["lab_result","scan_report","discharge_note","medical_letter","prescription","other"];
const AGE_RANGES = ["Under 18","18–24","25–34","35–44","45–54","55–64","65–74","75+"];

const inputCls = "w-full text-sm px-3.5 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-[var(--color-accent-dark)]";
const inputStyle = { borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)", color: "var(--color-ink)" };

export default function ReportReviewPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { submitReview, isWriting } = useSubmitReview();

  const [title, setTitle]               = useState("");
  const [reportKind, setReportKind]     = useState("lab_result");
  const [reportText, setReportText]     = useState("");
  const [userQuestion, setUserQuestion] = useState("");
  const [knownDiagnosis, setKnownDiagnosis] = useState("");
  const [ageRange, setAgeRange]         = useState("");
  const [existingConditions, setExistingConditions] = useState("");
  const [medications, setMedications]   = useState("");
  const [submitting, setSubmitting]     = useState(false);
  const [error, setError]               = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reportText.trim()) { setError("Please paste or describe your report content."); return; }
    setError("");
    setSubmitting(true);

    const reviewId = generateReviewId();
    const reviewPayload = {
      review_id: reviewId,
      user_address: address || "0x0000",
      review_type: "report",
      title: title || "Report Review",
      report_kind: reportKind,
      report_text: reportText,
      user_question: userQuestion,
      known_diagnosis: knownDiagnosis,
      age_range: ageRange,
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

  if (submitting && !isWriting) {
    return (<><ClinicalHeader /><main className="max-w-2xl mx-auto px-5 py-12"><LoadingReviewState message="Submitting report to GenLayer…" /></main></>);
  }

  return (
    <>
      <ClinicalHeader />
      <main className="max-w-2xl mx-auto px-5 sm:px-8 py-12 space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--color-accent-dark), #818CF8)" }}>
              <FileText className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}>Report Review</h1>
          </div>
          <p className="text-sm" style={{ color: "var(--color-ink-secondary)" }}>
            Paste or summarise a lab result, scan report, discharge note, or medical letter for GenLayer triage review.
          </p>
        </div>

        {!isConnected && (
          <div className="rounded-xl border p-4 flex items-start gap-3 text-sm" style={{ backgroundColor: "#FFFBEB", borderColor: "#FCD34D" }}>
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#D97706" }} />
            <span style={{ color: "#92400E" }}>Connect your wallet to submit on GenLayer and save history.</span>
          </div>
        )}

        <SafetyNotice />

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Report Details */}
          <div className="rounded-2xl p-5 space-y-5" style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-ink-muted)" }}>Report Details</p>

            <div className="space-y-1">
              <label className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>Title <span style={{ color: "var(--color-ink-light)" }}>(optional)</span></label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Blood test result — elevated glucose" className={inputCls} style={inputStyle} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>Report Type</label>
              <div className="flex flex-wrap gap-2">
                {REPORT_KINDS.map(k => (
                  <button key={k} type="button" onClick={() => setReportKind(k)}
                    className="text-xs px-3 py-1.5 rounded-full border font-medium transition-colors capitalize"
                    style={reportKind === k
                      ? { backgroundColor: "var(--color-accent-dark)", borderColor: "var(--color-accent-dark)", color: "#fff" }
                      : { backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", color: "var(--color-ink-secondary)" }}>
                    {k.replace(/_/g, " ")}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>Report Content <span style={{ color: "var(--color-emergency-red)" }}>*</span></label>
              <p className="text-xs" style={{ color: "var(--color-ink-muted)" }}>Paste the report text or write a clear summary. Remove personal identifiers if preferred.</p>
              <textarea rows={7} value={reportText} onChange={e => setReportText(e.target.value)}
                placeholder="Paste or summarise your report here…"
                className={inputCls + " resize-none"} style={inputStyle} />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>Your Question <span style={{ color: "var(--color-ink-light)" }}>(optional)</span></label>
              <input type="text" value={userQuestion} onChange={e => setUserQuestion(e.target.value)}
                placeholder="e.g. What does this result mean and how urgent is it?" className={inputCls} style={inputStyle} />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>Known Diagnosis <span style={{ color: "var(--color-ink-light)" }}>(if any)</span></label>
              <input type="text" value={knownDiagnosis} onChange={e => setKnownDiagnosis(e.target.value)}
                placeholder="e.g. Type 2 diabetes — leave blank if none" className={inputCls} style={inputStyle} />
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
              <label className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>Existing Conditions <span style={{ color: "var(--color-ink-light)" }}>(optional)</span></label>
              <input type="text" value={existingConditions} onChange={e => setExistingConditions(e.target.value)}
                placeholder="e.g. hypertension, diabetes" className={inputCls} style={inputStyle} />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>Current Medications <span style={{ color: "var(--color-ink-light)" }}>(optional)</span></label>
              <input type="text" value={medications} onChange={e => setMedications(e.target.value)}
                placeholder="e.g. metformin 500mg, amlodipine 5mg" className={inputCls} style={inputStyle} />
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
            {isWriting ? "Confirm in wallet…" : submitting ? "Submitting…" : <> Submit Report on GenLayer <ArrowRight className="w-4 h-4" /> </>}
          </button>
          <p className="text-xs text-center" style={{ color: "var(--color-ink-light)" }}>MedReview explains reports — it does not diagnose based on them.</p>
        </form>
      </main>
    </>
  );
}
