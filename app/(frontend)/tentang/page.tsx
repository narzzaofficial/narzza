import {
  HeroTentang,
  AchievementTentang,
  VisiMisi,
  CoreValues,
  FounderAndTeam,
  CompanyInfo,
  ContactSection,
  TechnologyStack,
  Partners,
  CTAFooter,
} from "@/components/tentang";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Narzza — Platform Media Digital Penyedia Informasi Umum",
  description:
    "Narzza adalah platform media digital yang menyajikan berita, tutorial, dan riset dari berbagai bidang dalam format yang mudah dipahami. Temukan informasi berkualitas untuk semua kalangan.",
  openGraph: {
    title: "Tentang Narzza — Platform Media Digital",
    description:
      "Platform penyedia informasi umum yang menghadirkan berita, tutorial, dan riset dalam format interaktif dan mudah dicerna.",
    url: "https://narzza.com/tentang",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tentang Narzza — Platform Media Digital",
    description:
      "Platform penyedia informasi umum yang menghadirkan berita, tutorial, dan riset dalam format interaktif dan mudah dicerna.",
  },
  alternates: { canonical: "/tentang" },
};

export default function TentangPage() {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <HeroTentang />

      {/* Achievements Section */}
      <AchievementTentang />

      {/* Visi, Misi & Highlights */}
      <VisiMisi />

      {/* Core Values */}
      <CoreValues />

      {/* Founders & Team Section */}
      <FounderAndTeam />

      {/* Company Info */}
      <CompanyInfo />

      {/* Contact Section */}
      <ContactSection />

      {/* Technology Stack */}
      <TechnologyStack />

      {/* Partners */}
      <Partners />

      {/* CTA Footer */}
      <CTAFooter />
    </div>
  );
}
