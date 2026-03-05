import type { Metadata } from "next";
import {
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_LOCALE,
  SITE_OG_IMAGE_WIDTH,
  SITE_OG_IMAGE_HEIGHT,
} from "./site-config";

type PageMetaInput = {
  /** Short page title — root layout template appends "| Narzza Media Digital" */
  title: string;
  description?: string;
  /** Relative path, e.g. "/berita". Resolved to absolute via metadataBase. */
  path: string;
  /** Custom OG image. Defaults to site logo. */
  image?: string;
};

/**
 * Generates consistent metadata for a frontend page.
 * Handles openGraph, twitter, and canonical — all sourced from site-config,
 * so updating BASE_URL or SITE_NAME in one place updates every page.
 */
export function createPageMeta({
  title,
  description = SITE_DESCRIPTION,
  path,
  image = "/logo.png",
}: PageMetaInput): Metadata {
  const ogTitle = `${title} — ${SITE_NAME}`;
  return {
    title,
    description,
    openGraph: {
      title: ogTitle,
      description,
      url: path,
      type: "website",
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      images: [
        {
          url: image,
          width: SITE_OG_IMAGE_WIDTH,
          height: SITE_OG_IMAGE_HEIGHT,
          alt: ogTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [image],
    },
    alternates: { canonical: path },
  };
}
