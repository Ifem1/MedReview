import { GenLayerProof } from "@/types/medreview";
import { FileText, ExternalLink } from "lucide-react";

interface Props {
  proof: Partial<GenLayerProof>;
  reviewId?: string;
}

export default function GenLayerReviewProof({ proof, reviewId }: Props) {
  return (
    <div
      className="rounded-xl border p-5"
      style={{
        backgroundColor: "#F8FAFC",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-4 h-4" style={{ color: "var(--color-proof-slate)" }} />
        <p
          className="text-sm font-semibold"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-proof-slate)" }}
        >
          GenLayer Review Proof
        </p>
        <span
          className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ backgroundColor: "var(--color-mint)", color: "var(--color-teal)" }}
        >
          On-chain
        </span>
      </div>

      <div
        className="space-y-2 text-xs"
        style={{ fontFamily: "var(--font-mono)", color: "var(--color-proof-slate)" }}
      >
        {reviewId && (
          <ProofRow label="Review ID" value={reviewId} />
        )}
        {proof.contractAddress && (
          <ProofRow label="Contract" value={proof.contractAddress} truncate />
        )}
        {proof.methodName && (
          <ProofRow label="Method" value={proof.methodName} />
        )}
        {proof.txHash && (
          <ProofRow label="Tx Hash" value={proof.txHash} truncate />
        )}
        {proof.status && (
          <ProofRow label="Status" value={proof.status} />
        )}
        {proof.timestamp && (
          <ProofRow label="Timestamp" value={new Date(proof.timestamp).toISOString()} />
        )}
      </div>

      {proof.txHash && (
        <div className="mt-3 pt-3 border-t" style={{ borderColor: "var(--color-border)" }}>
          <a
            href={`${process.env.NEXT_PUBLIC_GENLAYER_RPC_URL || "http://localhost:4000"}/tx/${proof.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-medium hover:underline"
            style={{ color: "var(--color-teal)" }}
          >
            View on GenLayer Explorer <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
}

function ProofRow({
  label,
  value,
  truncate = false,
}: {
  label: string;
  value: string;
  truncate?: boolean;
}) {
  const display =
    truncate && value.length > 20
      ? value.slice(0, 10) + "..." + value.slice(-8)
      : value;
  return (
    <div className="flex items-start gap-3">
      <span className="w-20 shrink-0 opacity-60">{label}</span>
      <span className="break-all">{display}</span>
    </div>
  );
}
