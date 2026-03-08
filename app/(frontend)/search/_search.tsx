"use client";

import { FeedTitleCard } from "@/components/feedpages/FeedTitleCard";
import { BookCard } from "@/components/books/book-card";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import type { Feed, Book } from "@/types/content";
import type { Roadmap } from "@/types/roadmaps";
import Link from "next/link";

const DEBOUNCE_MS = 350;
const MIN_CHARS = 2;

export function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";

  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState(initialQuery);
  const [feedResults, setFeedResults] = useState<Feed[]>([]);
  const [bookResults, setBookResults] = useState<Book[]>([]);
  const [roadmapResults, setRoadmapResults] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Keep URL in sync
  useEffect(() => {
    const encoded = query.trim()
      ? `/search?q=${encodeURIComponent(query.trim())}`
      : "/search";
    window.history.replaceState(null, "", encoded);
  }, [query]);

  const performSearch = useCallback(async (q: string, signal: AbortSignal) => {
    if (!q.trim() || q.trim().length < MIN_CHARS) {
      setFeedResults([]);
      setBookResults([]);
      setRoadmapResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`, {
        signal,
      });

      if (signal.aborted) return;

      if (!res.ok) throw new Error("Search failed");

      const data = await res.json();

      if (signal.aborted) return;

      setFeedResults(Array.isArray(data.feeds) ? data.feeds : []);
      setBookResults(Array.isArray(data.books) ? data.books : []);
      setRoadmapResults(Array.isArray(data.roadmaps) ? data.roadmaps : []);
    } catch (err) {
      if ((err as { name?: string }).name === "AbortError") return;
      console.error("Search error:", err);
      setFeedResults([]);
      setBookResults([]);
      setRoadmapResults([]);
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
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
    feedResults.length > 0 ||
    bookResults.length > 0 ||
    roadmapResults.length > 0;

  const isTooShort = query.trim().length > 0 && query.trim().length < MIN_CHARS;

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
          {isTooShort && (
            <p className="mt-1.5 text-xs text-slate-400">
              Ketik minimal {MIN_CHARS} karakter untuk mencari...
            </p>
          )}
        </div>
      </div>

      {mounted && loading && (
        <div className="mt-5 glass-panel rounded-2xl p-5 text-sm text-slate-300">
          🔍 Mencari...
        </div>
      )}

      {mounted && !query && !loading && (
        <div className="mt-5 glass-panel rounded-2xl p-5 text-sm text-slate-300">
          ↩️ Kembali ke homepage...
        </div>
      )}

      {mounted && query && !isTooShort && !loading && !hasResults && (
        <div className="mt-5 glass-panel rounded-2xl p-5 text-sm text-slate-300">
          Tidak ada hasil untuk &ldquo;{query}&rdquo;.
        </div>
      )}

      {feedResults.length > 0 && (
        <section className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-1 md:gap-4">
          {feedResults.map((feed, index) => (
            <FeedTitleCard
              key={feed.id ?? feed.slug ?? index}
              feed={feed}
              index={index}
            />
          ))}
        </section>
      )}

      {bookResults.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-3 text-lg font-bold text-slate-50">📚 Buku</h2>
          <div className="grid gap-4">
            {bookResults.map((book, index) => (
              <BookCard key={book.id ?? index} book={book} index={index} />
            ))}
          </div>
        </section>
      )}

      {roadmapResults.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-3 text-lg font-bold text-slate-50">🗺️ Roadmap</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {roadmapResults.map((rm) => (
              <Link
                key={rm.slug}
                href={`/roadmap/${rm.slug}`}
                className="glass-panel group flex min-w-0 flex-col overflow-hidden rounded-2xl transition hover:border-cyan-400/40"
              >
                {/* Thumbnail */}
                <div className="relative h-36 w-full overflow-hidden bg-slate-800">
                  {rm.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={rm.image}
                      alt={rm.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-4xl">
                      🗺️
                    </div>
                  )}
                  {/* Level badge overlay */}
                  <span className="absolute left-2 top-2 rounded-full bg-cyan-900/80 border border-cyan-500/40 px-2 py-0.5 text-[10px] font-semibold text-cyan-300 backdrop-blur-sm">
                    {rm.level}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col gap-2 p-3">
                  <p className="text-sm font-semibold leading-snug text-slate-50 line-clamp-2">
                    {rm.title}
                  </p>
                  {rm.summary && (
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {rm.summary}
                    </p>
                  )}
                  <div className="mt-auto flex flex-wrap gap-1 pt-1">
                    {rm.duration && (
                      <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-[10px] text-slate-400">
                        ⏱ {rm.duration}
                      </span>
                    )}
                    {rm.tags.slice(0, 2).map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-slate-800/60 px-2 py-0.5 text-[10px] text-slate-400"
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
