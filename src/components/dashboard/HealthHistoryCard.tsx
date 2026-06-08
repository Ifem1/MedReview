import { ReviewRow } from "@/types/medreview";
import UrgencyBadge from "@/components/triage/UrgencyBadge";
import { formatDate, truncate } from "@/lib/utils";
import Link from "next/link";
import { ChevronRight, AlertTriangle } from "lucide-react";

interface Props {
  review: ReviewRow;
}

const typeLabel: Record<string, string> = {
  symptom: "Symptom Review",
  report: "Report Review",
  medication_concern: "Medication Concern",
  follow_up: "Follow-up",
  child_symptom: "Child Symptom",
  pregnancy_concern: "Pregnancy Concern",
};

export default function HealthHistoryCard({ review }: Props) {
  return (
    <Link href={`/review/${review.genlayer_review_id}`}>
      <div
        className="rounded-2xl border p-5 sm:p-6 flex items-start gap-5 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: review.red_flags_present ? "#FCA5A5" : "var(--color-border)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div className="flex-1 min-w-0 space-y-2">
          {/* Type + red flags row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-xs px-3 py-1 rounded-full font-semibold"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "var(--color-accent-deeper)",
              }}
            >
              {typeLabel[review.review_type] || review.review_type}
            </span>
            {review.red_flags_present && (
              <span className="flex items-center gap-1 text-xs font-bold" style={{ color: "var(--color-emergency-red)" }}>
                <AlertTriangle className="w-3.5 h-3.5" /> Red Flags
              </span>
            )}
          </div>

          {/* Title */}
          <p
            className="font-bold text-base truncate"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}
          >
            {review.title || "Untitled Review"}
          </p>

          {/* Summary */}
          {review.summary && (
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-ink-secondary)" }}>
              {truncate(review.summary, 110)}
            </p>
          )}

          {/* Date */}
          <p className="text-xs font-medium" style={{ color: "var(--color-ink-muted)" }}>
            {formatDate(review.created_at)}
          </p>
        </div>

        {/* Right side */}
        <div className="flex flex-col items-end gap-3 shrink-0">
          {review.urgency_level && (
            <UrgencyBadge level={review.urgency_level} size="sm" />
          )}
          <ChevronRight className="w-5 h-5" style={{ color: "var(--color-ink-muted)" }} />
        </div>
      </div>
    </Link>
  );
}
