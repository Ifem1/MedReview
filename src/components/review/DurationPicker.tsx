"use client";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

const OPTIONS = [
  "Less than 1 hour",
  "A few hours",
  "1 day",
  "2-3 days",
  "4-7 days",
  "1-2 weeks",
  "2-4 weeks",
  "More than a month",
  "Chronic / ongoing",
];

export default function DurationPicker({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>
        How long have you had these symptoms?
      </label>
      <div className="flex flex-wrap gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className="text-sm px-3 py-1.5 rounded-full border transition-colors"
            style={
              value === opt
                ? {
                    backgroundColor: "var(--color-teal)",
                    borderColor: "var(--color-teal)",
                    color: "#fff",
                  }
                : {
                    backgroundColor: "var(--color-surface)",
                    borderColor: "var(--color-border)",
                    color: "var(--color-ink-secondary)",
                  }
            }
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
