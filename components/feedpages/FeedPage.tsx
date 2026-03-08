"use client";

import { useState } from "react";
import { BookCard } from "@/components/books/book-card";
import { FeedTitleCard } from "@/components/feedpages/FeedTitleCard";
import { GlobalSearchForm } from "@/components/GlobalSearchForm";
import { TutorialCard } from "@/components/tutorial-card";
import type { Book, Feed, Story } from "@/types/content";
import { useGlobalSearchFocus } from "@/hooks/useGlobalSearchFocus";
import { StatusViralSection } from "../status-bubble/StatusViralSection";
import { CategoryTabs } from "./CategoryTabs";
import { HomeAllSections } from "./HomeAllSections";
import { Product } from "@/types/products";
import { Roadmap } from "@/types/roadmaps";

export type HomeCategory = "Semua" | "Berita" | "Tutorial" | "Riset" | "Buku";

type FeedPageProps = {
  activePath: "/" | "/berita" | "/tutorial" | "/riset";
  badge: string;
  title: string;
  description: string;
  category?: Feed["category"];
  showStories?: boolean;
  initialFeeds: Feed[];
  initialStories: Story[];
  initialBooks: Book[];
  initialRoadmaps: Roadmap[];
  initialProducts: Product[];
};

export function FeedPage({
  activePath,
  badge,
  title,
  description,
  category,
  showStories = false,
  initialFeeds = [],
  initialStories = [],
  initialBooks = [],
  initialRoadmaps = [],
  initialProducts = [],
}: FeedPageProps) {
  const isHome = activePath === "/";
  const [activeCategory, setActiveCategory] = useState<HomeCategory>(
    isHome ? "Semua" : "Berita"
  );

  useGlobalSearchFocus();

  const isAllTab = isHome && activeCategory === "Semua";
  const isBookTab = activeCategory === "Buku";

  const homeFeedsByTab = isBookTab
    ? []
    : isAllTab
      ? initialFeeds
      : initialFeeds.filter((f) => f.category === activeCategory);

  const categoryPageFeeds =
    !isHome && category
      ? initialFeeds.filter((f) => f.category === category)
      : initialFeeds;

  const renderFeedList = (feeds: Feed[], targetCategory?: string) => {
    if (feeds.length === 0) {
      return (
        <div className="empty-state mt-4">
          Belum ada konten untuk kategori ini.
        </div>
      );
    }
    return (
      <section
        className={`mt-4 grid ${targetCategory === "Tutorial" ? "gap-4" : "grid-cols-2 gap-3 sm:grid-cols-1 sm:gap-4"}`}
      >
        {feeds.map((feed, index) =>
          targetCategory === "Tutorial" ? (
            <TutorialCard key={feed.id} feed={feed} index={index} />
          ) : (
            <FeedTitleCard key={feed.id} feed={feed} index={index} />
          )
        )}
      </section>
    );
  };

  return (
    <>
      <section className="page-hero">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">
              {badge}
            </p>
            <h1 className="mt-2 text-2xl font-bold text-slate-50 md:text-3xl">
              {title}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-300">
              {description}
            </p>
          </div>
        </div>
        {isHome && showStories && initialStories.length > 0 && (
          <div className="hidden lg:block mt-4">
            <StatusViralSection
              stories={initialStories}
              feeds={initialFeeds}
              books={initialBooks}
            />
          </div>
        )}
      </section>

      {isHome && (
        <div className="mt-4 flex flex-col gap-4">
          {showStories && initialStories.length > 0 && (
            <section className="page-hero lg:hidden">
              <StatusViralSection
                stories={initialStories}
                feeds={initialFeeds}
                books={initialBooks}
                standalone
              />
            </section>
          )}
          <GlobalSearchForm />
        </div>
      )}

      {isHome && (
        <CategoryTabs
          activeCategory={activeCategory}
          onChange={setActiveCategory}
        />
      )}

      {isHome ? (
        isAllTab ? (
          <HomeAllSections
            feeds={initialFeeds}
            roadmaps={initialRoadmaps}
            products={initialProducts}
            books={initialBooks}
          />
        ) : isBookTab ? (
          <section className="mt-4 grid gap-4">
            {initialBooks.length > 0 ? (
              initialBooks.map((book, index) => (
                <BookCard key={book.id} book={book} index={index} />
              ))
            ) : (
              <div className="empty-state">Belum ada buku.</div>
            )}
          </section>
        ) : (
          renderFeedList(homeFeedsByTab, activeCategory)
        )
      ) : (
        renderFeedList(categoryPageFeeds, category)
      )}
    </>
  );
}
