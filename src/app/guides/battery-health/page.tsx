import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { absoluteUrl } from "@/lib/market/site";

export const metadata: Metadata = {
  title: "Battery health on used phones",
  description: "How to read battery health numbers and what can be faked.",
  alternates: { canonical: absoluteUrl("/guides/battery-health") },
};

export default function BatteryGuide() {
  return (
    <LegalPage title="Battery health on used phones" updated="9 September 2026">
      <p>
        A “94% battery” line in an ad is the seller’s claim. On iPhones, Settings → Battery → Battery Health is the usual
        place to look — in person, not in a screenshot. On Android the number may be hidden, shown by the maker, or
        invented by a third-party app.
      </p>
      <ul className="list-disc space-y-1 pl-6">
        <li>A new-looking phone with 100% after two years of “heavy use” deserves a second look.</li>
        <li>Replacement batteries can be poor quality even if the percentage looks fine.</li>
        <li>Watch the temperature and shutdowns during your inspection, not only the number.</li>
      </ul>
      <p>Mobile Market does not measure batteries. If the number matters to you, check it on the device before paying.</p>
    </LegalPage>
  );
}
