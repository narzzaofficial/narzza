/**
 * Generate a URL-safe slug from a title string.
 * Appends the numeric ID for uniqueness.
 *
 * Example: slugify("AI Revolution: What's Next?", 42) → "ai-revolution-whats-next-42"
 */
export function slugify(title: string, id: number): string {
  const base = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .replace(/[^a-z0-9\s-]/g, "") // remove non-alphanumeric
    .trim()
    .replace(/\s+/g, "-") // spaces → hyphens
    .replace(/-+/g, "-") // collapse multiple hyphens
    .slice(0, 60) // keep it short
    .replace(/-$/, ""); // no trailing hyphen

  return `${base}-${id}`;
}

/**
 * Extract the numeric ID from the end of a slug.
 * Example: parseSlugId("ai-revolution-whats-next-42") → 42
 */
export function parseSlugId(slug: string): number | null {
  const match = slug.match(/-(\d+)$/);
  return match ? Number(match[1]) : null;
}

