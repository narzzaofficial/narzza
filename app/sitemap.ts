import type { MetadataRoute } from "next";
import { getFeeds, getBooks, getRoadmaps } from "@/lib/data";
import { slugify } from "@/lib/slugify";
import { BASE_URL } from "@/lib/site-config";

/**
 * Tanggal launch/deploy situs — digunakan sebagai lastModified
 * untuk halaman static yang kontennya embedded (bukan dari DB).
 * Update ini saat ada perubahan signifikan pada halaman tersebut.
 */
const SITE_LAUNCH_DATE = new Date("2024-01-01");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages — gunakan tanggal tetap, bukan new Date() (selalu berubah)
  // Crawler seperti Google tidak akan percaya jika lastModified selalu "sekarang"
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: SITE_LAUNCH_DATE,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/berita`,
      lastModified: SITE_LAUNCH_DATE,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/tutorial`,
      lastModified: SITE_LAUNCH_DATE,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/riset`,
      lastModified: SITE_LAUNCH_DATE,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/buku`,
      lastModified: SITE_LAUNCH_DATE,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/toko`,
      lastModified: SITE_LAUNCH_DATE,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/roadmap`,
      lastModified: SITE_LAUNCH_DATE,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/tentang`,
      lastModified: SITE_LAUNCH_DATE,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic: Feeds — gunakan createdAt dari DB (sudah benar sejak dulu)
  const feeds = await getFeeds();
  const feedPages: MetadataRoute.Sitemap = feeds.map((feed) => ({
    url: `${BASE_URL}/read/${feed.slug}`,
    lastModified: new Date(feed.createdAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Dynamic: Books — gunakan lastModified dari DB (tidak ada, pakai launch date)
  const books = await getBooks();
  const bookPages: MetadataRoute.Sitemap = books.map((book) => ({
    url: `${BASE_URL}/buku/${slugify(book.title, book.id)}`,
    lastModified: SITE_LAUNCH_DATE,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Dynamic: Roadmaps — gunakan updatedAt dari DB jika ada
  const roadmaps = await getRoadmaps();
  const roadmapPages: MetadataRoute.Sitemap = roadmaps.map((rm) => ({
    url: `${BASE_URL}/roadmap/${rm.slug}`,
    lastModified: rm.updatedAt ? new Date(rm.updatedAt) : SITE_LAUNCH_DATE,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...feedPages, ...bookPages, ...roadmapPages];
}
