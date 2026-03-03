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
  title: "Tentang Narzza — Perusahaan Media Digital Inovatif",
  description:
    "Narzza Media Digital adalah perusahaan media digital yang menghadirkan konten teknologi dalam format interaktif dan mudah dicerna.",
  openGraph: {
    title: "Tentang Narzza Media Digital",
    description:
      "Perusahaan media digital yang menghadirkan konten teknologi dalam format interaktif.",
    url: "https://narzza.com/tentang",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tentang Narzza Media Digital",
    description:
      "Perusahaan media digital yang menghadirkan konten teknologi dalam format interaktif.",
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
