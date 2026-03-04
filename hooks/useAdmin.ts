import { useState, useCallback, useEffect } from "react";
import type { Feed, Story, Book } from "@/types/content";
import { Category, Product } from "@/types/products";
import { Roadmap } from "@/types/roadmaps";
import type { Message } from "@/types/messages";

type DataKey = "feeds" | "stories" | "books" | "roadmaps" | "products" | "categories" | "messages";

const ENDPOINTS: Record<DataKey, string> = {
  feeds: "/api/feeds",
  stories: "/api/stories",
  books: "/api/books",
  roadmaps: "/api/roadmaps",
  products: "/api/products",
  categories: "/api/categories",
  messages: "/api/messages",
};

export function useAdmin() {
  const [data, setData] = useState({
    feeds: [] as Feed[],
    stories: [] as Story[],
    books: [] as Book[],
    roadmaps: [] as Roadmap[],
    products: [] as Product[],
    categories: [] as Category[],
    messages: [] as Message[],
  });
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [message, setMessage] = useState("");

  const flash = useCallback((msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  }, []);

  /** Fetch all endpoints in parallel (initial load / seed) */
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [feedsRes, storiesRes, booksRes, roadmapsRes, productsRes, categoriesRes, messagesRes] =
        await Promise.all(Object.values(ENDPOINTS).map((url) => fetch(url)));

      setData({
        feeds: feedsRes.ok
          ? (await feedsRes.json()).sort((a: Feed, b: Feed) => b.createdAt - a.createdAt)
          : [],
        stories: storiesRes.ok ? await storiesRes.json() : [],
        books: booksRes.ok ? await booksRes.json() : [],
        roadmaps: roadmapsRes.ok ? await roadmapsRes.json() : [],
        products: productsRes.ok ? await productsRes.json() : [],
        categories: categoriesRes.ok ? await categoriesRes.json() : [],
        messages: messagesRes.ok ? await messagesRes.json() : [],
      });
    } catch (err) {
      console.error("Fetch error:", err);
    }
    setLoading(false);
  }, []);

  /** Re-fetch only one entity endpoint */
  const refreshEntity = useCallback(async (key: DataKey) => {
    try {
      const res = await fetch(ENDPOINTS[key]);
      if (!res.ok) return;
      const json = await res.json();
      setData((prev) => ({
        ...prev,
        [key]:
          key === "feeds"
            ? json.sort((a: Feed, b: Feed) => b.createdAt - a.createdAt)
            : json,
      }));
    } catch (err) {
      console.error(`refreshEntity(${key}) error:`, err);
    }
  }, []);

  /** Optimistically remove an item from state, then DELETE via API */
  const deleteItem = useCallback(
    async (endpoint: DataKey, id: number) => {
      if (!confirm("Hapus item ini?")) return;

      // Optimistic update — remove from local state immediately
      setData((prev) => ({
        ...prev,
        [endpoint]: (prev[endpoint] as Array<{ id: number }>).filter(
          (item) => item.id !== id
        ),
      }));

      try {
        const res = await fetch(`/api/${endpoint}/${id}`, { method: "DELETE" });
        if (res.ok) {
          flash("✅ Item dihapus");
        } else {
          // Revert on failure
          flash("❌ Gagal menghapus item");
          refreshEntity(endpoint);
        }
      } catch {
        flash("❌ Network error");
        refreshEntity(endpoint);
      }
    },
    [flash, refreshEntity]
  );

  /** Optimistically delete a roadmap by slug */
  const deleteRoadmapItem = useCallback(
    async (slug: string) => {
      if (!confirm("Hapus roadmap ini?")) return;

      setData((prev) => ({
        ...prev,
        roadmaps: prev.roadmaps.filter((r) => r.slug !== slug),
      }));

      try {
        const res = await fetch(`/api/roadmaps/${slug}`, { method: "DELETE" });
        if (res.ok) {
          flash("✅ Roadmap dihapus");
        } else {
          flash("❌ Gagal menghapus roadmap");
          refreshEntity("roadmaps");
        }
      } catch {
        flash("❌ Network error");
        refreshEntity("roadmaps");
      }
    },
    [flash, refreshEntity]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSeed = async () => {
    if (
      !confirm(
        "🔄 DATABASE MIGRATION\n\nIni akan:\n✅ Menghapus semua data lama\n✅ Mengisi ulang dengan data dummy\n✅ Memperbaiki timestamp\n✅ Reset view counts\n\nLanjutkan?"
      )
    )
      return;
    setSeeding(true);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const resData = await res.json();
      if (res.ok) {
        flash(
          `✅ Migrasi berhasil! ${resData.feedsInserted} feeds, ${resData.storiesInserted} stories, ${resData.booksInserted} books.`
        );
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData();
      } else flash(`❌ Seed gagal: ${resData.error}`);
    } catch {
      flash("❌ Seed gagal: network error");
    }
    setSeeding(false);
  };

  return {
    data,
    loading,
    seeding,
    message,
    flash,
    handleSeed,
    fetchData,
    refreshEntity,
    deleteItem,
    deleteRoadmapItem,
  };
}
