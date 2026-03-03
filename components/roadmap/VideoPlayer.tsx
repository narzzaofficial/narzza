"use client";

import type { RoadmapVideo, RoadmapStep } from "@/types/roadmaps";

type VideoPlayerProps = {
  video: RoadmapVideo;
  step: RoadmapStep;
  stepIndex: number;
  totalSteps: number;
  videoIndex: number;
};

export function VideoPlayer({
  video,
  step,
  stepIndex,
  totalSteps,
  videoIndex,
}: VideoPlayerProps) {
  return (
    <div className="flex flex-1 flex-col min-h-0">
      {/* ── YouTube iframe — full width, flush left ──────────────── */}
      <div className="w-full bg-black">
        <div className="aspect-video w-full overflow-hidden">
          <iframe
            key={video.id}
            src={`https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1&autoplay=0`}
            title={step.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            className="h-full w-full"
          />
        </div>
      </div>

      {/* ── Meta ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-5 px-6 py-6 md:px-8 md:py-7 overflow-y-auto">
        {/* Title */}
        <div>
          <h2
            className="text-2xl font-bold leading-snug md:text-3xl lg:text-4xl"
            style={{ color: "var(--text-primary)" }}
          >
            {step.title}
          </h2>
          <p className="mt-2 text-sm md:text-base" style={{ color: "var(--text-secondary)" }}>
            Video {videoIndex + 1} • oleh{" "}
            <span className="font-semibold" style={{ color: "var(--text-accent)" }}>
              {video.author}
            </span>
          </p>
        </div>

        {/* Divider */}
        <div className="border-t" style={{ borderColor: "var(--surface-border)" }} />

        {/* Tags row */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="rounded-full border px-4 py-1.5 text-sm font-semibold"
            style={{
              borderColor: "var(--surface-border)",
              color: "var(--text-secondary)",
              background: "var(--surface)",
            }}
          >
            {step.focus}
          </span>
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Langkah {stepIndex + 1} dari {totalSteps}
          </span>
        </div>

        {/* Description */}
        {step.description && (
          <p
            className="text-base leading-relaxed md:text-lg"
            style={{ color: "var(--text-secondary)" }}
          >
            {step.description}
          </p>
        )}
      </div>
    </div>
  );
}
