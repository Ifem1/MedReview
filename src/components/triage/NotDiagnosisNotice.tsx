import { Info } from "lucide-react";

export default function NotDiagnosisNotice() {
  return (
    <div
      className="rounded-xl border-2 p-4 flex gap-3"
      style={{ backgroundColor: "#EFF6FF", borderColor: "#BFDBFE" }}
    >
      <Info className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#1D4ED8" }} />
      <div className="text-sm" style={{ color: "#1E3A8A" }}>
        <p className="font-bold">This is not a diagnosis.</p>
        <p className="mt-0.5">
          Please consult a qualified healthcare professional. Seek emergency care if
          red-flag symptoms are present.
        </p>
      </div>
    </div>
  );
}
