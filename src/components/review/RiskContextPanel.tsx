"use client";

interface Props {
  ageRange: string;
  onAgeChange: (v: string) => void;
  sex: string;
  onSexChange: (v: string) => void;
  existingConditions: string;
  onConditionsChange: (v: string) => void;
  medications: string;
  onMedicationsChange: (v: string) => void;
  allergies: string;
  onAllergiesChange: (v: string) => void;
  countryContext: string;
  onCountryChange: (v: string) => void;
}

const AGE_RANGES = ["Under 5", "5-12", "13-17", "18-24", "25-34", "35-44", "45-54", "55-64", "65-74", "75+"];
const SEX_OPTIONS = ["Prefer not to say", "Male", "Female", "Non-binary/Other"];

export default function RiskContextPanel({
  ageRange, onAgeChange, sex, onSexChange,
  existingConditions, onConditionsChange,
  medications, onMedicationsChange,
  allergies, onAllergiesChange,
  countryContext, onCountryChange,
}: Props) {
  return (
    <div className="space-y-5">
      <p
        className="text-xs font-semibold uppercase tracking-widest"
        style={{ color: "var(--color-ink-muted)" }}
      >
        Optional Context (improves triage accuracy)
      </p>

      {/* Age range */}
      <div className="space-y-2">
        <label className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>
          Age Range
        </label>
        <div className="flex flex-wrap gap-2">
          {AGE_RANGES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onAgeChange(r)}
              className="text-xs px-3 py-1.5 rounded-full border transition-colors"
              style={
                ageRange === r
                  ? { backgroundColor: "var(--color-teal)", borderColor: "var(--color-teal)", color: "#fff" }
                  : { backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", color: "var(--color-ink-secondary)" }
              }
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Sex */}
      <div className="space-y-2">
        <label className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>
          Biological Sex
        </label>
        <div className="flex flex-wrap gap-2">
          {SEX_OPTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSexChange(s)}
              className="text-xs px-3 py-1.5 rounded-full border transition-colors"
              style={
                sex === s
                  ? { backgroundColor: "var(--color-teal)", borderColor: "var(--color-teal)", color: "#fff" }
                  : { backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", color: "var(--color-ink-secondary)" }
              }
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>
            Existing Conditions
          </label>
          <input
            type="text"
            value={existingConditions}
            onChange={(e) => onConditionsChange(e.target.value)}
            placeholder="e.g. diabetes, hypertension"
            className="w-full text-sm px-3 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-indigo-500"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-surface)",
              color: "var(--color-ink)",
            }}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>
            Current Medications
          </label>
          <input
            type="text"
            value={medications}
            onChange={(e) => onMedicationsChange(e.target.value)}
            placeholder="e.g. metformin, aspirin"
            className="w-full text-sm px-3 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-indigo-500"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-surface)",
              color: "var(--color-ink)",
            }}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>
            Known Allergies
          </label>
          <input
            type="text"
            value={allergies}
            onChange={(e) => onAllergiesChange(e.target.value)}
            placeholder="e.g. penicillin, sulfa"
            className="w-full text-sm px-3 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-indigo-500"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-surface)",
              color: "var(--color-ink)",
            }}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>
            Country / Region
          </label>
          <input
            type="text"
            value={countryContext}
            onChange={(e) => onCountryChange(e.target.value)}
            placeholder="e.g. Nigeria, United Kingdom"
            className="w-full text-sm px-3 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-indigo-500"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-surface)",
              color: "var(--color-ink)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
