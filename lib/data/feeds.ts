import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { FeedModel } from "@/lib/models/Feed";
import type { IFeed } from "@/lib/models/Feed";
import type { Feed } from "@/types/content";
import { feeds as dummyFeeds } from "@/constants/content";
import { CONTENT_REVALIDATE_SECONDS, CACHE_TAGS } from "./constants";
import { slugify, parseSlugId } from "@/lib/slugify";

/**
 * Ensure a feed from in-memory/dummy data has a slug.
 * (Feeds from MongoDB always have a slug, but dummy data may not.)
 */
function ensureSlug(feed: Feed): Feed {
  return feed.slug ? feed : { ...feed, slug: slugify(feed.title, feed.id) };
}

/**
 * Convert a raw Mongoose Feed document into a plain Feed object.
 * Shared by loadFeeds() and loadFeedById() to avoid repeating the field mapping.
 */
function docToFeed(d: IFeed): Feed {
  return {
    id: d.id,
    slug: d.slug || slugify(d.title, d.id),
    title: d.title,
    category: d.category as Feed["category"],
    createdAt: d.createdAt ?? Date.now(),
    popularity: d.popularity ?? 0,
    image: d.image ?? "",
    lines: (d.lines ?? []) as Feed["lines"],
    takeaway: d.takeaway ?? "",
    source: d.source as Feed["source"],
    storyId: d.storyId ?? null,
  };
}

async function loadFeeds(category?: Feed["category"]): Promise<Feed[]> {
  try {
    const conn = await connectDB();
    if (!conn) {
      // DB not available — fall back to in-memory dummy data
      const fallback = category
        ? dummyFeeds.filter((f) => f.category === category)
        : dummyFeeds;
      return fallback.map(ensureSlug);
    }
    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;
    const docs = await FeedModel.find(filter).sort({ createdAt: -1 }).lean();
    // If DB is empty and no filter applied, fall back to dummy data
    if (docs.length === 0 && !category) return dummyFeeds.map(ensureSlug);
    return docs.map(docToFeed);
  } catch {
    // On any DB error, fall back to dummy data
    const fallback = category
      ? dummyFeeds.filter((f) => f.category === category)
      : dummyFeeds;
    return fallback.map(ensureSlug);
  }
}

async function loadFeedById(id: number): Promise<Feed | null> {
  try {
    const conn = await connectDB();
    if (!conn) {
      const feed = dummyFeeds.find((f) => f.id === id);
      return feed ? ensureSlug(feed) : null;
    }
    const doc = await FeedModel.findOne({ id }).lean();
    return doc ? docToFeed(doc) : null;
  } catch {
    return null;
  }
}

export const getFeeds = unstable_cache(
  async (category?: Feed["category"]) => loadFeeds(category),
  ["cached-feeds"],
  { revalidate: CONTENT_REVALIDATE_SECONDS, tags: [CACHE_TAGS.feeds] }
);

export const getFeedById = unstable_cache(
  async (id: number) => loadFeedById(id),
  ["cached-feed-by-id"],
  { revalidate: CONTENT_REVALIDATE_SECONDS, tags: [CACHE_TAGS.feeds] }
);

export async function getFeedBySlug(slug: string): Promise<Feed | null> {
  const feeds = await getFeeds();
  const exact = feeds.find((f) => f.slug === slug);
  if (exact) return exact;
  const id = parseSlugId(slug);
  if (id !== null) return feeds.find((f) => f.id === id) ?? null;
  return null;
}

export async function getFeedSlugs(): Promise<string[]> {
  const feeds = await getFeeds();
  return feeds.map((f) => f.slug);
}

