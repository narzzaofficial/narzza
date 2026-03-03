"use client";

import type { Story } from "@/types/content";

type StoryBubbleProps = {
  story: Story;
  coverImage?: string;
  active?: boolean;
  onClick?: () => void;
};

export function StoryBubble({
  story,
  coverImage,
  active = false,
  onClick,
}: StoryBubbleProps) {
  const backgroundImage = coverImage ? `url(${coverImage})` : undefined;
  const hasImage = Boolean(coverImage);

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-19.5 shrink-0 flex-col items-center gap-2 rounded-xl p-1 text-left transition"
      style={{
        background: active ? "rgba(6,182,212,0.1)" : "transparent",
      }}
      onMouseEnter={(e) => {
        if (!active)
          (e.currentTarget as HTMLButtonElement).style.background =
            "var(--surface)";
      }}
      onMouseLeave={(e) => {
        if (!active)
          (e.currentTarget as HTMLButtonElement).style.background = "transparent";
      }}
    >
      <div className={`story-ring ${story.viral ? "story-live" : ""}`}>
        <div
          className={`story-core grid place-items-center overflow-hidden bg-linear-to-br ${story.palette} text-xs font-semibold text-white`}
          style={
            backgroundImage
              ? {
                  backgroundImage,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        >
          {!hasImage ? (
            <span className="text-sm font-semibold leading-none tracking-tight">
              {story.label}
            </span>
          ) : null}
        </div>
      </div>
      <p
        className="w-full truncate text-center text-xs"
        style={{ color: "var(--text-primary)" }}
      >
        {story.name}
      </p>
      <span
        className="rounded-full border px-2 py-0.5 text-[10px]"
        style={{
          borderColor: "var(--surface-border)",
          color: "var(--text-secondary)",
        }}
      >
        {story.type}
      </span>
    </button>
  );
}
