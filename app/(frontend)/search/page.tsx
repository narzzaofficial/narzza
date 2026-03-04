"use client";

import { FeedTitleCard } from "@/components/feedpages/FeedTitleCard";
import { BookCard } from "@/components/books/book-card";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback, Suspense } from "react";
import type { Feed, Book } from "@/types/content";
import type { Roadmap } from "@/types/roadmaps";
import Link from "next/link";

// ─── helpers ────────────────────────────────────────────────────────────────

/** How long to wait after the last keystroke before firing the API call */
const DEBOUNCE_MS = 350;

// ─── page ───────────────────────────────────────────────────────────────────

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [feedResults, setFeedResults] = useState<Feed[]>([]);
  const [bookResults, setBookResults] = useState<Book[]>([]);
  const [roadmapResults, setRoadmapResults] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // Ref to abort stale in-flight requests
  const abortRef = useRef<AbortController | null>(null);

  // Auto-focus on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      const len = inputRef.current.value.length;
      inputRef.current.setSelectionRange(len, len);
    }
  }, []);

  // Redirect to home if query is cleared
  useEffect(() => {
    if (!query.trim()) {
      const timer = setTimeout(() => router.push("/?from=search"), 500);
      return () => clearTimeout(timer);
    }
  }, [query, router]);

  // Keep URL in sync without a full navigation
  useEffect(() => {
    const encoded = query.trim()
      ? `/search?q=${encodeURIComponent(query.trim())}`
      : "/search";
    window.history.replaceState(null, "", encoded);
  }, [query]);

  // Debounced server-side search — cancels stale requests via AbortController
  const performSearch = useCallback(async (q: string, signal: AbortSignal) => {
    if (!q.trim()) {
      setFeedResults([]);
      setBookResults([]);
      setRoadmapResults([]);
      return;
    }

    setLoading(true);
    try {
      const qs = encodeURIComponent(q.trim());
      // Server filters via the indexed $text query — only matching docs returned
      const [feedsRes, booksRes, roadmapsRes] = await Promise.all([
        fetch(`/api/feeds?q=${qs}`, { signal }),
        fetch(`/api/books?q=${qs}`, { signal }),
        fetch(`/api/roadmaps?q=${qs}`, { signal }),
      ]);

      if (signal.aborted) return;

      const [allFeeds, allBooks, allRoadmaps] = await Promise.all([
        feedsRes.ok ? (feedsRes.json() as Promise<Feed[]>) : Promise.resolve([]),
        booksRes.ok ? (booksRes.json() as Promise<Book[]>) : Promise.resolve([]),
        roadmapsRes.ok ? (roadmapsRes.json() as Promise<Roadmap[]>) : Promise.resolve([]),
      ]);

      if (signal.aborted) return;

      setFeedResults(Array.isArray(allFeeds) ? allFeeds : []);
      setBookResults(Array.isArray(allBooks) ? allBooks : []);
      setRoadmapResults(Array.isArray(allRoadmaps) ? allRoadmaps : []);
    } catch (err) {
      if ((err as { name?: string }).name === "AbortError") return; // cancelled — ignore
      console.error("Search error:", err);
      setFeedResults([]);
      setBookResults([]);
      setRoadmapResults([]);
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Cancel any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const timer = setTimeout(
      () => performSearch(query, controller.signal),
      DEBOUNCE_MS
    );
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, performSearch]);

  const hasResults =
    feedResults.length > 0 || bookResults.length > 0 || roadmapResults.length > 0;

  return (
    <>
      <section className="glass-panel rounded-3xl p-5 md:p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">
          Search
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-50 md:text-3xl">
          Hasil Pencarian Global
        </h1>
        <p className="mt-2 text-sm text-slate-300">
          {query ? `Kata kunci: "${query}"` : "Ketik untuk mencari..."}
        </p>
      </section>

      <div className="mt-4">
        <div className="glass-panel rounded-2xl p-3 md:p-4">
          <label
            htmlFor="global-search"
            className="mb-2 block text-xs uppercase tracking-[0.2em] text-cyan-300"
          >
            Global Search
          </label>
          <input
            ref={inputRef}
            id="global-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari topik, judul, atau kata kunci..."
            autoComplete="off"
            className="w-full rounded-xl border border-slate-500/45 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-300/65"
          />
        </div>
      </div>

      <section className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-1 md:gap-4">
        {loading && (
          <div className="col-span-2 glass-panel rounded-2xl p-5 text-sm text-slate-300 md:col-span-1">
            🔍 Mencari...
          </div>
        )}

        {!query && !loading && (
          <div className="col-span-2 glass-panel rounded-2xl p-5 text-sm text-slate-300 md:col-span-1">
            ↩️ Kembali ke homepage...
          </div>
        )}

        {query && !loading && !hasResults && (
          <div className="col-span-2 glass-panel rounded-2xl p-5 text-sm text-slate-300 md:col-span-1">
            Tidak ada hasil untuk kata kunci tersebut.
          </div>
        )}

        {feedResults.map((feed, index) => (
          <FeedTitleCard key={feed.id} feed={feed} index={index} />
        ))}
      </section>

      {bookResults.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-3 text-lg font-bold text-slate-50">📚 Buku</h2>
          <div className="grid gap-4">
            {bookResults.map((book, index) => (
              <BookCard key={book.id} book={book} index={index} />
            ))}
          </div>
        </section>
      )}

      {roadmapResults.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-3 text-lg font-bold text-slate-50">🗺️ Roadmap</h2>
          <div className="grid gap-3">
            {roadmapResults.map((rm) => (
              <Link
                key={rm.slug}
                href={`/roadmap/${rm.slug}`}
                className="glass-panel flex items-start gap-4 rounded-2xl p-4 transition hover:border-cyan-400/40"
              >
                {rm.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={rm.image}
                    alt=""
                    width={56}
                    height={56}
                    className="h-14 w-14 flex-shrink-0 rounded-xl object-cover"
                  />
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-slate-50 leading-snug line-clamp-1">
                    {rm.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                    {rm.summary}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="rounded-full bg-cyan-900/40 px-2 py-0.5 text-[10px] font-medium text-cyan-300">
                      {rm.level}
                    </span>
                    {rm.tags.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-canvas" />}>
      <SearchPageContent />
    </Suspense>
  );
}
