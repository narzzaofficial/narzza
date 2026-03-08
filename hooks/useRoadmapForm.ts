"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Roadmap, RoadmapStep, RoadmapVideo } from "@/types/roadmaps";
import { createRoadmap, updateRoadmap } from "@/lib/api/roadmaps";

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

export const EMPTY_VIDEO: RoadmapVideo = { id: "", title: "", author: "" };

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

type Mode = "create" | "edit";

export function useRoadmapForm(mode: Mode, initialData?: Roadmap) {
  const router = useRouter();
  const [form, setForm] = useState<Roadmap>(initialData ?? EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const finalValue = field === "id" ? extractVideoId(value) : value;
      setForm((prev) => ({
        ...prev,
        steps: prev.steps.map((step, i) =>
          i === stepIndex
            ? {
                ...step,
                videos: step.videos.map((video, vi) =>
                  vi === videoIndex ? { ...video, [field]: finalValue } : video
                ),
              }
            : step
        ),
      }));
    },
    []
  );

  /* ── Save ─────────────────────────────────────────────────────── */
  const handleSave = useCallback(async () => {
    if (!form.title.trim()) {
      setError("Judul tidak boleh kosong");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      if (mode === "edit" && initialData?.slug) {
        await updateRoadmap(initialData.slug, form);
      } else {
        await createRoadmap(form);
      }
      router.push("/admin/roadmaps");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }, [form, mode, initialData, router]);

  const hasChanges =
    !!form.title ||
    !!form.summary ||
    form.tags.length > 0 ||
    form.steps.length > 0 ||
    !!form.image;

  return {
    form,
    setForm,
    saving,
    error,
    hasChanges,
    addStep,
    removeStep,
    updateStep,
    addVideo,
    removeVideo,
    updateVideo,
    handleSave,
  };
}
