import { useState, useCallback, useEffect } from "react";
import type { Feed, Story, Book } from "@/types/content";
import { Category, Product } from "@/types/products";
import { Roadmap } from "@/types/roadmaps";
import type { Message } from "@/types/messages";

export type DataKey = "feeds" | "stories" | "books" | "roadmaps" | "products" | "categories" | "messages";

const ENDPOINTS: Record<DataKey, string> = {
  feeds: "/api/feeds",
  stories: "/api/stories",
  books: "/api/books",
  roadmaps: "/api/roadmaps",
  products: "/api/products",
  categories: "/api/categories",
  messages: "/api/messages",
};

type AdminData = {
  feeds: Feed[];
  stories: Story[];
  books: Book[];
  roadmaps: Roadmap[];
  products: Product[];
  categories: Category[];
  messages: Message[];
};

const EMPTY_DATA: AdminData = {
  feeds: [],
  stories: [],
  books: [],
  roadmaps: [],
  products: [],
  categories: [],
  messages: [],
};

export function useAdmin(initialTab: DataKey = "feeds") {
  const [data, setData] = useState<AdminData>(EMPTY_DATA);
  const [activeTab, setActiveTab] = useState<DataKey>(initialTab);
  /** Kumpulan tab yang sudah di-load minimal sekali */
  const [loadedTabs, setLoadedTabs] = useState<Set<DataKey>>(new Set());
  const [loadingTab, setLoadingTab] = useState<DataKey | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [message, setMessage] = useState("");

  const flash = useCallback((msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  }, []);

  /** Fetch satu tab saja — hanya kalau belum pernah di-load */
  const loadTab = useCallback(async (key: DataKey) => {
    if (loadedTabs.has(key)) return; // sudah di-cache di state
    setLoadingTab(key);
    try {
      const res = await fetch(ENDPOINTS[key]);
      if (!res.ok) return;
      const json = await res.json();
      setData((prev) => ({
        ...prev,
        [key]: key === "feeds"
          ? (json as Feed[]).sort((a, b) => b.createdAt - a.createdAt)
          : json,
      }));
      setLoadedTabs((prev) => new Set(prev).add(key));
    } catch (err) {
      console.error(`loadTab(${key}) error:`, err);
    } finally {
      setLoadingTab(null);
    }
  }, [loadedTabs]);

  /** Re-fetch satu tab, abaikan cache (misalnya setelah delete/create) */
  const refreshEntity = useCallback(async (key: DataKey) => {
    setLoadingTab(key);
    try {
      const res = await fetch(ENDPOINTS[key]);
      if (!res.ok) return;
      const json = await res.json();
      setData((prev) => ({
        ...prev,
        [key]: key === "feeds"
          ? (json as Feed[]).sort((a: Feed, b: Feed) => b.createdAt - a.createdAt)
          : json,
      }));
      // Pastikan tab ini ditandai sudah loaded
      setLoadedTabs((prev) => new Set(prev).add(key));
    } catch (err) {
      console.error(`refreshEntity(${key}) error:`, err);
    } finally {
      setLoadingTab(null);
    }
  }, []);

  /** Load tab aktif saat pertama kali dipilih */
  useEffect(() => {
    loadTab(activeTab);
  }, [activeTab, loadTab]);

  /** Ganti tab + trigger load jika belum loaded */
  const switchTab = useCallback((key: DataKey) => {
    setActiveTab(key);
    // loadTab akan dipanggil otomatis via useEffect di atas
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
        // Reset semua cache dan reload tab aktif
        setLoadedTabs(new Set());
        setData(EMPTY_DATA);
        await loadTab(activeTab);
      } else flash(`❌ Seed gagal: ${resData.error}`);
    } catch {
      flash("❌ Seed gagal: network error");
    }
    setSeeding(false);
  };

  /** loading = true hanya untuk tab yang sedang aktif */
  const loading = loadingTab === activeTab;

  return {
    data,
    loading,
    seeding,
    message,
    activeTab,
    loadedTabs,
    flash,
    handleSeed,
    refreshEntity,
    deleteItem,
    deleteRoadmapItem,
    switchTab,
    // Backward compat: fetchData sekarang reload tab aktif
    fetchData: () => refreshEntity(activeTab),
  };
}
