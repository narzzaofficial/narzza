import { unstable_cache } from "next/cache";
import { getDb } from "@/lib/mongodb";
import { roadmaps as dummyRoadmaps, type Roadmap } from "@/types/roadmaps";
import { CONTENT_REVALIDATE_SECONDS, CACHE_TAGS } from "./constants";

async function loadRoadmaps(): Promise<Roadmap[]> {
  try {
    const db = await getDb();
    if (!db) return dummyRoadmaps;
    const docs = await db
      .collection("roadmaps")
      .find()
      .sort({ createdAt: -1 })
      .toArray();
    if (docs.length === 0) return dummyRoadmaps;
    return docs.map(({ _id, ...rest }) => rest as Roadmap);
  } catch {
    return dummyRoadmaps;
  }
}

async function loadRoadmapBySlug(slug: string): Promise<Roadmap | null> {
  try {
    const db = await getDb();
    if (!db) return dummyRoadmaps.find((r) => r.slug === slug) ?? null;
    const doc = await db.collection("roadmaps").findOne({ slug });
    if (!doc) return null;
    const { _id, ...rest } = doc;
    return rest as Roadmap;
  } catch {
    return dummyRoadmaps.find((r) => r.slug === slug) ?? null;
  }
}

export const getRoadmaps = unstable_cache(
  async () => loadRoadmaps(),
  ["cached-roadmaps"],
  { revalidate: CONTENT_REVALIDATE_SECONDS, tags: [CACHE_TAGS.roadmaps] }
);

export const getRoadmapBySlug = unstable_cache(
  async (slug: string) => loadRoadmapBySlug(slug),
  ["cached-roadmap-by-slug"],
  { revalidate: CONTENT_REVALIDATE_SECONDS, tags: [CACHE_TAGS.roadmaps] }
);


