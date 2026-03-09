// @/app/lib/constants/about.ts

import { AiFillOpenAI } from "react-icons/ai";
import { BsCalendarFill, BsBriefcaseFill } from "react-icons/bs";
import {
  FaLinkedin,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaWhatsapp,
  FaRobot,
  FaGlobe,
  FaUsers,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { HiOfficeBuilding } from "react-icons/hi";
import { MdEmail, MdTrackChanges } from "react-icons/md";
import { RiOpenaiFill } from "react-icons/ri";
import { SiClaude, SiGithubcopilot, SiGooglegemini } from "react-icons/si";

export const ABOUT_HIGHLIGHTS = [
  {
    title: "Visi Perusahaan",
    points: [
      "Menjadi platform media digital terpercaya untuk berbagi informasi berkualitas bagi masyarakat Indonesia.",
      "Menciptakan ekosistem konten yang edukatif, informatif, dan mudah diakses oleh semua kalangan.",
      "Membangun komunitas pembaca aktif yang saling berbagi pengetahuan dan tumbuh bersama.",
    ],
  },
  {
    title: "Misi Kami",
    points: [
      "Menyajikan informasi aktual dan relevan dalam format yang mudah dipahami dan cepat dicerna.",
      "Memberikan nilai tambah kepada pembaca melalui tutorial, riset, dan analisis dari berbagai bidang.",
      "Berinovasi dalam penyampaian konten untuk memberikan pengalaman membaca yang lebih baik.",
    ],
  },
  {
    title: "Format Konten Unik",
    points: [
      "Setiap konten disajikan dalam format percakapan interaktif yang mudah dipahami.",
      "Dilengkapi ringkasan cepat di setiap artikel agar pembaca bisa menangkap inti informasi secara efisien.",
      "Tersedia dalam berbagai format: artikel, buku interaktif, dan roadmap pembelajaran.",
    ],
  },
  {
    title: "Produk & Layanan",
    points: [
      "Platform media dengan konten berita, tutorial, dan riset dari berbagai bidang.",
      "E-commerce untuk produk digital, buku, dan merchandise.",
      "Roadmap pembelajaran terstruktur untuk pengembangan diri.",
      "Buku interaktif dengan format Q&A yang engaging.",
    ],
  },
];

export const COMPANY_STATS = [
  { label: "Nama Perusahaan", value: "Narzza Media Digital", icon: "🏢" },
  { label: "Tahun Berdiri", value: "2024", icon: "📅" },
  { label: "Fokus Bisnis", value: "Media Digital & Informasi", icon: "🎯" },
  { label: "Model Bisnis", value: "Content + E-commerce", icon: "💼" },
  { label: "Tim", value: "4 Orang", icon: "👥" },
  { label: "Lokasi", value: "Remote-first, Indonesia", icon: "🌏" },
];

export const FOUNDERS = [
  {
    name: "Nardi",
    role: "Founder & CEO",
    avatar: "👨‍💼",
    description:
      "Visioner di balik Narzza Media Digital dengan passion untuk menghadirkan informasi berkualitas yang mudah diakses oleh semua orang.",
  },
  {
    name: "Nur Azizah Azzahra",
    role: "Co-Founder & COO",
    avatar: "👩‍💼",
    description:
      "Mengatur operasional dan strategi bisnis untuk memastikan pertumbuhan platform yang berkelanjutan dan berdampak positif bagi komunitas.",
  },
];

export const AI_TEAM = [
  {
    name: "GitHub Copilot",
    role: "Engineering Assistant",
    icon: SiGithubcopilot,
    color: "#6E40C9",
    team: "Engineering",
  },
  {
    name: "ChatGPT",
    role: "Content Writer",
    icon: RiOpenaiFill,
    color: "#10A37F",
    team: "Content",
  },
  {
    name: "Gemini",
    role: "Research Analyst",
    icon: SiGooglegemini,
    color: "#1A73E8",
    team: "Research",
  },
  {
    name: "Claude Sonnet",
    role: "Writing Assistant",
    icon: SiClaude,
    color: "#D97757",
    team: "Content",
  },
  {
    name: "Midjourney",
    role: "Visual Designer",
    icon: AiFillOpenAI,
    color: "#333333",
    team: "Design",
  },
];

export const CONTACT_INFO = [
  {
    label: "Email",
    value: "narzzaofficial@gmail.com",
    icon: MdEmail,
    href: "mailto:narzzaofficial@gmail.com",
    color: "#EA4335",
  },
  {
    label: "LinkedIn",
    value: "Narzza Media Digital",
    icon: FaLinkedin,
    href: "https://linkedin.com/in/narzza-media-digital-9701353b6",
    color: "#0A66C2",
  },
  {
    label: "WhatsApp",
    value: "+62 851-7214-0815",
    icon: FaWhatsapp,
    href: "https://wa.me/6285172140815",
    color: "#25D366",
  },
  {
    label: "Instagram",
    value: "@narzzaofficial",
    icon: FaInstagram,
    href: "https://www.instagram.com/narzzaofficial",
    color: "#E1306C",
  },
  {
    label: "TikTok",
    value: "@narzzaofficial",
    icon: FaTiktok,
    href: "https://www.tiktok.com/@narzzaofficial",
    color: "#010101",
  },
  {
    label: "YouTube",
    value: "@narzzaofficial",
    icon: FaYoutube,
    href: "https://youtube.com/@narzzaofficial",
    color: "#FF0000",
  },
];
export const ACHIEVEMENTS = [
  { number: "500+", label: "Pembaca Aktif", icon: "👁️" },
  { number: "30+", label: "Konten Diterbitkan", icon: "📝" },
  { number: "3+", label: "Roadmap Tersedia", icon: "🗺️" },
  { number: "50+", label: "Member Komunitas", icon: "👥" },
];

export const CORE_VALUES = [
  {
    icon: "🎯",
    title: "Kualitas Konten",
    description:
      "Setiap konten melalui proses riset dan review yang seksama untuk memastikan akurasi, kejelasan, dan relevansi bagi pembaca.",
  },
  {
    icon: "🌱",
    title: "Tumbuh Bersama",
    description:
      "Kami percaya pertumbuhan terbaik terjadi ketika komunitas saling mendukung, berbagi, dan belajar bersama.",
  },
  {
    icon: "🤝",
    title: "Keterbukaan",
    description:
      "Kami terbuka terhadap masukan dari komunitas dan terus berupaya meningkatkan kualitas layanan secara berkelanjutan.",
  },
  {
    icon: "💡",
    title: "Informasi Mudah Dicerna",
    description:
      "Fokus pada penyajian konten yang sederhana, ringkas, dan mudah dipahami oleh siapa saja.",
  },
];

export const PLATFORM_FEATURES = [
  {
    icon: "📰",
    label: "Berita & Artikel",
    desc: "Informasi terkini dari berbagai topik",
  },
  {
    icon: "🎓",
    label: "Tutorial Interaktif",
    desc: "Panduan langkah demi langkah",
  },
  {
    icon: "🔬",
    label: "Riset & Analisis",
    desc: "Konten mendalam berbasis data",
  },
  {
    icon: "📚",
    label: "Buku Digital",
    desc: "Buku dengan format Q&A interaktif",
  },
  {
    icon: "🗺️",
    label: "Roadmap Belajar",
    desc: "Jalur pembelajaran terstruktur",
  },
  { icon: "🛒", label: "Toko Produk", desc: "Produk digital & merchandise" },
];

export const PARTNERS = [
  "Digital Ocean",
  "Vercel",
  "MongoDB Atlas",
  "GitHub",
  "Unsplash",
  "YouTube",
];

export const TEAMS = [
  {
    label: "Nama Perusahaan",
    value: "Narzza Media Digital",
    icon: HiOfficeBuilding,
    color: "#60A5FA",
  },
  {
    label: "Tahun Berdiri",
    value: "2026",
    icon: BsCalendarFill,
    color: "#34D399",
  },
  {
    label: "Fokus Bisnis",
    value: "Media Digital & Informasi",
    icon: MdTrackChanges,
    color: "#F472B6",
  },
  {
    label: "Model Bisnis",
    value: "Content + E-commerce",
    icon: BsBriefcaseFill,
    color: "#FBBF24",
  },
  { label: "Tim", value: "4 Orang", icon: FaUsers, color: "#A78BFA" },
  {
    label: "Lokasi",
    value: "Remote-first, Indonesia",
    icon: FaGlobe,
    color: "#2DD4BF",
  },
];
