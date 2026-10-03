/**
 * Editorial brand hubs for /phones/<brand>.
 *
 * Rules (same as model-prices.ts): every price is from a dated source; anything we could not
 * verify is said to be unavailable instead of guessed. Brands that already have model price
 * data in MODEL_PRICES reuse it; the other brands carry their own dated rows in `extraPrices`.
 */
import type { ModelPriceData, PricePoint, PriceSource } from "./model-prices";

const CHECKED = "2026-10-04";
const p = (pkr: number, source: string, note?: string): PricePoint => (note ? { pkr, source, note } : { pkr, source });

export type BrandHubLink = { href: string; label: string };
export type BrandHubSection = { heading: string; paragraphs: string[]; bullets?: string[] };

export type BrandHub = {
  slug: string;
  /** Page <title> (the layout adds the site name). */
  title: string;
  h1: string;
  description: string;
  /** ISO date the hub text was last reviewed. */
  updated: string;
  intro: string[];
  /** Short note shown under the price table. */
  priceNote: string;
  /** Price rows for brands without entries in MODEL_PRICES. */
  extraPrices?: ModelPriceData[];
  ptaNotes: string[];
  used: BrandHubSection;
  service: BrandHubSection;
  faqs: { question: string; answer: string }[];
  links: BrandHubLink[];
  sources: { href: string; label: string }[];
};

/* ----------------------------- shared sources ----------------------------- */
const SRC = {
  news24: {
    href: "https://www.thenews.com.pk/print/1187217-smuggled-non-pta-approved-cell-phones-swamp-pakistan-s-markets-online-platforms-industry",
    label: "The News: Smuggled, non-PTA approved cell phones swamp Pakistan's markets (10 May 2024)",
  },
  samsungSc: { href: "https://www.samsung.com/pk/support/service-center/", label: "Samsung Pakistan service centre page, checked 3 Oct 2026" },
  samsungTi: { href: "https://www.samsung.com/pk/trade-in/", label: "Samsung Pakistan trade-in page and helpline, checked 3 Oct 2026" },
  samsungS24: { href: "https://news.samsung.com/sg/samsung-galaxy-s24-series-is-now-available-worldwide", label: "Samsung Newsroom: Galaxy S24 series now available worldwide (seven OS upgrades and seven years of security updates)" },
  mercantileCare: { href: "https://mercantile.com.pk/care", label: "Mercantile Care, Apple Authorized Service Provider, checked 3 Oct 2026" },
  airlinkStores: { href: "https://www.airlinkcommunication.com/airlink-stores/", label: "Airlink stores page (Xinhua Mall outlet labelled Apple Authorized Reseller), checked 3 Oct 2026" },
  airlinkWtb: { href: "https://www.airlinkcommunication.com/where-to-buy/", label: "Airlink where-to-buy page (brands it distributes and retail partners), checked 3 Oct 2026" },
  carlcare: { href: "https://www.carlcare.com/pk/service-center/", label: "Carlcare Pakistan service-centre finder (Tecno, Infinix, itel), checked 3 Oct 2026" },
  apple14: { href: "https://www.apple.com/newsroom/2022/09/apple-debuts-iphone-14-and-iphone-14-plus/", label: "Apple Newsroom: Apple debuts iPhone 14 and iPhone 14 Plus (7 Sep 2022), US models are eSIM only" },
  pixelUpdates: { href: "https://support.google.com/pixelphone/answer/4457705", label: "Google Pixel Help: when Pixel phones get software updates, checked 4 Oct 2026" },
  pixel8Blog: { href: "https://blog.google/products-and-platforms/devices/pixel/software-support-pixel-8-pixel-8-pro/", label: "Google: 7 years of software updates for the Pixel 8 series (4 Oct 2023)" },
  cnetPixel: { href: "https://www.cnet.com/tech/mobile/google-promises-pixel-8-phones-will-get-software-updates-through-2030/", label: "CNET: Google promises Pixel 8 phones will get updates through 2030 (4 Oct 2023)" },
  reutersHuawei: { href: "https://www.reuters.com/article/technology/huawei-talks-up-own-apps-with-mate-30-challenge-to-apple-samsung-idUSKBN1W32ZG/", label: "Reuters: Huawei talks up own apps with Mate 30 (19 Sep 2019)" },
  vergeHuawei: { href: "https://www.theverge.com/2019/9/19/20873690/huawei-mate-30-series-phones-google-android-ban-apps-block", label: "The Verge: Huawei confirms the Mate 30 Pro won't come with Google's Android apps (19 Sep 2019)" },
  huaweiPk: { href: "https://consumer.huawei.com/pk/phones/", label: "Huawei Pakistan consumer site, checked 4 Oct 2026" },
  jazzNothing: { href: "https://jazz.com.pk/media-center/detail/jazz-brings-nothing-phone-4a-series-to-pakistan-to-expand-smartphone-adoption", label: "Jazz: Jazz brings Nothing Phone (4a) series to Pakistan; Yellostone Technologies named official distributor (23 Apr 2026)" },
  realmePk: { href: "https://www.realme.com/pk/", label: "realme Pakistan website (model line-up and support contacts), checked 4 Oct 2026" },
} as const;

/* ----------------------- price sources for new brands ---------------------- */
const megaSrc = (brand: string, slug: string): PriceSource => ({
  id: "mega",
  label: `Mega.pk ${brand} mobile listings (PTA-approved and non-PTA units are listed as separate products)`,
  href: `https://www.mega.pk/mobiles-${slug}/`,
  date: CHECKED,
  kind: "retailer",
});
const priceoyeSrc = (brand: string, slug: string): PriceSource => ({
  id: "priceoye",
  label: `PriceOye ${brand} listings (new units sold with brand warranty)`,
  href: `https://priceoye.pk/mobiles/${slug}`,
  date: CHECKED,
  kind: "retailer",
});
const PW_NOTHING: PriceSource = {
  id: "pwNothing4a",
  label: "PhoneWorld: Nothing Phone (4a) series arrives in Pakistan, launch prices (20 Apr 2026)",
  href: "https://www.phoneworld.com.pk/nothing-phone-4a-series-arrives-in-pakistan-with-updated-design-and-enhanced-performance/",
  date: "2026-04-20",
  kind: "news",
};
const PW_REALME: PriceSource = {
  id: "pwRealme16",
  label: "PhoneWorld: realme 16 Pro series 5G launches in Pakistan, official prices (7 Apr 2026)",
  href: "https://www.phoneworld.com.pk/realme-16-pro-5g-hits-pakistan-with-200mp-7000mah-battery/",
  date: "2026-04-07",
  kind: "news",
};

/** Minimal ModelPriceData for a brand-hub row. */
function row(brand: string, model: string, variants: ModelPriceData["variants"], sources: PriceSource[], summary = ""): ModelPriceData {
  return { brand, model, lastUpdated: CHECKED, summary, variants, specs: [], specSource: sources[0].id, notes: [], sources };
}

const MEGA_GOOGLE = megaSrc("Google", "google");
const MEGA_ONEPLUS = megaSrc("OnePlus", "oneplus");
const PO_NOTHING = priceoyeSrc("Nothing", "nothing");
const PO_REALME = priceoyeSrc("Realme", "realme");

/* ------------------------------ shared copy ------------------------------- */
const PTA_BASE = [
  "A PTA-approved phone is one whose IMEI is registered on PTA's DIRBS system, so any Pakistani SIM keeps working in it. Phones imported by a brand's official distributor are registered before sale. Before you pay, dial *#06#, match the IMEI to the box and the bill, and send it by SMS to 8484. Our PTA status guide explains each reply.",
  "A non-PTA phone was brought in from abroad without that registration. You can register it by paying the PTA tax (customs duty and taxes collected through DIRBS). The amount depends on the phone's value slab and on whether you register on a passport or a CNIC, so look it up in our PTA tax guide and calculator before you agree a price. That cost is the real gap between a PTA and a non-PTA price.",
  "Be careful with 'patched' phones. The News reported on 10 May 2024 that smuggled phones are sold in Pakistani markets after being patched with duplicated or cloned IMEIs to get past DIRBS. Patching is illegal under PECA 2016, and a patched phone can be blocked later.",
];

const USED_CHECKS = [
  "Run the IMEI check (*#06# and SMS to 8484) and make sure the IMEI matches the box and the bill.",
  "Make sure the seller has signed out of their account and removed the phone-finder lock before you pay.",
  "Test the screen for dead pixels and touch problems, every camera, both speakers, the microphone, the charging port and Wi-Fi.",
  "Put your own SIM in and make a call before you leave.",
  "Ask for the original bill or warranty card. A phone with no bill and a price far below others is a risk.",
  "Meet in a public place and never send an advance.",
];

const CITY_LINKS = (slug: string): BrandHubLink[] => [
  { href: `/used-phones/karachi/${slug}`, label: "Used phones in Karachi" },
  { href: `/used-phones/lahore/${slug}`, label: "Used phones in Lahore" },
  { href: `/used-phones/islamabad/${slug}`, label: "Used phones in Islamabad" },
  { href: `/used-phones/rawalpindi/${slug}`, label: "Used phones in Rawalpindi" },
  { href: "/guides/best-mobile-market-in-karachi", label: "Best mobile market in Karachi" },
  { href: "/guides/best-mobile-market-in-lahore", label: "Mobile market Lahore (Hafeez Centre)" },
  { href: "/guides/best-mobile-market-in-islamabad", label: "Mobile market Islamabad" },
  { href: "/guides/best-mobile-market-in-rawalpindi", label: "Mobile market Rawalpindi" },
  { href: "/guides/best-mobile-markets-in-pakistan", label: "Mobile markets in other cities" },
];

const COMMON_LINKS: BrandHubLink[] = [
  { href: "/mobile-prices-in-pakistan", label: "Mobile prices in Pakistan" },
  { href: "/best-mobile-phones/under-30000", label: "Best phones under Rs 30,000" },
  { href: "/best-mobile-phones/under-50000", label: "Best phones under Rs 50,000" },
  { href: "/best-mobile-phones/under-100000", label: "Best phones under Rs 100,000" },
  { href: "/guides/pta-status", label: "How to check PTA status" },
  { href: "/guides/pta-tax", label: "PTA tax guide and calculator" },
  { href: "/guides/inspect-used-phone", label: "Inspect a used phone before you pay" },
  { href: "/guides/authorized-mobile-dealers-in-pakistan", label: "Authorized dealers in Pakistan" },
];

const ptaFaq = (name: string) => ({
  question: `How do I check if a ${name} phone is PTA approved?`,
  answer: "Dial *#06# to see the IMEI, match it to the box and the bill, and send it by SMS to 8484. A patched or cloned IMEI can be blocked later, so do not rely on the phone working with a SIM in the shop.",
});
const taxFaq = (name: string) => ({
  question: `How much PTA tax is due on a non-PTA ${name} phone?`,
  answer: "It depends on the phone's value slab and on whether you register on a passport or a CNIC. Use the PTA tax guide and calculator on this site; the amount DIRBS shows on the day you pay is final.",
});
const usedFaq = (name: string, slug: string) => ({
  question: `Where can I buy a used ${name} phone?`,
  answer: `Browse the used ${name} listings on this page or by city (Karachi, Lahore, Islamabad, Rawalpindi). Meet in a public place, check the IMEI with 8484 and test the phone before you pay.`,
  slug,
});

function faqs(list: { question: string; answer: string }[]) {
  return list.map(({ question, answer }) => ({ question, answer }));
}

/* --------------------------------- hubs ----------------------------------- */
export const BRAND_HUBS: BrandHub[] = [
  {
    slug: "apple",
    title: "iPhone Price in Pakistan 2026 (PTA & Non-PTA)",
    h1: "Apple iPhone Price in Pakistan 2026",
    description: "iPhone price in Pakistan in 2026: official PTA prices for the iPhone 17 and 18 Pro range from Mercantile and other distributors, PTA tax notes, used iPhone checks and Apple service in Pakistan.",
    updated: CHECKED,
    intro: [
      "Apple does not run its own store in Pakistan. New iPhones with an Apple warranty are sold through distributors such as Mercantile and authorised resellers, and those units are PTA approved before sale. Most of the price gap you see in markets comes from non-PTA imports, which need PTA tax before a Pakistani SIM works long term.",
      "The table below lists every current iPhone price we could verify, with the source and the date we checked it. Prices for the iPhone 18 Pro and 18 Pro Max come from launch reports in September 2026. Where no reliable price exists, the cell is left empty rather than guessed.",
    ],
    priceNote: "Official prices are distributor suggested retail prices (PTA approved, Apple warranty). Retailer prices are what one named shop listed on the date shown.",
    ptaNotes: [
      ...PTA_BASE,
      "iPhone models sold in the United States from the iPhone 14 onwards have no physical SIM tray and use eSIM only (Apple, 7 September 2022). Mercantile's official iPhone 17 units take a physical SIM and an eSIM. Check which version you are buying.",
    ],
    used: {
      heading: "Which iPhones are worth buying used?",
      paragraphs: [
        "A used iPhone is usually worth it when it is PTA approved, its battery health and parts history are clean, and the gap to a new official unit is big enough to cover a battery replacement. A cheap non-PTA iPhone is only a bargain once you add the PTA tax for that model.",
        "On an iPhone, open Settings > Battery > Battery Health to see the maximum capacity, and Settings > General > About to see the parts and service history on models that show it. A screen, battery or camera that was replaced with a non-genuine part shows a message there.",
      ],
      bullets: [...USED_CHECKS, "Make sure Find My iPhone is switched off and the Apple ID is signed out. An iPhone with an Activation Lock cannot be used by you."],
    },
    service: {
      heading: "Apple warranty and service in Pakistan",
      paragraphs: [
        "Mercantile's care page (checked 3 October 2026) describes Mercantile as Pakistan's official Apple Authorized Service Provider, with service centres in Lahore and Islamabad, open 10am to 6pm, Monday to Friday. It publishes 042-38977493 (Lahore), 051-2000131 (Islamabad) and 0329 1788644.",
        "Airlink's stores page labels its Xinhua Mall outlet in Gulberg III, Lahore, as an Apple Authorized Reseller. A shop in a mobile market can sell a genuine iPhone without being authorised; for an Apple warranty, check the shop on the distributor's list.",
      ],
    },
    faqs: faqs([
      { question: "What is the price of the iPhone 17 in Pakistan?", answer: "Mercantile's suggested retail price for the PTA-approved iPhone 17 is Rs 399,000 for 256GB and Rs 482,500 for 512GB (checked 2 October 2026). The table on this page lists every version with its source." },
      { question: "Is there an Apple Store in Pakistan?", answer: "No. Apple sells through distributors and authorised resellers such as Mercantile, and Airlink labels its Xinhua Mall outlet in Lahore as an Apple Authorized Reseller." },
      ptaFaq("iPhone"),
      taxFaq("iPhone"),
      { question: "Where can I get an iPhone repaired under Apple warranty in Pakistan?", answer: "Mercantile says it is Pakistan's official Apple Authorized Service Provider, with centres in Lahore and Islamabad open 10am to 6pm, Monday to Friday." },
      usedFaq("iPhone", "apple"),
    ]),
    links: [
      { href: "/iphone-18-price-in-pakistan", label: "iPhone 18 price in Pakistan" },
      { href: "/iphone-18-pro-price-in-pakistan", label: "iPhone 18 Pro price in Pakistan" },
      { href: "/iphone-18-pro-max-price-in-pakistan", label: "iPhone 18 Pro Max price in Pakistan" },
      ...COMMON_LINKS,
      ...CITY_LINKS("apple"),
    ],
    sources: [SRC.mercantileCare, SRC.airlinkStores, SRC.apple14, SRC.news24],
  },
  {
    slug: "samsung",
    title: "Samsung Mobile Price in Pakistan 2026 (PTA & Non-PTA)",
    h1: "Samsung Mobile Price in Pakistan 2026",
    description: "Samsung mobile prices in Pakistan in 2026: Galaxy S26 Ultra, S26, A57, A37, A17, A07 and A06 with dated PTA and non-PTA prices, PTA tax notes, used Galaxy checks and Samsung service points.",
    updated: CHECKED,
    intro: [
      "Samsung sells in Pakistan through official distributors and Samsung-branded stores run by its partners, with a range that covers everything from the Galaxy A06 to the Galaxy S26 Ultra. Official units are PTA approved. Non-PTA Galaxy flagships are also common in markets, usually at a lower sticker price that does not include PTA tax.",
      "The table lists every Samsung price we could verify, with the shop or source and the date we checked it. We could not read a clear official Samsung Pakistan price per version, so most rows show what a named retailer listed.",
    ],
    priceNote: "Retailer prices are what Mega.pk or PriceOye listed on the date shown; they change often and may include temporary discounts.",
    ptaNotes: PTA_BASE,
    used: {
      heading: "Which Samsung phones are worth buying used?",
      paragraphs: [
        "Software support is the main reason to pay more for a newer used Galaxy. Samsung says the Galaxy S24 series gets seven generations of Android upgrades and seven years of security updates. A used S24-series or newer flagship therefore has far more supported life left than an older S21 or S22 at a similar price.",
        "On the Ultra models, check that the S Pen is included and works. On any AMOLED Galaxy, show a plain grey or white screen to spot burn-in, and check the phone's diagnostics in the Samsung Members app if the seller allows it.",
      ],
      bullets: USED_CHECKS,
    },
    service: {
      heading: "Samsung warranty and service in Pakistan",
      paragraphs: [
        "Samsung Pakistan's service-centre page (checked 3 October 2026) lists 'Galaxy Consultants' points in Karachi (LuckyOne Mall), Lahore (Packages Mall and Emporium Mall), Islamabad (F-7 Markaz), Bahawalpur, Multan (Gulgasht) and Faisalabad (Lyallpur Galleria). Samsung says they offer free data transfer, device check-ups, software updates and consultation.",
        "Samsung's helpline is 0800 7267864, Monday to Sunday, 9am to 6pm, and its trade-in programme runs online in Karachi, Lahore, Islamabad and Rawalpindi, with in-store counters in Islamabad, Lahore and Rawalpindi.",
      ],
    },
    faqs: faqs([
      { question: "What is the Samsung Galaxy S26 Ultra price in Pakistan?", answer: "Mega.pk listed the PTA-approved S26 Ultra at Rs 447,999 (12GB/256GB) and Rs 517,999 (12GB/512GB) on 2 October 2026, and non-PTA units from Rs 271,999." },
      { question: "What is the cheapest Samsung phone in Pakistan?", answer: "Of the models we verified, the Galaxy A06 (4GB/64GB) was the cheapest, at Rs 22,499 on PriceOye on 2 October 2026." },
      ptaFaq("Samsung"),
      taxFaq("Samsung"),
      { question: "Where is the Samsung service centre in Pakistan?", answer: "Samsung's service-centre page lists Galaxy Consultants points in Karachi, Lahore, Islamabad, Bahawalpur, Multan and Faisalabad. The helpline is 0800 7267864." },
      usedFaq("Samsung", "samsung"),
    ]),
    links: [...COMMON_LINKS, ...CITY_LINKS("samsung")],
    sources: [SRC.samsungSc, SRC.samsungTi, SRC.samsungS24, SRC.news24],
  },
  {
    slug: "xiaomi",
    title: "Xiaomi & Redmi Mobile Price in Pakistan 2026 (PTA)",
    h1: "Xiaomi and Redmi Mobile Price in Pakistan 2026",
    description: "Xiaomi and Redmi mobile prices in Pakistan in 2026: Redmi Note 15 Pro, Note 15, Redmi 15, 15C, A5 and 14C with dated PTA-approved prices, PTA tax notes and used-phone checks.",
    updated: CHECKED,
    intro: [
      "Xiaomi's Pakistan line-up is mostly Redmi phones, from the entry-level Redmi A5 to the Redmi Note 15 Pro. Airlink Communication, one of Pakistan's largest phone distributors, lists Xiaomi among the brands it distributes. Official units are PTA approved.",
      "The table lists the Xiaomi and Redmi prices we could verify, with the shop and the date. We did not find reliable non-PTA prices for these models, so that column is empty.",
    ],
    priceNote: "Retailer prices are what Mega.pk or PriceOye listed on the date shown; they change often.",
    ptaNotes: PTA_BASE,
    used: {
      heading: "Which Xiaomi and Redmi phones are worth buying used?",
      paragraphs: [
        "Redmi phones are cheap new, so a used one only makes sense when the discount is large and the phone is PTA approved. Compare the used price with the new PTA prices in the table first.",
        "Ask the seller to remove their Xiaomi account and switch off Find Device before you pay. A phone still tied to someone else's account can lock you out after a reset.",
      ],
      bullets: USED_CHECKS,
    },
    service: {
      heading: "Xiaomi warranty and service in Pakistan",
      paragraphs: [
        "Xiaomi's Pakistan service-centre list loads in the browser and we could not verify the addresses, so we do not list them here (unavailable as of 4 October 2026). For warranty claims, keep the bill from an authorised seller; Airlink's where-to-buy page lists its retail partners by city.",
      ],
    },
    faqs: faqs([
      { question: "What is the Redmi Note 15 Pro price in Pakistan?", answer: "Mega.pk listed the PTA-approved Redmi Note 15 Pro at Rs 94,999 (8GB/256GB) and Rs 115,999 (12GB/512GB) on 2 October 2026." },
      { question: "What is the cheapest Xiaomi phone in Pakistan?", answer: "Of the models we verified, the Redmi 14C (4GB/128GB) was the cheapest, at Rs 29,999 on PriceOye on 2 October 2026." },
      ptaFaq("Xiaomi"),
      taxFaq("Xiaomi"),
      usedFaq("Xiaomi", "xiaomi"),
    ]),
    links: [...COMMON_LINKS, ...CITY_LINKS("xiaomi")],
    sources: [SRC.airlinkWtb, SRC.news24],
  },
  {
    slug: "vivo",
    title: "Vivo Mobile Price in Pakistan 2026 (Official PTA)",
    h1: "Vivo Mobile Price in Pakistan 2026",
    description: "Vivo mobile prices in Pakistan in 2026 from vivo Pakistan's own site: X300 FE, V70, Y500, Y31d, Y11d and Y05e, with PTA tax notes and used-phone checks.",
    updated: CHECKED,
    intro: [
      "vivo publishes Pakistan prices on its own website, so the vivo prices below are official prices for PTA-approved units rather than one shop's quote. The range runs from the Y05e to the X300 FE.",
      "Each row shows the date we read the price. vivo changes prices during promotions, so check the official page on the day you buy.",
    ],
    priceNote: "Official prices are from vivo Pakistan's product pages on the date shown.",
    ptaNotes: PTA_BASE,
    used: {
      heading: "Which vivo phones are worth buying used?",
      paragraphs: [
        "Because vivo's official prices are public, use them as the ceiling. A used vivo is worth it when it is PTA approved and the discount covers the lost warranty.",
      ],
      bullets: USED_CHECKS,
    },
    service: {
      heading: "vivo warranty and service in Pakistan",
      paragraphs: [
        "vivo's Pakistan service-centre list loads in the browser and we could not verify the addresses, so we do not list them here (unavailable as of 4 October 2026). Keep the bill and warranty card from an authorised seller.",
      ],
    },
    faqs: faqs([
      { question: "What is the vivo X300 FE price in Pakistan?", answer: "vivo Pakistan listed the X300 FE (12GB/256GB) at Rs 279,999 on 2 October 2026." },
      { question: "Are vivo prices on this page official?", answer: "Yes. The vivo rows come from vivo Pakistan's own product pages, with the date we read them." },
      ptaFaq("vivo"),
      taxFaq("vivo"),
      usedFaq("vivo", "vivo"),
    ]),
    links: [...COMMON_LINKS, ...CITY_LINKS("vivo")],
    sources: [SRC.news24],
  },
  {
    slug: "oppo",
    title: "Oppo Mobile Price in Pakistan 2026 (PTA)",
    h1: "Oppo Mobile Price in Pakistan 2026",
    description: "Oppo mobile prices in Pakistan in 2026: Find X9 Pro and A6 Pro with dated PTA-approved prices, PTA tax notes, used-phone checks and what we could not verify.",
    updated: CHECKED,
    intro: [
      "OPPO sells in Pakistan through its official channels and runs a Pakistan website with specifications. We verified prices for two current models, the flagship Find X9 Pro and the mid-range A6 Pro. Other OPPO models are on sale, but we did not find a reliable dated price for them, so they are not in the table.",
    ],
    priceNote: "Retailer prices are what Mega.pk listed on the date shown; the Find X9 Pro was shown as out of stock that day.",
    ptaNotes: PTA_BASE,
    used: {
      heading: "Which OPPO phones are worth buying used?",
      paragraphs: [
        "A used OPPO is worth it when it is PTA approved and the price is well below the new PTA price. Ask the seller to sign out of their OPPO or Google account before you pay.",
      ],
      bullets: USED_CHECKS,
    },
    service: {
      heading: "OPPO warranty and service in Pakistan",
      paragraphs: [
        "OPPO's Pakistan service-centre list did not load for us, so we do not list addresses here (unavailable as of 4 October 2026). Keep the bill and warranty card from an authorised seller.",
      ],
    },
    faqs: faqs([
      { question: "What is the OPPO A6 Pro price in Pakistan?", answer: "Mega.pk listed the PTA-approved OPPO A6 Pro (8GB/256GB) at Rs 94,999 on 2 October 2026." },
      { question: "What is the OPPO Find X9 Pro price in Pakistan?", answer: "Mega.pk listed the PTA-approved Find X9 Pro (16GB/512GB) at Rs 354,999 on 2 October 2026, shown as out of stock." },
      ptaFaq("OPPO"),
      taxFaq("OPPO"),
      usedFaq("OPPO", "oppo"),
    ]),
    links: [...COMMON_LINKS, ...CITY_LINKS("oppo")],
    sources: [SRC.news24],
  },
  {
    slug: "infinix",
    title: "Infinix Mobile Price in Pakistan 2026 (PTA)",
    h1: "Infinix Mobile Price in Pakistan 2026",
    description: "Infinix mobile prices in Pakistan in 2026: Note 60 Pro, Note 60, Hot 60 Pro, Hot 60i and Smart 10 Plus with dated PTA prices, PTA tax notes and Carlcare service cities.",
    updated: CHECKED,
    intro: [
      "Infinix is one of the most common budget brands in Pakistan, with phones from the Smart series up to the Note series. Official units are PTA approved and serviced through Carlcare, the after-sales network shared with Tecno and itel.",
      "The table lists the Infinix prices we could verify, with the shop and the date. We did not find reliable non-PTA prices for these models.",
    ],
    priceNote: "Retailer prices are what Mega.pk listed on the date shown; they change often.",
    ptaNotes: PTA_BASE,
    used: {
      heading: "Which Infinix phones are worth buying used?",
      paragraphs: [
        "The Infinix models in the table cost Rs 46,999 to Rs 121,999 new, so a used one is only worth it with a clear discount and a working warranty or bill. Compare the used price with the new PTA prices in the table before you agree.",
      ],
      bullets: USED_CHECKS,
    },
    service: {
      heading: "Infinix warranty and service in Pakistan (Carlcare)",
      paragraphs: [
        "Carlcare's Pakistan service-centre finder (checked 3 October 2026) lists these cities: Karachi, Hyderabad, Sukkur, Lahore, Faisalabad, Multan, Rawalpindi, Gujranwala, Gujrat, Sialkot, Sargodha, Jhelum, Kasur, Chakwal, Burewala, Haroonabad, Samundri, Toba Tek Singh, Peshawar, Mardan, Nowshera, Charsadda, Mansehra and Quetta. The finder loads addresses in the browser, so pick your city there for the current counter.",
      ],
    },
    faqs: faqs([
      { question: "What is the Infinix Note 60 Pro price in Pakistan?", answer: "Mega.pk listed the PTA-approved Note 60 Pro (8GB/256GB) at Rs 121,999 on 2 October 2026." },
      { question: "Where is the Infinix service centre?", answer: "Infinix phones are serviced by Carlcare. Its Pakistan finder lists more than 20 cities, including Karachi, Lahore, Rawalpindi, Peshawar and Quetta." },
      ptaFaq("Infinix"),
      taxFaq("Infinix"),
      usedFaq("Infinix", "infinix"),
    ]),
    links: [...COMMON_LINKS, ...CITY_LINKS("infinix")],
    sources: [SRC.carlcare, SRC.news24],
  },
  {
    slug: "tecno",
    title: "Tecno Mobile Price in Pakistan 2026 (PTA)",
    h1: "Tecno Mobile Price in Pakistan 2026",
    description: "Tecno mobile prices in Pakistan in 2026: Camon 50 Pro, Camon 50, Spark 50 Pro, Spark 50, Spark 40 and Spark Go 3 with dated PTA prices, PTA tax notes and Carlcare service cities.",
    updated: CHECKED,
    intro: [
      "Tecno sells budget and mid-range phones in Pakistan, from the Spark Go series to the Camon series. Airlink lists Tecno among the brands it distributes, official units are PTA approved, and service is through Carlcare.",
      "The table lists the Tecno prices we could verify, with the shop and the date.",
    ],
    priceNote: "Retailer prices are what the named shop listed on the date shown; they change often.",
    ptaNotes: PTA_BASE,
    used: {
      heading: "Which Tecno phones are worth buying used?",
      paragraphs: [
        "As with other budget brands, a used Tecno is worth it only with a clear discount over the new PTA price and a bill you can use at Carlcare.",
      ],
      bullets: USED_CHECKS,
    },
    service: {
      heading: "Tecno warranty and service in Pakistan (Carlcare)",
      paragraphs: [
        "Carlcare's Pakistan service-centre finder (checked 3 October 2026) lists these cities: Karachi, Hyderabad, Sukkur, Lahore, Faisalabad, Multan, Rawalpindi, Gujranwala, Gujrat, Sialkot, Sargodha, Jhelum, Kasur, Chakwal, Burewala, Haroonabad, Samundri, Toba Tek Singh, Peshawar, Mardan, Nowshera, Charsadda, Mansehra and Quetta. Pick your city in the finder for the current address.",
      ],
    },
    faqs: faqs([
      { question: "What is the Tecno Camon 50 Pro price in Pakistan?", answer: "PriceOye listed the Tecno Camon 50 Pro (8GB/256GB) at Rs 99,999, down from a listed Rs 109,999, on 2 October 2026." },
      { question: "Where is the Tecno service centre?", answer: "Tecno phones are serviced by Carlcare. Its Pakistan finder lists more than 20 cities, including Karachi, Lahore, Rawalpindi, Peshawar and Quetta." },
      ptaFaq("Tecno"),
      taxFaq("Tecno"),
      usedFaq("Tecno", "tecno"),
    ]),
    links: [...COMMON_LINKS, ...CITY_LINKS("tecno")],
    sources: [SRC.carlcare, SRC.airlinkWtb, SRC.news24],
  },
  {
    slug: "google",
    title: "Google Pixel Price in Pakistan 2026 (PTA & Non-PTA)",
    h1: "Google Pixel Price in Pakistan 2026",
    description: "Google Pixel prices in Pakistan in 2026: Pixel 11, 11 Pro, 11 Pro XL, 10, 10a and 9 series with dated PTA and non-PTA prices, PTA tax notes and which used Pixels still get updates.",
    updated: CHECKED,
    intro: [
      "Google does not sell Pixel phones officially in Pakistan, and we found no official Pakistan distributor or price list. Pixels reach Pakistan as imports, so most units in shops are non-PTA. A non-PTA Pixel needs PTA tax before a Pakistani SIM works long term, and that tax is a large part of the real cost.",
      "The table lists the Pixel prices one large Pakistani retailer showed on the date we checked. Only one of them, the Pixel 10 (128GB), was listed as PTA approved.",
    ],
    priceNote: "Retailer prices are what Mega.pk listed on 4 October 2026. Mega.pk lists PTA-approved and non-PTA units as separate products; most Pixels it listed were non-PTA.",
    extraPrices: [
      row("Google", "Pixel 11 Pro Fold", [
        { storage: "16GB / 256GB", nonPta: [p(534999, "mega")] },
        { storage: "16GB / 512GB", nonPta: [p(574999, "mega")] },
      ], [MEGA_GOOGLE]),
      row("Google", "Pixel 11 Pro XL", [
        { storage: "12GB / 256GB", nonPta: [p(399999, "mega")] },
        { storage: "16GB / 512GB", nonPta: [p(454999, "mega")] },
      ], [MEGA_GOOGLE]),
      row("Google", "Pixel 11 Pro", [
        { storage: "12GB / 256GB", nonPta: [p(369999, "mega")] },
        { storage: "16GB / 512GB", nonPta: [p(409999, "mega")] },
      ], [MEGA_GOOGLE]),
      row("Google", "Pixel 11", [{ storage: "12GB / 256GB", nonPta: [p(284999, "mega")] }], [MEGA_GOOGLE]),
      row("Google", "Pixel 10 Pro XL", [{ storage: "16GB / 512GB", nonPta: [p(339999, "mega")] }], [MEGA_GOOGLE]),
      row("Google", "Pixel 10 Pro", [{ storage: "16GB / 128GB", nonPta: [p(262999, "mega")] }], [MEGA_GOOGLE]),
      row("Google", "Pixel 10", [
        { storage: "12GB / 128GB", ptaRetail: [p(274999, "mega")], nonPta: [p(189999, "mega")] },
        { storage: "12GB / 256GB", nonPta: [p(219999, "mega")] },
      ], [MEGA_GOOGLE]),
      row("Google", "Pixel 10a", [{ storage: "8GB / 128GB", nonPta: [p(167999, "mega")] }], [MEGA_GOOGLE]),
      row("Google", "Pixel 9 Pro XL", [
        { storage: "16GB / 128GB", nonPta: [p(209999, "mega")] },
        { storage: "16GB / 256GB", nonPta: [p(269999, "mega")] },
        { storage: "16GB / 512GB", nonPta: [p(284999, "mega")] },
      ], [MEGA_GOOGLE]),
      row("Google", "Pixel 9 Pro", [
        { storage: "16GB / 128GB", nonPta: [p(224999, "mega")] },
        { storage: "16GB / 256GB", nonPta: [p(259999, "mega")] },
      ], [MEGA_GOOGLE]),
      row("Google", "Pixel 9", [{ storage: "12GB / 256GB", nonPta: [p(209999, "mega")] }], [MEGA_GOOGLE]),
      row("Google", "Pixel 9a", [{ storage: "8GB / 128GB", nonPta: [p(124999, "mega")] }], [MEGA_GOOGLE]),
    ],
    ptaNotes: [
      ...PTA_BASE,
      "Compare like with like. On 4 October 2026 Mega.pk listed the PTA-approved Pixel 10 (128GB) at Rs 274,999 and the non-PTA version at Rs 189,999. Before choosing the non-PTA phone, work out the PTA tax for it with our calculator.",
    ],
    used: {
      heading: "Which Pixels are worth buying used?",
      paragraphs: [
        "Software support matters most. Google says Pixel 8 and later phones get seven years of OS and security updates, counted from when each model first went on sale on the US Google Store. Its list includes the Pixel 8, 8 Pro, 8a, the Pixel 9 series and the Pixel 10 series. The Pixel 6 and Pixel 7 were promised three years of OS updates and five years of security updates (CNET, 4 October 2023), so they are much closer to the end of support.",
        "That makes a used Pixel 8 or newer the safer buy, as long as it is PTA approved or you have priced in the tax. Because we found no official Google warranty service in Pakistan, the seller's bill is all you have.",
      ],
      bullets: USED_CHECKS,
    },
    service: {
      heading: "Google Pixel warranty and service in Pakistan",
      paragraphs: [
        "We found no official Google Pixel service centre in Pakistan (unavailable as of 4 October 2026). Repairs are done by independent shops, and any warranty is the seller's own. Ask the shop in writing what it covers and for how long.",
      ],
    },
    faqs: faqs([
      { question: "Is Google Pixel officially sold in Pakistan?", answer: "We found no official Google distributor or Pakistan price list. Pixels are imported, and most units in shops are non-PTA." },
      { question: "What is the Pixel 10 price in Pakistan?", answer: "On 4 October 2026 Mega.pk listed the PTA-approved Pixel 10 (128GB) at Rs 274,999, and non-PTA units at Rs 189,999 (128GB) and Rs 219,999 (256GB)." },
      ptaFaq("Google Pixel"),
      taxFaq("Google Pixel"),
      { question: "Which used Pixel still gets updates?", answer: "Google says Pixel 8 and later get seven years of OS and security updates from their US launch. The Pixel 6 and 7 had shorter promises." },
      usedFaq("Google Pixel", "google"),
    ]),
    links: [...COMMON_LINKS, ...CITY_LINKS("google")],
    sources: [SRC.pixelUpdates, SRC.pixel8Blog, SRC.cnetPixel, SRC.news24],
  },
  {
    slug: "oneplus",
    title: "OnePlus Price in Pakistan 2026 (PTA & Non-PTA)",
    h1: "OnePlus Price in Pakistan 2026",
    description: "OnePlus prices in Pakistan in 2026: OnePlus 15 and 13s with dated non-PTA retailer prices, PTA tax notes, used OnePlus checks and what we could not verify.",
    updated: CHECKED,
    intro: [
      "We found no official OnePlus distributor or Pakistan price list. OnePlus phones in Pakistan are imports, and the units we found at a large retailer were all non-PTA. Budget for PTA tax on top of the sticker price if you want to use a Pakistani SIM long term.",
      "Only two current models, the OnePlus 15 and OnePlus 13s, had a listed price on the date we checked. We did not find a PTA-approved OnePlus price, so that column is empty.",
    ],
    priceNote: "Retailer prices are what Mega.pk listed on 4 October 2026. All three listings were non-PTA units.",
    extraPrices: [
      row("OnePlus", "15", [{ storage: "16GB / 512GB", nonPta: [p(284999, "mega")] }], [MEGA_ONEPLUS]),
      row("OnePlus", "13s", [
        { storage: "12GB / 256GB", nonPta: [p(181999, "mega")] },
        { storage: "12GB / 512GB", nonPta: [p(194999, "mega")] },
      ], [MEGA_ONEPLUS]),
    ],
    ptaNotes: PTA_BASE,
    used: {
      heading: "Which OnePlus phones are worth buying used?",
      paragraphs: [
        "Most OnePlus phones in Pakistan are non-PTA, used or new. A used OnePlus 11, 12 or 13 can be good value, but only once you check its PTA status and add the tax if it has none. A PTA-approved used OnePlus is rarer and usually worth a higher price for that reason.",
      ],
      bullets: USED_CHECKS,
    },
    service: {
      heading: "OnePlus warranty and service in Pakistan",
      paragraphs: [
        "We found no official OnePlus service centre in Pakistan (unavailable as of 4 October 2026). Repairs are done by independent shops, and any warranty is the seller's own.",
      ],
    },
    faqs: faqs([
      { question: "Is OnePlus officially sold in Pakistan?", answer: "We found no official OnePlus distributor or Pakistan price list. The units we found at a large retailer were non-PTA imports." },
      { question: "What is the OnePlus 15 price in Pakistan?", answer: "Mega.pk listed the non-PTA OnePlus 15 (16GB/512GB) at Rs 284,999 on 4 October 2026." },
      ptaFaq("OnePlus"),
      taxFaq("OnePlus"),
      usedFaq("OnePlus", "oneplus"),
    ]),
    links: [...COMMON_LINKS, ...CITY_LINKS("oneplus")],
    sources: [SRC.news24],
  },
  {
    slug: "realme",
    title: "Realme Mobile Price in Pakistan 2026 (PTA)",
    h1: "Realme Mobile Price in Pakistan 2026",
    description: "Realme mobile prices in Pakistan in 2026: official launch prices for the realme 16 Pro+, 16 Pro and 16 5G, plus C100, C71, C75x and Note 70 retail prices, PTA notes and realme support contacts.",
    updated: CHECKED,
    intro: [
      "realme sells officially in Pakistan and runs a Pakistan website. Its current line-up there includes the realme 16 Pro+, 16 Pro and 16 5G, the 15 Pro and 15, the C100, C100x, C100i, C85 and C85 Pro, and the Note 80 and Note 70. Official units are PTA approved.",
      "The table combines realme's official launch prices for the 16 series (April 2026) with what a large retailer listed on 4 October 2026 for other models. Each price shows its source and date.",
    ],
    priceNote: "Official prices are realme's launch prices reported on 7 April 2026. Retailer prices are what PriceOye showed on 4 October 2026 for new units with brand warranty; for models with several versions, the price is for the version shown first.",
    extraPrices: [
      row("Realme", "16 Pro+ 5G", [{ storage: "12GB / 512GB", official: [p(199999, "pwRealme16")] }], [PW_REALME]),
      row("Realme", "16 Pro 5G", [{ storage: "12GB / 512GB", official: [p(169999, "pwRealme16")] }], [PW_REALME]),
      row("Realme", "16 5G", [{ storage: "8GB / 256GB", official: [p(129999, "pwRealme16")], ptaRetail: [p(114499, "priceoye")] }], [PW_REALME, PO_REALME]),
      row("Realme", "15 Pro", [{ storage: "12GB / 512GB", ptaRetail: [p(151999, "priceoye")] }], [PO_REALME]),
      row("Realme", "C100", [{ storage: "8GB / 256GB", ptaRetail: [p(90999, "priceoye")] }], [PO_REALME]),
      row("Realme", "C100x", [{ storage: "6GB or 8GB / 128GB", ptaRetail: [p(67299, "priceoye")] }], [PO_REALME]),
      row("Realme", "C75x", [{ storage: "6GB or 8GB / 128GB", ptaRetail: [p(54499, "priceoye")] }], [PO_REALME]),
      row("Realme", "C71", [{ storage: "6GB or 8GB / 128GB", ptaRetail: [p(53300, "priceoye")] }], [PO_REALME]),
      row("Realme", "Note 70", [{ storage: "4GB or 6GB / 128GB", ptaRetail: [p(41599, "priceoye")] }], [PO_REALME]),
      row("Realme", "C100i", [{ storage: "4GB / 64GB to 6GB / 128GB", ptaRetail: [p(36999, "priceoye")] }], [PO_REALME]),
    ],
    ptaNotes: PTA_BASE,
    used: {
      heading: "Which realme phones are worth buying used?",
      paragraphs: [
        "A used realme C or Note phone is only worth it with a large discount, because the new PTA prices in the table are already low. For the 15 and 16 series, compare with the official launch prices above. Ask the seller to remove their realme or Google account before you pay.",
      ],
      bullets: USED_CHECKS,
    },
    service: {
      heading: "realme warranty and support in Pakistan",
      paragraphs: [
        "realme Pakistan's website (checked 4 October 2026) gives a support WhatsApp number, +92 339 3339988, and a phone line, 042-38048018, open Monday to Saturday, 9:30am to 6pm, excluding holidays. It also has a service-centre page, which did not load for us, so we do not list addresses here.",
      ],
    },
    faqs: faqs([
      { question: "What is the realme 16 Pro price in Pakistan?", answer: "realme launched the 16 Pro (12GB/512GB) in Pakistan at Rs 169,999, with the 16 Pro+ at Rs 199,999 and the 16 5G at Rs 129,999 (reported 7 April 2026)." },
      { question: "What is the cheapest realme phone in Pakistan?", answer: "Of the models we verified, the realme C100i was the cheapest, shown at Rs 36,999 on PriceOye on 4 October 2026." },
      ptaFaq("realme"),
      taxFaq("realme"),
      { question: "How do I contact realme support in Pakistan?", answer: "realme Pakistan lists WhatsApp +92 339 3339988 and 042-38048018, Monday to Saturday, 9:30am to 6pm, excluding holidays." },
      usedFaq("realme", "realme"),
    ]),
    links: [...COMMON_LINKS, ...CITY_LINKS("realme")],
    sources: [SRC.realmePk, SRC.news24],
  },
  {
    slug: "huawei",
    title: "Huawei Mobile Price in Pakistan 2026: What's Available",
    h1: "Huawei Mobile Price in Pakistan 2026",
    description: "Huawei mobile prices in Pakistan in 2026: which Huawei phones are officially sold, why we list no current official prices, Google services on used Huawei phones, PTA checks and used-phone advice.",
    updated: CHECKED,
    intro: [
      "Huawei's Pakistan consumer website (checked 4 October 2026) features tablets and wearables, and we did not find a current Huawei phone with an official Pakistan price. Two large Pakistani retailers we checked had no current Huawei phone in stock either. So this page lists no new-phone prices: they are unavailable, not missing by mistake.",
      "So the Huawei phones you are likely to be offered are used ones, such as the P30 Pro, P60 Pro, Nova 11, Nova 12 or Mate 60. The most important thing to know before buying one is whether it has Google's apps.",
    ],
    priceNote: "No verified current price: Huawei Pakistan's site lists no phone prices, and Mega.pk and PriceOye listed no current Huawei phone on 4 October 2026.",
    ptaNotes: PTA_BASE,
    used: {
      heading: "Used Huawei phones: Google apps and what to check",
      paragraphs: [
        "In 2019 the US export ban stopped Google licensing its apps and services to new Huawei phones. Huawei's Mate 30, launched in September 2019, was the first all-new model to ship without Google Mobile Services, including the Play Store, Gmail, YouTube and Maps (Reuters and The Verge, 19 September 2019). Huawei phones launched after that use Huawei's AppGallery instead.",
        "The P30 Pro launched before the ban and shipped with Google services. Later models such as the P60 Pro, Mate 60, Nova 11 and Nova 12 do not have the Play Store built in. Check that the apps you need work on the phone in front of you before you pay.",
      ],
      bullets: USED_CHECKS,
    },
    service: {
      heading: "Huawei warranty and service in Pakistan",
      paragraphs: [
        "Huawei's Pakistan site has a support section, but its service-centre list did not load for us, so we do not list addresses (unavailable as of 4 October 2026). A used Huawei phone is unlikely to still be under warranty; ask the seller for the original bill.",
      ],
    },
    faqs: faqs([
      { question: "Are Huawei phones officially sold in Pakistan in 2026?", answer: "Huawei's Pakistan site featured tablets and wearables when we checked on 4 October 2026, and we found no current Huawei phone with an official Pakistan price." },
      { question: "Do Huawei phones have Google Play?", answer: "Phones launched before the 2019 US ban, such as the P30 Pro, shipped with Google services. Models launched from the Mate 30 onwards ship without Google Mobile Services and use AppGallery." },
      ptaFaq("Huawei"),
      taxFaq("Huawei"),
      usedFaq("Huawei", "huawei"),
    ]),
    links: [...COMMON_LINKS, ...CITY_LINKS("huawei")],
    sources: [SRC.huaweiPk, SRC.reutersHuawei, SRC.vergeHuawei, SRC.news24],
  },
  {
    slug: "nothing",
    title: "Nothing Phone Price in Pakistan 2026 (PTA & Non-PTA)",
    h1: "Nothing Phone Price in Pakistan 2026",
    description: "Nothing Phone price in Pakistan in 2026: Phone (4a), (4a) Pro, (3a), (3a) Pro, (3a) Lite, (2a) and CMF phones with dated PTA prices, the official distributor, PTA tax notes and used-phone checks.",
    updated: CHECKED,
    intro: [
      "Nothing sells officially in Pakistan. Jazz announced on 23 April 2026 that it had partnered with Nothing and Yellostone Technologies, which it named as Nothing's official distributor in Pakistan, to launch the Phone (4a) series, sold at Jazz Experience Centres in major cities. Official units are PTA approved.",
      "The table combines the Phone (4a) series launch prices from April 2026 with what a large retailer listed on 4 October 2026 for new units with brand warranty. Each price shows its source and date. We did not find a reliable non-PTA price for any Nothing phone, so that column is empty.",
    ],
    priceNote: "Launch prices were reported on 20 April 2026. Retailer prices are what PriceOye showed on 4 October 2026 for new units with brand warranty; for the Phone (4a), which has 8GB and 12GB versions, the price is for the version shown first.",
    extraPrices: [
      row("Nothing", "Phone (4a) Pro", [{ storage: "12GB / 256GB", official: [p(244999, "pwNothing4a", "Launch price")], ptaRetail: [p(233999, "priceoye")] }], [PW_NOTHING, PO_NOTHING]),
      row("Nothing", "Phone (4a)", [{ storage: "8GB or 12GB / 256GB", official: [p(214999, "pwNothing4a", "Launch price reported")], ptaRetail: [p(168499, "priceoye")] }], [PW_NOTHING, PO_NOTHING]),
      row("Nothing", "Phone (3a) Pro", [{ storage: "12GB / 256GB", ptaRetail: [p(173999, "priceoye")] }], [PO_NOTHING]),
      row("Nothing", "Phone (3a)", [{ storage: "12GB / 256GB", ptaRetail: [p(145499, "priceoye")] }], [PO_NOTHING]),
      row("Nothing", "Phone (2a)", [{ storage: "12GB / 256GB", ptaRetail: [p(112199, "priceoye")] }], [PO_NOTHING]),
      row("Nothing", "Phone (3a) Lite", [{ storage: "8GB / 256GB", ptaRetail: [p(106999, "priceoye")] }], [PO_NOTHING]),
      row("Nothing", "CMF Phone 2 Pro", [{ storage: "8GB / 128GB", ptaRetail: [p(99299, "priceoye")] }], [PO_NOTHING]),
      row("Nothing", "CMF Phone 1", [{ storage: "8GB / 128GB", ptaRetail: [p(77249, "priceoye")] }], [PO_NOTHING]),
    ],
    ptaNotes: [
      ...PTA_BASE,
      "We found no current price for the flagship Nothing Phone (3) at the Pakistani retailers we checked, so it is not in the table (unavailable as of 4 October 2026).",
    ],
    used: {
      heading: "Which Nothing phones are worth buying used?",
      paragraphs: [
        "If you are looking at an older model such as the Phone (1), Phone (2) or Phone (2a), compare the used price with the new PTA prices in the table first: the Phone (2a) was still on sale new at Rs 112,199 on 4 October 2026, so a used one should cost clearly less.",
        "On any Nothing phone, check that the Glyph lights on the back all work, and look for scratches under the transparent back panel. Ask the seller to remove their Google account before you pay.",
      ],
      bullets: USED_CHECKS,
    },
    service: {
      heading: "Nothing warranty and service in Pakistan",
      paragraphs: [
        "Jazz names Yellostone Technologies as Nothing's official distributor in Pakistan. We could not find a published list of Nothing service centres in Pakistan (unavailable as of 4 October 2026), so keep the bill from an authorised seller or Jazz Experience Centre and ask the seller where warranty repairs are handled.",
      ],
    },
    faqs: faqs([
      { question: "What is the Nothing Phone (4a) price in Pakistan?", answer: "PhoneWorld reported a launch price of Rs 214,999 for the Phone (4a) in April 2026. On 4 October 2026 PriceOye showed it at Rs 168,499 for the version listed first." },
      { question: "What is the Nothing Phone (4a) Pro price in Pakistan?", answer: "The Phone (4a) Pro (12GB/256GB) launched at Rs 244,999 (April 2026). PriceOye showed Rs 233,999 on 4 October 2026." },
      { question: "Is Nothing officially available in Pakistan?", answer: "Yes. Jazz announced on 23 April 2026 that Yellostone Technologies is Nothing's official distributor in Pakistan and that the Phone (4a) series is sold at Jazz Experience Centres." },
      ptaFaq("Nothing"),
      taxFaq("Nothing"),
      usedFaq("Nothing", "nothing"),
    ]),
    links: [...COMMON_LINKS, ...CITY_LINKS("nothing")],
    sources: [SRC.jazzNothing, SRC.news24],
  },
];

export function getBrandHub(slug: string) {
  return BRAND_HUBS.find((h) => h.slug === slug);
}
