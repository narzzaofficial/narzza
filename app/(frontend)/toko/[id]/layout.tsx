import { Suspense } from "react";
import { DetailShell } from "@/components/navigation/DetailShell";
import {
  ProductRecommendSidebarLeft,
  ProductRecommendSidebarRight,
} from "@/components/navigation/ProductRecommendSidebar";

type Props = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

export default async function TokoDetailLayout({ children, params }: Props) {
  const { id } = await params;

  return (
    <DetailShell
      leftSidebar={
        <Suspense fallback={<div className="sidebar-widget animate-pulse h-64" />}>
          <ProductRecommendSidebarLeft currentId={id} />
        </Suspense>
      }
      rightSidebar={
        <Suspense fallback={<div className="sidebar-widget animate-pulse h-64" />}>
          <ProductRecommendSidebarRight currentId={id} />
        </Suspense>
      }
    >
      {children}
    </DetailShell>
  );
}

