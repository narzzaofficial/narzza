/**
 * Generate a URL-safe slug from a title string.
 * Appends the numeric ID for uniqueness.
 *
 * Example: slugify("AI Revolution: What's Next?", 42) → "ai-revolution-whats-next-42"
 */
export function slugify(title: string, id: number): string {
  return `${slugifyBase(title)}-${id}`;
}

/**
 * Generate a URL-safe slug without an ID suffix.
 * Use for entities that manage their own unique slug (e.g. roadmaps).
 *
 * Example: slugifyBase("React & Next.js Starter") → "react-nextjs-starter"
 */
export function slugifyBase(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .replace(/[^a-z0-9\s-]/g, "") // remove non-alphanumeric
    .trim()
    .replace(/\s+/g, "-") // spaces → hyphens
    .replace(/-+/g, "-") // collapse multiple hyphens
    .slice(0, 60) // keep it short
    .replace(/-$/, ""); // no trailing hyphen
}

/**
 * Extract the numeric ID from the end of a slug.
 * Accepts both slug-with-id and legacy numeric-only paths.
 * Example: parseSlugId("ai-revolution-whats-next-42") → 42; parseSlugId("42") → 42
 */
export function parseSlugId(slug: string): number | null {
  const match = slug.match(/-(\d+)$/);
  if (match) return Number(match[1]);
  if (/^\d+$/.test(slug)) return Number(slug);
  return null;
}



