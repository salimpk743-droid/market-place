/**
 * Accessory price hubs and AirPods guides.
 *
 * Rules (same as model-prices.ts and brand-hubs.ts): every price is a retailer's listed price on a
 * dated check, linked to the product page it came from. Items a retailer showed as out of stock on
 * the check date are left out. We do not publish used prices; used items link to real listings.
 */

export const ACCESSORY_CHECKED = "4 October 2026";

export type AccessoryPrice = {
  name: string;
  /** Listed price in PKR on ACCESSORY_CHECKED. */
  pkr: number;
  retailer: "PriceOye" | "Shophive";
  href: string;
  note?: string;
};

export type AccessoryPriceTable = {
  heading: string;
  intro?: string;
  rows: AccessoryPrice[];
};

export type AccessorySection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  links?: { href: string; label: string }[];
};

export type AccessoryPage = {
  path: string;
  title: string;
  description: string;
  h1: string;
  updated: string;
  intro: string[];
  tables: AccessoryPriceTable[];
  sections: AccessorySection[];
  faqs: { question: string; answer: string }[];
  related: { href: string; label: string }[];
  sources: { href: string; label: string }[];
};

const po = (name: string, pkr: number, path: string, note?: string): AccessoryPrice => ({
  name,
  pkr,
  retailer: "PriceOye",
  href: `https://priceoye.pk/wireless-earbuds/${path}`,
  ...(note ? { note } : {}),
});
const sh = (name: string, pkr: number, slug: string, note?: string): AccessoryPrice => ({
  name,
  pkr,
  retailer: "Shophive",
  href: `https://www.shophive.com/${slug}/`,
  ...(note ? { note } : {}),
});

const SRC = {
  poApple: { href: "https://priceoye.pk/wireless-earbuds/apple", label: "PriceOye: Apple earbuds and headphones, prices and stock checked 4 October 2026" },
  poEarbuds: { href: "https://priceoye.pk/wireless-earbuds", label: "PriceOye: wireless earbuds and headphones by brand, prices and stock checked 4 October 2026" },
  shAirpods: { href: "https://www.shophive.com/catalogsearch/result/?q=airpods", label: "Shophive: Apple AirPods product pages, prices and stock checked 4 October 2026" },
  appleIdentify: { href: "https://support.apple.com/en-us/109525", label: "Apple Support: Identify your AirPods (model numbers and charging cases), checked 4 October 2026" },
  appleAirpods: { href: "https://www.apple.com/airpods/", label: "Apple: AirPods line-up and comparison, checked 4 October 2026" },
  appleSell: { href: "https://support.apple.com/en-us/102131", label: "Apple Support: Before you sell, give away, return, or recycle your AirPods (published 25 March 2025)" },
  appleLock: { href: "https://support.apple.com/en-us/102620", label: "Apple Support: If an item or device is connected to another Apple Account (published 14 September 2026)" },
  appleCoverage: { href: "https://checkcoverage.apple.com/", label: "Apple: Check Coverage (serial number lookup)" },
};

const LISTINGS = {
  earbuds: { href: "/accessories/earbuds", label: "Used earbuds and AirPods for sale" },
  headphones: { href: "/accessories/headphones", label: "Used headphones for sale" },
  all: { href: "/accessories", label: "All mobile accessories for sale" },
};

const CITY_GUIDES = [
  { href: "/guides/best-mobile-market-in-karachi", label: "Karachi mobile market (Saddar, Cooperative Market for accessories)" },
  { href: "/guides/best-mobile-market-in-lahore", label: "Lahore mobile market (Hafeez Centre, Hall Road)" },
  { href: "/guides/best-mobile-market-in-rawalpindi", label: "Rawalpindi mobile market (Singapore Plaza)" },
  { href: "/guides/best-mobile-market-in-peshawar", label: "Peshawar mobile market (Saddar accessories wholesale)" },
];

const NO_PTA =
  "AirPods, earbuds and headphones have no SIM slot and no IMEI, so there is no PTA approval to check. What matters is whether the item is genuine, whose warranty it carries, and whether it is locked to someone else's account.";

/* ------------------------------- AirPods hub ------------------------------- */

export const AIRPODS_HUB: AccessoryPage = {
  path: "/accessories/airpods-price-in-pakistan",
  title: "AirPods Price in Pakistan 2026: AirPods 5, Pro 3, 4 and Max 2",
  description:
    "AirPods price in Pakistan, checked 4 October 2026: AirPods 4, AirPods 5, AirPods Pro 3 and AirPods Max 2 at named retailers, with model numbers, fake checks and used AirPods tips.",
  h1: "AirPods price in Pakistan (October 2026)",
  updated: ACCESSORY_CHECKED,
  intro: [
    "These are listed prices at two Pakistani online retailers, PriceOye and Shophive, on 4 October 2026, each linked to the product page. Apple has no store of its own in Pakistan, and the prices move often, so treat every number as that day's listing, not a fixed rate.",
    NO_PTA,
  ],
  tables: [
    {
      heading: "New AirPods prices in Pakistan",
      intro: "Only items the retailer showed in stock on 4 October 2026. Model numbers are from Apple's own identification page.",
      rows: [
        sh("AirPods 4 (A3053, A3050, A3054)", 35999, "apple-airpods-4-2024-mxp63", "Shophive lists it as MXP63"),
        po("AirPods 4 (A3053, A3050, A3054)", 36999, "apple/apple-airpods-4"),
        po("AirPods 4 with Active Noise Cancellation (A3056, A3055, A3057)", 50999, "apple/airpods-4-active-noise-cancellation"),
        sh("AirPods 4 with Active Noise Cancellation (A3056, A3055, A3057)", 55999, "apple-airpods-4-2024-with-active-noise-cancellation-mxp93", "Shophive lists it as MXP93"),
        sh("AirPods 5 (A3531, A3532, A3533)", 55999, "apple-airpods-5-2026-mkfw4ll"),
        sh("AirPods 5 with Wireless Charging Case (A3439, A3440, A3441)", 64999, "apple-airpods-5-2026-with-wireless-charging-case-mkft4ll"),
        po("AirPods 5 with Wireless Charging Case (A3439, A3440, A3441)", 71999, "apple/apple-airpods-5-with-wireless-charging-case"),
        sh("AirPods Pro 3 (A3063, A3064, A3065)", 64999, "apple-airpods-pro-3-2025-with-active-noise-cancellation-mfhp4ll"),
        sh("AirPods Max 2 (A3454)", 179999, "apple-airpods-max-2-with-active-noise-cancellation-2026"),
      ],
    },
  ],
  sections: [
    {
      heading: "Which AirPods are current?",
      paragraphs: [
        "Apple's AirPods page, checked on 4 October 2026, lists AirPods 5, AirPods 5 with Wireless Charging Case, AirPods Pro 3 and AirPods Max 2. Apple says AirPods 5 have up to 1.5 times more Active Noise Cancellation than AirPods 4 with Active Noise Cancellation, and AirPods Max 2 up to 1.5 times more than the original AirPods Max.",
        "Both retailers still listed AirPods 4 (2024) in stock, as the table shows. PriceOye's Apple page did not list AirPods Pro 2, AirPods 3 or AirPods 2 on 4 October 2026, so we have no new price for them; look for them on the used listings.",
      ],
    },
    {
      heading: "AirPods model numbers: match them before you pay",
      paragraphs: [
        "Apple's identification page lists a model number for every generation. On an iPhone, open Settings, then Bluetooth, and tap the info button next to the AirPods. On AirPods and AirPods Pro the number is also printed under each earbud, starting with A. On AirPods Max it is behind the cushion on the left ear cup.",
      ],
      bullets: [
        "AirPods 5: A3531, A3532, A3533 (2026). With Wireless Charging Case: A3439, A3440, A3441.",
        "AirPods 4 with ANC: A3056, A3055, A3057 (2024). AirPods 4: A3053, A3050, A3054 (2024).",
        "AirPods Pro 3: A3063, A3064, A3065 (2025).",
        "AirPods Pro 2, USB-C case: A3047, A3048, A3049 (2023). Lightning case: A2931, A2699, A2698 (2022).",
        "AirPods 3: A2565, A2564 (2021). AirPods 2: A2032, A2031 (2019).",
        "AirPods Max 2: A3454 (2026). AirPods Max USB-C: A3184 (2024). AirPods Max Lightning: A2096 (2020).",
      ],
    },
    {
      heading: "Used AirPods price",
      paragraphs: [
        "We do not publish a 'used AirPods price', because we cannot source one for a given day. Use the new prices above as the ceiling, then look at what sellers are asking on the used earbuds listings. A used pair still locked to the seller's Apple Account is worth far less, because you cannot pair it to yours: read the used AirPods guide before you pay.",
      ],
      links: [LISTINGS.earbuds, { href: "/guides/buy-used-airpods", label: "How to buy used AirPods safely" }, { href: "/guides/fake-airpods", label: "How to spot fake or copy AirPods" }],
    },
    {
      heading: "Copy AirPods: why the price gap matters",
      paragraphs: [
        "A pair offered far below the cheapest price in the table is a reason to check harder, not a bargain. Ask for the model number, check it against Apple's list, and look the serial number up on Apple's coverage page. The fake AirPods guide walks through each step.",
      ],
    },
    {
      heading: "Where to buy AirPods in person",
      paragraphs: [
        "The big phone markets sell AirPods alongside phones and covers. Ask to pair them with your own iPhone at the counter, check the model number, and get a bill that names the model. The city guides below name the buildings.",
      ],
      links: CITY_GUIDES,
    },
  ],
  faqs: [
    {
      question: "What is the price of AirPods 4 in Pakistan?",
      answer: "On 4 October 2026, Shophive listed AirPods 4 at Rs 35,999 and PriceOye at Rs 36,999. AirPods 4 with Active Noise Cancellation were Rs 50,999 at PriceOye and Rs 55,999 at Shophive.",
    },
    {
      question: "What is the AirPods Pro 3 price in Pakistan?",
      answer: "Shophive listed AirPods Pro 3 at Rs 64,999 and in stock on 4 October 2026. PriceOye showed them out of stock that day, so we do not quote its price.",
    },
    {
      question: "What is the price of AirPods 5 in Pakistan?",
      answer: "On 4 October 2026, Shophive listed AirPods 5 at Rs 55,999 and AirPods 5 with Wireless Charging Case at Rs 64,999. PriceOye listed the Wireless Charging Case version at Rs 71,999.",
    },
    {
      question: "Do AirPods need PTA approval?",
      answer: "No. AirPods have no SIM and no IMEI, so there is nothing to register with PTA. Check that they are genuine and not locked to someone else's Apple Account.",
    },
    {
      question: "How much are used AirPods in Pakistan?",
      answer: "We do not publish a used price we cannot source. Compare sellers' asking prices on the used earbuds listings with the new prices on this page, and make sure the seller has removed the AirPods from their Apple Account.",
    },
  ],
  related: [
    LISTINGS.earbuds,
    { href: "/accessories/earbuds-price-in-pakistan", label: "Earbuds price in Pakistan by brand" },
    { href: "/accessories/headphones-price-in-pakistan", label: "Headphones price in Pakistan" },
    { href: "/guides/fake-airpods", label: "How to spot fake AirPods" },
    { href: "/guides/buy-used-airpods", label: "Buying used AirPods" },
    { href: "/phones/apple", label: "iPhone prices in Pakistan" },
    { href: "/used-mobile-phones", label: "Used phones in Pakistan" },
  ],
  sources: [SRC.poApple, SRC.shAirpods, SRC.appleAirpods, SRC.appleIdentify, SRC.appleCoverage],
};

/* ------------------------------- Earbuds hub ------------------------------- */

export const EARBUDS_HUB: AccessoryPage = {
  path: "/accessories/earbuds-price-in-pakistan",
  title: "Earbuds Price in Pakistan 2026: Audionic, Ronin, Redmi Buds, Galaxy Buds",
  description:
    "Wireless earbuds (airbuds) price in Pakistan, checked 4 October 2026: Audionic, Ronin, Redmi Buds, Samsung Galaxy Buds, realme, Anker Soundcore, Oraimo, Infinix, Sony and JBL.",
  h1: "Earbuds price in Pakistan by brand (October 2026)",
  updated: ACCESSORY_CHECKED,
  intro: [
    "Every price below is PriceOye's listed price on 4 October 2026 for an item it showed in stock, linked to the product page. Where PriceOye also shows a crossed-out higher price, we quote only the current listed price. Prices change often, so open the link before you decide.",
    "Many sellers call wireless earbuds 'airbuds' (Audionic names some models that way). " + NO_PTA,
  ],
  tables: [
    {
      heading: "Audionic earbuds price",
      rows: [
        po("Audionic Wireless Airbuds 425", 3899, "audionic/audionic-wireless-airbuds-425"),
        po("Audionic Battlebuds", 4799, "audionic/audionic-battlebuds-wireless-earbuds"),
        po("Audionic Airbud 550", 4949, "audionic/audionic-airbud-550"),
        po("Audionic Airbud 735 Ion with ANC", 5849, "audionic/audionic-airbud-735-ion-with-anc"),
        po("Audionic Trance Airbud 850 (ANC)", 8599, "audionic/audionic-trance-airbud-850-earbuds"),
        po("Audionic Trance Airbud 810 with ANC", 9449, "audionic/audionic-trance-airbud-810-with-anc"),
      ],
    },
    {
      heading: "Ronin earbuds price",
      rows: [
        po("Ronin R-7005", 4699, "ronin/ronin-r-7005-wireless-earbuds"),
        po("Ronin R-520", 5399, "ronin/ronin-r-520-earbuds"),
        po("Ronin R-7145 Glaze", 5999, "ronin/ronin-r-7145-glaze-wireless-earbuds"),
        po("Ronin Pebble R-7130", 6099, "ronin/ronin-pebble-r-7130-wireless-earbuds"),
        po("Ronin R-7090 Gaming", 7499, "ronin/ronin-r-7090-gaming-earbuds"),
      ],
    },
    {
      heading: "Xiaomi Redmi Buds price",
      rows: [
        po("Redmi Buds 6 Play", 4349, "xiaomi/redmi-buds-6-play-wireless-earbuds"),
        po("Redmi Buds 6 Active", 4499, "xiaomi/redmi-buds-6-active-wireless-earbuds"),
        po("Redmi Buds 8 Active", 6999, "xiaomi/redmi-buds-8-active-wireless-earbuds"),
        po("Redmi Buds 8 Lite", 8199, "xiaomi/redmi-buds-8-lite"),
        po("Redmi Buds 8", 11999, "xiaomi/redmi-buds-8"),
        po("Redmi Buds 6 Pro", 17299, "xiaomi/redmi-buds-6-pro"),
        po("Redmi Buds 8 Pro", 17999, "xiaomi/redmi-buds-8-pro-wireless-earbuds"),
      ],
    },
    {
      heading: "Samsung Galaxy Buds price",
      intro: "PriceOye lists some Galaxy Buds twice: a version labelled '1 Year Brand Warranty' and an unlabelled one at a different price. Ask which you are buying.",
      rows: [
        po("Samsung Galaxy Buds Core", 11999, "samsung/samsung-galaxy-buds-core-1-year-brand-warranty"),
        po("Samsung Galaxy Buds Core (1 Year Brand Warranty)", 12499, "samsung/samsung-galaxy-buds-core"),
        po("Samsung Galaxy Buds3 FE", 21499, "samsung/samsung-galaxy-buds3-fe"),
        po("Samsung Galaxy Buds 3", 25499, "samsung/samsung-galaxy-buds3"),
        po("Samsung Galaxy Buds 3 FE (1 Year Brand Warranty)", 28799, "samsung/samsung-galaxy-buds-3-fe-1-year-brand-warranty"),
        po("Samsung Galaxy Buds 4", 35499, "samsung/samsung-galaxy-buds-4"),
        po("Samsung Galaxy Buds 3 Pro", 38599, "samsung/samsung-galaxy-buds3-pro"),
        po("Samsung Galaxy Buds 4 Pro", 49999, "samsung/samsung-galaxy-buds-4-pro"),
      ],
    },
    {
      heading: "realme Buds price",
      rows: [
        po("realme Buds Air Neo", 2999, "realme/realme-buds-air-neo"),
        po("realme Buds Air 2", 4849, "realme/realme-air-2-wireless-earbuds"),
        po("realme Buds T200 Lite", 5349, "realme/realme-buds-t200-lite"),
        po("realme Buds T500 Pro", 15499, "realme/realme-buds-t500-pro"),
      ],
    },
    {
      heading: "Anker Soundcore earbuds price",
      rows: [
        po("Anker Soundcore R50i", 4999, "anker/anker-r50i-earbuds"),
        po("Anker Soundcore R50i NC", 6999, "anker/anker-a3959h11-soundcore-r50i-nc"),
        po("Anker Soundcore P30i", 9499, "anker/anker-soundcore-p30i-true-wireless-noise-cancelling-earbuds"),
        po("Anker Soundcore Liberty 4 NC", 15299, "anker/anker-soundcore-liberty-4-nc-earbuds"),
        po("Anker Soundcore Liberty 5", 19999, "anker/anker-soundcore-liberty-5-earbuds"),
      ],
    },
    {
      heading: "Budget China earbuds: Infinix and Oraimo",
      rows: [
        po("Infinix XE33", 2199, "infinix/infinix-xe33-wireless-earbuds"),
        po("Oraimo SpaceBuds Air (OTW-324S)", 2699, "oraimo/oraimo-otw-324s-spacebuds-air-true-wireless-earbuds"),
        po("Infinix Buds Xeo4", 2999, "infinix/infinix-buds-xeo4"),
        po("Oraimo SpaceBuds Pro (OTW-930)", 11999, "oraimo/oraimo-spacebuds-pro-true-wireless-earbuds-otw-930"),
      ],
    },
    {
      heading: "Sony and JBL earbuds price",
      rows: [
        po("JBL Wave Flex", 9799, "jbl/jbl-wave-flex-wireless-earbuds"),
        po("JBL Wave Beam 2", 16599, "jbl/jbl-wave-beam-2-wireless-earbuds"),
        po("Sony WF-C510", 17999, "sony/sony-truly-wireless-earbuds-wf-c510"),
        po("Sony WF-C710", 27999, "sony/sony-truly-wireless-earbuds-wf-c710"),
        po("Sony WF-1000XM5", 59999, "sony/sony-wf-1000xm5-wireless-noise-cancelling-earbuds"),
        po("Sony WF-1000XM6", 80499, "sony/sony-wf-1000xm6-wireless-headphones"),
      ],
    },
  ],
  sections: [
    {
      heading: "AirPods prices",
      paragraphs: ["Apple AirPods have their own page, with prices from two retailers and Apple's model numbers."],
      links: [{ href: "/accessories/airpods-price-in-pakistan", label: "AirPods price in Pakistan" }],
    },
    {
      heading: "Affordable earbuds: what the cheapest prices buy",
      paragraphs: [
        "On 4 October 2026 the cheapest in-stock pairs in these tables were Infinix, Oraimo, realme, Audionic and Redmi models between about Rs 2,200 and Rs 5,000. Pairs labelled ANC (active noise cancellation) or ENC (call noise reduction) cost more within each brand. These are the retailer's descriptions, not our test results.",
      ],
    },
    {
      heading: "Buying earbuds in a mobile market",
      paragraphs: [
        "Mobile markets sell earbuds next to phones and covers. Copies of popular models are common enough that the price alone tells you little. Ask to pair the earbuds with your own phone at the counter, play something, make a test call, and get a bill that names the model and the warranty.",
      ],
      links: CITY_GUIDES,
    },
    {
      heading: "Used earbuds",
      paragraphs: [
        "We do not publish used earbud prices. If you buy second hand, check both earbuds and the case charge, ask how old they are, and compare the asking price with the new prices above. For AirPods, also make sure they are removed from the seller's Apple Account.",
      ],
      links: [LISTINGS.earbuds, { href: "/guides/buy-used-airpods", label: "Buying used AirPods" }],
    },
  ],
  faqs: [
    {
      question: "What are the cheapest wireless earbuds in Pakistan?",
      answer: "Among in-stock items on PriceOye on 4 October 2026, the Infinix XE33 was Rs 2,199, the Oraimo SpaceBuds Air Rs 2,699 and the realme Buds Air Neo Rs 2,999.",
    },
    {
      question: "What is the price of Audionic airbuds in Pakistan?",
      answer: "On 4 October 2026, PriceOye listed Audionic models from Rs 3,899 (Wireless Airbuds 425) to Rs 9,449 (Trance Airbud 810 with ANC).",
    },
    {
      question: "What is the Samsung Galaxy Buds price in Pakistan?",
      answer: "PriceOye listed Galaxy Buds Core from Rs 11,999, Galaxy Buds 3 at Rs 25,499, Galaxy Buds 4 at Rs 35,499 and Galaxy Buds 4 Pro at Rs 49,999 on 4 October 2026. Some versions are labelled '1 Year Brand Warranty' at a different price.",
    },
    {
      question: "What is the Redmi Buds price in Pakistan?",
      answer: "PriceOye listed Redmi Buds 6 Play at Rs 4,349, Redmi Buds 8 at Rs 11,999 and Redmi Buds 8 Pro at Rs 17,999 on 4 October 2026.",
    },
    {
      question: "Do earbuds need PTA approval?",
      answer: "No. Earbuds have no SIM and no IMEI. Check the warranty and that they are genuine instead.",
    },
  ],
  related: [
    LISTINGS.earbuds,
    { href: "/accessories/airpods-price-in-pakistan", label: "AirPods price in Pakistan" },
    { href: "/accessories/headphones-price-in-pakistan", label: "Headphones price in Pakistan" },
    { href: "/phones/samsung", label: "Samsung phone prices" },
    { href: "/phones/xiaomi", label: "Xiaomi and Redmi phone prices" },
    { href: "/phones/realme", label: "realme phone prices" },
    { href: "/phones/infinix", label: "Infinix phone prices" },
  ],
  sources: [SRC.poEarbuds],
};

/* ------------------------------ Headphones hub ----------------------------- */

export const HEADPHONES_HUB: AccessoryPage = {
  path: "/accessories/headphones-price-in-pakistan",
  title: "Headphones Price in Pakistan 2026: Sony, JBL, Anker, Audionic, AirPods Max",
  description:
    "Wireless headphones price in Pakistan, checked 4 October 2026: Audionic, Ronin, Oraimo, Anker Soundcore, JBL, Sony WH-1000XM6 and AirPods Max 2, each linked to the retailer page.",
  h1: "Headphones price in Pakistan (October 2026)",
  updated: ACCESSORY_CHECKED,
  intro: [
    "Listed prices on 4 October 2026 for over-ear and on-ear wireless headphones the retailer showed in stock, linked to each product page. PriceOye files headphones under its earbuds section; AirPods Max 2 is from Shophive. Prices change often.",
  ],
  tables: [
    {
      heading: "Budget wireless headphones",
      rows: [
        po("Ronin R-1525 Rap", 3949, "ronin/ronin-r-1525-rap-wireless-headphones"),
        po("Oraimo BoomPop 2 ENC (OHP-610)", 4349, "oraimo/oraimo-boompop-2-enc-over-ear-wireless-headphones-ohp-610"),
        po("Ronin Magnus R-1520", 5749, "ronin/ronin-magnus-r-1520-wireless-headphones"),
        po("Audionic Hammer 120 Pro (on-ear)", 5849, "audionic/audionic-hammer-120-pro-on-ear-headphone"),
        po("Audionic Trance 100 ANC", 6749, "audionic/audionic-trance-100-anc-wireless-headphone"),
        po("Audionic Hammer Wireless", 6749, "audionic/audionic-hammer-wireless-headphone"),
        po("Ronin Hurricane R-1515", 8049, "ronin/ronin-hurricane-r-1515-headphones"),
      ],
    },
    {
      heading: "Mid-range headphones",
      rows: [
        po("Anker Soundcore Life Q10i", 10999, "anker/anker-soundcore-q10i-wireless-headphones"),
        po("Sony WH-CH520", 10999, "sony/sony-wh-ch520-wireless-headphones"),
        po("Anker Soundcore Life Q20i", 11249, "anker/anker-soundcore-life-q20i-headphones"),
        po("JBL Tune T720BT", 16949, "jbl/jbl-headset-t720bt-wireless-headphones"),
        po("JBL Tune 660NC", 17499, "jbl/jbl-tune-660nc-headphone"),
        po("Anker Soundcore Space One", 18699, "anker/anker-soundcore-space-one-headphones"),
        po("Sony WH-CH720N", 25499, "sony/sony-wh-ch720n-wireless-headphones"),
      ],
    },
    {
      heading: "Premium noise-cancelling headphones",
      rows: [
        po("Anker Soundcore Space One Pro", 34999, "anker/anker-soundcore-space-one-pro-headphones"),
        po("Sony WH-ULT-900N", 48499, "sony/sony-wh-ult-900n-wireless-headphones"),
        po("Sony WH-1000XM6", 105999, "sony/sony-wh-1000xm6-wireless-headphones"),
        sh("Apple AirPods Max 2 (A3454)", 179999, "apple-airpods-max-2-with-active-noise-cancellation-2026"),
      ],
    },
  ],
  sections: [
    {
      heading: "What we left out",
      paragraphs: [
        "Several popular models, including the Sony WH-1000XM4 and WH-1000XM5, JBL Tune 670NC and Anker Soundcore Life Q30 and Space Q45, were listed but out of stock at PriceOye on 4 October 2026, so we do not quote a price for them.",
      ],
    },
    {
      heading: "Buying headphones second hand",
      paragraphs: [
        "Check both ear cups play cleanly at high volume, the noise cancelling switches on and off, the cushions are not cracked and the battery holds a charge for the length of your test. For AirPods Max, the model number is behind the left ear cushion, and the seller must remove them from their Apple Account. We do not publish used headphone prices; compare asking prices with the new prices above.",
      ],
      links: [LISTINGS.headphones, { href: "/guides/buy-used-airpods", label: "Buying used AirPods and AirPods Max" }],
    },
    {
      heading: "Where to buy in person",
      paragraphs: ["Phone markets sell headphones alongside earbuds and covers. Test before you pay and get a bill with the model and warranty."],
      links: CITY_GUIDES,
    },
  ],
  faqs: [
    {
      question: "What is the Sony WH-1000XM6 price in Pakistan?",
      answer: "PriceOye listed the Sony WH-1000XM6 at Rs 105,999, in stock, on 4 October 2026.",
    },
    {
      question: "What is the AirPods Max price in Pakistan?",
      answer: "Shophive listed AirPods Max 2 at Rs 179,999, in stock, on 4 October 2026.",
    },
    {
      question: "What are good cheap wireless headphones in Pakistan?",
      answer: "We do not rank headphones. On 4 October 2026, in-stock models under Rs 7,000 at PriceOye included the Ronin R-1525 Rap (Rs 3,949), Oraimo BoomPop 2 (Rs 4,349) and Audionic Trance 100 ANC (Rs 6,749).",
    },
    {
      question: "Why is the WH-1000XM5 not on this page?",
      answer: "PriceOye showed it out of stock on 4 October 2026, and we only quote prices for items in stock on the day we checked.",
    },
  ],
  related: [
    LISTINGS.headphones,
    { href: "/accessories/earbuds-price-in-pakistan", label: "Earbuds price in Pakistan" },
    { href: "/accessories/airpods-price-in-pakistan", label: "AirPods price in Pakistan" },
    LISTINGS.all,
  ],
  sources: [SRC.poEarbuds, SRC.shAirpods, SRC.appleIdentify],
};

/* ------------------------------- Fake AirPods ------------------------------ */

export const FAKE_AIRPODS_GUIDE: AccessoryPage = {
  path: "/guides/fake-airpods",
  title: "How to Spot Fake AirPods in Pakistan: Copy vs Original Checks",
  description:
    "Copy AirPods vs original: check the model number against Apple's list, the case, the serial on Apple's coverage page, and Find My, plus the price gap that should worry you.",
  h1: "How to spot fake (copy) AirPods",
  updated: ACCESSORY_CHECKED,
  intro: [
    "'Master copy' and 'first copy' AirPods are sold openly. Some are close enough on the outside that a quick look will not tell you. These checks use Apple's own published information, and most take a few minutes at the counter.",
  ],
  tables: [],
  sections: [
    {
      heading: "1. Check the model number against Apple's list",
      paragraphs: [
        "On an iPhone, open Settings, then Bluetooth, and tap the info button next to the AirPods. Apple's identification page lists the model numbers for every generation, for example A3063, A3064 and A3065 for AirPods Pro 3, and A3531, A3532 and A3533 for AirPods 5. On AirPods and AirPods Pro the model number is also printed under each earbud, starting with A. If the number is missing, or does not match the model on the box, stop there.",
      ],
      links: [{ href: "/accessories/airpods-price-in-pakistan", label: "AirPods model numbers and prices" }],
    },
    {
      heading: "2. Check the case matches the earbuds",
      paragraphs: [
        "Apple lists each charging case separately, with its own model number, and says, for example, that the Charging Case for AirPods 5 works only with AirPods 5 earbuds, not the Wireless Charging Case version or any other AirPods. Apple also says where the serial number is printed on each case; on AirPods 5 cases it is under the lid. A case that does not match the earbuds is either a replacement or a fake.",
      ],
    },
    {
      heading: "3. Look the serial number up on Apple's coverage page",
      paragraphs: [
        "Enter the serial number on Apple's Check Coverage page. A genuine serial should come back with the right model. A result only proves the serial exists, not that the pair in your hand carries it, so also compare the serial shown in Settings with the one on the case and the box.",
      ],
    },
    {
      heading: "4. Use Find My",
      paragraphs: [
        "Genuine AirPods pair to one Apple Account at a time. Apple says that when you set up AirPods still linked to someone else, the Find My app shows a message that they are paired to another Apple Account, and Apple cannot remove that Find My Lock; only the previous owner can. A brand new sealed pair should set up on your account without that message.",
      ],
    },
    {
      heading: "5. Compare the price",
      paragraphs: [
        "On 4 October 2026 the cheapest new AirPods in stock at the two Pakistani retailers we checked (PriceOye and Shophive) were AirPods 4 at Rs 35,999 at Shophive. 'New AirPods Pro' at a small fraction of that are almost certainly not genuine.",
      ],
    },
    {
      heading: "If you already bought a fake",
      paragraphs: [
        "Go back to the seller with the bill. If they refuse, Pakistan's consumer courts and the seller's platform are the routes; keep the bill, the chat and any payment record. Copies are sometimes sold honestly as copies at copy prices; the problem is a copy sold as original.",
      ],
      links: [{ href: "/guides/common-scams", label: "Common marketplace scams" }, { href: "/buyer-safety", label: "Buyer safety" }],
    },
  ],
  faqs: [
    {
      question: "How can I tell if AirPods are original?",
      answer: "Check the model number in Settings against Apple's list, make sure the case matches the earbuds, look the serial up on Apple's Check Coverage page, and confirm the AirPods set up on your Apple Account without a 'connected to another Apple Account' message.",
    },
    {
      question: "Where is the model number on AirPods?",
      answer: "In Settings, then Bluetooth, then the info button next to the AirPods. It is also printed under each AirPod, starting with A, and behind the left ear cushion on AirPods Max.",
    },
    {
      question: "Are 'master copy' AirPods the same as original?",
      answer: "No. A copy is not made by Apple, whatever it is called. It will not have a model and serial that check out with Apple.",
    },
    {
      question: "What is the cheapest price for original AirPods in Pakistan?",
      answer: "Of the two retailers we checked on 4 October 2026, the cheapest new pair in stock was AirPods 4 at Rs 35,999 at Shophive.",
    },
  ],
  related: [
    { href: "/accessories/airpods-price-in-pakistan", label: "AirPods price in Pakistan" },
    { href: "/guides/buy-used-airpods", label: "Buying used AirPods" },
    LISTINGS.earbuds,
    { href: "/guides/common-scams", label: "Common used-phone scams" },
  ],
  sources: [SRC.appleIdentify, SRC.appleCoverage, SRC.appleLock, SRC.shAirpods],
};

/* ------------------------------- Used AirPods ------------------------------ */

export const USED_AIRPODS_GUIDE: AccessoryPage = {
  path: "/guides/buy-used-airpods",
  title: "Buying Used AirPods in Pakistan: Find My Lock, Fakes and Fair Prices",
  description:
    "Before you buy second hand AirPods: make the seller remove them from their Apple Account, check the model and case, test both earbuds, and compare with new prices checked 4 October 2026.",
  h1: "How to buy used AirPods safely",
  updated: ACCESSORY_CHECKED,
  intro: [
    "Second hand AirPods can be a fair deal or a pair you can never use properly. The biggest trap is not a weak battery: it is a pair still locked to the seller's Apple Account. Apple says only the previous owner can remove that lock.",
  ],
  tables: [],
  sections: [
    {
      heading: "1. The seller must remove the AirPods from their Apple Account",
      paragraphs: [
        "Apple says AirPods can be paired with only one Apple Account at a time, and the owner must remove them before selling. On an iPhone they open the Find My app, choose Devices, tap the AirPods, swipe up and tap Remove This Device. Apple says it cannot remove this Find My Lock for you; only the previous owner can.",
        "If a seller cannot or will not do it in front of you, do not buy. Apple says a reset alone stops the AirPods sharing location with the previous owner, but you still will not be able to pair them to your own Apple Account.",
      ],
    },
    {
      heading: "2. Check the model and the case",
      paragraphs: [
        "Match the model number in Settings, under Bluetooth and the info button, with Apple's list, and make sure the case is the right one for those earbuds. Apple says some cases work only with their own earbuds. The fake AirPods guide has the full check.",
      ],
      links: [{ href: "/guides/fake-airpods", label: "How to spot fake AirPods" }],
    },
    {
      heading: "3. Test both earbuds and the case",
      paragraphs: [
        "Play music through each earbud on its own, make a call, try noise cancelling and transparency if the model has them, and watch the case charge. A seller's battery claim is hard to verify on the spot, so give more weight to what you can test.",
      ],
    },
    {
      heading: "4. Ask about AppleCare and the bill",
      paragraphs: [
        "Apple says an AppleCare plan on AirPods can be transferred to a new owner. Ask whether there is one, and ask for the original bill. A pair with a bill and a transferable plan is worth more than one without.",
      ],
    },
    {
      heading: "5. Price it against new",
      paragraphs: [
        "We do not publish a used AirPods price. On 4 October 2026, new AirPods 4 started at Rs 35,999 and AirPods Pro 3 were Rs 64,999 at Shophive. A used pair should be well below the new price of the same model, and older generations such as AirPods Pro 2 and AirPods 3 sit below current ones.",
      ],
      links: [{ href: "/accessories/airpods-price-in-pakistan", label: "New AirPods prices" }, LISTINGS.earbuds],
    },
    {
      heading: "Meet safely",
      paragraphs: [
        "Meet in a public place, test before paying, and do not send an advance. The same rules apply as for a used phone.",
      ],
      links: [{ href: "/guides/common-scams", label: "Common marketplace scams" }, { href: "/buyer-safety", label: "Buyer safety" }],
    },
  ],
  faqs: [
    {
      question: "Can I use second hand AirPods that are still linked to the seller's Apple ID?",
      answer: "Not properly. Apple says the previous owner must remove them from their Apple Account before you can pair them to yours, and Apple cannot remove that lock for you.",
    },
    {
      question: "How do I remove AirPods from an Apple Account?",
      answer: "The owner opens Find My on an iPhone or iPad, taps Devices, selects the AirPods, swipes up and taps Remove This Device, then Remove. It can also be done on a Mac or at icloud.com/find.",
    },
    {
      question: "What should I pay for used AirPods in Pakistan?",
      answer: "We do not publish a used price we cannot source. Compare the seller's asking price with the new price of the same model on our AirPods page, and pay less for an older generation, a missing bill or a weak case.",
    },
    {
      question: "Can AppleCare on AirPods be transferred?",
      answer: "Apple says an AppleCare plan on AirPods can be transferred to the new owner. Ask the seller to do it as part of the sale.",
    },
  ],
  related: [
    { href: "/accessories/airpods-price-in-pakistan", label: "AirPods price in Pakistan" },
    { href: "/guides/fake-airpods", label: "How to spot fake AirPods" },
    LISTINGS.earbuds,
    { href: "/accessories/earbuds-price-in-pakistan", label: "Earbuds price in Pakistan" },
  ],
  sources: [SRC.appleSell, SRC.appleLock, SRC.appleIdentify, SRC.shAirpods],
};

export const ACCESSORY_PAGES = [AIRPODS_HUB, EARBUDS_HUB, HEADPHONES_HUB, FAKE_AIRPODS_GUIDE, USED_AIRPODS_GUIDE];
