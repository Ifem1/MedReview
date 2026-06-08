"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import ClinicalHeader from "@/components/layout/ClinicalHeader";
import TriageResultPanel from "@/components/triage/TriageResultPanel";
import GenLayerReviewProof from "@/components/proof/GenLayerReviewProof";
import LoadingReviewState from "@/components/ui/LoadingReviewState";
import ErrorSafetyState from "@/components/ui/ErrorSafetyState";
import EmergencyBanner from "@/components/layout/EmergencyBanner";
import { useTriageResult } from "@/hooks/useTriageResult";
import Link from "next/link";
import { RefreshCw, Download } from "lucide-react";

type LoadingStep = "submitting" | "waiting" | "fetching" | "generic";

export default function ReviewResultPage() {
  const { reviewId } = useParams<{ reviewId: string }>();
  const { result, proof, loading, error, retry } = useTriageResult(reviewId);

  const [loadingStep, setLoadingStep] = useState<LoadingStep>("submitting");
  const [elapsed, setElapsed]         = useState(0);
  const startTime = useRef(Date.now());

  // Elapsed timer
  useEffect(() => {
    if (!loading) return;
    const t = setInterval(() => setElapsed(Math.round((Date.now() - startTime.current) / 1000)), 1000);
    return () => clearInterval(t);
  }, [loading]);

  // Step progression based on elapsed time
  useEffect(() => {
    if (!loading) return;
    if (elapsed < 8)        setLoadingStep("submitting");
    else if (elapsed < 20)  setLoadingStep("waiting");
    else                    setLoadingStep("fetching");
  }, [elapsed, loading]);

  function handleRetry() {
    startTime.current = Date.now();
    setElapsed(0);
    retry();
  }

  return (
    <>
      <ClinicalHeader />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">

        {loading && (
          <LoadingReviewState step={loadingStep} elapsed={elapsed} />
        )}

        {!loading && error && (
          <>
            <ErrorSafetyState error={error} onRetry={handleRetry} />
            <div className="text-center pt-2">
              <p className="text-sm mb-3" style={{ color: "var(--color-ink-secondary)" }}>
                Had a previous result and want to submit a follow-up?
              </p>
              <Link
                href={`/review/${reviewId}/follow-up`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border transition-colors hover:bg-[var(--color-surface-soft)]"
                style={{ borderColor: "var(--color-border)", color: "var(--color-ink-secondary)" }}
              >
                <RefreshCw className="w-4 h-4" /> Submit Follow-up Anyway
              </Link>
            </div>
          </>
        )}

        {!loading && result && (
          <>
            {result.urgencyLevel === "EMERGENCY" && (
              <EmergencyBanner message={result.summary} inline />
            )}

            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--color-ink-muted)" }}>
                  Review ID
                </p>
                <p className="text-sm font-mono" style={{ color: "var(--color-ink-secondary)" }}>
                  {reviewId}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/review/${reviewId}/follow-up`}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors hover:bg-[var(--color-surface-soft)]"
                  style={{ borderColor: "var(--color-border)", color: "var(--color-ink-secondary)" }}
                >
                  <RefreshCw className="w-4 h-4" /> Submit Follow-up
                </Link>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors hover:bg-[var(--color-surface-soft)]"
                  style={{ borderColor: "var(--color-border)", color: "var(--color-ink-secondary)" }}
                >
                  <Download className="w-4 h-4" /> Export
                </button>
              </div>
            </div>

            <TriageResultPanel result={result} />
            <GenLayerReviewProof proof={proof} reviewId={reviewId} />
          </>
        )}
      </main>
    </>
  );
}
