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
import { createPageMeta } from "@/lib/metadata";

export const metadata: Metadata = createPageMeta({
  title: "Tentang Kami",
  description:
    "Narzza adalah platform media digital yang menyajikan berita, tutorial, dan riset dari berbagai bidang dalam format yang mudah dipahami. Temukan informasi berkualitas untuk semua kalangan.",
  path: "/tentang",
});

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
