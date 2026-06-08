import { ClipboardList } from "lucide-react";
import Link from "next/link";

interface Props {
  message?: string;
}

export default function EmptyHealthState({ message }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-5 text-center">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ backgroundColor: "var(--color-surface-soft)" }}
      >
        <ClipboardList className="w-7 h-7" style={{ color: "var(--color-ink-muted)" }} />
      </div>
      <div>
        <p
          className="text-lg font-semibold"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}
        >
          No reviews yet
        </p>
        <p className="text-sm mt-1 max-w-sm" style={{ color: "var(--color-ink-secondary)" }}>
          {message || "Start a triage review to receive structured health guidance."}
        </p>
      </div>
      <Link
        href="/review"
        className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
        style={{ backgroundColor: "var(--color-teal)", fontFamily: "var(--font-heading)" }}
      >
        Start a Review
      </Link>
    </div>
  );
}
