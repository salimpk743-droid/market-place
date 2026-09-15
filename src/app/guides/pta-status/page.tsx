import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { absoluteUrl } from "@/lib/market/site";

export const metadata: Metadata = {
  title: "PTA Approved & Non-PTA Phone Meaning in Pakistan | IMEI Check",
  description:
    "What does PTA approved mean? Learn what non-PTA means in Pakistan, how to check a phone's PTA/DIRBS status by IMEI, and what to verify before buying a used phone.",
  alternates: { canonical: absoluteUrl("/guides/pta-status") },
  robots: { index: true, follow: true },
};

export default function PtaGuide() {
  return (
    <LegalPage title="PTA Approved & Non-PTA Phone Meaning in Pakistan" updated="16 September 2026">
      <p>
        Buying a used mobile phone in Pakistan? Before you pay, check the phone's IMEI and verify its current PTA/DIRBS
        status. This guide explains what <strong>PTA approved</strong> and <strong>non-PTA</strong> mean and what to check
        before completing a deal.
      </p>

      <h2>What does PTA approved mean?</h2>
      <p>
        "PTA approved" is commonly used in phone listings to describe a handset whose IMEI is registered for local mobile
        network use. Treat the seller's label as a claim and verify the actual IMEI yourself before paying.
      </p>
      <p>
        PTA status can be specific to the handset's IMEI, so do not rely only on a product photo, an old screenshot, or a
        seller's message. Check the phone you are actually buying.
      </p>

      <h2>What does non-PTA mean?</h2>
      <p>
        "Non-PTA" usually means the seller believes the handset's IMEI is not currently registered for local network use,
        or that registration is still pending. The label alone does not tell you every detail about the device's current
        status or future network use.
      </p>
      <p>
        A non-PTA phone is not automatically unusable or worthless. The important step is to verify the current status of
        the exact IMEI and understand the implications before you buy.
      </p>

      <h2>PTA approved vs non-PTA</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr>
              <th className="border-b border-line px-3 py-2 font-semibold">Listing label</th>
              <th className="border-b border-line px-3 py-2 font-semibold">What it usually means</th>
              <th className="border-b border-line px-3 py-2 font-semibold">What you should do</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-b border-line px-3 py-2">PTA approved</td>
              <td className="border-b border-line px-3 py-2">Seller says the IMEI is registered for local network use.</td>
              <td className="border-b border-line px-3 py-2">Verify the actual IMEI before payment.</td>
            </tr>
            <tr>
              <td className="border-b border-line px-3 py-2">Non-PTA</td>
              <td className="border-b border-line px-3 py-2">Seller says the IMEI is not currently registered or registration is pending.</td>
              <td className="border-b border-line px-3 py-2">Check the current status and understand the implications before buying.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>How to check PTA status by IMEI</h2>
      <p>Use the IMEI of the phone you are actually buying, not a number copied from an advertisement.</p>
      <ol className="list-decimal space-y-1 pl-6">
        <li>Open the Messages app.</li>
        <li>Create a new SMS.</li>
        <li>Type the phone's IMEI number.</li>
        <li>Send the SMS to 8484.</li>
        <li>Review the response for the device's PTA/DIRBS status.</li>
      </ol>
      <p>
        If the response does not match the seller's claim, pause the transaction until you understand the difference.
      </p>

      <h2>How to find the IMEI</h2>
      <p>
        Read the IMEI from the phone you are buying and compare it with any IMEI shown on the device or packaging when
        available. If the numbers do not match, do not pay until the mismatch is explained.
      </p>
      <p>Then use that same IMEI for the PTA/DIRBS status check.</p>

      <h2>What to check before paying for a used phone</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>Verify the IMEI on the actual device.</li>
        <li>Verify the current PTA/DIRBS status.</li>
        <li>Confirm the exact phone model and storage capacity.</li>
        <li>Check the display, cameras, charging, speakers, and microphone.</li>
        <li>Test SIM and mobile-network functionality.</li>
        <li>Check battery health where the device provides it.</li>
        <li>Compare the physical device with the seller's description.</li>
        <li>Inspect the phone in person before payment.</li>
      </ul>

      <h2>Buying a used phone on Mobile Market</h2>
      <p>
        Mobile Market is a classifieds marketplace for phones and mobile accessories in Pakistan. Sellers post ads and
        buyers can search listings and deal directly. PTA status, condition, and other listing details may be declared by
        sellers, so verify important claims before payment.
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
      <h3 className="!mt-4 text-base font-semibold text-ink">What is the meaning of PTA approved?</h3>
      <p>
        It is a common marketplace label for a phone whose IMEI is said to be registered for local mobile network use.
        Verify the actual IMEI rather than relying only on the listing label.
      </p>

      <h3 className="!mt-4 text-base font-semibold text-ink">What does non-PTA mean?</h3>
      <p>
        It usually means the seller says the phone's IMEI is not currently registered for local network use or that
        registration is pending. Check the current status of the exact IMEI before buying.
      </p>

      <h3 className="!mt-4 text-base font-semibold text-ink">How can I check the PTA status of a mobile phone?</h3>
      <p>
        Read the IMEI on the phone, send it by SMS to 8484, and review the response for the device's PTA/DIRBS status. Do
        this using the device you are actually considering buying.
      </p>

      <h3 className="!mt-4 text-base font-semibold text-ink">What number do I send the IMEI to for PTA verification?</h3>
      <p>Send the IMEI as an SMS to 8484, then review the response for the device's PTA/DIRBS status.</p>

      <h3 className="!mt-4 text-base font-semibold text-ink">Why should I check IMEI before buying a used phone?</h3>
      <p>
        The IMEI identifies the specific handset. Checking it helps you verify that the phone in front of you matches the
        device being sold and gives you the identifier needed for the status check.
      </p>

      <h3 className="!mt-4 text-base font-semibold text-ink">Should I trust a seller's PTA status claim?</h3>
      <p>
        Treat it as a claim, not a certificate. Screenshots can become outdated. Verify the status using the actual IMEI
        before you pay.
      </p>
    </LegalPage>
  );
}
