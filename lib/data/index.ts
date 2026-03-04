/**
 * Data layer — satu titik ekspor untuk server-side data.
 * Loader per domain di file terpisah (feeds, books, stories, roadmaps, products).
 */

export { CONTENT_REVALIDATE_SECONDS, CACHE_TAGS } from "./constants";
export { getFeeds, getFeedById, getFeedBySlug, getFeedSlugs } from "./feeds";
export { getBooks } from "./books";
export { getBookPageData, getBookStaticIds, getBookStaticSlugs, type BookPageData } from "./book-page";
export { getStories } from "./stories";
export { getRoadmaps, getRoadmapBySlug } from "./roadmaps";
export { getProducts, getProductById, getProductIds } from "./products";
export {
  getTokoPageData,
  getTokoDetailData,
  getProductStaticIds,
  type TokoPageData,
  type TokoDetailData,
} from "./toko-page";
export { getFeedPageData, type FeedPageData } from "./feed-page";
