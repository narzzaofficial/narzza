/**
 * feed-page.ts
 * Centralized data loader untuk semua halaman feed (Home, Berita, Tutorial, Riset).
 * Menggantikan duplikat getInternalData() yang tersebar di tiap page.
 */

import type { FeedCategory } from "@/types/content";
import { getFeeds } from "./feeds";
import { getStories } from "./stories";
import { getBooks } from "./books";
import { getRoadmaps } from "./roadmaps";
import { getProducts } from "./products";

export type FeedPageData = {
  feeds: Awaited<ReturnType<typeof getFeeds>>;
  stories: Awaited<ReturnType<typeof getStories>>;
  books: Awaited<ReturnType<typeof getBooks>>;
  roadmaps: Awaited<ReturnType<typeof getRoadmaps>>;
  products: Awaited<ReturnType<typeof getProducts>>;
};

/**
 * Load semua data yang dibutuhkan FeedPage secara paralel.
 * @param category - filter kategori feed (undefined = semua)
 */
export async function getFeedPageData(
  category?: FeedCategory
): Promise<FeedPageData> {
  const [feeds, stories, books, roadmaps, products] = await Promise.all([
    getFeeds(category),
    getStories(),
    getBooks(),
    getRoadmaps(),
    getProducts(),
  ]);

  return { feeds, stories, books, roadmaps, products };
}

