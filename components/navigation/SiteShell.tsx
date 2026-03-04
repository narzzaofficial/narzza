"use client";

import { usePathname } from "next/navigation";
import {
  AdsPlaceholder,
  MobileNavDrawer,
  NavigationSection,
} from ".";
import { ThemeToggle } from "@/components/navigation/ThemeToggle";
import { SiteFeedbackButton } from "@/components/floating-actions/SiteFeedbackButton";
import Image from "next/image";

type SiteShellProps = {
  children: React.ReactNode;
};

/** Rute detail konten — shell-nya dihandle oleh layout masing-masing */
const DETAIL_PATTERNS = [
  /^\/read\/[^/]+$/,
  /^\/buku\/\d+$/,
  /^\/roadmap\/[^/]+$/,
  /^\/toko\/[^/]+$/,
];

function isDetailPage(path: string) {
  return DETAIL_PATTERNS.some((pattern) => pattern.test(path));
}

export function SiteShell({ children }: SiteShellProps) {
  const activePath = usePathname();

  if (isDetailPage(activePath)) {
    return <>{children}</>;
  }

  return (
    <div className="page-shell">
      <div className="content-grid">
        {/* Sidebar Kiri */}
       <aside className="w-72 shrink-0 sidebar-sticky">
  <div className="sidebar-widget flex flex-col p-4">

    {/* Brand */}
    <div className="flex items-center gap-3">
      <Image
        src="/logo.png"
        alt="Narzza Logo"
        width={200}
        height={200}
        className="w-24 object-contain"
      />

      <div className="leading-tight">
        <p className="text-lg font-semibold">Narzza</p>
        <p className="text-xs text-gray-500">Media Digital</p>
      </div>
    </div>

    {/* Divider */}
    <div className="drawer-divider my-3" />

    {/* Navigation */}
    <NavigationSection activePath={activePath} />

    {/* Divider */}
    <div className="drawer-divider my-3" />

    {/* Theme Toggle */}
    <ThemeToggle />

  </div>
</aside>

        {/* Konten Utama */}
        <main className="mx-auto w-full min-w-0 max-w-3xl">{children}</main>

        {/* Sidebar Kanan — Ad slots */}
        <aside className="w-64 shrink-0 sidebar-sticky">
          <div className="space-y-4">
            <AdsPlaceholder label="Iklan" size="300 × 250" variant="square" />
            <AdsPlaceholder label="Sponsor" size="Native Promo Block" variant="native" />
            <AdsPlaceholder label="Iklan" size="300 × 90" variant="banner" />
          </div>
        </aside>
      </div>

      <MobileNavDrawer activePath={activePath} />
      <SiteFeedbackButton />
    </div>
  );
}
