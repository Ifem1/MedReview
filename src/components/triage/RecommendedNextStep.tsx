import { ArrowRight, Heart } from "lucide-react";

interface Props {
  step: string;
  selfCare: string[];
}

export default function RecommendedNextStep({ step, selfCare }: Props) {
  return (
    <div
      className="rounded-xl border p-5"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <ArrowRight className="w-4 h-4" style={{ color: "var(--color-teal)" }} />
        <p
          className="text-sm font-semibold"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}
        >
          Recommended Next Step
        </p>
      </div>
      <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--color-ink-secondary)" }}>
        {step}
      </p>

      {selfCare.length > 0 && (
        <>
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-3.5 h-3.5" style={{ color: "var(--color-teal)" }} />
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-ink-muted)" }}>
              General Self-Care
            </p>
          </div>
          <ul className="space-y-1">
            {selfCare.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm" style={{ color: "var(--color-ink-secondary)" }}>
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "var(--color-teal)" }} />
                {item}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
