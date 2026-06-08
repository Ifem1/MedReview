import { DashboardStats as Stats } from "@/types/medreview";
import UrgencyBadge from "@/components/triage/UrgencyBadge";
import { ClipboardList, AlertTriangle, RefreshCw, FileText, Activity } from "lucide-react";

interface Props {
  stats: Stats;
}

export default function DashboardStatsPanel({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      <StatCard
        icon={<ClipboardList className="w-5 h-5" style={{ color: "var(--color-teal)" }} />}
        label="Total Reviews"
        value={stats.totalReviews}
      />
      <StatCard
        icon={<Activity className="w-5 h-5" style={{ color: "var(--color-calm-blue)" }} />}
        label="Symptom Reviews"
        value={stats.symptomReviews}
      />
      <StatCard
        icon={<FileText className="w-5 h-5" style={{ color: "var(--color-calm-blue)" }} />}
        label="Report Reviews"
        value={stats.reportReviews}
      />
      <StatCard
        icon={<RefreshCw className="w-5 h-5" style={{ color: "var(--color-soon-amber)" }} />}
        label="Open Follow-ups"
        value={stats.openFollowUps}
      />
      <StatCard
        icon={<AlertTriangle className="w-5 h-5" style={{ color: "var(--color-emergency-red)" }} />}
        label="Emergency Flags"
        value={stats.emergencyFlags}
        highlight={stats.emergencyFlags > 0}
      />
      {stats.latestUrgencyLevel && (
        <div
          className="col-span-2 sm:col-span-3 lg:col-span-5 rounded-xl border p-4"
          style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
        >
          <p className="text-xs font-medium mb-2" style={{ color: "var(--color-ink-muted)" }}>
            Latest Urgency
          </p>
          <UrgencyBadge level={stats.latestUrgencyLevel} showDescription />
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className="rounded-xl border p-4"
      style={{
        backgroundColor: highlight ? "#FEF2F2" : "var(--color-surface)",
        borderColor: highlight ? "#FCA5A5" : "var(--color-border)",
      }}
    >
      <div className="flex items-center gap-2 mb-2">{icon}</div>
      <p
        className="text-2xl font-bold"
        style={{
          fontFamily: "var(--font-heading)",
          color: highlight ? "var(--color-emergency-red)" : "var(--color-ink)",
        }}
      >
        {value}
      </p>
      <p className="text-xs mt-0.5" style={{ color: "var(--color-ink-muted)" }}>
        {label}
      </p>
    </div>
  );
}
