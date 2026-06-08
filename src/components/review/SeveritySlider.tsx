"use client";

interface Props {
  value: number;
  onChange: (v: number) => void;
}

const labels = ["Mild", "Moderate", "Significant", "Severe", "Extreme"];
const colors = ["#16A34A", "#84CC16", "#F59E0B", "#EA580C", "#DC2626"];

export default function SeveritySlider({ value, onChange }: Props) {
  const idx = Math.min(Math.floor((value - 1) / 2), 4);
  const label = labels[idx];
  const color = colors[idx];

  const pct = ((value - 1) / 9) * 100;
  const trackStyle = `linear-gradient(to right, ${color} 0%, ${color} ${pct}%, #6366F1 ${pct}%, #6366F1 100%)`;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>
          Severity
        </span>
        <span className="text-sm font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: color + "20", color }}>
          {value}/10 — {label}
        </span>
      </div>

      <style>{`
        .severity-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 8px;
          border-radius: 9999px;
          cursor: pointer;
          outline: none;
        }
        .severity-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          border: 3px solid currentColor;
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(0,0,0,0.25);
        }
        .severity-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          border: 3px solid currentColor;
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(0,0,0,0.25);
        }
      `}</style>

      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="severity-slider"
        style={{
          background: trackStyle,
          color,
        }}
      />

      <div className="flex justify-between text-xs" style={{ color: "var(--color-ink-secondary)" }}>
        <span>1 — Mild</span>
        <span>5 — Moderate</span>
        <span>10 — Extreme</span>
      </div>
    </div>
  );
}
