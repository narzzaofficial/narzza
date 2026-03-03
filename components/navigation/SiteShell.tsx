"use client";

import { usePathname } from "next/navigation";
import {
  AdsPlaceholder,
  MobileNavDrawer,
  NavigationSection,
} from ".";
import { ThemeToggle } from "@/components/navigation/ThemeToggle";

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
          <div className="sidebar-widget flex flex-col gap-0 p-4">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 text-base font-bold text-cyan-300 ring-1 ring-cyan-400/30">
                N
              </div>
              <div>
                <p className="text-base font-bold leading-none" style={{ color: "var(--text-primary)" }}>Narzza</p>
                <p className="mt-1 text-xs leading-none" style={{ color: "var(--text-secondary)" }}>Media Digital</p>
              </div>
            </div>
            <div className="drawer-divider my-3" />
            <NavigationSection activePath={activePath} />
            <div className="drawer-divider my-3" />
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
    </div>
  );
}
