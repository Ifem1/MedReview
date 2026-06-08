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
  Plus, History, ClipboardList, Activity,
  FileText, RefreshCw, AlertTriangle, Lock,
  ShieldCheck, ExternalLink,
} from "lucide-react";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const [reviews, setReviews]   = useState<ReviewRow[]>([]);
  const [stats, setStats]       = useState<DashboardStats | null>(null);
  const [loading, setLoading]   = useState(true);

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

        {/* Page header */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-10 pb-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-4xl font-extrabold mb-1" style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}>
              Health Dashboard
            </h1>
            <p className="text-base" style={{ color: "var(--color-ink-secondary)" }}>
              Your private, on-chain triage review history secured by GenLayer.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/history"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-colors hover:bg-[var(--color-surface-soft)]"
              style={{ borderColor: "var(--color-border)", color: "var(--color-ink-secondary)", backgroundColor: "var(--color-surface)" }}>
              <History className="w-4 h-4" /> Full History
            </Link>
            <Link href="/review"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
              style={{ background: "linear-gradient(135deg, var(--color-accent-dark), #818CF8)", fontFamily: "var(--font-heading)" }}>
              <Plus className="w-4 h-4" /> New Review
            </Link>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-5 sm:px-8 pb-16">
          {!isConnected ? (
            <div className="grid md:grid-cols-3 gap-5">
              {/* Connect wallet panel */}
              <div className="md:col-span-2 rounded-3xl border p-14 text-center flex flex-col items-center justify-center gap-5"
                style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, var(--color-accent-dark), #818CF8)" }}>
                  <ShieldCheck className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}>
                    Connect your wallet
                  </p>
                  <p className="text-sm max-w-xs mx-auto" style={{ color: "var(--color-ink-secondary)" }}>
                    Connect your wallet to view your private triage review history. All data is encrypted and stored on-chain using GenLayer&apos;s privacy protocol.
                  </p>
                </div>
                <div className="flex items-center gap-5 text-xs font-semibold" style={{ color: "var(--color-ink-muted)" }}>
                  <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> Private by default</span>
                  <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> On-chain security</span>
                </div>
              </div>

              {/* Stats placeholder */}
              <div className="flex flex-col gap-4">
                <StatBox icon={<RefreshCw className="w-5 h-5" style={{ color: "#14B8A6" }} />} label="Active Sessions" value="0" sub="No active triage in progress." />
                <StatBox icon={<ClipboardList className="w-5 h-5" style={{ color: "var(--color-accent-dark)" }} />} label="Completed Reviews" value="--" sub="Connect wallet to load history." />
                <div className="rounded-2xl border p-5 flex flex-col items-center justify-center text-center gap-2"
                  style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", borderStyle: "dashed" }}>
                  <Activity className="w-6 h-6" style={{ color: "var(--color-ink-light)" }} />
                  <p className="text-sm font-semibold" style={{ color: "var(--color-ink-muted)" }}>Clinical Insights</p>
                  <p className="text-xs" style={{ color: "var(--color-ink-light)" }}>Insights will appear here after your first review.</p>
                </div>
              </div>
            </div>
          ) : loading ? (
            <LoadingReviewState message="Loading your review history…" />
          ) : (
            <div className="space-y-8">

              {/* Stats row */}
              {stats && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  <StatCard icon={<ClipboardList className="w-5 h-5" style={{ color: "var(--color-accent-dark)" }} />} label="Total Reviews"    value={stats.totalReviews} />
                  <StatCard icon={<Activity       className="w-5 h-5" style={{ color: "#6366F1" }} />}                  label="Symptom Reviews" value={stats.symptomReviews} />
                  <StatCard icon={<FileText       className="w-5 h-5" style={{ color: "#8B5CF6" }} />}                  label="Report Reviews"  value={stats.reportReviews} />
                  <StatCard icon={<RefreshCw      className="w-5 h-5" style={{ color: "#F59E0B" }} />}                  label="Follow-ups"      value={stats.openFollowUps} />
                  <StatCard icon={<AlertTriangle  className="w-5 h-5" style={{ color: "#EF4444" }} />}                  label="Emergency Flags" value={stats.emergencyFlags} highlight={stats.emergencyFlags > 0} />
                </div>
              )}

              {/* Latest urgency */}
              {stats?.latestUrgencyLevel && (
                <div className="rounded-2xl border p-5 flex items-center justify-between gap-4 flex-wrap"
                  style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--color-ink-muted)" }}>Latest Triage Urgency</p>
                    <UrgencyBadge level={stats.latestUrgencyLevel} showDescription />
                  </div>
                  <Link href="/dashboard/history" className="text-sm font-semibold" style={{ color: "var(--color-accent-dark)" }}>
                    View all reviews →
                  </Link>
                </div>
              )}

              {/* Recent Reviews */}
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}>Recent Reviews</h2>
                  {reviews.length > 5 && (
                    <Link href="/dashboard/history" className="text-sm font-semibold" style={{ color: "var(--color-accent-dark)" }}>
                      See all {reviews.length} →
                    </Link>
                  )}
                </div>
                {reviews.length === 0 ? (
                  <EmptyHealthState />
                ) : (
                  <div className="space-y-4">
                    {reviews.slice(0, 5).map(r => <HealthHistoryCard key={r.id} review={r} />)}
                    {reviews.length > 5 && (
                      <Link href="/dashboard/history"
                        className="block text-center text-sm font-semibold py-4 rounded-2xl border transition-colors hover:bg-[var(--color-surface-soft)]"
                        style={{ borderColor: "var(--color-border)", color: "var(--color-accent-dark)", backgroundColor: "var(--color-surface)" }}>
                        View all {reviews.length} reviews →
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {/* Clinical Protocol Disclaimer */}
              <div className="rounded-2xl border p-5 flex items-start gap-4"
                style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#FEF2F2" }}>
                  <AlertTriangle className="w-4 h-4" style={{ color: "var(--color-emergency-red)" }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold mb-1" style={{ color: "var(--color-ink)" }}>Clinical Protocol Disclaimer</p>
                  <p className="text-sm mb-3" style={{ color: "var(--color-ink-secondary)" }}>
                    MedReview uses advanced language models to perform initial triage screening. This process is designed to assist in
                    determining the urgency of care but does not constitute a medical diagnosis. In cases of sudden chest pain, difficulty
                    breathing, or severe injury, please call emergency services (911/112) immediately.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link href="/safety" className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--color-accent-dark)" }}>
                      Read Safety Protocol <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <Link href="/consent" className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--color-accent-dark)" }}>
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

function StatBox({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border p-5 space-y-2" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium" style={{ color: "var(--color-ink-secondary)" }}>{label}</p>
        {icon}
      </div>
      <p className="text-3xl font-extrabold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}>{value}</p>
      <p className="text-xs" style={{ color: "var(--color-ink-muted)" }}>{sub}</p>
    </div>
  );
}

function StatCard({ icon, label, value, highlight = false }: { icon: React.ReactNode; label: string; value: number; highlight?: boolean }) {
  return (
    <div className="rounded-2xl border p-5 space-y-3"
      style={{ backgroundColor: highlight ? "#FEF2F2" : "var(--color-surface)", borderColor: highlight ? "#FCA5A5" : "var(--color-border)", boxShadow: "var(--shadow-card)" }}>
      <div>{icon}</div>
      <p className="text-4xl font-extrabold" style={{ fontFamily: "var(--font-heading)", color: highlight ? "#EF4444" : "var(--color-ink)" }}>{value}</p>
      <p className="text-sm font-medium" style={{ color: "var(--color-ink-secondary)" }}>{label}</p>
    </div>
  );
}
