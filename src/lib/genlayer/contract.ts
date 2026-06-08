import { getGenLayerClient, getContractAddress, getServerAccount } from "./client";

const WRITE_DEFAULTS = { value: BigInt(0) } as const;

export async function createReviewSession(reviewId: string, reviewJson: string): Promise<string> {
  const client = getGenLayerClient();
  const tx = await client.writeContract({ ...WRITE_DEFAULTS, address: getContractAddress(), functionName: "create_review_session", args: [reviewId, reviewJson], account: getServerAccount() });
  return tx as unknown as string;
}

export async function submitSymptomReview(reviewId: string, symptomJson: string): Promise<string> {
  const client = getGenLayerClient();
  const tx = await client.writeContract({ ...WRITE_DEFAULTS, address: getContractAddress(), functionName: "submit_symptom_review", args: [reviewId, symptomJson], account: getServerAccount() });
  return tx as unknown as string;
}

export async function submitReportReview(reviewId: string, reportJson: string): Promise<string> {
  const client = getGenLayerClient();
  const tx = await client.writeContract({ ...WRITE_DEFAULTS, address: getContractAddress(), functionName: "submit_report_review", args: [reviewId, reportJson], account: getServerAccount() });
  return tx as unknown as string;
}

export async function submitFollowUp(reviewId: string, followupId: string, followupJson: string): Promise<string> {
  const client = getGenLayerClient();
  const tx = await client.writeContract({ ...WRITE_DEFAULTS, address: getContractAddress(), functionName: "submit_follow_up", args: [reviewId, followupId, followupJson], account: getServerAccount() });
  return tx as unknown as string;
}

export async function archiveReview(reviewId: string): Promise<string> {
  const client = getGenLayerClient();
  const tx = await client.writeContract({ ...WRITE_DEFAULTS, address: getContractAddress(), functionName: "archive_review", args: [reviewId], account: getServerAccount() });
  return tx as unknown as string;
}

export async function flagEmergencyReview(reviewId: string, reason: string): Promise<string> {
  const client = getGenLayerClient();
  const tx = await client.writeContract({ ...WRITE_DEFAULTS, address: getContractAddress(), functionName: "flag_emergency_review", args: [reviewId, reason], account: getServerAccount() });
  return tx as unknown as string;
}

export async function getReview(reviewId: string): Promise<string> {
  const client = getGenLayerClient();
  const result = await client.readContract({ address: getContractAddress(), functionName: "get_review", args: [reviewId] });
  return result as string;
}

export async function getTriageResult(reviewId: string): Promise<string> {
  const client = getGenLayerClient();
  const result = await client.readContract({ address: getContractAddress(), functionName: "get_triage_result", args: [reviewId] });
  return result as string;
}

export async function getUserReviews(address: string): Promise<string> {
  const client = getGenLayerClient();
  const result = await client.readContract({ address: getContractAddress(), functionName: "get_user_reviews", args: [address] });
  return result as string;
}

export async function getTotalReviews(): Promise<number> {
  const client = getGenLayerClient();
  const result = await client.readContract({ address: getContractAddress(), functionName: "get_total_reviews", args: [] });
  return Number(result);
}

export async function getReviewFollowupIds(reviewId: string): Promise<string[]> {
  const client = getGenLayerClient();
  const result = await client.readContract({ address: getContractAddress(), functionName: "get_review_followup_ids", args: [reviewId] });
  return result as string[];
}

export async function getFollowupResult(reviewId: string, followupId: string): Promise<string> {
  const client = getGenLayerClient();
  const result = await client.readContract({ address: getContractAddress(), functionName: "get_followup_result", args: [reviewId, followupId] });
  return result as string;
}

export async function getTotalFollowups(): Promise<number> {
  const client = getGenLayerClient();
  const result = await client.readContract({ address: getContractAddress(), functionName: "get_total_followups", args: [] });
  return Number(result);
}

export async function getFollowup(followupId: string): Promise<string> {
  const client = getGenLayerClient();
  const result = await client.readContract({ address: getContractAddress(), functionName: "get_followup", args: [followupId] });
  return result as string;
}

export async function getReviewFollowups(reviewId: string): Promise<string> {
  const client = getGenLayerClient();
  const result = await client.readContract({ address: getContractAddress(), functionName: "get_review_followups", args: [reviewId] });
  return result as string;
}

export async function getSafetyFlags(reviewId: string): Promise<string> {
  const client = getGenLayerClient();
  const result = await client.readContract({ address: getContractAddress(), functionName: "get_safety_flags", args: [reviewId] });
  return result as string;
}

export async function getProtocolState(): Promise<string> {
  const client = getGenLayerClient();
  const result = await client.readContract({ address: getContractAddress(), functionName: "get_protocol_state", args: [] });
  return result as string;
}
