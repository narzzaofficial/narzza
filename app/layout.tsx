import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL("https://narzza.com"),
  title: {
    default: "Narzza Media Digital",
    template: "%s | Narzza Media Digital",
  },
  description:
    "Portal berita teknologi, tutorial, dan eksperimen koding dalam format chat interaktif. Baca topik panjang jadi santai.",
  keywords: [
    "berita teknologi",
    "tutorial coding",
    "media digital",
    "narzza",
    "belajar programming",
    "roadmap developer",
  ],
  authors: [{ name: "Narzza Media Digital", url: "https://narzza.com" }],
  creator: "Narzza Media Digital",
  publisher: "Narzza Media Digital",
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Narzza Media Digital",
    title: "Narzza Media Digital",
    description:
      "Portal berita teknologi, tutorial, dan eksperimen koding dalam format chat interaktif.",
    url: "https://narzza.com",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Narzza Media Digital",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Narzza Media Digital",
    description:
      "Portal berita teknologi, tutorial, dan eksperimen koding dalam format chat interaktif.",
    images: ["/logo.png"],
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
    canonical: "https://narzza.com",
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "manifest", url: "/site.webmanifest" },
    ],
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
            name: "Narzza Media Digital",
            url: "https://narzza.com",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://narzza.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Narzza Media Digital",
            url: "https://narzza.com",
            logo: "https://narzza.com/logo.png",
            sameAs: [],
          }}
        />
      </head>
      <body className={`${inter.className} antialiased bg-canvas min-h-screen`}>
        <ClerkProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
