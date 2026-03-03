"use client";

import { MobileNavDrawer } from "./MobileNavDrawer";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type DetailShellProps = {
  children: ReactNode;
  leftSidebar: ReactNode;
  rightSidebar: ReactNode;
};

export function DetailShell({
  children,
  leftSidebar,
  rightSidebar,
}: DetailShellProps) {
  const activePath = usePathname();

  return (
    <div className="page-shell">
      <div className="content-grid">
        {/* Sidebar Kiri — Rekomendasi */}
        <aside className="w-72 shrink-0 sidebar-sticky">
          <div className="space-y-4">{leftSidebar}</div>
        </aside>

        {/* Konten Utama */}
        <main className="mx-auto w-full min-w-0 max-w-3xl">{children}</main>

        {/* Sidebar Kanan — Rekomendasi */}
        <aside className="w-64 shrink-0 sidebar-sticky">
          <div className="space-y-4">{rightSidebar}</div>
        </aside>
      </div>

      <MobileNavDrawer activePath={activePath} />
    </div>
  );
}

