import { Lock, EyeOff, Shield } from "lucide-react";

export default function PrivacyPanel() {
  return (
    <div
      className="rounded-xl border p-5 space-y-3"
      style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
    >
      <p
        className="font-semibold text-sm"
        style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}
      >
        Your Privacy
      </p>
      <div className="space-y-2">
        {[
          { icon: <Lock className="w-4 h-4" />, text: "Your health data is stored privately and linked to your wallet address only" },
          { icon: <EyeOff className="w-4 h-4" />, text: "No health information is publicly visible" },
          { icon: <Shield className="w-4 h-4" />, text: "GenLayer stores review hashes on-chain for verification; raw health text is not on-chain" },
        ].map(({ icon, text }, i) => (
          <div key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--color-ink-secondary)" }}>
            <span style={{ color: "var(--color-teal)" }}>{icon}</span>
            {text}
          </div>
        ))}
      </div>
    </div>
  );
}
