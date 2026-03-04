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
    <div className="mb-6 flex flex-wrap gap-2">
      {tabs.map(({ key, label, countKey }) => (
        <button
          key={key}
          onClick={() => setTab(key)}
          className={`admin-tab-btn rounded-xl px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition ${
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
        className={`admin-tab-btn relative rounded-xl px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition ${
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
        className="admin-tab-link rounded-xl px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-slate-400 hover:text-slate-200 transition flex items-center"
      >
        📊 Analytics
      </Link>
    </div>
  );
}
