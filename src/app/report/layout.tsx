import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Report a listing",
  robots: { index: false, follow: true },
};

export default function ReportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
