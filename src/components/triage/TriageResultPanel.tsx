"use client";

import { TriageResult } from "@/types/medreview";
import UrgencyBadge from "./UrgencyBadge";
import NotDiagnosisNotice from "./NotDiagnosisNotice";
import EmergencyBanner from "@/components/layout/EmergencyBanner";
import PossibleConditionsPanel from "./PossibleConditionsPanel";
import RecommendedNextStep from "./RecommendedNextStep";
import MonitorList from "./MonitorList";
import DoctorQuestionsPanel from "./DoctorQuestionsPanel";
import RedFlagChecklist from "./RedFlagChecklist";
import { AlertTriangle, Brain, TrendingUp } from "lucide-react";

interface Props {
  result: TriageResult;
}

export default function TriageResultPanel({ result }: Props) {
  const isEmergency = result.urgencyLevel === "EMERGENCY";

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Emergency banner dominates */}
      {isEmergency && (
        <EmergencyBanner
          message={
            result.summary ||
            "Emergency-level symptoms detected. Seek emergency care immediately."
          }
          inline
        />
      )}

      {/* Urgency header */}
      <div
        className="rounded-2xl border p-6"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
          boxShadow: "0 2px 8px var(--color-panel-shadow)",
        }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-3"
          style={{ color: "var(--color-ink-muted)" }}
        >
          Urgency Level
        </p>
        <UrgencyBadge level={result.urgencyLevel} size="lg" showDescription />
        <p
          className="mt-4 text-base leading-relaxed"
          style={{ color: "var(--color-ink-secondary)" }}
        >
          {result.summary}
        </p>
        {result.confidence < 0.6 && (
          <div
            className="mt-4 flex items-start gap-2 text-sm rounded-lg px-3 py-2 border"
            style={{ backgroundColor: "#FFFBEB", borderColor: "#FCD34D", color: "#92400E" }}
          >
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Confidence is low ({Math.round(result.confidence * 100)}%). Consider seeking
              professional review regardless of urgency level.
            </span>
          </div>
        )}
      </div>

      {/* Red flags */}
      {result.redFlagsPresent && result.redFlags.length > 0 && (
        <RedFlagChecklist flags={result.redFlags} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recommended next step */}
        <RecommendedNextStep
          step={result.recommendedNextStep}
          selfCare={result.selfCareGeneral}
        />

        {/* Possible conditions */}
        <PossibleConditionsPanel categories={result.possibleConditionCategories} />
      </div>

      {/* What to monitor */}
      <MonitorList items={result.whatToMonitor} />

      {/* Doctor questions */}
      <DoctorQuestionsPanel questions={result.questionsForDoctor} />

      {/* Reasoning */}
      {result.reasoning && (
        <div
          className="rounded-xl border p-5"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-4 h-4" style={{ color: "var(--color-teal)" }} />
            <p
              className="text-sm font-semibold"
              style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}
            >
              GenLayer Reasoning
            </p>
            <span
              className="text-xs px-2 py-0.5 rounded-full ml-auto"
              style={{ backgroundColor: "var(--color-mint)", color: "var(--color-teal)" }}
            >
              AI Review
            </span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--color-ink-secondary)" }}>
            {result.reasoning}
          </p>
        </div>
      )}

      {/* Confidence bar */}
      <div
        className="rounded-xl border p-4"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4" style={{ color: "var(--color-ink-muted)" }} />
          <p className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>
            Review Confidence
          </p>
          <span
            className="ml-auto text-sm font-bold"
            style={{ color: "var(--color-ink-secondary)" }}
          >
            {Math.round(result.confidence * 100)}%
          </span>
        </div>
        <div
          className="h-2 rounded-full overflow-hidden"
          style={{ backgroundColor: "var(--color-surface-soft)" }}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${Math.round(result.confidence * 100)}%`,
              backgroundColor:
                result.confidence >= 0.7
                  ? "var(--color-urgency-green)"
                  : result.confidence >= 0.5
                  ? "var(--color-soon-amber)"
                  : "var(--color-urgent-orange)",
            }}
          />
        </div>
      </div>

      <NotDiagnosisNotice />
    </div>
  );
}
