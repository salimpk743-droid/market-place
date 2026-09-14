import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { absoluteUrl } from "@/lib/market/site";

export const metadata: Metadata = {
  title: "How to Check a Used Phone Before Buying in Pakistan",
  description:
    "Learn what to check before buying a used phone in Pakistan, including IMEI, PTA status, condition, battery, display, cameras and network.",
  alternates: { canonical: absoluteUrl("/guides/buy-used-phone") },
  robots: { index: true, follow: true },
};

export default function BuyUsedPhoneGuide() {
  return (
    <LegalPage title="How to Check a Used Phone Before Buying in Pakistan" updated="14 September 2026">
      <p>
        A used-phone ad is a starting point. Before you pay, inspect and test the handset in front of you and compare it
        with the listing. Photos, PTA labels and condition notes can be incomplete or out of date.
      </p>

      <h2>Why you should check a used phone before buying</h2>
      <p>
        Once money has changed hands, it is much harder to undo a bad deal. Checking the phone yourself helps you catch
        a different IMEI, a cracked screen under a protector, a camera that will not focus, or a listing that does not
        match the device. None of the checks below prove a phone is original or has never been repaired. They only show
        what you can see and test at the meeting.
      </p>

      <h2>Check the IMEI</h2>
      <p>
        The IMEI identifies that specific phone. Read it on the device you are buying and compare it with any IMEI the
        seller showed you. If the numbers do not match, stop until you understand why.
      </p>
      <p>
        You will also need that IMEI to verify PTA status.{" "}
        <Link href="/guides/pta-status" className="link">
          How to check PTA status
        </Link>
        .
      </p>

      <h2>Verify PTA status</h2>
      <p>
        PTA/DIRBS status should be checked independently before payment. A seller’s label, screenshot or verbal claim is
        not enough on its own. Use the IMEI from the actual phone and follow the steps here:{" "}
        <Link href="/guides/pta-status" className="link">
          How to check PTA status
        </Link>
        .
      </p>

      <h2>Check the phone's physical condition</h2>
      <p>Look at the phone in good light, without rushing. Note anything the listing did not mention.</p>
      <ul className="list-disc space-y-1 pl-6">
        <li>Screen: cracks, chips, deep scratches, or a protector hiding damage</li>
        <li>Frame: bends, gaps, or uneven edges</li>
        <li>Back panel: cracks, lifting, or a replacement that does not sit flush</li>
        <li>Camera lenses: scratches, haze, or loose glass</li>
        <li>Buttons: power, volume and any extra keys should click and return</li>
        <li>Charging port: debris, looseness, or a cable that only works at an angle</li>
        <li>Signs of damage or repair: mismatched colour, leftover adhesive, or a replaced part that was not disclosed</li>
      </ul>

      <h2>Test the display and touchscreen</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>Look for spots, lines, burn-in, or a tint that the photos hid</li>
        <li>Drag your finger across the whole screen, including the corners</li>
        <li>Raise and lower brightness and watch for flicker or dead areas</li>
        <li>Confirm the screen responds evenly, not only in the centre</li>
      </ul>
      <p>These checks show how the display behaves today. They do not prove the screen is original.</p>

      <h2>Test cameras, speakers and microphone</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>Front camera: a selfie in the meeting light</li>
        <li>Rear cameras: a still photo with each advertised lens</li>
        <li>Flash, if the phone has one</li>
        <li>Speakers: a short video or song at a moderate volume</li>
        <li>Microphone: a voice note, then play it back</li>
      </ul>
      <p>Ask the seller to unlock the camera app if the phone is still signed into their account.</p>

      <h2>Check charging and battery</h2>
      <p>
        Plug in with a cable you trust and confirm the phone starts charging. If the device shows battery health, read
        that number on the phone itself, not from a screenshot. There is no single percentage that makes a used phone a
        good or bad buy. Watch for sudden shutdowns or unusual heat while you test.
      </p>

      <h2>Test SIM and mobile network</h2>
      <p>
        If you can do so safely at the meeting, check that a SIM is recognised, that a call connects, and that mobile
        data works. PTA status should still be verified separately, because a phone that makes a call today may not match
        the status in the listing.
      </p>

      <h2>Check storage and specifications</h2>
      <p>
        Open the phone’s about/settings screen and confirm the model, storage, RAM where it is shown, colour, and any
        other details that matter to you. They should match the ad. Do not assume two phones with a similar name have the
        same storage or features.
      </p>

      <h2>Compare the listing with the actual phone</h2>
      <p>Keep the ad open and check it against the device:</p>
      <ul className="list-disc space-y-1 pl-6">
        <li>Title and photos</li>
        <li>Description and condition</li>
        <li>Storage</li>
        <li>PTA status</li>
        <li>Price</li>
      </ul>
      <p>
        If something does not match, treat the listing as incomplete. Seller-provided information should be independently
        checked.
      </p>

      <h2>Meet safely and inspect before paying</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>Meet in a public place</li>
        <li>Inspect and test the phone before payment</li>
        <li>Do not rush because of pressure from a seller</li>
        <li>Confirm the device and agreed terms before paying</li>
      </ul>
      <p>
        <Link href="/guides/common-scams" className="link">
          Read common mobile marketplace scams
        </Link>
        .
      </p>

      <h2>Buying used phones on Mobile Market</h2>
      <p>
        Mobile Market is a classifieds marketplace for used phones and mobile accessories in Pakistan. Sellers post ads.
        Buyers search, meet and deal directly. Condition, PTA status and other listing details may be declared by sellers
        and should be independently verified.
      </p>
      <p>
        <Link href="/phones" className="link">
          Browse used phones for sale in Pakistan
        </Link>
        .
      </p>

      <h2>Final used-phone checklist</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>Check IMEI</li>
        <li>Verify PTA status</li>
        <li>Inspect physical condition</li>
        <li>Test display and touchscreen</li>
        <li>Test cameras</li>
        <li>Test speakers and microphone</li>
        <li>Test charging</li>
        <li>Check battery health where available</li>
        <li>Test SIM, calls and mobile data</li>
        <li>Confirm model and storage</li>
        <li>Compare the actual phone with the listing</li>
        <li>Inspect and test before paying</li>
      </ul>

      <h2>FAQ</h2>
      <h3 className="!mt-4 text-base font-semibold text-ink">What should I check before buying a used phone?</h3>
      <p>
        IMEI, PTA status, physical condition, display, cameras, audio, charging, battery information if shown, SIM and
        network, and whether the model and storage match the listing. Inspect before you pay.
      </p>
      <h3 className="!mt-4 text-base font-semibold text-ink">How do I check the IMEI of a used phone?</h3>
      <p>
        Read the IMEI on the device you are buying and compare it with any number the seller provided. Use that same
        IMEI when you verify PTA status.
      </p>
      <h3 className="!mt-4 text-base font-semibold text-ink">How do I check PTA status before buying a used phone?</h3>
      <p>
        Use the IMEI from the actual phone and follow{" "}
        <Link href="/guides/pta-status" className="link">
          How to check PTA status
        </Link>
        . Do not rely only on the ad.
      </p>
      <h3 className="!mt-4 text-base font-semibold text-ink">Should I test a used phone before paying?</h3>
      <p>
        Yes. Power it on, try the screen, cameras, sound, charging and, where you can, a SIM. Pay after you are satisfied
        with the same unit you inspected.
      </p>
      <h3 className="!mt-4 text-base font-semibold text-ink">What should I check on a used iPhone or Samsung phone?</h3>
      <p>
        The same checklist applies: identity, PTA status, condition, display, cameras, charging, battery information if
        the phone shows it, and network tests. Confirm the model and storage on the device, not only from the listing
        title.
      </p>
      <h3 className="!mt-4 text-base font-semibold text-ink">Is it safe to buy a used phone from a marketplace?</h3>
      <p>
        It can be, if you meet in public, inspect the phone, and pay only after the checks above. A marketplace listing
        is not a guarantee. Treat seller claims as claims.
      </p>
    </LegalPage>
  );
}
