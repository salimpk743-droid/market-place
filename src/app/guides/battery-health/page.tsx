import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { AuthorBox, SourceList } from "@/components/GuideMeta";
import { absoluteUrl } from "@/lib/market/site";

export const metadata: Metadata = {
  title: "Battery health on used phones",
  description: "How to read iPhone battery health, what 80% at 500 or 1,000 cycles means, the non-genuine battery warning, and why Android figures are hard to verify.",
  alternates: { canonical: absoluteUrl("/guides/battery-health") },
};

export default function BatteryGuide() {
  return (
    <LegalPage title="Battery health on used phones" updated="2 October 2026">
      <p>
        A “94% battery” line in an ad is the seller’s claim. Check the number on the phone itself, in person, not in a
        screenshot.
      </p>
      <h2>iPhone</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>Open Settings → Battery → Battery Health. It shows Maximum Capacity, measured against the battery when it was new.</li>
        <li>
          Apple says iPhone 14 and earlier batteries are designed to keep 80% of their original capacity at 500 complete
          charge cycles under ideal conditions, and iPhone 15 batteries at 1,000 cycles. A brand-new phone can read slightly
          under 100%.
        </li>
        <li>
          On iPhone XS, XR and later, a message that iPhone is “unable to verify this iPhone has a genuine Apple battery”
          means the battery was replaced with one Apple cannot verify, and the health figure may not be accurate.
        </li>
        <li>A “Performance management applied” note means the phone has already shut down unexpectedly because the battery could not deliver peak power.</li>
      </ul>
      <h2>Android</h2>
      <p>
        Many Android phones do not show a battery health percentage in Settings, and third-party apps only estimate it.
        Treat an Android battery percentage in an ad as a claim you cannot easily verify.
      </p>
      <h2>What to watch during the meeting</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>A phone with 100% after two years of “heavy use” deserves a second look.</li>
        <li>Replacement batteries can be poor quality even if the percentage looks fine.</li>
        <li>Watch the temperature and any shutdowns during your inspection, not only the number.</li>
      </ul>
      <p>Mobile Market does not measure batteries. If the number matters to you, check it on the device before paying.</p>
      <h2>Sources</h2>
      <SourceList sources={[{ label: "Apple Support: iPhone battery and performance (published 1 June 2026)", href: "https://support.apple.com/en-us/101575" }]} />
      <AuthorBox reviewed="2 October 2026" sourcesNote="iPhone battery facts come from Apple's support page above; the rest is general advice from our editorial team." />
    </LegalPage>
  );
}
