"use client";

import { useEffect, useState, useCallback } from "react";
import { useAccount } from "wagmi";
import ClinicalHeader from "@/components/layout/ClinicalHeader";
import HealthHistoryCard from "@/components/dashboard/HealthHistoryCard";
import EmptyHealthState from "@/components/ui/EmptyHealthState";
import LoadingReviewState from "@/components/ui/LoadingReviewState";
import PrivacyPanel from "@/components/dashboard/PrivacyPanel";
import UrgencyBadge from "@/components/triage/UrgencyBadge";
import { DashboardStats, ReviewRow } from "@/types/medreview";
import Link from "next/link";
import { Plus, History, ClipboardList, Activity, FileText, RefreshCw, AlertTriangle } from "lucide-react";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    if (!address) return;
    try {
      const res = await fetch(`/api/history?wallet=${address}`);
      const data = await res.json();
      setReviews(data.reviews || []);
      setStats(data.stats || {
        totalReviews: 0,
        latestUrgencyLevel: null,
        openFollowUps: 0,
        emergencyFlags: 0,
        reportReviews: 0,
        symptomReviews: 0,
      });
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    if (!isConnected || !address) { setLoading(false); return; }
    fetchDashboard();
  }, [isConnected, address, fetchDashboard]);

  return (
    <>
      <ClinicalHeader />
      <main className="max-w-5xl mx-auto px-6 sm:px-10 py-14 space-y-10">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1
              className="text-4xl font-extrabold"
              style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}
            >
              Health Dashboard
            </h1>
            <p className="text-base mt-2" style={{ color: "var(--color-ink-secondary)" }}>
              Your private, on-chain triage review history
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/review"
              className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
              style={{ background: "linear-gradient(135deg, var(--color-accent-dark), #818CF8)", fontFamily: "var(--font-heading)" }}
            >
              <Plus className="w-4 h-4" /> New Review
            </Link>
            <Link
              href="/dashboard/history"
              className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold border transition-colors hover:bg-[var(--color-surface-soft)]"
              style={{ borderColor: "var(--color-border)", color: "var(--color-ink-secondary)", backgroundColor: "var(--color-surface)" }}
            >
              <History className="w-4 h-4" /> Full History
            </Link>
          </div>
        </div>

        {!isConnected ? (
          <div
            className="rounded-3xl border p-16 text-center space-y-5"
            style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
              style={{ background: "linear-gradient(135deg, var(--color-accent-dark), #818CF8)" }}
            >
              <Activity className="w-8 h-8 text-white" />
            </div>
            <p className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}>
              Connect your wallet
            </p>
            <p className="text-base max-w-sm mx-auto" style={{ color: "var(--color-ink-secondary)" }}>
              Connect your wallet to view your private triage review history secured on GenLayer.
            </p>
          </div>
        ) : loading ? (
          <LoadingReviewState message="Loading your review history…" />
        ) : (
          <>
            {/* Stats grid */}
            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
                <StatCard
                  icon={<ClipboardList className="w-6 h-6" style={{ color: "var(--color-accent-dark)" }} />}
                  label="Total Reviews"
                  value={stats.totalReviews}
                />
                <StatCard
                  icon={<Activity className="w-6 h-6" style={{ color: "#6366F1" }} />}
                  label="Symptom Reviews"
                  value={stats.symptomReviews}
                />
                <StatCard
                  icon={<FileText className="w-6 h-6" style={{ color: "#6366F1" }} />}
                  label="Report Reviews"
                  value={stats.reportReviews}
                />
                <StatCard
                  icon={<RefreshCw className="w-6 h-6" style={{ color: "#F59E0B" }} />}
                  label="Open Follow-ups"
                  value={stats.openFollowUps}
                />
                <StatCard
                  icon={<AlertTriangle className="w-6 h-6" style={{ color: "#EF4444" }} />}
                  label="Emergency Flags"
                  value={stats.emergencyFlags}
                  highlight={stats.emergencyFlags > 0}
                />
              </div>
            )}

            {/* Latest urgency */}
            {stats?.latestUrgencyLevel && (
              <div
                className="rounded-2xl border p-6 flex items-center justify-between gap-4 flex-wrap"
                style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
              >
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--color-ink-muted)" }}>
                    Latest Triage Urgency
                  </p>
                  <UrgencyBadge level={stats.latestUrgencyLevel} showDescription />
                </div>
                <Link
                  href="/dashboard/history"
                  className="text-sm font-semibold"
                  style={{ color: "var(--color-accent-dark)" }}
                >
                  View all reviews →
                </Link>
              </div>
            )}

            {/* Recent Reviews */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2
                  className="text-2xl font-bold"
                  style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}
                >
                  Recent Reviews
                </h2>
                {reviews.length > 5 && (
                  <Link
                    href="/dashboard/history"
                    className="text-sm font-semibold"
                    style={{ color: "var(--color-accent-dark)" }}
                  >
                    See all {reviews.length} →
                  </Link>
                )}
              </div>

              {reviews.length === 0 ? (
                <EmptyHealthState />
              ) : (
                <div className="space-y-4">
                  {reviews.slice(0, 5).map((r) => (
                    <HealthHistoryCard key={r.id} review={r} />
                  ))}
                  {reviews.length > 5 && (
                    <Link
                      href="/dashboard/history"
                      className="block text-center text-sm font-semibold py-4 rounded-2xl border transition-colors hover:bg-[var(--color-surface-soft)]"
                      style={{ borderColor: "var(--color-border)", color: "var(--color-accent-dark)", backgroundColor: "var(--color-surface)" }}
                    >
                      View all {reviews.length} reviews →
                    </Link>
                  )}
                </div>
              )}
            </div>

            <PrivacyPanel />
          </>
        )}
      </main>
    </>
  );
}

function StatCard({
  icon, label, value, highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className="rounded-2xl border p-6 space-y-3"
      style={{
        backgroundColor: highlight ? "#FEF2F2" : "var(--color-surface)",
        borderColor: highlight ? "#FCA5A5" : "var(--color-border)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div>{icon}</div>
      <p
        className="text-4xl font-extrabold"
        style={{
          fontFamily: "var(--font-heading)",
          color: highlight ? "#EF4444" : "var(--color-ink)",
        }}
      >
        {value}
      </p>
      <p className="text-sm font-medium" style={{ color: "var(--color-ink-secondary)" }}>
        {label}
      </p>
    </div>
  );
}
