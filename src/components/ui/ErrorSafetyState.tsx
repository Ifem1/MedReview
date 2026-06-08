import { AlertCircle, RefreshCw } from "lucide-react";

interface Props {
  error?: string;
  onRetry?: () => void;
}

export default function ErrorSafetyState({ error, onRetry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-5 text-center">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ backgroundColor: "#FEE2E2" }}
      >
        <AlertCircle className="w-7 h-7" style={{ color: "var(--color-emergency-red)" }} />
      </div>
      <div>
        <p
          className="text-lg font-semibold"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}
        >
          Something went wrong
        </p>
        <p className="text-sm mt-1 max-w-sm" style={{ color: "var(--color-ink-secondary)" }}>
          {error || "An unexpected error occurred. Please try again."}
        </p>
        <p className="text-xs mt-2" style={{ color: "var(--color-ink-muted)" }}>
          If you are experiencing a medical emergency, do not wait — seek emergency care.
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-white"
          style={{ backgroundColor: "var(--color-teal)" }}
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      )}
    </div>
  );
}
