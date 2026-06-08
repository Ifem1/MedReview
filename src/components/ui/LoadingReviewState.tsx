import { Activity, CheckCircle, Loader2 } from "lucide-react";

type Step = "submitting" | "waiting" | "fetching" | "generic";

interface Props {
  message?: string;
  step?: Step;
  elapsed?: number; // seconds
}

const STEPS: { key: Step; label: string; sub: string }[] = [
  { key: "submitting", label: "Submitting review on GenLayer",        sub: "Waiting for wallet confirmation…"          },
  { key: "waiting",    label: "Waiting for AI triage review",          sub: "GenLayer is running the intelligent contract…" },
  { key: "fetching",   label: "Fetching triage result",                sub: "Reading result from the contract…"         },
];

export default function LoadingReviewState({ message, step = "generic", elapsed = 0 }: Props) {
  const currentIdx = STEPS.findIndex((s) => s.key === step);

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-8 animate-fadeIn">

      {/* Animated icon */}
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, var(--color-accent-dark), #818CF8)" }}
      >
        <Activity className="w-8 h-8 text-white animate-pulse" />
      </div>

      {/* Step tracker — only shown when step is explicit */}
      {step !== "generic" && (
        <div className="w-full max-w-sm space-y-2">
          {STEPS.map((s, i) => {
            const done    = i < currentIdx;
            const active  = i === currentIdx;
            const pending = i > currentIdx;
            return (
              <div
                key={s.key}
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{
                  backgroundColor: active
                    ? "var(--color-surface)"
                    : "transparent",
                  border: active
                    ? "1px solid var(--color-border)"
                    : "1px solid transparent",
                  boxShadow: active ? "var(--shadow-card)" : "none",
                  opacity: pending ? 0.4 : 1,
                }}
              >
                {done ? (
                  <CheckCircle className="w-4 h-4 shrink-0" style={{ color: "var(--color-urgency-green)" }} />
                ) : active ? (
                  <Loader2 className="w-4 h-4 shrink-0 animate-spin" style={{ color: "var(--color-accent-dark)" }} />
                ) : (
                  <div className="w-4 h-4 shrink-0 rounded-full border-2" style={{ borderColor: "var(--color-border)" }} />
                )}
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: active ? "var(--color-ink)" : "var(--color-ink-secondary)", fontFamily: "var(--font-heading)" }}
                  >
                    {s.label}
                  </p>
                  {active && (
                    <p className="text-xs mt-0.5" style={{ color: "var(--color-ink-muted)" }}>
                      {s.sub}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Fallback / override message */}
      <div className="text-center">
        <p className="text-base font-semibold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}>
          {message || (step !== "generic"
            ? STEPS[Math.max(0, currentIdx)]?.label
            : "GenLayer is reviewing…")}
        </p>
        <p className="text-sm mt-1" style={{ color: "var(--color-ink-muted)" }}>
          {elapsed > 0
            ? `${elapsed}s elapsed — GenLayer AI review in progress. Do not close this tab.`
            : "This review is submitted on GenLayer. Do not close this tab."}
        </p>
      </div>

      {/* Dots */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full animate-bounce"
            style={{ backgroundColor: "var(--color-accent-dark)", animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
