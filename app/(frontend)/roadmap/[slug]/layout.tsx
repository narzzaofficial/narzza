import { Suspense } from "react";
import { DetailShell } from "@/components/navigation/DetailShell";
import {
  RoadmapRecommendSidebarLeft,
  RoadmapRecommendSidebarRight,
} from "@/components/navigation/RoadmapRecommendSidebar";

type Props = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

export default async function RoadmapDetailLayout({ children, params }: Props) {
  const { slug } = await params;

  return (
    <DetailShell
      leftSidebar={
        <Suspense fallback={<div className="sidebar-widget animate-pulse h-64" />}>
          <RoadmapRecommendSidebarLeft currentSlug={slug} />
        </Suspense>
      }
      rightSidebar={
        <Suspense fallback={<div className="sidebar-widget animate-pulse h-64" />}>
          <RoadmapRecommendSidebarRight currentSlug={slug} />
        </Suspense>
      }
    >
      {children}
    </DetailShell>
  );
}

