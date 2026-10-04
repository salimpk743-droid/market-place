import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { LegalPage } from "@/components/LegalPage";
import { AuthorBox } from "@/components/GuideMeta";
import { placeGuideBySlug, placeGuides } from "@/lib/market/place-guides";
import { absoluteUrl } from "@/lib/market/site";

export function generateStaticParams() {
  return placeGuides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = placeGuideBySlug(slug);
  if (!guide) return {};
  return {
    title: guide.seoTitle ?? guide.title,
    description: guide.description,
    alternates: { canonical: absoluteUrl(`/guides/${guide.slug}`) },
    robots: { index: true, follow: true },
  };
}

export default async function PlaceGuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = placeGuideBySlug(slug);
  if (!guide) notFound();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: guide.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }}
      />
      <LegalPage title={guide.seoTitle ?? guide.title} updated={guide.updated}>
        {guide.seoTitle ? <h2>{guide.title}</h2> : null}
        <p>{guide.intro}</p>
        {guide.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.bullets ? (
              <ul className="list-disc space-y-1 pl-6">
                {section.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
            {section.links ? (
              <ul className="list-disc space-y-1 pl-6">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
        <h2>Questions people ask</h2>
        {guide.faqs.map((faq) => (
          <section key={faq.question}>
            <h3 className="!mt-4 text-base font-semibold text-ink">{faq.question}</h3>
            <p>{faq.answer}</p>
          </section>
        ))}
        <h2>Keep going</h2>
        <ul className="list-disc space-y-1 pl-6">
          {guide.related.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="link">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <h2>Where these names come from</h2>
        <ul className="list-disc space-y-1 pl-6">
          {guide.sources.map((source) => (
            <li key={source.href}>
              <a href={source.href} className="link">
                {source.label}
              </a>
            </li>
          ))}
        </ul>
        <AuthorBox reviewed={guide.updated} sourcesNote="Shop names and addresses are copied from the distributor, brand or news pages listed above; we have not visited every counter." />
      </LegalPage>
    </>
  );
}
