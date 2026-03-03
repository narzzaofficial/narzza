import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getFeeds, getFeedById, getFeedBySlug, getFeedSlugs, getProducts } from "@/lib/data";
import { CommentSection } from "@/components/comment/comment-section";
import { ReadArticleHeader } from "@/components/reads/read-article-header";
import { ReadArticleBody } from "@/components/reads/read-article-body";
import { SimilarFeedsSection } from "@/components/reads/similar-feeds-section";
import { StorePreviewSection } from "@/components/reads/store-preview-section";
import { JsonLd } from "@/components/JsonLd";

export const revalidate = 300;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getFeedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  // For old numeric URLs, try lookup by ID
  const feed = /^\d+$/.test(slug)
    ? await getFeedById(Number(slug))
    : await getFeedBySlug(slug);

  if (!feed) return { title: "Konten tidak ditemukan | Narzza Media Digital" };
  return {
    title: feed.title,
    description: feed.takeaway,
    openGraph: {
      title: feed.title,
      description: feed.takeaway,
      images: [feed.image],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: feed.title,
      description: feed.takeaway,
      images: [feed.image],
    },
    alternates: { canonical: `/read/${feed.slug}` },
  };
}

export default async function ReadPage({ params }: PageProps) {
  const { slug } = await params;

  // 301 redirect: old numeric URLs like /read/42 → /read/actual-slug-42
  if (/^\d+$/.test(slug)) {
    const feedById = await getFeedById(Number(slug));
    if (feedById) permanentRedirect(`/read/${feedById.slug}`);
    notFound();
  }

  const feed = await getFeedBySlug(slug);
  if (!feed) notFound();

  const [allFeeds, products] = await Promise.all([getFeeds(), getProducts()]);

  const similarFeeds = allFeeds
    .filter((item) => item.category === feed.category && item.id !== feed.id)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 8);
  const storePreview = products.slice(0, 8);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: feed.title,
          description: feed.takeaway,
          image: feed.image,
          datePublished: new Date(feed.createdAt).toISOString(),
          dateModified: new Date(feed.createdAt).toISOString(),
          url: `https://narzza.com/read/${feed.slug}`,
          author: {
            "@type": "Organization",
            name: "Narzza Media Digital",
            url: "https://narzza.com",
          },
          publisher: {
            "@type": "Organization",
            name: "Narzza Media Digital",
            logo: {
              "@type": "ImageObject",
              url: "https://narzza.com/og-default.png",
            },
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://narzza.com/read/${feed.slug}`,
          },
        }}
      />
      <ReadArticleHeader title={feed.title} category={feed.category} />
      <ReadArticleBody feed={feed} />
      <CommentSection feedId={feed.id} />
      <SimilarFeedsSection feeds={similarFeeds} category={feed.category} />
      <StorePreviewSection products={storePreview} />
    </>
  );
}

