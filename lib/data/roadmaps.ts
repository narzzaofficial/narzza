import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { RoadmapModel } from "@/lib/models/Roadmap";
import { roadmaps as dummyRoadmaps, type Roadmap } from "@/types/roadmaps";
import { CONTENT_REVALIDATE_SECONDS, CACHE_TAGS } from "./constants";

async function loadRoadmaps(): Promise<Roadmap[]> {
  try {
    const conn = await connectDB();
    if (!conn) return dummyRoadmaps;
    const docs = await RoadmapModel.find().sort({ createdAt: -1 }).lean();
    if (docs.length === 0) return dummyRoadmaps;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return docs.map(({ _id, ...rest }) => rest as unknown as Roadmap);
  } catch {
    return dummyRoadmaps;
  }
}

async function loadRoadmapBySlug(slug: string): Promise<Roadmap | null> {
  try {
    const conn = await connectDB();
    if (!conn) return dummyRoadmaps.find((r) => r.slug === slug) ?? null;
    const doc = await RoadmapModel.findOne({ slug }).lean();
    if (!doc) return null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...rest } = doc;
    return rest as unknown as Roadmap;
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


