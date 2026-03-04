import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { StoryModel } from "@/lib/models/Story";
import type { Story } from "@/types/content";
import { stories as dummyStories } from "@/constants/content";
import { CONTENT_REVALIDATE_SECONDS, CACHE_TAGS } from "./constants";

async function loadStories(): Promise<Story[]> {
  try {
    const conn = await connectDB();
    if (!conn) return dummyStories;
    const docs = await StoryModel.find().sort({ id: 1 }).lean();
    if (docs.length === 0) return [];
    return docs.map((d) => ({
      id: d.id,
      name: d.name,
      label: d.label,
      type: d.type as Story["type"],
      palette: d.palette,
      image: d.image || "",
      viral: d.viral,
    }));
  } catch {
    return dummyStories;
  }
}

export const getStories = unstable_cache(
  async () => loadStories(),
  ["cached-stories"],
  { revalidate: CONTENT_REVALIDATE_SECONDS, tags: [CACHE_TAGS.stories] }
);
