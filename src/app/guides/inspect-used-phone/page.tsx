import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { absoluteUrl } from "@/lib/market/site";

export const metadata: Metadata = {
  title: "How to inspect a used phone in Pakistan",
  description: "A practical checklist for screen, IMEI, cameras, charging and a safe meeting.",
  alternates: { canonical: absoluteUrl("/guides/inspect-used-phone") },
};

export default function InspectGuide() {
  return (
    <LegalPage title="How to inspect a used phone before you pay" updated="9 September 2026">
      <p>
        Do this at the meeting, in your hands, with the phone powered on. A listing photo is not an inspection. Mobile
        Market does not inspect devices for you.
      </p>
      <h2>Identity of the phone</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>Open Settings and read the IMEI. On many Androids: About phone. On iPhone: General → About.</li>
        <li>Dial <code>*#06#</code> and compare. Open the SIM tray and compare the printed IMEI if present.</li>
        <li>Mismatch is a walk-away signal.</li>
      </ul>
      <h2>Body and screen</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>Look across the screen at an angle for burn-in, green tint, or hairline cracks under a glass replacement.</li>
        <li>Press every edge of the display. Dead spots and “ghost touch” show up here.</li>
        <li>Check camera glass, flash, and whether the frame is bent (a drop that cameras cannot hide).</li>
      </ul>
      <h2>Functions</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>Make a test call on both SIMs if the seller claims dual SIM.</li>
        <li>Face ID / fingerprint, loudspeaker, earpiece, microphone, Wi-Fi, Bluetooth, charging with your own cable.</li>
        <li>Open the cameras — selfie and rear, including ultrawide if advertised.</li>
      </ul>
      <h2>Accounts</h2>
      <p>
        The phone should be signed out of iCloud / Google. An activation lock after you pay is a classic trap. Do not
        accept “I’ll remove it tonight”.
      </p>
    </LegalPage>
  );
}
