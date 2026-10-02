import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { LegalPage } from "@/components/LegalPage";
import { AuthorBox, SourceList } from "@/components/GuideMeta";
import { BRAND, absoluteUrl } from "@/lib/market/site";

const path = "/guides/pta-status";
const UPDATED = "2 October 2026";
const UPDATED_ISO = "2026-10-02";
const TITLE = "Non-PTA Meaning: PTA Approved vs Non-PTA Phones";
const DESCRIPTION =
  "Non-PTA means the IMEI is not registered in PTA's DIRBS, so Pakistani SIMs stop working after 60 days. PTA full form, JV, *8484#, tax and Urdu guide.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(path) },
  robots: { index: true, follow: true },
  openGraph: { title: TITLE, description: DESCRIPTION, url: absoluteUrl(path), type: "article", images: [{ url: "/og.jpg", width: 1200, height: 630, alt: TITLE }] },
};

const SOURCES = [
  { label: "PTA DIRBS — Frequently asked questions (dirbs.pta.gov.pk/faqs)", href: "https://dirbs.pta.gov.pk/faqs" },
  { label: "PTA DIRBS portal (dirbs.pta.gov.pk)", href: "https://dirbs.pta.gov.pk/" },
  {
    label: "FBR — Income Tax Ordinance 2001, Second Schedule clause (60E) (no s.148 tax on phones in personal baggage)",
    href: "https://download1.fbr.gov.pk/Docs/2025881983148210Income-Tax-Ordinance,-2001-Amended-upto-31.07.2025.pdf",
  },
  {
    label: "ProPakistani, 5 May 2025 — PTA warns of legal action over patched/JV mobile phones",
    href: "https://propakistani.pk/2025/05/05/pta-warns-of-legal-action-over-use-of-patched-jv-mobile-phones/",
  },
];

const FAQS = [
  {
    q: "What does non-PTA mean?",
    a: "Non-PTA means the phone's IMEI is not registered with the Pakistan Telecommunication Authority's DIRBS system. A valid non-PTA phone can use a Pakistani SIM for a limited time; if it is not registered and the FBR duty/tax is not paid within 60 days of its first use on a local network, calls, SMS and mobile data on Pakistani SIMs are blocked. Wi-Fi keeps working.",
  },
  {
    q: "What does PTA approved mean?",
    a: "PTA approved means the phone's IMEI is registered (compliant) in DIRBS, so it can be used with Pakistani SIM cards without being blocked. Either the official importer paid the duties, or an owner registered it on a CNIC or passport and paid the FBR duty/tax.",
  },
  {
    q: "What is the full form of PTA?",
    a: "PTA stands for Pakistan Telecommunication Authority, the telecom regulator. DIRBS stands for Device Identification, Registration and Blocking System, the PTA system that records which IMEIs may use Pakistani mobile networks.",
  },
  {
    q: "How do I check if a phone is PTA approved?",
    a: "Dial *#06# on the phone to see its IMEI, then send that IMEI by SMS to 8484 or enter it on dirbs.pta.gov.pk. Check every IMEI the phone has (dual-SIM phones and eSIM have more than one).",
  },
  {
    q: "What is the difference between PTA and non-PTA phones?",
    a: "A PTA approved phone works on Pakistani SIMs permanently. A non-PTA phone is cheaper to buy, but it needs FBR duty/tax paid through DIRBS to keep working on Pakistani SIMs after the 60-day window. Both work on Wi-Fi.",
  },
  {
    q: "What does JV mean on an iPhone?",
    a: "Sellers use JV for an iPhone that is locked to a foreign carrier and only accepts a Pakistani SIM through a SIM adapter (often called a JV SIM). JV is about the carrier lock, not PTA status. Adapters can stop working after an iOS update or reset.",
  },
  {
    q: "What is the difference between official PTA approved and PTA approved on CNIC or passport?",
    a: "Official PTA approved usually means the phone was imported by the brand's authorised distributor, with duty already paid and a local warranty. CNIC/passport (sometimes called online) PTA approved means an individual registered the IMEI in DIRBS and paid the tax. DIRBS warns that such a device is registered under that person's CNIC or passport and is bought or sold at your own risk.",
  },
  {
    q: "How do I register a non-PTA phone?",
    a: "Dial *8484# from the phone or use dirbs.pta.gov.pk (a franchise or customer service centre can also help), enter your CNIC or passport details and the IMEI, then pay the FBR duty/tax shown on the PSID at a bank. The PSID is valid for 7 days.",
  },
];

const cell = "border-b border-line px-3 py-2 align-top";

function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} className={`${cell} font-semibold text-ink`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]}>
              {r.map((c, i) => (
                <td key={i} className={cell}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function PtaGuide() {
  const url = absoluteUrl(path);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Article",
              "@id": `${url}#article`,
              headline: TITLE,
              description: DESCRIPTION,
              inLanguage: "en-PK",
              datePublished: "2026-09-16",
              dateModified: UPDATED_ISO,
              mainEntityOfPage: url,
              author: { "@type": "Organization", name: `${BRAND} editorial team`, url: absoluteUrl("/about") },
              publisher: {
                "@type": "Organization",
                name: BRAND,
                url: absoluteUrl("/"),
                logo: { "@type": "ImageObject", url: absoluteUrl("/icons/icon-512.png") },
              },
            },
            {
              "@type": "FAQPage",
              mainEntity: FAQS.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
                { "@type": "ListItem", position: 2, name: "Guides", item: absoluteUrl("/guides") },
                { "@type": "ListItem", position: 3, name: "PTA approved vs non-PTA", item: url },
              ],
            },
          ],
        }}
      />
      <LegalPage title="Non-PTA meaning: PTA approved vs non-PTA phones in Pakistan" updated={UPDATED}>
        <div className="not-prose rounded-xl border border-brand/20 bg-brand-soft p-4 text-ink" id="answer">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">Short answer</p>
          <p className="mt-2 text-base">
            <strong>Non-PTA</strong> means the phone&apos;s IMEI is <strong>not registered</strong> in PTA&apos;s DIRBS system.
            If it is not registered and the FBR duty/tax is not paid within <strong>60 days</strong> of first use on a Pakistani
            network, calls, SMS and mobile data on Pakistani SIMs are <strong>blocked</strong>. The phone still works on{" "}
            <strong>Wi-Fi</strong>.
          </p>
          <p className="mt-2 text-base">
            <strong>PTA approved</strong> means the IMEI is registered, so Pakistani SIMs keep working.{" "}
            <strong>PTA</strong> = Pakistan Telecommunication Authority. <strong>DIRBS</strong> = Device Identification,
            Registration and Blocking System.
          </p>
          <p className="mt-2 text-sm text-ink-soft">
            Check any phone: dial <strong>*#06#</strong> for the IMEI, then SMS it to <strong>8484</strong>. Register a phone:
            dial <strong>*8484#</strong> or use dirbs.pta.gov.pk.
          </p>
        </div>

        <h2 id="pta-full-form">PTA full form</h2>
        <p>
          <strong>PTA</strong> is the <strong>Pakistan Telecommunication Authority</strong>, Pakistan&apos;s telecom regulator. On a
          phone ad, &quot;PTA&quot; refers to whether the handset&apos;s IMEI is registered in PTA&apos;s{" "}
          <strong>DIRBS</strong> (Device Identification, Registration and Blocking System). DIRBS decides whether a handset may
          keep using Pakistani mobile networks.
        </p>

        <h2 id="non-pta-meaning">What does non-PTA mean?</h2>
        <p>
          A non-PTA phone has a valid IMEI that is <strong>not registered</strong> in DIRBS. These are usually phones brought from
          abroad or imported without duty. PTA&apos;s DIRBS FAQ says that a GSMA-valid device that is not registered must be
          registered, and the FBR duties/taxes paid, <strong>within 60 days of its first use</strong> on a local mobile network.
          Otherwise it is blocked.
        </p>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            <strong>Before blocking:</strong> a Pakistani SIM works normally during the 60-day window.
          </li>
          <li>
            <strong>After blocking:</strong> calls, SMS and mobile data on Pakistani SIMs stop.
          </li>
          <li>
            <strong>Wi-Fi note:</strong> blocking only covers mobile networks. The phone still works as a Wi-Fi device (WhatsApp
            on Wi-Fi, apps, camera).
          </li>
          <li>
            A non-PTA phone is <strong>not illegal to own</strong>. It is cheaper because the duty has not been paid yet.
          </li>
        </ul>

        <h2 id="pta-approved-meaning">What does PTA approved mean?</h2>
        <p>
          PTA approved (DIRBS calls it &quot;compliant&quot;) means the IMEI is registered and the phone can use any Pakistani
          SIM without being blocked. A phone becomes PTA approved in one of two ways:
        </p>

        <h3 className="!mt-4 text-base font-semibold text-ink" id="official-vs-cnic">
          Official PTA approved vs PTA approved on CNIC/passport (&quot;online PTA&quot;)
        </h3>
        <Table
          head={["Label in ads", "What it usually means", "What to watch"]}
          rows={[
            [
              "Official PTA approved",
              "Imported by the brand's authorised distributor. Duty paid at import; usually sold with a local warranty.",
              "Ask for the bill and the warranty card. Match the IMEI on the phone, box and bill.",
            ],
            [
              "PTA approved on CNIC / passport (\"online\" or \"self\" PTA)",
              "Someone brought the phone in and paid the FBR duty/tax themselves through DIRBS.",
              "DIRBS warns the device is registered under an individual's CNIC/passport and is bought or sold at your own risk. Check every IMEI.",
            ],
            [
              "Patched / CPID / \"VIP approved\"",
              "The phone's IMEI has been changed to another IMEI that is already registered. This is not real PTA approval.",
              "Avoid. PTA has warned of legal action against patched devices (ProPakistani, 5 May 2025).",
            ],
          ]}
        />

        <h2 id="pta-vs-non-pta">PTA approved vs non-PTA: comparison</h2>
        <Table
          head={["", "PTA approved", "Non-PTA"]}
          rows={[
            ["IMEI in DIRBS", "Registered (compliant)", "Not registered"],
            ["Pakistani SIM", "Works permanently", "Works for up to 60 days from first use, then blocked"],
            ["Wi-Fi", "Works", "Works, even after blocking"],
            ["Price when buying", "Higher (duty already paid)", "Lower (duty still unpaid)"],
            ["To make it work on SIM", "Nothing to do", "Register in DIRBS and pay FBR duty/tax (see PTA tax guide)"],
            ["Local warranty", "Usually, if bought from the official distributor", "Usually no local brand warranty"],
          ]}
        />

        <h2 id="jv-meaning">JV and FU meaning (iPhone ads)</h2>
        <p>
          <strong>JV</strong> is used in Pakistani ads for an iPhone that is <strong>locked to a foreign carrier</strong>. It only
          accepts a Pakistani SIM through a SIM adapter (often called a &quot;JV SIM&quot;). Adapters can stop working after an iOS
          update, a reset or a SIM change. <strong>FU</strong> (factory unlocked) means the iPhone is not carrier-locked.
        </p>
        <p>
          JV and FU are about the <strong>carrier lock</strong>. PTA approved and non-PTA are about <strong>DIRBS
          registration</strong>. A phone has one of each, e.g. &quot;FU non-PTA&quot; or &quot;JV non-PTA&quot;. PTA has warned of
          legal action over patched and JV phones (ProPakistani, 5 May 2025), so treat JV phones as Wi-Fi phones unless you
          accept that risk.
        </p>

        <h2 id="check-pta-status">How to check PTA status by IMEI</h2>
        <ol className="list-decimal space-y-1 pl-6">
          <li>
            Dial <strong>*#06#</strong> on the phone you are buying. It shows the IMEI (two IMEIs on dual-SIM phones).
          </li>
          <li>
            Send each IMEI as an SMS to <strong>8484</strong>, or enter it on <strong>dirbs.pta.gov.pk</strong>.
          </li>
          <li>Read the reply. &quot;Compliant&quot; means PTA approved; &quot;valid, not registered&quot; means non-PTA.</li>
          <li>Make sure the IMEI on the screen matches the box and bill. Never check a number the seller types for you.</li>
        </ol>

        <h2 id="register">How to register a non-PTA phone (*8484#)</h2>
        <ol className="list-decimal space-y-1 pl-6">
          <li>
            Dial <strong>*8484#</strong> from the phone, or go to dirbs.pta.gov.pk. A franchise or customer service centre of your
            mobile operator can also do it.
          </li>
          <li>
            Choose the route. <strong>Local applicant:</strong> CNIC plus a SIM issued on that CNIC. <strong>International
            traveller:</strong> passport (plus CNIC/NICOP if applicable) within 60 days of arrival.
          </li>
          <li>
            The system generates a <strong>PSID</strong> (valid 7 days). Pay it at a bank; the IMEI is then whitelisted.
          </li>
        </ol>

        <h2 id="pta-tax">PTA tax</h2>
        <p>
          &quot;PTA tax&quot; is really FBR customs duty and taxes collected when you register the IMEI in DIRBS. The amount depends
          on the phone&apos;s assessed value in US dollars and on the route. Phones in personal baggage are exempt from the s.148
          income tax under clause (60E) of the Income Tax Ordinance, which is one reason the passport route usually costs less.
          See the{" "}
          <Link href="/guides/pta-tax" className="link">
            PTA tax guide and calculator
          </Link>{" "}
          for the current slabs and published amounts for iPhone 17 models.
        </p>

        <h2 id="urdu" lang="ur">
          اردو میں: پی ٹی اے اپرووڈ اور نان پی ٹی اے کا مطلب
        </h2>
        <div lang="ur" dir="rtl" className="space-y-2 text-base leading-loose">
          <p>
            <strong>پی ٹی اے</strong> کا مطلب ہے پاکستان ٹیلی کمیونیکیشن اتھارٹی۔ <strong>پی ٹی اے اپرووڈ</strong> فون کا آئی ایم
            ای آئی (IMEI) ڈربس (DIRBS) میں رجسٹرڈ ہوتا ہے، اس لیے پاکستانی سم ہمیشہ چلتی ہے۔
          </p>
          <p>
            <strong>نان پی ٹی اے</strong> فون رجسٹرڈ نہیں ہوتا۔ پہلی بار پاکستانی نیٹ ورک پر چلنے کے 60 دن کے اندر ٹیکس ادا کر کے
            رجسٹر نہ کیا جائے تو سم (کال، ایس ایم ایس، موبائل ڈیٹا) بند ہو جاتی ہے، لیکن وائی فائی چلتا رہتا ہے۔
          </p>
          <p>چیک کرنے کے لیے *#06# ملا کر آئی ایم ای آئی دیکھیں اور اسے 8484 پر ایس ایم ایس کریں۔ رجسٹریشن کے لیے *8484# ملائیں۔</p>
        </div>
        <p>
          <strong>Roman Urdu:</strong> PTA approved ka matlab hai ke phone ka IMEI PTA ke DIRBS system mein registered hai, is
          liye Pakistani SIM hamesha chalti hai. Non-PTA ka matlab hai IMEI registered nahi. 60 din ke andar tax de kar register
          na karein to SIM band ho jati hai, lekin Wi-Fi chalta rehta hai. Check karne ke liye *#06# se IMEI dekhein aur 8484 par
          SMS karein.
        </p>

        <h2 id="before-you-pay">Before you pay for a used phone</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>Check every IMEI yourself (SMS 8484) on the phone in your hand.</li>
          <li>Match the IMEI on the screen, box and bill. A mismatch is a reason to walk away.</li>
          <li>Insert your own SIM and make a call before paying.</li>
          <li>Ask whether &quot;PTA approved&quot; means official, CNIC or passport. Avoid patched/CPID phones.</li>
          <li>
            Read the{" "}
            <Link href="/guides/inspect-used-phone" className="link">
              inspection checklist
            </Link>{" "}
            and{" "}
            <Link href="/guides/common-scams" className="link">
              common scams
            </Link>
            .
          </li>
        </ul>
        <p>
          Browse{" "}
          <Link href="/pta-approved-phones" className="link">
            PTA approved used phones
          </Link>
          ,{" "}
          <Link href="/non-pta-phones" className="link">
            non-PTA phones
          </Link>{" "}
          or{" "}
          <Link href="/used-mobile-phones" className="link">
            all used mobile phones in Pakistan
          </Link>
          . Seller-declared PTA status on {BRAND} is a claim; verify it.
        </p>

        <h2 id="faq">FAQ</h2>
        {FAQS.map((f) => (
          <section key={f.q}>
            <h3 className="!mt-4 text-base font-semibold text-ink">{f.q}</h3>
            <p>{f.a}</p>
          </section>
        ))}

        <h2 id="sources">Sources</h2>
        <SourceList sources={SOURCES} />
        <AuthorBox reviewed={UPDATED} />
      </LegalPage>
    </>
  );
}
