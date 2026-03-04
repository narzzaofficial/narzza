import { BASE_URL as SITE_BASE_URL } from "@/lib/site-config";

/**
 * IndexNow key for fast search engine indexing.
 *
 * To use IndexNow:
 * 1. Generate your own key at https://www.bing.com/indexnow/getstarted
 *    or use any unique alphanumeric string (8-128 chars).
 * 2. Update INDEXNOW_KEY below (or set INDEXNOW_KEY in your .env.local).
 * 3. Rename /public/{current-key}.txt to /public/{your-new-key}.txt
 *    and update its contents to match the new key.
 */
export const INDEXNOW_KEY =
  process.env.INDEXNOW_KEY ?? "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6";

export const INDEXNOW_ENGINES = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
];

export const BASE_URL = SITE_BASE_URL;
