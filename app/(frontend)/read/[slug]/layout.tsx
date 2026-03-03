import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getFeedBySlug, getFeedById } from "@/lib/data";
import { DetailShell } from "@/components/navigation/DetailShell";
import {
  FeedRecommendSidebarLeft,
  FeedRecommendSidebarRight,
} from "@/components/navigation/FeedRecommendSidebar";
import type { FeedCategory } from "@/types/content";

type Props = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

export default async function ReadDetailLayout({ children, params }: Props) {
  const { slug } = await params;
  const feed = /^\d+$/.test(slug)
    ? await getFeedById(Number(slug))
    : await getFeedBySlug(slug);
  if (!feed) notFound();

  const category: FeedCategory = feed.category ?? "Berita";

  return (
    <DetailShell
      leftSidebar={
        <Suspense fallback={<div className="sidebar-widget animate-pulse h-64" />}>
          <FeedRecommendSidebarLeft currentId={feed.id} category={category} />
        </Suspense>
      }
      rightSidebar={
        <Suspense fallback={<div className="sidebar-widget animate-pulse h-64" />}>
          <FeedRecommendSidebarRight currentId={feed.id} category={category} />
        </Suspense>
      }
    >
      {children}
    </DetailShell>
  );
}



