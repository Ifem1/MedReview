import { Eye } from "lucide-react";

interface Props {
  items: string[];
}

export default function MonitorList({ items }: Props) {
  if (!items.length) return null;
  return (
    <div
      className="rounded-xl border p-5"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Eye className="w-4 h-4" style={{ color: "var(--color-teal)" }} />
        <p
          className="text-sm font-semibold"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}
        >
          What to Monitor
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map((item) => (
          <div
            key={item}
            className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg"
            style={{ backgroundColor: "var(--color-surface-soft)", color: "var(--color-ink-secondary)" }}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: "var(--color-soon-amber)" }}
            />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
