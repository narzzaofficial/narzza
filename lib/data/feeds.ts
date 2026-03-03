import { unstable_cache } from "next/cache";
import { getDb } from "@/lib/mongodb";
import type { Feed } from "@/types/content";
import { feeds as dummyFeeds } from "@/data/content";
import { CONTENT_REVALIDATE_SECONDS, CACHE_TAGS } from "./constants";
import { slugify, parseSlugId } from "@/lib/slugify";

/** Ensure every feed object has a computed slug */
function ensureSlug(feed: Feed): Feed {
  return feed.slug ? feed : { ...feed, slug: slugify(feed.title, feed.id) };
}

function mapFeedDoc(d: Record<string, unknown>): Feed {
  const id = d.id as number;
  const title = d.title as string;
  return {
    id,
    slug: (d.slug as string) || slugify(title, id),
    title,
    category: d.category as Feed["category"],
    createdAt: (d.createdAt as number) ?? Date.now(),
    popularity: (d.popularity as number) ?? 0,
    image: (d.image as string) ?? "",
    lines: (d.lines as Feed["lines"]) ?? [],
    takeaway: (d.takeaway as string) ?? "",
    source: d.source as Feed["source"],
    storyId: (d.storyId as number | null | undefined) ?? null,
  };
}

async function loadFeeds(category?: Feed["category"]): Promise<Feed[]> {
  try {
    const db = await getDb();
    if (!db)
      return (category
        ? dummyFeeds.filter((f) => f.category === category)
        : dummyFeeds
      ).map(ensureSlug);
    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;
    const docs = await db
      .collection("feeds")
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();
    if (docs.length === 0 && !category) return dummyFeeds.map(ensureSlug);
    return docs.map(mapFeedDoc);
  } catch {
    return (category
      ? dummyFeeds.filter((f) => f.category === category)
      : dummyFeeds
    ).map(ensureSlug);
  }
}

async function loadFeedById(id: number): Promise<Feed | null> {
  try {
    const db = await getDb();
    if (!db) {
      const f = dummyFeeds.find((f) => f.id === id);
      return f ? ensureSlug(f) : null;
    }
    const doc = await db.collection("feeds").findOne({ id });
    return doc ? mapFeedDoc(doc) : null;
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
  // First try exact slug match
  const exact = feeds.find((f) => f.slug === slug);
  if (exact) return exact;
  // Fallback: parse trailing ID from slug
  const id = parseSlugId(slug);
  if (id !== null) return feeds.find((f) => f.id === id) ?? null;
  return null;
}

export async function getFeedSlugs(): Promise<string[]> {
  const feeds = await getFeeds();
  return feeds.map((f) => f.slug);
}

