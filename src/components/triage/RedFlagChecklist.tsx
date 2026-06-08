import { AlertTriangle } from "lucide-react";

interface Props {
  flags: string[];
}

export default function RedFlagChecklist({ flags }: Props) {
  if (!flags.length) return null;
  return (
    <div
      className="rounded-xl border-2 p-5"
      style={{ backgroundColor: "#FEF2F2", borderColor: "#FCA5A5" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-4 h-4" style={{ color: "var(--color-emergency-red)" }} />
        <p
          className="text-sm font-bold"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-emergency-red)" }}
        >
          Red Flags Detected
        </p>
      </div>
      <p className="text-xs mb-3 font-medium" style={{ color: "#B91C1C" }}>
        Seek prompt medical attention if these symptoms are present.
      </p>
      <ul className="space-y-2">
        {flags.map((flag) => (
          <li key={flag} className="flex items-start gap-2 text-sm font-medium" style={{ color: "#991B1B" }}>
            <span className="mt-1.5 w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: "var(--color-emergency-red)" }} />
            {flag}
          </li>
        ))}
      </ul>
    </div>
  );
}
