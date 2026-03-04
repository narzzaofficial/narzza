"use client";

import { useState, useCallback, useEffect } from "react";
import type { Roadmap, RoadmapStep, RoadmapVideo } from "@/types/roadmaps";
import {
  fetchRoadmaps,
  createRoadmap,
  updateRoadmap,
  deleteRoadmap,
} from "@/lib/api/roadmaps";

/* ── Constants ────────────────────────────────────────────────────── */

export const EMPTY_FORM: Roadmap = {
  slug: "",
  title: "",
  summary: "",
  duration: "",
  level: "Pemula",
  tags: [],
  image: "",
  steps: [],
};

export const EMPTY_STEP: RoadmapStep = {
  title: "",
  description: "",
  focus: "",
  videos: [],
};

export const EMPTY_VIDEO: RoadmapVideo = { id: "", author: "" };

/* ── Extract YouTube video ID from URL ───────────────────────────── */
export function extractVideoId(value: string): string {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]+)/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
  ];
  for (const pattern of patterns) {
    const match = value.match(pattern);
    if (match?.[1]) return match[1];
  }
  return value;
}

/* ── Hook ────────────────────────────────────────────────────────── */
export function useRoadmaps() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState<Roadmap>(EMPTY_FORM);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  /* ── Data loading ─────────────────────────────────────────────── */
  const loadRoadmaps = useCallback(async () => {
    setLoading(true);
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

  /* ── Form helpers ─────────────────────────────────────────────── */
  const resetForm = useCallback(() => {
    setForm(EMPTY_FORM);
    setEditingSlug(null);
    setError(null);
    setMessage(null);
  }, []);

  const startEdit = useCallback((item: Roadmap) => {
    setEditingSlug(item.slug);
    setForm({ ...item });
    setMessage(null);
    setError(null);
  }, []);

  /* ── Step helpers ─────────────────────────────────────────────── */
  const addStep = useCallback(
    () =>
      setForm((prev) => ({
        ...prev,
        steps: [...prev.steps, { ...EMPTY_STEP, videos: [] }],
      })),
    []
  );

  const removeStep = useCallback(
    (index: number) =>
      setForm((prev) => ({
        ...prev,
        steps: prev.steps.filter((_, i) => i !== index),
      })),
    []
  );

  const updateStep = useCallback(
    (index: number, field: keyof RoadmapStep, value: string) =>
      setForm((prev) => ({
        ...prev,
        steps: prev.steps.map((step, i) =>
          i === index ? { ...step, [field]: value } : step
        ),
      })),
    []
  );

  /* ── Video helpers ────────────────────────────────────────────── */
  const addVideo = useCallback(
    (stepIndex: number) =>
      setForm((prev) => ({
        ...prev,
        steps: prev.steps.map((step, i) =>
          i === stepIndex
            ? { ...step, videos: [...step.videos, { ...EMPTY_VIDEO }] }
            : step
        ),
      })),
    []
  );

  const removeVideo = useCallback(
    (stepIndex: number, videoIndex: number) =>
      setForm((prev) => ({
        ...prev,
        steps: prev.steps.map((step, i) =>
          i === stepIndex
            ? {
                ...step,
                videos: step.videos.filter((_, vi) => vi !== videoIndex),
              }
            : step
        ),
      })),
    []
  );

  const updateVideo = useCallback(
    (
      stepIndex: number,
      videoIndex: number,
      field: keyof RoadmapVideo,
      value: string
    ) => {
      const finalValue =
        field === "id" ? extractVideoId(value) : value;
      setForm((prev) => ({
        ...prev,
        steps: prev.steps.map((step, i) =>
          i === stepIndex
            ? {
                ...step,
                videos: step.videos.map((video, vi) =>
                  vi === videoIndex
                    ? { ...video, [field]: finalValue }
                    : video
                ),
              }
            : step
        ),
      }));
    },
    []
  );

  /* ── CRUD ─────────────────────────────────────────────────────── */
  const handleSave = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      if (editingSlug) {
        const updated = await updateRoadmap(editingSlug, form);
        // Optimistic: replace item in list
        setRoadmaps((prev) =>
          prev.map((r) => (r.slug === editingSlug ? updated : r))
        );
        setMessage("✅ Roadmap berhasil diperbarui");
      } else {
        const created = await createRoadmap(form);
        // Optimistic: prepend new item
        setRoadmaps((prev) => [created, ...prev]);
        setMessage("✅ Roadmap berhasil ditambahkan");
      }
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }, [editingSlug, form, resetForm]);

  const handleDelete = useCallback(
    async (slug: string) => {
      if (!confirm("Hapus roadmap ini?")) return;
      // Optimistic: remove immediately
      setRoadmaps((prev) => prev.filter((r) => r.slug !== slug));
      if (editingSlug === slug) resetForm();
      try {
        await deleteRoadmap(slug);
      } catch (err) {
        // Revert on failure
        setError(err instanceof Error ? err.message : "Gagal menghapus");
        await loadRoadmaps(); // only refetch on error
      }
    },
    [editingSlug, loadRoadmaps, resetForm]
  );

  const handleJsonImport = useCallback(
    async (items: unknown[]): Promise<string | null> => {
      const created: Roadmap[] = [];
      let failCount = 0;
      for (const item of items) {
        try {
          const result = await createRoadmap(item as Roadmap);
          created.push(result);
        } catch {
          failCount++;
        }
      }
      // Optimistic: prepend all successfully created items
      if (created.length > 0) {
        setRoadmaps((prev) => [...created, ...prev]);
        setMessage(`✅ ${created.length} Roadmap berhasil diimport!`);
      }
      if (failCount > 0)
        return `${failCount} dari ${items.length} roadmap gagal disimpan.`;
      return null;
    },
    []
  );

  /* ── Derived ──────────────────────────────────────────────────── */
  const hasChanges =
    !!form.title ||
    !!form.summary ||
    form.tags.length > 0 ||
    form.steps.length > 0 ||
    !!form.image;

  return {
    // state
    roadmaps,
    loading,
    saving,
    error,
    message,
    form,
    editingSlug,
    hasChanges,
    // form
    setForm,
    resetForm,
    startEdit,
    // steps
    addStep,
    removeStep,
    updateStep,
    // videos
    addVideo,
    removeVideo,
    updateVideo,
    // crud
    handleSave,
    handleDelete,
    handleJsonImport,
    // data
    loadRoadmaps,
  };
}

