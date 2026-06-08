import { Shield } from "lucide-react";

export default function SafetyNotice() {
  return (
    <div
      className="rounded-xl border p-4 flex gap-3"
      style={{
        backgroundColor: "var(--color-surface-soft)",
        borderColor: "var(--color-border)",
      }}
    >
      <Shield className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "var(--color-accent-dark)" }} />
      <div className="text-sm" style={{ color: "var(--color-ink-secondary)" }}>
        <p className="font-semibold mb-1" style={{ color: "var(--color-ink)" }}>
          Healthcare Safety Notice
        </p>
        <p>
          MedReview provides AI-assisted triage guidance only. It does not provide a
          medical diagnosis, prescription, or emergency service. If symptoms are severe,
          sudden, worsening, or life-threatening,{" "}
          <strong>seek emergency medical care immediately.</strong>
        </p>
      </div>
    </div>
  );
}
