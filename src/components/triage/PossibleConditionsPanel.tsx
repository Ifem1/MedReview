import { Tag } from "lucide-react";

interface Props {
  categories: string[];
}

export default function PossibleConditionsPanel({ categories }: Props) {
  return (
    <div
      className="rounded-xl border p-5"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Tag className="w-4 h-4" style={{ color: "var(--color-teal)" }} />
        <p
          className="text-sm font-semibold"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}
        >
          Possible Condition Categories
        </p>
      </div>
      <p className="text-xs mb-3" style={{ color: "var(--color-ink-muted)" }}>
        These are possible categories — not a diagnosis.
      </p>
      {categories.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--color-ink-muted)" }}>
          No categories identified.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <span
              key={cat}
              className="text-xs px-3 py-1.5 rounded-full font-medium border"
              style={{
                backgroundColor: "var(--color-surface-soft)",
                borderColor: "var(--color-border)",
                color: "var(--color-ink-secondary)",
              }}
            >
              {cat}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
