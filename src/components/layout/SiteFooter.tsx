import Link from "next/link";
import { Activity } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer style={{ backgroundColor: "var(--color-surface)", borderTop: "1px solid var(--color-border)" }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3 group">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--color-accent-dark), #818CF8)" }}>
                <Activity className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-sm" style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}>MedReview</span>
            </Link>
            <p className="text-xs leading-relaxed" style={{ color: "var(--color-ink-muted)" }}>
              AI-assisted triage guidance powered by verifiable on-chain intelligence.
            </p>
            <p className="text-xs mt-3" style={{ color: "var(--color-ink-light)" }}>© 2024 MedReview</p>
          </div>

          {/* Product */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--color-ink-muted)" }}>Product</p>
            <div className="space-y-2">
              {[
                { href: "/review", label: "New Review" },
                { href: "/dashboard", label: "Dashboard" },
                { href: "/dashboard/history", label: "History" },
                { href: "/safety", label: "Safety Protocol" },
              ].map(l => (
                <Link key={l.href} href={l.href} className="block text-sm hover:underline" style={{ color: "var(--color-ink-secondary)" }}>{l.label}</Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--color-ink-muted)" }}>Legal</p>
            <div className="space-y-2">
              {[
                { href: "/consent", label: "Privacy Policy" },
                { href: "/consent", label: "Terms of Service" },
                { href: "/consent", label: "Legal Disclaimer" },
                { href: "/safety",  label: "Safety Protocol" },
              ].map((l, i) => (
                <Link key={i} href={l.href} className="block text-sm hover:underline" style={{ color: "var(--color-ink-secondary)" }}>{l.label}</Link>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--color-ink-muted)" }}>Status</p>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium" style={{ color: "#16A34A" }}>Clinical Node Active</span>
            </div>
            <div className="space-y-2">
              {[
                { href: "https://github.com/Ifem1/MedReview", label: "GitHub" },
                { href: "https://genlayer-explorer.vercel.app", label: "GenLayer Explorer" },
              ].map(l => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="block text-sm hover:underline" style={{ color: "var(--color-ink-secondary)" }}>{l.label}</a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style={{ borderColor: "var(--color-border)", color: "var(--color-ink-light)" }}>
          <p>MedReview provides AI-assisted triage guidance only. It does not provide a medical diagnosis, prescription, or emergency service.</p>
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--color-accent-dark)" }} />
            <span style={{ color: "var(--color-ink-muted)" }}>Powered by GenLayer</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
