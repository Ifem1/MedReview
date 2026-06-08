"use client";

import { useEffect, useState, useMemo } from "react";
import { useAccount } from "wagmi";
import ClinicalHeader from "@/components/layout/ClinicalHeader";
import HealthHistoryCard from "@/components/dashboard/HealthHistoryCard";
import EmptyHealthState from "@/components/ui/EmptyHealthState";
import LoadingReviewState from "@/components/ui/LoadingReviewState";
import { ReviewRow } from "@/types/medreview";
import Link from "next/link";
import { ArrowLeft, ArrowUpDown, ArrowDownAZ } from "lucide-react";

const TYPE_LABELS: Record<string, string> = {
  symptom: "Symptom Review",
  report: "Report Review",
  medication_concern: "Medication Concern",
  follow_up: "Follow-up",
  child_symptom: "Child Symptom",
  pregnancy_concern: "Pregnancy Concern",
};

type SortMode = "date_desc" | "date_asc" | "az";

export default function HistoryPage() {
  const { address, isConnected } = useAccount();
  const [reviews, setReviews]       = useState<ReviewRow[]>([]);
  const [failedCount, setFailedCount] = useState(0);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sort, setSort]             = useState<SortMode>("date_desc");

  useEffect(() => {
    if (!isConnected || !address) { setLoading(false); return; }
    fetch(`/api/history?wallet=${address}`)
      .then((r) => r.json())
      .then((d) => { setReviews(d.reviews || []); setFailedCount(d.failedCount || 0); })
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [isConnected, address]);

  // API already strips failed reviews — use reviews directly
  const validReviews = reviews;

  // Unique types present in valid reviews
  const availableTypes = useMemo(() => {
    const seen = new Set(validReviews.map((r) => r.review_type));
    return Array.from(seen).sort();
  }, [validReviews]);

  const filtered = useMemo(() => {
    let list = validReviews.filter((r) => {
      const matchesSearch =
        !search ||
        r.title?.toLowerCase().includes(search.toLowerCase()) ||
        r.review_type.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "all" || r.review_type === typeFilter;
      return matchesSearch && matchesType;
    });

    if (sort === "date_desc") {
      list = [...list].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sort === "date_asc") {
      list = [...list].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else if (sort === "az") {
      list = [...list].sort((a, b) =>
        (TYPE_LABELS[a.review_type] || a.review_type).localeCompare(TYPE_LABELS[b.review_type] || b.review_type)
      );
    }

    return list;
  }, [validReviews, search, typeFilter, sort]);


  return (
    <>
      <ClinicalHeader />
      <main className="max-w-5xl mx-auto px-6 sm:px-10 py-14 space-y-8">

        {/* Header */}
        <div>
          <Link href="/dashboard" className="flex items-center gap-1.5 text-sm font-medium mb-5" style={{ color: "var(--color-accent-dark)" }}>
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1
                className="text-4xl font-extrabold"
                style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}
              >
                Review History
              </h1>
              {failedCount > 0 && (
                <p className="text-sm mt-2" style={{ color: "var(--color-ink-muted)" }}>
                  {failedCount} incomplete {failedCount === 1 ? "review" : "reviews"} hidden
                </p>
              )}
            </div>
            <span
              className="text-base px-4 py-2 rounded-full font-semibold"
              style={{ backgroundColor: "var(--color-surface)", color: "var(--color-ink-secondary)", border: "1px solid var(--color-border)" }}
            >
              {validReviews.length} {validReviews.length === 1 ? "review" : "reviews"}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {/* Search */}
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or type…"
            className="w-full text-base px-5 py-3.5 rounded-2xl border outline-none focus:ring-2 focus:ring-[var(--color-accent-dark)]"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-surface)",
              color: "var(--color-ink)",
            }}
          />

          {/* Sort + Type filter row */}
          <div className="flex gap-2 flex-wrap">
            {/* Sort buttons */}
            <button
              onClick={() => setSort(sort === "date_desc" ? "date_asc" : "date_desc")}
              className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl border font-semibold transition-colors"
              style={{
                backgroundColor: sort === "date_desc" || sort === "date_asc" ? "var(--color-accent)" : "var(--color-surface)",
                borderColor: sort === "date_desc" || sort === "date_asc" ? "var(--color-accent-dark)" : "var(--color-border)",
                color: sort === "date_desc" || sort === "date_asc" ? "var(--color-accent-deeper)" : "var(--color-ink-secondary)",
              }}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              {sort === "date_asc" ? "Oldest first" : "Newest first"}
            </button>

            <button
              onClick={() => setSort(sort === "az" ? "date_desc" : "az")}
              className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl border font-semibold transition-colors"
              style={{
                backgroundColor: sort === "az" ? "var(--color-accent)" : "var(--color-surface)",
                borderColor: sort === "az" ? "var(--color-accent-dark)" : "var(--color-border)",
                color: sort === "az" ? "var(--color-accent-deeper)" : "var(--color-ink-secondary)",
              }}
            >
              <ArrowDownAZ className="w-3.5 h-3.5" />
              A → Z by type
            </button>

            {/* Type filter pills */}
            {availableTypes.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setTypeFilter("all")}
                  className="text-xs px-3 py-2 rounded-xl border font-medium transition-colors"
                  style={{
                    backgroundColor: typeFilter === "all" ? "var(--color-accent-dark)" : "var(--color-surface)",
                    borderColor: typeFilter === "all" ? "var(--color-accent-dark)" : "var(--color-border)",
                    color: typeFilter === "all" ? "#fff" : "var(--color-ink-secondary)",
                  }}
                >
                  All types
                </button>
                {availableTypes.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t === typeFilter ? "all" : t)}
                    className="text-xs px-3 py-2 rounded-xl border font-medium transition-colors"
                    style={{
                      backgroundColor: typeFilter === t ? "var(--color-accent-dark)" : "var(--color-surface)",
                      borderColor: typeFilter === t ? "var(--color-accent-dark)" : "var(--color-border)",
                      color: typeFilter === t ? "#fff" : "var(--color-ink-secondary)",
                    }}
                  >
                    {TYPE_LABELS[t] || t}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* List */}
        {loading ? (
          <LoadingReviewState message="Loading history…" />
        ) : !isConnected ? (
          <p className="text-center py-8" style={{ color: "var(--color-ink-muted)" }}>
            Connect your wallet to view history.
          </p>
        ) : filtered.length === 0 ? (
          <EmptyHealthState message={search || typeFilter !== "all" ? "No reviews match your filters." : undefined} />
        ) : (
          <div className="space-y-4">
            {filtered.map((r) => (
              <HealthHistoryCard key={r.id} review={r} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
