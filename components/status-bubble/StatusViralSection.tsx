"use client";

import { createPortal } from "react-dom";
import { useRef, useEffect } from "react";
import { StoryBubble } from "@/components/status-bubble/StoryBubble";
import { EmptyStoryOverlay } from "./EmptyStoryOverlay";
import type { Book, Feed, Story } from "@/types/content";
import { useStoryViewer } from "@/hooks/useStoryViwer";
import { StoryViewerOverlay } from "./StoryViwerOverlay";

type StatusViralSectionProps = {
  stories: Story[];
  feeds: Feed[];
  books?: Book[];
  standalone?: boolean;
};

export function StatusViralSection({
  stories,
  feeds,
  books = [],
  standalone = false,
}: StatusViralSectionProps) {
  // Panggil semua logika dari Custom Hook
  const {
    selectedStory,
    storyCoverMap,
    popularFeeds,
    currentIndex,
    activeFeed,
    prevFeed,
    nextFeed,
    viewerCover,
    isFirstStory,
    isLastStory,
    nextStory,
    prevStory,
    nextStoryTopFeed,
    prevStoryTopFeed,
    openStory,
    closeStoryViewer,
    goNext,
    goPrev,
  } = useStoryViewer({ stories, feeds, books });

  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll horizontally with mouse wheel on desktop
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollBy({ left: e.deltaY * 1.5, behavior: "smooth" });
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const portalTarget = typeof document === "undefined" ? null : document.body;

  // Render Portal Content
  const renderPortal = () => {
    if (!portalTarget || !selectedStory) return null;

    if (activeFeed) {
      return createPortal(
        <StoryViewerOverlay
          selectedStory={selectedStory}
          popularFeeds={popularFeeds}
          currentIndex={currentIndex}
          activeFeed={activeFeed}
          prevFeed={prevFeed}
          nextFeed={nextFeed}
          viewerCover={viewerCover}
          isFirstStory={isFirstStory}
          isLastStory={isLastStory}
          nextStory={nextStory}
          prevStory={prevStory}
          nextStoryTopFeed={nextStoryTopFeed}
          prevStoryTopFeed={prevStoryTopFeed}
          storyCoverMap={storyCoverMap}
          onClose={closeStoryViewer}
          onNext={goNext}
          onPrev={goPrev}
        />,
        portalTarget
      );
    }

    return createPortal(
      <EmptyStoryOverlay onClose={closeStoryViewer} />,
      portalTarget
    );
  };

  return (
    <>
      <div
        className={standalone ? "" : "mt-6 border-t pt-5"}
        style={{ borderColor: "var(--surface-border)" }}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2
            className="text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Status Viral Hari Ini
          </h2>
          <span
            className="text-xs"
            style={{ color: "var(--text-secondary)" }}
          >
            klik status
          </span>
        </div>

        {/* Render List Story Bubble */}
        <div ref={scrollRef} className="no-scrollbar flex gap-3 overflow-x-auto pb-2 cursor-grab active:cursor-grabbing">
          {stories.map((story) => (
            <StoryBubble
              key={story.id}
              story={story}
              coverImage={storyCoverMap.get(story.id)}
              active={selectedStory?.id === story.id}
              onClick={() => openStory(story.id)}
            />
          ))}
        </div>
      </div>

      {/* Render Modal/Overlay (Jika ada story yang dipilih) */}
      {renderPortal()}
    </>
  );
}
