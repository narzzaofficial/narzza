import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getFeeds } from "@/lib/data";
import { DetailShell } from "@/components/navigation/DetailShell";
import {
  FeedRecommendSidebarLeft,
  FeedRecommendSidebarRight,
} from "@/components/navigation/FeedRecommendSidebar";
import type { FeedCategory } from "@/types/content";

type Props = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

export default async function ReadDetailLayout({ children, params }: Props) {
  const { id } = await params;
  const feedId = Number(id);
  if (Number.isNaN(feedId)) notFound();

  const allFeeds = await getFeeds();
  const feed = allFeeds.find((f) => f.id === feedId);
  const category: FeedCategory = feed?.category ?? "Berita";

  return (
    <DetailShell
      leftSidebar={
        <Suspense fallback={<div className="sidebar-widget animate-pulse h-64" />}>
          <FeedRecommendSidebarLeft currentId={feedId} category={category} />
        </Suspense>
      }
      rightSidebar={
        <Suspense fallback={<div className="sidebar-widget animate-pulse h-64" />}>
          <FeedRecommendSidebarRight currentId={feedId} category={category} />
        </Suspense>
      }
    >
      {children}
    </DetailShell>
  );
}

