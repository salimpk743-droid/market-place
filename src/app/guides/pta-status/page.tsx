import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { absoluteUrl } from "@/lib/market/site";

export const metadata: Metadata = {
  title: "How to Check PTA Status of a Mobile Phone in Pakistan",
  description:
    "Learn how to check PTA status of a mobile phone in Pakistan before buying. Check the IMEI and verify the device's PTA status before you pay.",
  alternates: { canonical: absoluteUrl("/guides/pta-status") },
  robots: { index: true, follow: true },
};

export default function PtaGuide() {
  return (
    <LegalPage title="How to Check PTA Status of a Mobile Phone in Pakistan" updated="14 September 2026">
      <p>
        When you buy a used phone in Pakistan, check the device yourself before you pay. A listing may mention PTA
        status, but that is the seller’s claim. Confirm it on the phone in front of you.
      </p>

      <h2>What does PTA approved mean?</h2>
      <p>
        PTA status is about whether a handset is registered for use on Pakistani mobile networks. Sellers often label a
        phone as PTA approved or non-PTA. Those labels are useful as a starting point, not as proof. Official records
        can change, and a screenshot in an ad can be old.
      </p>

      <h2>How to check PTA status by SMS</h2>
      <p>Use the IMEI of the phone you are actually buying, not a number from a photo or a previous listing.</p>
      <ol className="list-decimal space-y-1 pl-6">
        <li>Open the Messages app.</li>
        <li>Create a new SMS.</li>
        <li>Type the phone's IMEI number.</li>
        <li>Send the SMS to 8484.</li>
        <li>Review the response to determine the device's PTA/DIRBS status.</li>
      </ol>
      <p>
        If the reply does not match what the seller told you, pause the deal until you understand the difference.
      </p>

      <h2>Find the phone's IMEI</h2>
      <p>
        Read the IMEI on the device itself. Compare it with any IMEI printed on the phone or its packaging when that
        information is available. If the numbers do not match, do not pay until the mismatch is explained.
      </p>
      <p>Then send that same IMEI to 8484 using the steps above.</p>

      <h2>What to check before paying for a used phone</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>Verify IMEI.</li>
        <li>Verify PTA status.</li>
        <li>Confirm the exact phone model.</li>
        <li>Confirm storage capacity.</li>
        <li>Check physical condition.</li>
        <li>Test the display.</li>
        <li>Test cameras.</li>
        <li>Test charging.</li>
        <li>Test speakers and microphone.</li>
        <li>Test SIM/mobile network functionality.</li>
        <li>Check battery health where the device provides it.</li>
        <li>Make sure the seller's description matches the actual device.</li>
        <li>Inspect the phone before payment.</li>
      </ul>

      <h2>PTA approved vs non-PTA</h2>
      <p>
        PTA approved usually means the seller believes the IMEI is registered for local network use. Non-PTA usually
        means the seller believes it is not, or that registration is still pending. Neither label is a legal verdict, and
        a non-PTA phone is not automatically unusable, blocked, or worthless.
      </p>
      <p>
        Prices and network behaviour can differ. Check the current status yourself before you buy, rather than relying on
        the ad wording alone.
      </p>

      <h2>Buying a used phone on Mobile Market</h2>
      <p>
        Mobile Market is a classifieds marketplace for phones and mobile accessories in Pakistan. Sellers post ads.
        Buyers search, meet, and deal directly. PTA status, condition, and other listing details may be declared by
        sellers and should be independently verified before payment.
      </p>
      <p>
        <Link href="/phones" className="link">
          Browse used phones for sale in Pakistan
        </Link>
        . For fraud patterns to watch for,{" "}
        <Link href="/guides/common-scams" className="link">
          read common mobile marketplace scams
        </Link>
        .
      </p>

      <h2>FAQ</h2>
      <h3 className="!mt-4 text-base font-semibold text-ink">How can I check the PTA status of a mobile phone?</h3>
      <p>
        Read the IMEI on the phone, send it by SMS to 8484, and read the reply. Do this at the meeting, using the device
        you are about to buy.
      </p>
      <h3 className="!mt-4 text-base font-semibold text-ink">What number do I send the IMEI to for PTA verification?</h3>
      <p>Send the IMEI as an SMS to 8484, then review the response for the device's PTA/DIRBS status.</p>
      <h3 className="!mt-4 text-base font-semibold text-ink">Why should I check IMEI before buying a used phone?</h3>
      <p>
        The IMEI identifies that specific handset. Checking it helps you confirm you are inspecting the same phone that
        will be sold, and it is what you send to 8484.
      </p>
      <h3 className="!mt-4 text-base font-semibold text-ink">Should I trust a seller's PTA status claim?</h3>
      <p>
        Treat it as a claim, not a certificate. Screenshots can be outdated. Verify the status on the actual IMEI before
        you pay.
      </p>
      <h3 className="!mt-4 text-base font-semibold text-ink">What should I check before paying for a used phone?</h3>
      <p>
        Confirm IMEI and PTA status, then check the model, storage, condition, display, cameras, charging, audio, SIM
        reception, and battery information if the phone shows it. Inspect the device in person before payment.
      </p>
    </LegalPage>
  );
}
