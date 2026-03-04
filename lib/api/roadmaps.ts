/**
 * Client-side API helpers for roadmaps.
 * Use these in hooks and client components — never in Server Components.
 */

import type { Roadmap } from "@/types/roadmaps";

export async function fetchRoadmaps(): Promise<Roadmap[]> {
  const res = await fetch("/api/roadmaps", { cache: "no-store" });
  if (!res.ok) throw new Error("Gagal memuat roadmaps");
  return res.json();
}

export async function fetchRoadmapBySlug(slug: string): Promise<Roadmap> {
  const res = await fetch(`/api/roadmaps/${slug}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Roadmap "${slug}" tidak ditemukan`);
  return res.json();
}

export async function createRoadmap(payload: Roadmap): Promise<Roadmap> {
  const res = await fetch("/api/roadmaps", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(normalizePayload(payload)),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Gagal membuat roadmap");
  }
  return res.json();
}

export async function updateRoadmap(
  slug: string,
  payload: Roadmap
): Promise<Roadmap> {
  const res = await fetch(`/api/roadmaps/${slug}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(normalizePayload(payload)),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Gagal memperbarui roadmap");
  }
  return res.json();
}

export async function deleteRoadmap(slug: string): Promise<void> {
  const res = await fetch(`/api/roadmaps/${slug}`, { method: "DELETE" });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Gagal menghapus roadmap");
  }
}

/** Normalize tags from either string or array before sending to API */
function normalizePayload(payload: Roadmap): Roadmap {
  const tags = payload.tags as unknown;
  return {
    ...payload,
    tags: Array.isArray(tags)
      ? (tags as string[])
      : typeof tags === "string"
        ? (tags as string)
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
  };
}


