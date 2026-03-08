import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import {
  getFeedById,
  getFeedBySlug,
  getFeedSlugs,
  getProducts,
} from "@/lib/data";
import { CommentSection } from "@/components/comment/comment-section";
import { ReadArticleHeader } from "@/components/reads/read-article-header";
import { ReadArticleBody } from "@/components/reads/read-article-body";
import { SimilarFeedsSection } from "@/components/reads/similar-feeds-section";
import { StorePreviewSection } from "@/components/reads/store-preview-section";
import { JsonLd } from "@/components/JsonLd";
import {
  SITE_NAME,
  BASE_URL,
  SITE_LOGO,
  SITE_LOGO_WIDTH,
  SITE_LOGO_HEIGHT,
  SITE_OG_IMAGE_WIDTH,
  SITE_OG_IMAGE_HEIGHT,
  SITE_LANGUAGE,
} from "@/lib/site-config";
import { getSimilarFeeds } from "@/lib/data/feed-fetching/feeds";

type PageProps = { params: Promise<{ slug: string }> };

/**
 * Pre-render semua slug saat build time → SSG murni.
 * Slug baru yang ditambahkan setelah build akan di-render on-demand
 * (fallback: "blocking" adalah default Next.js App Router).
 */
export async function generateStaticParams() {
  const slugs = await getFeedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const feed = /^\d+$/.test(slug)
    ? await getFeedById(Number(slug))
    : await getFeedBySlug(slug);

  if (!feed) return { title: `Konten tidak ditemukan | ${SITE_NAME}` };

  return {
    title: feed.title,
    description: feed.takeaway,
    authors: [{ name: feed.author || SITE_NAME, url: BASE_URL }],
    openGraph: {
      title: feed.title,
      description: feed.takeaway,
      images: [
        {
          url: feed.image,
          width: SITE_OG_IMAGE_WIDTH,
          height: SITE_OG_IMAGE_HEIGHT,
          alt: feed.title,
        },
      ],
      type: "article",
      publishedTime: new Date(feed.createdAt).toISOString(),
      authors: [feed.author || SITE_NAME],
      section: feed.category,
    },
    twitter: {
      card: "summary_large_image",
      title: feed.title,
      description: feed.takeaway,
      images: [feed.image],
    },
    alternates: {
      canonical: `/read/${feed.slug}`,
      types: { "application/rss+xml": `${BASE_URL}/rss.xml` },
    },
  };
}

export default async function ReadPage({ params }: PageProps) {
  const { slug } = await params;

  // 301 redirect: URL lama numerik /read/42 → /read/actual-slug-42
  if (/^\d+$/.test(slug)) {
    const feedById = await getFeedById(Number(slug));
    if (feedById) permanentRedirect(`/read/${feedById.slug}`);
    notFound();
  }

  const feed = await getFeedBySlug(slug);
  if (!feed) notFound();

  // ✅ getSimilarFeeds langsung query DB dengan filter — tidak fetch semua feed
  // ✅ getProducts tetap paralel via Promise.all
  const [similarFeeds, products] = await Promise.all([
    getSimilarFeeds(feed.category, feed.id),
    getProducts(),
  ]);

  const storePreview = products.slice(0, 8);

  // Build FAQPage schema dari Q/A chat lines
  const qaLines = feed.lines.reduce<{ q: string; a: string }[]>(
    (acc, line, idx, arr) => {
      if (line.role === "q") {
        const answer = arr.slice(idx + 1).find((l) => l.role === "a");
        if (answer) acc.push({ q: line.text, a: answer.text });
      }
      return acc;
    },
    []
  );

  const faqSchema =
    qaLines.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: qaLines.map(({ q, a }) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: { "@type": "Answer", text: a },
          })),
        }
      : null;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: feed.title,
          description: feed.takeaway,
          image: {
            "@type": "ImageObject",
            url: feed.image,
            width: SITE_OG_IMAGE_WIDTH,
            height: SITE_OG_IMAGE_HEIGHT,
          },
          datePublished: new Date(feed.createdAt).toISOString(),
          dateModified: new Date(feed.createdAt).toISOString(),
          url: `${BASE_URL}/read/${feed.slug}`,
          articleSection: feed.category,
          inLanguage: SITE_LANGUAGE,
          author: {
            "@type": "Organization",
            name: feed.author || SITE_NAME,
            url: BASE_URL,
          },
          publisher: {
            "@type": "Organization",
            name: SITE_NAME,
            logo: {
              "@type": "ImageObject",
              url: SITE_LOGO,
              width: SITE_LOGO_WIDTH,
              height: SITE_LOGO_HEIGHT,
            },
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${BASE_URL}/read/${feed.slug}`,
          },
        }}
      />
      {faqSchema && <JsonLd data={faqSchema} />}
      <ReadArticleHeader title={feed.title} category={feed.category} />
      <ReadArticleBody feed={feed} />
      <CommentSection feedId={feed.id} />
      <SimilarFeedsSection feeds={similarFeeds} category={feed.category} />
      <StorePreviewSection products={storePreview} />
    </>
  );
}
