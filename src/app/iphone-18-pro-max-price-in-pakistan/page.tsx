import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IPhonePriceGuide } from "@/components/IPhonePriceGuide";
import { getModelPriceData, lowestOfficialPrice } from "@/lib/market/model-prices";
import { absoluteUrl } from "@/lib/market/site";

const path = "/iphone-18-pro-max-price-in-pakistan";
const data = getModelPriceData("Apple", "iPhone 18 Pro Max");
const from = data ? lowestOfficialPrice(data) : null;

export const metadata: Metadata = {
  title: { absolute: "iPhone 18 Pro Max Price in Pakistan 2026: PTA & Non-PTA" },
  description: `iPhone 18 Pro Max price in Pakistan from Rs ${from?.toLocaleString("en-PK")} (official PTA approved). All storage options 256GB–2TB, non-PTA where verified, specs and sources.`,
  alternates: { canonical: absoluteUrl(path) },
  openGraph: {
    title: "iPhone 18 Pro Max Price in Pakistan 2026",
    url: absoluteUrl(path),
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "iPhone 18 Pro Max price in Pakistan" }],
  },
};

export default function IPhone18ProMaxPage() {
  if (!data) notFound();
  return (
    <IPhonePriceGuide
      data={data}
      path={path}
      modelPagePath="/phones/apple/iphone-18-pro-max"
      related={[
        { href: "/iphone-18-pro-price-in-pakistan", title: "iPhone 18 Pro", text: "Pakistan price table" },
        { href: "/iphone-18-price-in-pakistan", title: "iPhone 18", text: "Which iPhone 18 models are out" },
        { href: "/phones/apple/iphone-17-pro-max", title: "iPhone 17 Pro Max", text: "Price, PTA tax and specs" },
      ]}
    />
  );
}
