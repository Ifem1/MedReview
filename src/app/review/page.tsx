import ClinicalHeader from "@/components/layout/ClinicalHeader";
import SafetyNotice from "@/components/triage/SafetyNotice";
import Link from "next/link";

const reviewTypes = [
  {
    href: "/review/symptoms",
    emoji: "🩺",
    title: "Symptom Review",
    description: "Describe your symptoms and receive a structured urgency triage recommendation.",
  },
  {
    href: "/review/report",
    emoji: "📄",
    title: "Report Review",
    description: "Paste or summarise a lab result, scan report, discharge note, or medical letter.",
  },
  {
    href: "/review/medication",
    emoji: "💊",
    title: "Medication Concern",
    description: "Questions about side effects, missed doses, or drug interactions.",
  },
  {
    href: "/review/child",
    emoji: "👶",
    title: "Child Symptom Review",
    description: "Specialised caution review for children under 12. Lower threshold for urgent care.",
    badge: "Extra Caution",
  },
  {
    href: "/review/pregnancy",
    emoji: "🤰",
    title: "Pregnancy Concern Review",
    description: "Lower-threshold triage for pregnancy symptoms. Dismissal of serious symptoms is not permitted.",
    badge: "Extra Caution",
  },
  {
    href: "/dashboard",
    emoji: "🔄",
    title: "Follow-up Review",
    description: "Update a previous session if your symptoms have changed, improved, or worsened.",
  },
];

export default function ReviewPage() {
  return (
    <>
      <ClinicalHeader />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div>
          <h1
            className="text-3xl font-bold mb-2"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}
          >
            Choose Review Type
          </h1>
          <p style={{ color: "var(--color-ink-secondary)" }}>
            Select the type of triage review that best fits your situation.
          </p>
        </div>

        <SafetyNotice />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {reviewTypes.map((rt) => (
            <Link key={rt.href} href={rt.href}>
              <div
                className="rounded-2xl border p-5 h-full flex flex-col gap-3 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg"
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderColor: "var(--color-border)",
                  boxShadow: "0 1px 4px var(--color-panel-shadow)",
                }}
              >
                <div className="flex items-start justify-between">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                    style={{ backgroundColor: "var(--color-surface-soft)" }}
                  >
                    {rt.emoji}
                  </div>
                  {rt.badge && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{
                        backgroundColor: "#FFEDD5",
                        color: "#C2410C",
                      }}
                    >
                      {rt.badge}
                    </span>
                  )}
                </div>
                <div>
                  <p
                    className="font-semibold text-base"
                    style={{ fontFamily: "var(--font-heading)", color: "var(--color-ink)" }}
                  >
                    {rt.title}
                  </p>
                  <p
                    className="text-sm mt-1 leading-relaxed"
                    style={{ color: "var(--color-ink-secondary)" }}
                  >
                    {rt.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
