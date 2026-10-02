/**
 * Statutory components of the duty/tax FBR collects when a CBU (fully built)
 * mobile phone is registered in PTA's DIRBS. Every number here is copied from a
 * primary legal text; see PTA_TAX_SOURCES. Do not add a figure that is not in
 * one of those texts.
 *
 * Limits (shown to users on /guides/pta-tax):
 * - Customs applies its own assessed value and may add charges that are not
 *   modelled here. DIRBS issues the payable amount (PSID); that figure is final.
 * - Slabs are by C&F value in US dollars per set.
 */

export const PTA_TAX_RATES_CHECKED = "2 October 2026";

export const PTA_TAX_SOURCES = [
  {
    label: "Regulatory duty: FBR S.R.O. 1064(I)/2026 (30 June 2026, from 1 July 2026), PCT 8517.1390/8517.1419",
    href: "https://download1.fbr.gov.pk/SROs/202663017637155381064-2026.pdf",
  },
  {
    label: "Sales tax: Sales Tax Act 1990, Ninth Schedule, Table-II (substituted by Finance Act 2024)",
    href: "https://download1.fbr.gov.pk/Docs/20247231874252122SalesTaxAct,1990updatedbyFinanceAct,2024upto30.06.2024--12.07.2024.pdf",
  },
  {
    label:
      "Income tax: Income Tax Ordinance 2001, First Schedule Part II (s.148, mobile phones in CBU condition), Tenth Schedule rule 1, Second Schedule clause (60E). FBR text amended up to 31 July 2025",
    href: "https://download1.fbr.gov.pk/Docs/2025881983148210Income-Tax-Ordinance,-2001-Amended-upto-31.07.2025.pdf",
  },
  {
    label: "Mobile handset levy: Finance Act 2018, table substituted by section 7 of the Finance Act 2022",
    href: "https://download1.fbr.gov.pk/Docs/2022711571639532FinanceAct2022.pdf",
  },
] as const;

type Band = { upTo: number; amount: number };

/** S.R.O. 1064(I)/2026 — rupees per set. */
export const REGULATORY_DUTY: Band[] = [
  { upTo: 30, amount: 240 },
  { upTo: 100, amount: 2400 },
  { upTo: 200, amount: 6000 },
  { upTo: 350, amount: 8800 },
  { upTo: 500, amount: 12000 },
  { upTo: Infinity, amount: 17600 },
];

/** ITO 2001 First Schedule Part II, CBU column (filer rate). Smartphones up to US$100 pay Rs 100. */
export const INCOME_TAX_148: Band[] = [
  { upTo: 100, amount: 100 },
  { upTo: 200, amount: 930 },
  { upTo: 350, amount: 970 },
  { upTo: 500, amount: 5000 },
  { upTo: Infinity, amount: 11500 },
];

/** Finance Act 2018 levy table as substituted by Finance Act 2022. */
export const HANDSET_LEVY: Band[] = [
  { upTo: 30, amount: 100 },
  { upTo: 100, amount: 200 },
  { upTo: 200, amount: 600 },
  { upTo: 350, amount: 1800 },
  { upTo: 500, amount: 4000 },
  { upTo: 700, amount: 8000 },
  { upTo: Infinity, amount: 16000 },
];

/** Ninth Schedule Table-II, CBU at import or registration. */
export function salesTaxRate(usd: number) {
  return usd > 500 ? 0.25 : 0.18;
}

function band(bands: Band[], usd: number) {
  return (bands.find((b) => usd <= b.upTo) || bands[bands.length - 1]).amount;
}

export type PtaRoute = "baggage" | "cnic";

export type PtaTaxInput = {
  usd: number;
  pkrPerUsd: number;
  route: PtaRoute;
  /** Appears in FBR's Active Taxpayers List. Only matters for income tax. */
  activeTaxpayer: boolean;
};

export type PtaTaxBreakdown = {
  valuePkr: number;
  regulatoryDuty: number;
  salesTax: number;
  salesTaxRate: number;
  incomeTax: number;
  handsetLevy: number;
  total: number;
};

export function estimatePtaTax(input: PtaTaxInput): PtaTaxBreakdown | null {
  const { usd, pkrPerUsd, route, activeTaxpayer } = input;
  if (!Number.isFinite(usd) || !Number.isFinite(pkrPerUsd) || usd <= 0 || pkrPerUsd <= 0) return null;
  const valuePkr = usd * pkrPerUsd;
  const regulatoryDuty = band(REGULATORY_DUTY, usd);
  const rate = salesTaxRate(usd);
  const salesTax = Math.round(valuePkr * rate);
  // Clause (60E), Part IV, Second Schedule: s.148 does not apply to phones in personal baggage.
  const baseIncomeTax = route === "baggage" ? 0 : band(INCOME_TAX_148, usd);
  // Tenth Schedule rule 1: +100% for persons not on the Active Taxpayers List.
  const incomeTax = activeTaxpayer ? baseIncomeTax : baseIncomeTax * 2;
  const handsetLevy = band(HANDSET_LEVY, usd);
  return {
    valuePkr: Math.round(valuePkr),
    regulatoryDuty,
    salesTax,
    salesTaxRate: rate,
    incomeTax,
    handsetLevy,
    total: regulatoryDuty + salesTax + incomeTax + handsetLevy,
  };
}

/**
 * Published DIRBS-based estimates for specific models. Third-party figures,
 * shown with source and date. They are higher than the statutory components
 * above because Customs uses its own assessed value and other charges.
 */
export const PUBLISHED_PTA_TAX = {
  source: "PhoneWorld, “iPhone 17 PTA Tax in Pakistan – All Models”, updated 8 July 2026",
  href: "https://www.phoneworld.com.pk/apple-iphone-17-17-air-17-pro-17-pro-max-pta-tax/",
  rows: [
    { model: "iPhone 17", passport: 149640, cnic: 164604 },
    { model: "iPhone 17 Air", passport: 156322, cnic: 172377 },
    { model: "iPhone 17 Pro", passport: 190679, cnic: 209747 },
    { model: "iPhone 17 Pro Max", passport: 204954, cnic: 225449 },
  ],
} as const;

/**
 * FBR Directorate General of Customs Valuation, Valuation Ruling No. 2070/2026
 * (dated 21-04-2026). C&F values in US$ per piece for OLD AND USED phones
 * imported in COMMERCIAL QUANTITY without packing/accessories. Read from the
 * scanned FBR PDF. Not a quote for an individual DIRBS registration.
 */
export const FBR_VR_2070 = {
  title: "FBR Valuation Ruling No. 2070/2026 (21 April 2026): customs values of old and used mobile phones",
  href: "https://download1.fbr.gov.pk/VALUATIONS/20264221242011915UsedMobilePhone.pdf",
  litigationNote:
    "On 31 August 2026 the Sindh High Court (SCRA No. 190/2026) suspended a Customs Appellate Tribunal judgment of 22 July 2026 about this ruling; FBR circulated the order in September 2026.",
  litigationHref: "https://download1.fbr.gov.pk/Docs/20269101591728609scra190-2026.pdf",
  rows: [
    ["Apple", "iPhone 15 Pro Max", 505],
    ["Apple", "iPhone 15 Pro", 472],
    ["Apple", "iPhone 15 Plus", 390],
    ["Apple", "iPhone 15", 378],
    ["Apple", "iPhone 14 Pro Max", 413],
    ["Apple", "iPhone 14 Pro", 350],
    ["Apple", "iPhone 14", 275],
    ["Apple", "iPhone 13 Pro Max", 374],
    ["Apple", "iPhone 13 Pro", 293],
    ["Apple", "iPhone 13", 225],
    ["Apple", "iPhone 12 Pro Max", 274],
    ["Apple", "iPhone 12 Pro", 222],
    ["Apple", "iPhone 12", 156],
    ["Apple", "iPhone 11 Pro Max", 211],
    ["Apple", "iPhone 11 Pro", 160],
    ["Apple", "iPhone 11", 133],
    ["Apple", "iPhone XS Max", 95],
    ["Apple", "iPhone XR", 80],
    ["Samsung", "Galaxy S23 Ultra", 305],
    ["Samsung", "Galaxy S23+", 260],
    ["Samsung", "Galaxy S23", 250],
    ["Samsung", "Galaxy S22 Ultra 5G", 260],
    ["Samsung", "Galaxy S22+ 5G", 180],
    ["Samsung", "Galaxy S22 5G", 130],
    ["Samsung", "Galaxy S21+ 5G", 150],
    ["Samsung", "Galaxy S21 5G", 110],
    ["Samsung", "Galaxy Note 20 Ultra", 145],
    ["Google", "Pixel 9 Pro XL", 348],
    ["Google", "Pixel 9 Pro", 290],
    ["Google", "Pixel 9", 215],
    ["Google", "Pixel 8 Pro", 215],
    ["Google", "Pixel 8a", 120],
    ["Google", "Pixel 7 Pro", 145],
    ["Google", "Pixel 7", 105],
    ["Google", "Pixel 6 Pro", 110],
    ["Google", "Pixel 6", 94],
    ["Google", "Pixel 6a", 82],
    ["OnePlus", "OnePlus 12", 211],
    ["OnePlus", "OnePlus 12R", 176],
    ["OnePlus", "OnePlus 11", 121],
  ] as [string, string, number][],
};
