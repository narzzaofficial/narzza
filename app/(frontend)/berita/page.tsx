import { Suspense } from "react";
import type { Metadata } from "next";
import { FeedPage } from "@/components/feedpages/FeedPage";
import { getFeeds, getStories, getBooks } from "@/lib/data";

export const metadata: Metadata = {
  title: "Berita Teknologi Terbaru",
  description:
    "Update berita teknologi terkini, tren industri, dan perkembangan dunia digital dalam format chat yang mudah dipahami.",
  openGraph: {
    title: "Berita Teknologi Terbaru — Narzza Media Digital",
    description:
      "Update berita teknologi terkini dan tren industri dalam format chat interaktif.",
    url: "https://narzza.com/berita",
    type: "website",
  },
  alternates: { canonical: "/berita" },
};

// Helper fetch data (sama seperti di Home)
async function getInternalData(endpoint: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/api/${endpoint}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    return [];
  }
}

export default async function BeritaPage() {
  const [feeds, stories, books, roadmaps, products] = await Promise.all([
    getFeeds("Berita"),
    getStories(),
    getBooks(),
    getInternalData("roadmaps"),
    getInternalData("products"),
  ]);

  return (
    <Suspense fallback={<div className="min-h-screen bg-canvas" />}>
      <FeedPage
        activePath="/berita"
        badge="BERITA"
        title="Berita Teknologi"
        description="Update teknologi terkini dan tren industri."
        category="Berita"
        initialFeeds={feeds}
        initialStories={stories}
        initialBooks={books}
        initialRoadmaps={roadmaps}
        initialProducts={products}
      />
    </Suspense>
  );
}
