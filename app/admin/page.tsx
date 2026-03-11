"use client";

import Link from "next/link";
import { useState } from "react";
import { AdminTab } from "@/app/admin/_types";
import { AdminTabBar } from "@/app/admin/_components/admin-tab-bar";

// Import komponen tab

import { FeedTab } from "./_components/feedTab";
import { StoryTab } from "./_components/story-tab";
import { BookTab } from "./_components/book-tab";
import { useAdmin } from "@/hooks/useAdmin";
import type { DataKey } from "@/hooks/useAdmin";
import { RoadmapTab, ProductTab, CategoryTab } from "./_components/simple-tab";
import { MessageTab } from "./_components/message-tab";

export default function AdminPage() {
  const {
    data,
    loading,
    message,
    activeTab,
    flash,
    refreshEntity,
    deleteItem,
    deleteRoadmapItem,
    switchTab,
  } = useAdmin("feeds");

  return (
    <div className="admin-main-page bg-canvas min-h-screen px-4 py-8 text-slate-100">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">🛠️ Admin Panel</h1>
            <p className="mt-1 text-sm text-slate-400">
              Kelola konten Narzza Media Digital
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className="rounded-xl border border-slate-600/50 px-3 py-2 text-xs sm:text-sm text-slate-300 transition hover:border-cyan-400/50 hover:text-cyan-200"
            >
              Home
            </Link>
          </div>
        </div>

        {message && (
          <div className="mb-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200">
            {message}
          </div>
        )}

        <AdminTabBar
          tab={activeTab as AdminTab}
          setTab={(t) => switchTab(t as DataKey)}
          counts={{
            feeds: data.feeds.length,
            stories: data.stories.length,
            books: data.books.length,
            roadmaps: data.roadmaps.length,
            products: data.products.length,
            categories: data.categories.length,
            messages: data.messages.length,
            unreadMessages: data.messages.filter((m) => m.status === "unread")
              .length,
          }}
        />

        {loading ? (
          <div className="glass-panel rounded-2xl p-8 text-center text-slate-400">
            Memuat data...
          </div>
        ) : (
          <main className="mt-6">
            {activeTab === "feeds" && (
              <FeedTab
                feeds={data.feeds}
                onRefresh={() => refreshEntity("feeds")}
                onDelete={(id: number) => deleteItem("feeds", id)}
                flash={flash}
              />
            )}
            {activeTab === "stories" && (
              <StoryTab
                stories={data.stories}
                onRefresh={() => refreshEntity("stories")}
                onDelete={(id: number) => deleteItem("stories", id)}
                flash={flash}
              />
            )}
            {activeTab === "books" && (
              <BookTab
                books={data.books}
                onRefresh={() => refreshEntity("books")}
                onDelete={(id: number) => deleteItem("books", id)}
                flash={flash}
              />
            )}
            {activeTab === "roadmaps" && (
              <RoadmapTab
                roadmaps={data.roadmaps}
                onDelete={deleteRoadmapItem}
              />
            )}
            {activeTab === "products" && <ProductTab products={data.products} />}
            {activeTab === "categories" && (
              <CategoryTab categories={data.categories} />
            )}
            {activeTab === "messages" && (
              <MessageTab
                messages={data.messages}
                onRefresh={() => refreshEntity("messages")}
              />
            )}
          </main>
        )}
      </div>
    </div>
  );
}
