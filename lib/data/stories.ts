import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { StoryModel, type IStory } from "@/lib/models/Story";
import type { Story } from "@/types/content";
import { CONTENT_REVALIDATE_SECONDS, CACHE_TAGS } from "./constants";

function docToStory(d: IStory): Story {
  return {
    id: d.id,
    name: d.name,
    label: d.label,
    type: d.type as Story["type"],
    palette: d.palette,
    image: d.image || "",
    viral: d.viral,
  };
}

async function loadStories(): Promise<Story[]> {
  try {
    const conn = await connectDB();
    if (!conn) return [];
    const docs = await StoryModel.find().sort({ id: 1 }).lean();
    return docs.map(docToStory);
  } catch {
    return [];
  }
}

export const getStories = unstable_cache(
  async () => loadStories(),
  ["cached-stories"],
  { revalidate: CONTENT_REVALIDATE_SECONDS, tags: [CACHE_TAGS.stories] }
);
