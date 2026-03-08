export type {
  Story,
  ChatLine,
  Feed,
  BookChapter,
  Book,
  FeedCategory,
} from "@/types/content";

import type { Story, Book } from "@/types/content";

export const stories: Story[] = [
  {
    id: 1,
    name: "AI Corner",
    label: "AI",
    type: "Berita",
    palette: "from-sky-400 to-blue-500",
    image: "https://picsum.photos/seed/ai-corner/400/400",
    viral: true,
  },
  {
    id: 2,
    name: "Code Daily",
    label: "CD",
    type: "Tutorial",
    palette: "from-amber-300 to-orange-500",
    image: "https://picsum.photos/seed/code-daily/400/400",
    viral: true,
  },
  {
    id: 3,
    name: "Lab NAA",
    label: "LAB",
    type: "Riset",
    palette: "from-emerald-400 to-teal-500",
    image: "https://picsum.photos/seed/lab-naa/400/400",
    viral: false,
  },
  {
    id: 4,
    name: "Cyber Byte",
    label: "CB",
    type: "Berita",
    palette: "from-indigo-400 to-blue-600",
    image: "https://picsum.photos/seed/cyber-byte/400/400",
    viral: true,
  },
  {
    id: 5,
    name: "UX Pulse",
    label: "UX",
    type: "Tutorial",
    palette: "from-pink-400 to-rose-500",
    image: "https://picsum.photos/seed/ux-pulse/400/400",
    viral: false,
  },
  {
    id: 6,
    name: "Data Hunt",
    label: "DH",
    type: "Riset",
    palette: "from-violet-400 to-fuchsia-500",
    image: "https://picsum.photos/seed/data-hunt/400/400",
    viral: true,
  },
];
