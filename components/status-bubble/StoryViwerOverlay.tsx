"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Story } from "@/types/content";
import { StoryContent } from "@/hooks/useStoryViwer";
import { StorySidePreview } from "./StorySidePreview";

type StoryViewerOverlayProps = {
  selectedStory: Story;
  popularFeeds: StoryContent[];
  currentIndex: number;
  activeFeed: StoryContent;
  prevFeed: StoryContent | null;
  nextFeed: StoryContent | null;
  viewerCover?: string;
  isFirstStory?: boolean;
  isLastStory?: boolean;
  nextStory?: Story | null;
  prevStory?: Story | null;
  nextStoryTopFeed?: StoryContent | null;
  prevStoryTopFeed?: StoryContent | null;
  storyCoverMap?: Map<number, string>;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
};

const STORY_DURATION = 10000;

export function StoryViewerOverlay({
  selectedStory,
  popularFeeds,
  currentIndex,
  activeFeed,
  prevFeed,
  nextFeed,
  viewerCover,
  isFirstStory = false,
  isLastStory = false,
  nextStory = null,
  prevStory = null,
  nextStoryTopFeed = null,
  prevStoryTopFeed = null,
  onClose,
  onNext,
  onPrev,
}: StoryViewerOverlayProps) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);

  const isLastFeed = currentIndex === popularFeeds.length - 1;
  const isFirstFeed = currentIndex === 0;

  useEffect(() => {
    startRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      const pct = Math.min((elapsed / STORY_DURATION) * 100, 100);

      setProgress(pct);

      if (pct < 100) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        onNext();
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [currentIndex, onNext]);

  return (
    <div className="fixed inset-0 z-140 flex items-center justify-center">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Tutup status populer"
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="pointer-events-none relative z-10 flex w-full max-w-230 items-center justify-center gap-5 px-4">
        {/* LEFT PREVIEW */}
        {prevFeed ? (
          <StorySidePreview
            label="Prev"
            title={prevFeed.title}
            takeaway={prevFeed.takeaway}
            onClick={onPrev}
          />
        ) : prevStory && isFirstFeed ? (
          <StorySidePreview
            label={prevStory.name}
            title={prevStoryTopFeed?.title}
            takeaway={prevStoryTopFeed?.takeaway}
            storyType={prevStory.type}
            onClick={onPrev}
          />
        ) : (
          <div className="hidden w-50 shrink-0 xl:block" />
        )}

        {/* MAIN VIEWER */}
        <article
          className="pointer-events-auto relative h-[88vh] max-h-180 w-full max-w-100 overflow-hidden rounded-[28px] border shadow-[0_24px_80px_rgba(0,0,0,0.5)]"
          style={{
            background: "var(--story-card-bg)",
            borderColor: "var(--story-card-border)",
          }}
        >
          <div className="pointer-events-none absolute inset-0 rounded-[28px] opacity-20 [data-theme=light]_&:opacity-10 bg-[radial-gradient(circle_at_18%_0%,rgba(56,189,248,0.3),transparent_45%),radial-gradient(circle_at_92%_0%,rgba(217,70,239,0.2),transparent_40%)]" />

          <div className="relative z-10 flex h-full flex-col p-5">
            {/* PROGRESS */}
            <div className="mb-3 flex gap-1.5">
              {popularFeeds.map((feed, index) => (
                <span
                  key={feed.id}
                  className="relative h-1 flex-1 overflow-hidden rounded-full"
                  style={{ background: "var(--story-progress-inactive)" }}
                >
                  <span
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      background: "var(--story-progress-active)",
                      width:
                        index < currentIndex
                          ? "100%"
                          : index === currentIndex
                            ? `${progress}%`
                            : "0%",
                    }}
                  />
                </span>
              ))}
            </div>

            {/* HEADER */}
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.2em]"
                  style={{ color: "var(--story-accent)" }}
                >
                  Status Populer
                </p>

                <p
                  className="mt-1 text-sm font-medium"
                  style={{ color: "var(--story-subtext)" }}
                >
                  {selectedStory.name} • {selectedStory.type}
                </p>
              </div>

              <button
                type="button"
                className="rounded-full border px-3 py-1 text-[11px]"
                style={{
                  borderColor: "var(--story-btn-border)",
                  color: "var(--story-btn-text)",
                  background: "var(--story-btn-bg)",
                }}
                onClick={onClose}
              >
                Tutup
              </button>
            </div>

            {/* CONTENT */}
            <div
              className="flex-1 overflow-y-auto overscroll-contain rounded-2xl border p-5"
              style={{
                borderColor: "var(--story-inner-border)",
                background: "var(--story-inner-bg)",
              }}
            >
              {viewerCover && (
                <div
                  className="mb-4 overflow-hidden rounded-xl border"
                  style={{ borderColor: "var(--story-img-border)" }}
                >
                  <Image
                    src={viewerCover}
                    alt={`Status ${selectedStory.name}`}
                    width={720}
                    height={400}
                    className="h-44 w-full object-cover"
                    priority
                  />
                </div>
              )}

              <h3
                className="mt-4 text-2xl font-bold"
                style={{ color: "var(--story-title)" }}
              >
                {activeFeed.title}
              </h3>

              <p
                className="mt-4 text-sm leading-relaxed"
                style={{ color: "var(--story-body)" }}
              >
                {activeFeed.lines[0]?.text}
              </p>

              <div
                className="mt-5 rounded-xl border px-3 py-2.5 text-xs"
                style={{
                  borderColor: "var(--story-takeaway-border)",
                  background: "var(--story-takeaway-bg)",
                  color: "var(--story-takeaway-text)",
                }}
              >
                {activeFeed.takeaway}
              </div>
            </div>

            {/* NAVIGATION */}
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={onPrev}
                disabled={isFirstFeed && isFirstStory}
                className="rounded-full border px-4 py-2 text-xs"
              >
                prev
              </button>

              <Link
                href={activeFeed.detailHref}
                onClick={onClose}
                className="rounded-full border px-5 py-2 text-xs font-bold"
              >
                {activeFeed.kind === "book" ? "Lihat Buku" : "Baca Artikel"}
              </Link>

              <button
                onClick={onNext}
                disabled={isLastFeed && isLastStory}
                className="rounded-full border px-4 py-2 text-xs"
              >
                next
              </button>
            </div>
          </div>
        </article>

        {/* RIGHT PREVIEW */}
        {nextFeed ? (
          <StorySidePreview
            label="Selanjutnya"
            title={nextFeed.title}
            takeaway={nextFeed.takeaway}
            onClick={onNext}
          />
        ) : nextStory && isLastFeed ? (
          <StorySidePreview
            label={nextStory.name}
            title={nextStoryTopFeed?.title}
            takeaway={nextStoryTopFeed?.takeaway}
            storyType={nextStory.type}
            onClick={onNext}
          />
        ) : (
          <div className="hidden w-50 shrink-0 xl:block" />
        )}
      </div>
    </div>
  );
}
