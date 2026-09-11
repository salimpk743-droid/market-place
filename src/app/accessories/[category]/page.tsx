import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { CatalogResults } from "@/components/CatalogResults";
import { ACCESSORY_SLUGS, canonicalCategory, getCategory } from "@/lib/market/catalog";
import { searchListings } from "@/lib/market/listings";
import { absoluteUrl } from "@/lib/market/site";
import type { ListingFilters } from "@/lib/market/types";

type Props = { params: Promise<{ category: string }>; searchParams: Promise<ListingFilters> };

export function generateStaticParams() {
  return ACCESSORY_SLUGS.map((category) => ({ category }));
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { category } = await params;
  const canonical = canonicalCategory(category);
  if (!ACCESSORY_SLUGS.includes(canonical)) return { title: "Not found", robots: { index: false, follow: true } };
  const cat = getCategory(canonical);
  const f = await searchParams;
  const filtered = Boolean(f.q || f.brand || f.city || f.pta || f.storage || f.area || f.condition);
  const result = await searchListings({ category: cat.slug });
  return {
    title: `${cat.name} for sale in Pakistan`,
    description: `Buy and sell ${cat.name.toLowerCase()} on Mobile Market. ${cat.blurb}.`,
    alternates: { canonical: absoluteUrl(`/accessories/${cat.slug}`) },
    robots: !filtered && result.total > 0 ? { index: true, follow: true } : { index: false, follow: true },
  };
}

export default async function AccessoryCategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  const canonical = canonicalCategory(category);
  if (!ACCESSORY_SLUGS.includes(canonical)) notFound();
  if (canonical !== category) redirect(`/accessories/${canonical}`);
  const cat = getCategory(canonical);
  const f = await searchParams;
  const result = await searchListings({ ...f, category: cat.slug });
  return (
    <CatalogResults
      result={result}
      filters={{ ...f, category: cat.slug }}
      action={`/accessories/${cat.slug}`}
      lockedCategory={cat.slug}
      kicker="Accessories"
      title={cat.name}
      description={cat.blurb}
      emptyTitle={`No ${cat.short.toLowerCase()} ads yet`}
      emptyBody="When a seller posts a real listing in this category, it will show up here."
    />
  );
}
