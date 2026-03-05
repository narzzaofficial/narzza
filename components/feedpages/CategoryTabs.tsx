import type React from "react";
import { type HomeCategory } from "./FeedPage"; // Sesuaikan lokasi tipe

const categoryButtons: {
  key: HomeCategory;
  icon: string;
  activeStyle: React.CSSProperties;
}[] = [
  {
    key: "Semua",
    icon: "🌐",
    activeStyle: {
      background: "#6366f1",
      borderColor: "#6366f1",
      color: "#fff",
    }, // indigo
  },
  {
    key: "Berita",
    icon: "📰",
    activeStyle: {
      background: "#ef4444",
      borderColor: "#ef4444",
      color: "#fff",
    }, // red
  },
  {
    key: "Tutorial",
    icon: "🎓",
    activeStyle: {
      background: "#10b981",
      borderColor: "#10b981",
      color: "#fff",
    }, // emerald
  },
  {
    key: "Riset",
    icon: "🔬",
    activeStyle: {
      background: "#d946ef",
      borderColor: "#d946ef",
      color: "#fff",
    }, // fuchsia
  },
  {
    key: "Buku",
    icon: "📚",
    activeStyle: {
      background: "#f59e0b",
      borderColor: "#f59e0b",
      color: "#fff",
    }, // amber
  },
];

export function CategoryTabs({
  activeCategory,
  onChange,
}: {
  activeCategory: HomeCategory;
  onChange: (cat: HomeCategory) => void;
}) {
  return (
    <div className="mt-5">
      <div className="scrollbar-hide flex w-full max-w-full items-center gap-2 overflow-x-auto pb-2 px-safe scroll-px-safe">
        {categoryButtons.map((cat) => {
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => onChange(cat.key)}
              className="category-tab-btn"
              style={isActive ? cat.activeStyle : undefined}
            >
              {cat.icon} {cat.key}
            </button>
          );
        })}
      </div>
    </div>
  );
}
