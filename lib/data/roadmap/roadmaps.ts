import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { RoadmapModel } from "@/lib/models/Roadmap";
import type { IRoadmap } from "@/lib/models/Roadmap";
import type { Roadmap } from "@/types/roadmaps";
import { CONTENT_REVALIDATE_SECONDS, CACHE_TAGS } from "../constants";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Convert raw Mongoose Roadmap document → plain Roadmap object.
 * IRoadmap dan Roadmap strukturnya sama — mapping langsung tanpa cast unsafe.
 */
function docToRoadmap(d: IRoadmap): Roadmap {
  return {
    slug: d.slug,
    title: d.title,
    summary: d.summary ?? "",
    duration: d.duration ?? "",
    level: d.level ?? "Pemula",
    tags: d.tags ?? [],
    image: d.image ?? "",
    steps: (d.steps ?? []).map((s) => ({
      title: s.title,
      description: s.description ?? "",
      focus: s.focus ?? "",
      videos: (s.videos ?? []).map((v) => ({
        id: v.id,
        title: v.title ?? "", // ← tambah ini
        author: v.author,
      })),
    })),
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  };
}

// ─── Private loaders ─────────────────────────────────────────────────────────

async function loadRoadmaps(): Promise<Roadmap[]> {
  try {
    const conn = await connectDB();
    if (!conn) return [];

    const docs = await RoadmapModel.find().sort({ createdAt: -1 }).lean();
    return docs.map(docToRoadmap);
  } catch (error) {
    console.error("❌ loadRoadmaps error:", error);
    return [];
  }
}

async function loadRoadmapBySlug(slug: string): Promise<Roadmap | null> {
  try {
    const conn = await connectDB();
    if (!conn) return null;

    const doc = await RoadmapModel.findOne({ slug }).lean();
    return doc ? docToRoadmap(doc) : null;
  } catch (error) {
    console.error("❌ loadRoadmapBySlug error:", error);
    return null;
  }
}

// ─── Cached exports ───────────────────────────────────────────────────────────

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
