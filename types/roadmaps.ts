// FILE: @/types/roadmaps.ts

export type RoadmapVideo = {
  id: string;
  title: string; // ← tambah field title
  author: string;
};

export type RoadmapStep = {
  title: string;
  description: string;
  focus: string;
  videos: RoadmapVideo[];
};

export type Roadmap = {
  _id?: string;
  slug: string;
  title: string;
  summary: string;
  duration: string;
  level: "Pemula" | "Menengah" | "Lanjutan";
  tags: string[];
  image: string;
  steps: RoadmapStep[];
  createdAt?: number;
  updatedAt?: number;
};

export function getRoadmapBySlug(slug: string, roadmaps: Roadmap[]) {
  return roadmaps.find((item) => item.slug === slug);
}
