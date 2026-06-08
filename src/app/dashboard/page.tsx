"use client";

import { useEffect, useState, useCallback } from "react";
import { useAccount } from "wagmi";
import ClinicalHeader from "@/components/layout/ClinicalHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import HealthHistoryCard from "@/components/dashboard/HealthHistoryCard";
import EmptyHealthState from "@/components/ui/EmptyHealthState";
import LoadingReviewState from "@/components/ui/LoadingReviewState";
import UrgencyBadge from "@/components/triage/UrgencyBadge";
import { DashboardStats, ReviewRow } from "@/types/medreview";
import Link from "next/link";
import {
  Plus, History, ClipboardList, Activity, FileText, RefreshCw,
  AlertTriangle, Lock, ShieldCheck, ExternalLink,
  BarChart3, BookOpen, Settings2,
} from "lucide-react";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [stats, setStats]     = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    if (!address) return;
    try {
      const res  = await fetch(`/api/history?wallet=${address}`);
      const data = await res.json();
      setReviews(data.reviews || []);
      setStats(data.stats || { totalReviews:0, latestUrgencyLevel:null, openFollowUps:0, emergencyFlags:0, reportReviews:0, symptomReviews:0 });
    } catch { /* ignore */ } finally { setLoading(false); }
  }, [address]);

  useEffect(() => {
    if (!isConnected || !address) { setLoading(false); return; }
    fetchDashboard();
  }, [isConnected, address, fetchDashboard]);

  return (
    <>
      <ClinicalHeader />
      <main>

        {/* ── Welcome Banner ── */}
        <section className="relative overflow-hidden mb-8"
          style={{ background:"linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)" }}>
          <div className="absolute inset-0 pointer-events-none opacity-20"
            style={{ background:"radial-gradient(circle at 80% 50%, #6366F1, transparent 60%)" }} />
          <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-10 grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2">
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color:"#818CF8" }}>Health Dashboard</p>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3" style={{ fontFamily:"var(--font-heading)" }}>
                Welcome to your Clinical Workspace
              </h1>
              <p className="text-sm leading-relaxed mb-6" style={{ color:"#A5B4FC" }}>
                {isConnected
                  ? "Securely access your triage review history and clinical data secured by GenLayer's on-chain verification protocol."
                  : "Connect your verified wallet to access your private triage review history and begin signing clinical reviews on-chain."}
              </p>
              {!isConnected ? (
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 text-sm font-semibold" style={{ color:"#34D399" }}>
                    <Lock className="w-4 h-4" /> Private by default
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold" style={{ color:"#A5B4FC" }}>
                    <ShieldCheck className="w-4 h-4" /> On-chain security
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  <Link href="/review"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity"
                    style={{ background:"linear-gradient(135deg, var(--color-accent-dark), #818CF8)" }}>
                    <Plus className="w-4 h-4" /> New Review
                  </Link>
                  <Link href="/dashboard/history"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white border border-white/20 hover:bg-white/10 transition-colors">
                    <History className="w-4 h-4" /> Full History
                  </Link>
                </div>
              )}
            </div>
            {/* Shield emblem */}
            <div className="hidden md:flex justify-end">
              <div className="w-32 h-32 rounded-3xl flex items-center justify-center"
                style={{ backgroundColor:"rgba(255,255,255,0.06)", border:"2px solid rgba(255,255,255,0.12)" }}>
                <ShieldCheck className="w-16 h-16" style={{ color:"rgba(255,255,255,0.25)" }} />
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-5 sm:px-8 pb-16">

          {!isConnected ? (
            /* ── Not connected: stat placeholders ── */
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard icon={<Activity className="w-5 h-5" style={{ color:"#14B8A6" }} />}     label="Active Reviews"     value="0"  sub="No active triage"          />
              <StatCard icon={<ClipboardList className="w-5 h-5" style={{ color:"var(--color-accent-dark)" }} />} label="Completed Reviews" value="--" sub="Connect to load"  />
              <StatCard icon={<RefreshCw className="w-5 h-5" style={{ color:"#F59E0B" }} />}    label="Follow-ups"         value="--" sub="Connect to load"              />
              <StatCard icon={<AlertTriangle className="w-5 h-5" style={{ color:"#EF4444" }} />} label="Emergency Flags"   value="--" sub="Connect to load"              />
            </div>

          ) : loading ? (
            <LoadingReviewState message="Loading your review history…" />

          ) : (
            <div className="space-y-8">

              {/* ── Stats row ── */}
              {stats && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <StatCard icon={<ClipboardList className="w-5 h-5" style={{ color:"var(--color-accent-dark)" }} />} label="Total Reviews"    value={stats.totalReviews}      />
                  <StatCard icon={<Activity       className="w-5 h-5" style={{ color:"#6366F1" }} />}                  label="Symptom Reviews" value={stats.symptomReviews}    />
                  <StatCard icon={<RefreshCw      className="w-5 h-5" style={{ color:"#F59E0B" }} />}                  label="Follow-ups"      value={stats.openFollowUps}     />
                  <StatCard icon={<AlertTriangle  className="w-5 h-5" style={{ color:"#EF4444" }} />}                  label="Emergency Flags" value={stats.emergencyFlags} highlight={stats.emergencyFlags > 0} />
                </div>
              )}

              {/* Latest urgency strip */}
              {stats?.latestUrgencyLevel && (
                <div className="rounded-2xl border p-5 flex items-center justify-between gap-4 flex-wrap"
                  style={{ backgroundColor:"var(--color-surface)", borderColor:"var(--color-border)" }}>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color:"var(--color-ink-muted)" }}>Latest Triage Urgency</p>
                    <UrgencyBadge level={stats.latestUrgencyLevel} showDescription />
                  </div>
                  <Link href="/dashboard/history" className="text-sm font-semibold" style={{ color:"var(--color-accent-dark)" }}>
                    View all reviews →
                  </Link>
                </div>
              )}

              {/* ── Two-column: Reviews + Sidebar ── */}
              <div className="grid md:grid-cols-3 gap-6">

                {/* Reviews list (wider) */}
                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold" style={{ fontFamily:"var(--font-heading)", color:"var(--color-ink)" }}>Recent Reviews</h2>
                    {reviews.length > 5 && (
                      <Link href="/dashboard/history" className="text-sm font-semibold" style={{ color:"var(--color-accent-dark)" }}>
                        View All →
                      </Link>
                    )}
                  </div>
                  {reviews.length === 0 ? (
                    <EmptyHealthState />
                  ) : (
                    <>
                      {reviews.slice(0, 5).map(r => <HealthHistoryCard key={r.id} review={r} />)}
                      {reviews.length > 5 && (
                        <Link href="/dashboard/history"
                          className="block text-center text-sm font-semibold py-4 rounded-2xl border transition-colors hover:bg-[var(--color-surface-soft)]"
                          style={{ borderColor:"var(--color-border)", color:"var(--color-accent-dark)", backgroundColor:"var(--color-surface)" }}>
                          View all {reviews.length} reviews →
                        </Link>
                      )}
                    </>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-4">

                  {/* Quick Actions */}
                  <div className="rounded-2xl border p-5" style={{ backgroundColor:"var(--color-surface)", borderColor:"var(--color-border)", boxShadow:"var(--shadow-card)" }}>
                    <p className="text-sm font-bold mb-3" style={{ fontFamily:"var(--font-heading)", color:"var(--color-ink)" }}>Quick Actions</p>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { href:"/review",             icon:Plus,       label:"New Entry" },
                        { href:"/dashboard/history",  icon:BarChart3,  label:"Reports" },
                        { href:"/dashboard/history",  icon:FileText,   label:"Audit Log" },
                        { href:"/review",             icon:Settings2,  label:"All Reviews" },
                      ].map(qa => {
                        const Icon = qa.icon;
                        return (
                          <Link key={qa.label} href={qa.href}
                            className="flex flex-col items-center justify-center gap-2 rounded-xl p-4 text-center transition-all hover:scale-[1.02] hover:shadow-sm cursor-pointer"
                            style={{ backgroundColor:"var(--color-bg)", border:"1px solid var(--color-border)" }}>
                            <Icon className="w-5 h-5" style={{ color:"var(--color-accent-dark)" }} />
                            <span className="text-xs font-semibold" style={{ color:"var(--color-ink-secondary)" }}>{qa.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Clinical Guidelines */}
                  <div className="rounded-2xl border p-5" style={{ backgroundColor:"var(--color-surface)", borderColor:"var(--color-border)", boxShadow:"var(--shadow-card)" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4" style={{ color:"var(--color-accent-dark)" }} />
                      <p className="text-sm font-bold" style={{ fontFamily:"var(--font-heading)", color:"var(--color-ink)" }}>Clinical Guidelines</p>
                    </div>
                    <p className="text-xs mb-3" style={{ color:"var(--color-ink-secondary)" }}>
                      Access the latest documentation on triage protocols and system safety updates.
                    </p>
                    <Link href="/safety"
                      className="flex items-center gap-1.5 text-sm font-semibold" style={{ color:"var(--color-accent-dark)" }}>
                      Review Guidelines <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* GenLayer node status */}
                  <div className="rounded-2xl border p-5" style={{ backgroundColor:"var(--color-surface)", borderColor:"var(--color-border)", boxShadow:"var(--shadow-card)" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <p className="text-sm font-bold" style={{ fontFamily:"var(--font-heading)", color:"var(--color-ink)" }}>Verification Node</p>
                    </div>
                    <p className="text-xs mb-3" style={{ color:"var(--color-ink-secondary)" }}>
                      GenLayer on-chain verification is active. All review results are being verified in real-time.
                    </p>
                    <p className="text-xs font-semibold" style={{ color:"#16A34A" }}>Clinical Node Active</p>
                  </div>
                </div>
              </div>

              {/* ── Clinical Protocol Disclaimer ── */}
              <div className="rounded-2xl border p-5 flex items-start gap-4"
                style={{ backgroundColor:"var(--color-surface)", borderColor:"var(--color-border)" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor:"#FEF2F2" }}>
                  <AlertTriangle className="w-4 h-4" style={{ color:"var(--color-emergency-red)" }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold mb-1" style={{ color:"var(--color-ink)" }}>Clinical Protocol Disclaimer</p>
                  <p className="text-sm mb-3" style={{ color:"var(--color-ink-secondary)" }}>
                    MedReview uses advanced language models to perform initial triage screening. This process is designed to assist
                    in determining the urgency of care but does not constitute a medical diagnosis. In cases of sudden chest pain,
                    difficulty breathing, or severe injury, please call emergency services (911/112) immediately.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link href="/safety" className="flex items-center gap-1.5 text-sm font-semibold" style={{ color:"var(--color-accent-dark)" }}>
                      Read Safety Protocol <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <Link href="/consent" className="flex items-center gap-1.5 text-sm font-semibold" style={{ color:"var(--color-accent-dark)" }}>
                      Verification Method <ShieldCheck className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function StatCard({
  icon, label, value, sub, highlight = false,
}: {
  icon: React.ReactNode; label: string; value: number | string; sub?: string; highlight?: boolean;
}) {
  return (
    <div className="rounded-2xl border p-5 space-y-2"
      style={{
        backgroundColor: highlight ? "#FEF2F2" : "var(--color-surface)",
        borderColor: highlight ? "#FCA5A5" : "var(--color-border)",
        boxShadow: "var(--shadow-card)",
      }}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium" style={{ color:"var(--color-ink-secondary)" }}>{label}</p>
        {icon}
      </div>
      <p className="text-4xl font-extrabold" style={{ fontFamily:"var(--font-heading)", color: highlight ? "#EF4444" : "var(--color-ink)" }}>{value}</p>
      {sub && <p className="text-xs" style={{ color:"var(--color-ink-muted)" }}>{sub}</p>}
    </div>
  );
}
