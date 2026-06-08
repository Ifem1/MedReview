import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { UrgencyLevel } from "@/types/medreview";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateReviewId(): string {
  return `review_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function generateFollowUpId(): string {
  return `followup_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function urgencyColor(level: UrgencyLevel): string {
  switch (level) {
    case "SELF_MONITOR":
      return "urgency-green";
    case "ROUTINE_DOCTOR":
      return "routine-blue";
    case "SOON_DOCTOR":
      return "soon-amber";
    case "URGENT_CARE":
      return "urgent-orange";
    case "EMERGENCY":
      return "emergency-red";
  }
}

export function urgencyLabel(level: UrgencyLevel): string {
  switch (level) {
    case "SELF_MONITOR":
      return "Self Monitor";
    case "ROUTINE_DOCTOR":
      return "Routine Doctor";
    case "SOON_DOCTOR":
      return "See Doctor Soon";
    case "URGENT_CARE":
      return "Urgent Care";
    case "EMERGENCY":
      return "Emergency";
  }
}

export function urgencyDescription(level: UrgencyLevel): string {
  switch (level) {
    case "SELF_MONITOR":
      return "Low urgency based on submitted information.";
    case "ROUTINE_DOCTOR":
      return "Book a routine medical appointment.";
    case "SOON_DOCTOR":
      return "Arrange medical review within 24–72 hours.";
    case "URGENT_CARE":
      return "Seek same-day urgent care.";
    case "EMERGENCY":
      return "Seek emergency medical care now.";
  }
}

export const EMERGENCY_KEYWORDS = [
  "chest pain",
  "can't breathe",
  "cannot breathe",
  "difficulty breathing",
  "trouble breathing",
  "stroke",
  "unconscious",
  "passed out",
  "fainted",
  "seizure",
  "severe bleeding",
  "allergic reaction",
  "anaphylaxis",
  "suicidal",
  "self harm",
  "severe head injury",
  "collapse",
  "collapsed",
  "high fever stiff neck",
  "pregnancy bleeding",
  "sepsis",
];

export function detectEmergencyKeywords(text: string): boolean {
  const lower = text.toLowerCase();
  return EMERGENCY_KEYWORDS.some((kw) => lower.includes(kw));
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function truncate(str: string, max = 80): string {
  if (str.length <= max) return str;
  return str.slice(0, max - 3) + "...";
}
