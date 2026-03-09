import { BASE_URL as SITE_BASE_URL } from "@/lib/site-config";

export const INDEXNOW_KEY =
  process.env.INDEXNOW_KEY ?? "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6";

export const INDEXNOW_ENGINES = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
];

export const BASE_URL = SITE_BASE_URL;
