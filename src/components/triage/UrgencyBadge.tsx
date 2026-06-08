import { UrgencyLevel } from "@/types/medreview";
import { urgencyLabel, urgencyDescription } from "@/lib/utils";
import {
  ShieldCheck,
  CalendarDays,
  Clock,
  AlertCircle,
  Siren,
} from "lucide-react";

interface Props {
  level: UrgencyLevel;
  showDescription?: boolean;
  size?: "sm" | "md" | "lg";
}

const config: Record<
  UrgencyLevel,
  {
    bg: string;
    text: string;
    border: string;
    icon: React.ElementType;
  }
> = {
  SELF_MONITOR: {
    bg: "#DCFCE7",
    text: "#15803D",
    border: "#86EFAC",
    icon: ShieldCheck,
  },
  ROUTINE_DOCTOR: {
    bg: "#E0F2FE",
    text: "#0369A1",
    border: "#7DD3FC",
    icon: CalendarDays,
  },
  SOON_DOCTOR: {
    bg: "#FEF3C7",
    text: "#B45309",
    border: "#FCD34D",
    icon: Clock,
  },
  URGENT_CARE: {
    bg: "#FFEDD5",
    text: "#C2410C",
    border: "#FDBA74",
    icon: AlertCircle,
  },
  EMERGENCY: {
    bg: "#FEE2E2",
    text: "#B91C1C",
    border: "#FCA5A5",
    icon: Siren,
  },
};

export default function UrgencyBadge({
  level,
  showDescription = false,
  size = "md",
}: Props) {
  const c = config[level];
  const Icon = c.icon;
  const isEmergency = level === "EMERGENCY";

  const padding =
    size === "sm" ? "px-2 py-0.5" : size === "lg" ? "px-5 py-3" : "px-3 py-1.5";
  const textSize =
    size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm";
  const iconSize =
    size === "sm" ? "w-3 h-3" : size === "lg" ? "w-5 h-5" : "w-4 h-4";

  return (
    <div className={isEmergency ? "animate-pulse-emergency" : ""}>
      <div
        className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ${padding} ${textSize}`}
        style={{
          backgroundColor: c.bg,
          color: c.text,
          borderColor: c.border,
          fontFamily: "var(--font-heading)",
        }}
      >
        <Icon className={iconSize} />
        {urgencyLabel(level)}
      </div>
      {showDescription && (
        <p
          className="mt-1.5 text-sm font-medium"
          style={{ color: c.text }}
        >
          {urgencyDescription(level)}
        </p>
      )}
    </div>
  );
}
