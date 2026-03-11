import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { TopProgressBar } from "@/components/TopProgressBar";
import { ClerkProvider } from "@clerk/nextjs";
import { JsonLd } from "@/components/JsonLd";
import {
  SITE_NAME,
  BASE_URL,
  SITE_DESCRIPTION,
  SITE_LOGO,
  SITE_OG_IMAGE,
  SITE_OG_IMAGE_WIDTH,
  SITE_OG_IMAGE_HEIGHT,
  SITE_LOCALE,
  SITE_EMAIL,
} from "@/lib/site-config";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "berita terkini",
    "tutorial",
    "media digital",
    "narzza",
    "riset",
    "informasi umum",
    "belajar online",
  ],
  authors: [{ name: SITE_NAME, url: BASE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  openGraph: {
    type: "website",
    locale: SITE_LOCALE,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: BASE_URL,
    images: [
      {
        url: SITE_OG_IMAGE, // absolute URL via site-config
        width: SITE_OG_IMAGE_WIDTH,
        height: SITE_OG_IMAGE_HEIGHT,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [SITE_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  icons: {
    icon: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [{ rel: "manifest", url: "/site.webmanifest" }],
  },
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className="bg-canvas"
      data-theme="dark"
      suppressHydrationWarning
    >
      <head>
        {/* Prevent flash of wrong theme before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('narzza-theme');document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark');})();`,
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE_NAME,
            url: BASE_URL,
            description: SITE_DESCRIPTION,
            inLanguage: "id",
            potentialAction: {
              "@type": "SearchAction",
              // target harus match route yang benar-benar ada
              target: `${BASE_URL}/search?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: SITE_NAME,
            url: BASE_URL,
            logo: {
              "@type": "ImageObject",
              url: SITE_LOGO,
            },
            email: SITE_EMAIL,
            sameAs: [
              // Tambah URL sosmed yang aktif di sini
              // "https://twitter.com/narzzaofficial",
              // "https://instagram.com/narzzaofficial",
            ],
          }}
        />
      </head>
      <body className={`${inter.className} antialiased bg-canvas min-h-screen`}>
        <TopProgressBar />
        <ClerkProvider dynamic>
          <ThemeProvider>{children}</ThemeProvider>
        </ClerkProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
