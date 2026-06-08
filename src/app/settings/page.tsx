"use client";

import ClinicalHeader from "@/components/layout/ClinicalHeader";
import PrivacyPanel from "@/components/dashboard/PrivacyPanel";
import { useAccount } from "wagmi";
import { Shield, Trash2 } from "lucide-react";

export default function SettingsPage() {
  const { address, isConnected } = useAccount();

  function resetConsent() {
    localStorage.removeItem("medreview_consent");
    window.location.reload();
  }

  return (
    <>
      <ClinicalHeader />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}>
            Privacy &amp; Settings
          </h1>
          <p style={{ color: "var(--color-ink-secondary)" }}>Manage your MedReview session and privacy preferences.</p>
        </div>

        <PrivacyPanel />

        <div className="rounded-2xl border p-6 space-y-4" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}>
          <h2 className="text-lg font-semibold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}>Your Account</h2>
          {isConnected ? (
            <div className="text-sm space-y-2">
              <div className="flex items-center gap-2">
                <span style={{ color: "var(--color-ink-muted)" }}>Wallet:</span>
                <span className="font-mono text-xs" style={{ color: "var(--color-proof-slate)" }}>{address}</span>
              </div>
              <p style={{ color: "var(--color-ink-secondary)" }}>
                Your health reviews are linked to this wallet address. Disconnecting your wallet
                will not delete data.
              </p>
            </div>
          ) : (
            <p className="text-sm" style={{ color: "var(--color-ink-muted)" }}>No wallet connected.</p>
          )}
        </div>

        <div className="rounded-2xl border p-6 space-y-4" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}>
          <h2 className="text-lg font-semibold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}>Consent</h2>
          <div className="flex items-start gap-3 text-sm" style={{ color: "var(--color-ink-secondary)" }}>
            <Shield className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--color-teal)" }} />
            You have accepted the MedReview healthcare limitation notice. You can reset this
            consent below, which will show the consent gate on your next visit.
          </div>
          <button onClick={resetConsent}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors"
            style={{ borderColor: "var(--color-border)", color: "var(--color-ink-secondary)" }}>
            <Trash2 className="w-4 h-4" /> Reset Consent
          </button>
        </div>
      </main>
    </>
  );
}
