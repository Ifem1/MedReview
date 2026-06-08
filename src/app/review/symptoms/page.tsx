"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import ClinicalHeader from "@/components/layout/ClinicalHeader";
import EmergencyBanner from "@/components/layout/EmergencyBanner";
import SafetyNotice from "@/components/triage/SafetyNotice";
import SeveritySlider from "@/components/review/SeveritySlider";
import DurationPicker from "@/components/review/DurationPicker";
import RiskContextPanel from "@/components/review/RiskContextPanel";
import LoadingReviewState from "@/components/ui/LoadingReviewState";
import { detectEmergencyKeywords, generateReviewId } from "@/lib/utils";
import { Activity, Plus, X, AlertTriangle, ArrowRight } from "lucide-react";
import { useSubmitReview } from "@/hooks/useSubmitReview";

const inputCls = [
  "w-full text-sm px-3.5 py-2.5 rounded-xl border outline-none transition-all",
  "focus:ring-2 focus:ring-[var(--color-accent-dark)] focus:border-[var(--color-accent-dark)]",
].join(" ");
const inputStyle = {
  borderColor: "var(--color-border)",
  backgroundColor: "var(--color-surface)",
  color: "var(--color-ink)",
};

export default function SymptomReviewPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { submitReview, isWriting } = useSubmitReview();

  const [title, setTitle] = useState("");
  const [freeText, setFreeText] = useState("");
  const [symptomInput, setSymptomInput] = useState("");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [duration, setDuration] = useState("");
  const [severity, setSeverity] = useState(5);
  const [location, setLocation] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [sex, setSex] = useState("Prefer not to say");
  const [existingConditions, setExistingConditions] = useState("");
  const [medications, setMedications] = useState("");
  const [allergies, setAllergies] = useState("");
  const [countryContext, setCountryContext] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const emergencyDetected =
    detectEmergencyKeywords(freeText) ||
    symptoms.some((s) => detectEmergencyKeywords(s));

  function addSymptom() {
    const trimmed = symptomInput.trim();
    if (trimmed && !symptoms.includes(trimmed)) {
      setSymptoms([...symptoms, trimmed]);
    }
    setSymptomInput("");
  }

  function removeSymptom(s: string) {
    setSymptoms(symptoms.filter((x) => x !== s));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!freeText.trim() && symptoms.length === 0) {
      setError("Please describe your symptoms or add at least one symptom.");
      return;
    }
    setError("");
    setSubmitting(true);

    const reviewId = generateReviewId();
    const reviewPayload = {
      review_id: reviewId,
      user_address: address || "0x0000",
      review_type: "symptom",
      title: title || "Symptom Review",
      age_range: ageRange,
      sex,
      pregnancy_status: "not_applicable",
      symptoms,
      duration,
      severity,
      location,
      associated_symptoms: [],
      existing_conditions: existingConditions ? existingConditions.split(",").map((s) => s.trim()) : [],
      medications: medications ? medications.split(",").map((s) => s.trim()) : [],
      allergies: allergies ? allergies.split(",").map((s) => s.trim()) : [],
      free_text: freeText,
      country_context: countryContext,
      status: "submitted",
      created_at: new Date().toISOString(),
      reviewed_at: "",
    };

    try {
      // Step 1: save to Supabase off-chain index
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewPayload, walletAddress: address }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");

      // Step 2: write to GenLayer via connected wallet (MetaMask signs)
      const txHash = await submitReview(
        "submit_symptom_review",
        [reviewId, JSON.stringify(reviewPayload)]
      );

      // Step 3: fire async server-side result polling (don't await)
      fetch("/api/genlayer/sync-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewPayload, walletAddress: address, txHash }),
      }).catch(() => {});

      // Step 4: go to result page immediately — it will poll until ready
      router.push(`/review/${data.reviewId}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Submission failed. Please try again.");
      setSubmitting(false);
    }
  }

  if (submitting && !isWriting) {
    return (
      <>
        <ClinicalHeader />
        <main className="max-w-2xl mx-auto px-5 sm:px-8 py-12">
          <LoadingReviewState message="Submitting to GenLayer for triage review…" />
        </main>
      </>
    );
  }

  return (
    <>
      <ClinicalHeader />
      <main className="max-w-2xl mx-auto px-5 sm:px-8 py-12 space-y-6">

        {/* Page header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, var(--color-accent-dark), #818CF8)" }}
            >
              <Activity className="w-4 h-4 text-white" />
            </div>
            <h1
              className="text-2xl font-extrabold"
              style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}
            >
              Symptom Review
            </h1>
          </div>
          <p className="text-sm" style={{ color: "var(--color-ink-secondary)" }}>
            Describe your symptoms for GenLayer triage review. Do not submit if this is an emergency.
          </p>
        </div>

        {emergencyDetected && <EmergencyBanner inline />}

        {!isConnected && (
          <div
            className="rounded-xl border p-4 flex items-start gap-3 text-sm"
            style={{ backgroundColor: "#FFFBEB", borderColor: "#FCD34D" }}
          >
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#D97706" }} />
            <span style={{ color: "#92400E" }}>
              Connect your wallet to submit a review and save your history.
            </span>
          </div>
        )}

        <SafetyNotice />

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Section: Core details */}
          <div
            className="rounded-2xl p-5 space-y-5"
            style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}
          >
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-ink-muted)" }}>Symptom Details</p>

            {/* Title */}
            <div className="space-y-1">
              <label className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>
                Review Title <span style={{ color: "var(--color-ink-light)" }}>(optional)</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Fever and sore throat for two days"
                className={inputCls}
                style={inputStyle}
              />
            </div>

            {/* Symptoms tags */}
            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>Symptoms</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={symptomInput}
                  onChange={(e) => setSymptomInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSymptom(); } }}
                  placeholder="e.g. fever, sore throat, headache"
                  className={inputCls + " flex-1"}
                  style={inputStyle}
                />
                <button
                  type="button"
                  onClick={addSymptom}
                  className="px-3.5 py-2.5 rounded-xl text-white font-bold transition-opacity hover:opacity-85"
                  style={{ background: "linear-gradient(135deg, var(--color-accent-dark), #818CF8)" }}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {symptoms.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {symptoms.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-full"
                      style={{ backgroundColor: "var(--color-accent)", color: "var(--color-accent-deeper)" }}
                    >
                      {s}
                      <button type="button" onClick={() => removeSymptom(s)} className="hover:opacity-70">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Free text */}
            <div className="space-y-1">
              <label className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>
                Describe symptoms in detail <span style={{ color: "var(--color-emergency-red)" }}>*</span>
              </label>
              <textarea
                rows={5}
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                placeholder="Onset, progression, what makes it better or worse, associated symptoms…"
                className={inputCls + " resize-none"}
                style={inputStyle}
              />
            </div>

            {/* Location */}
            <div className="space-y-1">
              <label className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>
                Location of symptoms <span style={{ color: "var(--color-ink-light)" }}>(optional)</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. throat, chest, abdomen, left knee"
                className={inputCls}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Duration & Severity */}
          <div
            className="rounded-2xl p-5 space-y-5"
            style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}
          >
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-ink-muted)" }}>Duration &amp; Severity</p>
            <DurationPicker value={duration} onChange={setDuration} />
            <SeveritySlider value={severity} onChange={setSeverity} />
          </div>

          {/* Risk context */}
          <div
            className="rounded-2xl p-5 space-y-4"
            style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}
          >
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-ink-muted)" }}>Patient Context</p>
            <RiskContextPanel
              ageRange={ageRange}
              onAgeChange={setAgeRange}
              sex={sex}
              onSexChange={setSex}
              existingConditions={existingConditions}
              onConditionsChange={setExistingConditions}
              medications={medications}
              onMedicationsChange={setMedications}
              allergies={allergies}
              onAllergiesChange={setAllergies}
              countryContext={countryContext}
              onCountryChange={setCountryContext}
            />
          </div>

          {error && (
            <p className="text-sm font-semibold" style={{ color: "var(--color-emergency-red)" }}>
              {error}
            </p>
          )}

          {/* On-chain notice */}
          <div
            className="rounded-xl px-4 py-3 flex items-start gap-2.5 text-sm"
            style={{ backgroundColor: "var(--color-surface-soft)", border: "1px solid var(--color-border)" }}
          >
            <span className="text-base shrink-0">⛓️</span>
            <p style={{ color: "var(--color-ink-secondary)" }}>
              <strong style={{ color: "var(--color-ink)" }}>This review is submitted on GenLayer.</strong>{" "}
              Your wallet will show a <em>Send Transaction</em> prompt — this is expected.
              The AI triage runs through an intelligent contract, not a regular API call.
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting || isWriting}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base text-white transition-all hover:scale-[1.01] hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
            style={{ background: "linear-gradient(135deg, var(--color-accent-dark) 0%, #818CF8 100%)", fontFamily: "var(--font-heading)" }}
          >
            {isWriting
              ? "Confirm in wallet to submit on GenLayer…"
              : submitting
              ? "Submitting review on GenLayer…"
              : <> Submit Review on GenLayer <ArrowRight className="w-4 h-4" /> </>
            }
          </button>

          <p className="text-xs text-center" style={{ color: "var(--color-ink-light)" }}>
            By submitting you confirm this is not an emergency and you understand
            MedReview provides triage guidance only.
          </p>
        </form>
      </main>
    </>
  );
}
