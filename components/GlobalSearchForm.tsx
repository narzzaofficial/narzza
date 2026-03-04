"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

type GlobalSearchFormProps = {
  placeholder?: string;
  defaultQuery?: string;
};

export function GlobalSearchForm({
  placeholder = "Cari topik, judul, atau kata kunci...",
  defaultQuery = "",
}: GlobalSearchFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(defaultQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const navTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce navigation so we don't trigger a full route push on every keystroke
  useEffect(() => {
    if (pathname === "/search") return; // search page handles its own state
    if (!query.trim()) return;

    if (navTimerRef.current) clearTimeout(navTimerRef.current);
    navTimerRef.current = setTimeout(() => {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }, 350);

    return () => {
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
    };
  }, [query, pathname, router]);

  return (
    <div>
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
          placeholder={placeholder}
          autoComplete="off"
          className="w-full rounded-xl border border-slate-500/45 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-300/65"
        />
      </div>
    </div>
  );
}
