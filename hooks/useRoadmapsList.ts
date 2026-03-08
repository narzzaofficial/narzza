"use client";

import { useState, useCallback, useEffect } from "react";
import type { Roadmap } from "@/types/roadmaps";
import { fetchRoadmaps, deleteRoadmap } from "@/lib/api/roadmaps";

export function useRoadmapList() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRoadmaps = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRoadmaps();
      setRoadmaps(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRoadmaps();
  }, [loadRoadmaps]);

  const handleDelete = useCallback(
    async (slug: string) => {
      if (!confirm("Hapus roadmap ini?")) return;
      setRoadmaps((prev) => prev.filter((r) => r.slug !== slug));
      try {
        await deleteRoadmap(slug);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal menghapus");
        await loadRoadmaps();
      }
    },
    [loadRoadmaps]
  );

  return { roadmaps, loading, error, handleDelete };
}
