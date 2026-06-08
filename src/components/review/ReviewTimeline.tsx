import { ReviewRow } from "@/types/medreview";
import { formatDate } from "@/lib/utils";
import UrgencyBadge from "@/components/triage/UrgencyBadge";
import { CheckCircle, Clock, AlertCircle, Archive, Activity } from "lucide-react";

interface Props {
  reviews: ReviewRow[];
}

const statusIcon: Record<string, React.ReactNode> = {
  created: <Clock className="w-4 h-4" />,
  submitted: <Activity className="w-4 h-4" />,
  reviewing: <Activity className="w-4 h-4 animate-pulse" />,
  reviewed: <CheckCircle className="w-4 h-4" />,
  follow_up_submitted: <Activity className="w-4 h-4" />,
  follow_up_reviewed: <CheckCircle className="w-4 h-4" />,
  flagged_emergency: <AlertCircle className="w-4 h-4" />,
  archived: <Archive className="w-4 h-4" />,
};

export default function ReviewTimeline({ reviews }: Props) {
  if (!reviews.length) return null;
  return (
    <div className="space-y-3">
      {reviews.map((r, i) => (
        <div key={r.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{
                backgroundColor: r.urgency_level
                  ? r.urgency_level === "EMERGENCY" ? "#FEE2E2" : "var(--color-surface-soft)"
                  : "var(--color-surface-soft)",
                color: r.urgency_level === "EMERGENCY"
                  ? "var(--color-emergency-red)"
                  : "var(--color-teal)",
              }}
            >
              {statusIcon[r.status] || <Clock className="w-4 h-4" />}
            </div>
            {i < reviews.length - 1 && (
              <div className="w-px flex-1 mt-1" style={{ backgroundColor: "var(--color-border)" }} />
            )}
          </div>
          <div className="pb-4 min-w-0">
            <p
              className="font-medium text-sm"
              style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}
            >
              {r.title || "Review"}
            </p>
            <p className="text-xs" style={{ color: "var(--color-ink-muted)" }}>
              {formatDate(r.created_at)} · {r.status.replace(/_/g, " ")}
            </p>
            {r.urgency_level && (
              <div className="mt-1.5">
                <UrgencyBadge level={r.urgency_level} size="sm" />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
