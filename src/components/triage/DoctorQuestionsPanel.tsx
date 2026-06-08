import { MessageSquare } from "lucide-react";

interface Props {
  questions: string[];
}

export default function DoctorQuestionsPanel({ questions }: Props) {
  if (!questions.length) return null;
  return (
    <div
      className="rounded-xl border p-5"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="w-4 h-4" style={{ color: "var(--color-teal)" }} />
        <p
          className="text-sm font-semibold"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}
        >
          Questions to Ask Your Clinician
        </p>
      </div>
      <ul className="space-y-2">
        {questions.map((q, i) => (
          <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "var(--color-ink-secondary)" }}>
            <span
              className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5"
              style={{ backgroundColor: "var(--color-teal)" }}
            >
              {i + 1}
            </span>
            {q}
          </li>
        ))}
      </ul>
    </div>
  );
}
