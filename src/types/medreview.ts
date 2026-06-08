export type ReviewType =
  | "symptom"
  | "report"
  | "medication_concern"
  | "follow_up"
  | "child_symptom"
  | "pregnancy_concern";

export type UrgencyLevel =
  | "SELF_MONITOR"
  | "ROUTINE_DOCTOR"
  | "SOON_DOCTOR"
  | "URGENT_CARE"
  | "EMERGENCY";

export type ReviewStatus =
  | "created"
  | "submitted"
  | "reviewing"
  | "reviewed"
  | "follow_up_submitted"
  | "follow_up_reviewed"
  | "flagged_emergency"
  | "archived";

export type ReviewSession = {
  reviewId: string;
  userAddress: string;
  reviewType: ReviewType;
  title: string;
  ageRange?: string;
  sex?: string;
  pregnancyStatus?: string;
  symptoms?: string[];
  duration?: string;
  severity?: number;
  location?: string;
  associatedSymptoms?: string[];
  existingConditions?: string[];
  medications?: string[];
  allergies?: string[];
  freeText?: string;
  countryContext?: string;
  status: ReviewStatus;
  createdAt: string;
  reviewedAt?: string;
};

export type TriageResult = {
  reviewId: string;
  urgencyLevel: UrgencyLevel;
  confidence: number;
  possibleConditionCategories: string[];
  redFlagsPresent: boolean;
  redFlags: string[];
  summary: string;
  recommendedNextStep: string;
  selfCareGeneral: string[];
  whatToMonitor: string[];
  questionsForDoctor: string[];
  notDiagnosisNotice: string;
  reasoning: string;
};

export type FollowUp = {
  followupId: string;
  reviewId: string;
  userAddress: string;
  symptomChange: "better" | "same" | "worse" | "new_symptoms";
  newSymptoms: string[];
  resolvedSymptoms: string[];
  currentSeverity: number;
  freeText: string;
  createdAt: string;
};

export type RedFlagCheck = {
  redFlagsPresent: boolean;
  urgencyOverride: "EMERGENCY" | "URGENT_CARE" | "NONE";
  redFlags: string[];
  safetyMessage: string;
};

export type SafetyFlag = {
  genlayerReviewId: string;
  userWallet: string;
  urgencyOverride: string;
  redFlags: string[];
  safetyMessage: string;
  genlayerTx?: string;
  createdAt: string;
};

export type GenLayerProof = {
  contractAddress: string;
  methodName: string;
  txHash: string;
  status: string;
  timestamp: string;
  reviewId: string;
};

export type DashboardStats = {
  totalReviews: number;
  latestUrgencyLevel: UrgencyLevel | null;
  openFollowUps: number;
  emergencyFlags: number;
  reportReviews: number;
  symptomReviews: number;
};

export type Notification = {
  id: string;
  walletAddress: string;
  title: string;
  body: string;
  type?: string;
  read: boolean;
  createdAt: string;
};

export type ProfileRow = {
  id: string;
  wallet_address: string;
  display_name?: string;
  avatar_url?: string;
  consent_accepted: boolean;
  created_at: string;
  updated_at: string;
};

export type ReviewRow = {
  id: string;
  genlayer_review_id: string;
  user_wallet: string;
  review_type: ReviewType;
  title: string;
  summary?: string;
  urgency_level?: UrgencyLevel;
  status: ReviewStatus;
  red_flags_present: boolean;
  latest_genlayer_tx?: string;
  created_at: string;
  updated_at: string;
};
