"use client";

import Link from "next/link";
import type { AdminTab } from "@/app/admin/_types";

type AdminTabBarProps = {
  tab: AdminTab;
  setTab: (t: AdminTab) => void;
  counts: {
    feeds: number;
    stories: number;
    books: number;
    roadmaps: number;
    products: number;
    categories: number;
    messages: number;
    unreadMessages: number;
  };
};

const tabs: { key: AdminTab; label: string; countKey: keyof Omit<AdminTabBarProps["counts"], "unreadMessages"> }[] = [
  { key: "feeds", label: "📰 Feeds", countKey: "feeds" },
  { key: "stories", label: "💬 Stories", countKey: "stories" },
  { key: "books", label: "📚 Buku", countKey: "books" },
  { key: "roadmaps", label: "🧭 Roadmaps", countKey: "roadmaps" },
  { key: "products", label: "🛒 Produk", countKey: "products" },
  { key: "categories", label: "🏷️ Kategori", countKey: "categories" },
];

export function AdminTabBar({ tab, setTab, counts }: AdminTabBarProps) {
  return (
    <div className="mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
    <div className="flex overflow-x-auto scrollbar-hide gap-1 sm:gap-2 pb-1 sm:flex-wrap">
      {tabs.map(({ key, label, countKey }) => (
        <button
          key={key}
          onClick={() => setTab(key)}
          className={`admin-tab-btn shrink-0 rounded-lg px-2.5 py-1.5 text-[11px] sm:text-xs font-semibold transition ${
            tab === key
              ? "admin-tab-btn-active bg-cyan-500/20 text-cyan-200 ring-1 ring-cyan-500/40"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          {label} ({counts[countKey]})
        </button>
      ))}

      {/* Messages tab with unread badge */}
      <button
        onClick={() => setTab("messages")}
        className={`admin-tab-btn relative shrink-0 rounded-lg px-2.5 py-1.5 text-[11px] sm:text-xs font-semibold transition ${
          tab === "messages"
            ? "admin-tab-btn-active bg-cyan-500/20 text-cyan-200 ring-1 ring-cyan-500/40"
            : "text-slate-400 hover:text-slate-200"
        }`}
      >
        📨 Pesan
        {counts.unreadMessages > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[9px] font-bold text-white">
            {counts.unreadMessages > 99 ? "99+" : counts.unreadMessages}
          </span>
        )}
      </button>

      <Link
        href="/admin/analytics"
        className="admin-tab-link shrink-0 rounded-lg px-2.5 py-1.5 text-[11px] sm:text-xs font-semibold text-slate-400 hover:text-slate-200 transition flex items-center"
      >
        📊 Analytics
      </Link>
    </div>
    </div>
  );
}
