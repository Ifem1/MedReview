import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/lib/providers";

export const metadata: Metadata = {
  title: "MedReview — Healthcare Triage Intelligence",
  description:
    "MedReview provides AI-assisted triage guidance. Submit symptoms or report summaries and receive structured urgency guidance powered by GenLayer. Not a medical diagnosis service.",
  keywords: ["triage", "healthcare", "symptoms", "medical review", "urgency"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className="min-h-full flex flex-col antialiased"
        style={{ backgroundColor: "var(--color-bg)", color: "var(--color-ink)" }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
