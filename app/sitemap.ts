import type { MetadataRoute } from "next";
import { getFeeds, getBooks, getRoadmaps } from "@/lib/data";
import { slugify } from "@/lib/slugify";

const BASE_URL = "https://narzza.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/berita`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/tutorial`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/riset`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/buku`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/toko`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/roadmap`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/tentang`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic: Feeds
  const feeds = await getFeeds();
  const feedPages: MetadataRoute.Sitemap = feeds.map((feed) => ({
    url: `${BASE_URL}/read/${feed.slug}`,
    lastModified: new Date(feed.createdAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Dynamic: Books
  const books = await getBooks();
  const bookPages: MetadataRoute.Sitemap = books.map((book) => ({
    url: `${BASE_URL}/buku/${slugify(book.title, book.id)}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Dynamic: Roadmaps
  const roadmaps = await getRoadmaps();
  const roadmapPages: MetadataRoute.Sitemap = roadmaps.map((rm) => ({
    url: `${BASE_URL}/roadmap/${rm.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...feedPages, ...bookPages, ...roadmapPages];
}

