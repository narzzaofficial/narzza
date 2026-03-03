import { useState, useCallback, useEffect } from "react";
import type { Feed, Story, Book } from "@/types/content";
import { Category, Product } from "@/types/products";
import { Roadmap } from "@/types/roadmaps";

export function useAdmin() {
  const [data, setData] = useState({
    feeds: [] as Feed[],
    stories: [] as Story[],
    books: [] as Book[],
    roadmaps: [] as Roadmap[],
    products: [] as Product[],
    categories: [] as Category[],
  });
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [message, setMessage] = useState("");

  const flash = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [
        feedsRes,
        storiesRes,
        booksRes,
        roadmapsRes,
        productsRes,
        categoriesRes,
      ] = await Promise.all([
        fetch("/api/feeds"),
        fetch("/api/stories"),
        fetch("/api/books"),
        fetch("/api/roadmaps"),
        fetch("/api/products"),
        fetch("/api/categories"),
      ]);

      setData({
        feeds: feedsRes.ok
          ? (await feedsRes.json()).sort(
              (a: Feed, b: Feed) => b.createdAt - a.createdAt
            )
          : [],
        stories: storiesRes.ok ? await storiesRes.json() : [],
        books: booksRes.ok ? await booksRes.json() : [],
        roadmaps: roadmapsRes.ok ? await roadmapsRes.json() : [],
        products: productsRes.ok ? await productsRes.json() : [],
        categories: categoriesRes.ok ? await categoriesRes.json() : [],
      });
    } catch (err) {
      console.error("Fetch error:", err);
    }
    setLoading(false);
  }, []);

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
        fetchData();
      } else flash(`❌ Seed gagal: ${resData.error}`);
    } catch {
      flash("❌ Seed gagal: network error");
    }
    setSeeding(false);
  };

  const deleteItem = async (endpoint: string, id: number) => {
    if (!confirm("Hapus item ini?")) return;
    try {
      const res = await fetch(`/api/${endpoint}/${id}`, { method: "DELETE" });
      if (res.ok) {
        flash("✅ Item dihapus");
        fetchData();
      } else flash("❌ Gagal menghapus item");
    } catch {
      flash("❌ Network error");
    }
  };

  return {
    data,
    loading,
    seeding,
    message,
    flash,
    handleSeed,
    fetchData,
    deleteItem,
  };
}
