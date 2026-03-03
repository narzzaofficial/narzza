// FILE: app/(frontend)/data/roadmaps.ts
// (Ini tempat menyimpan Tipe & Data Dummy)

export type RoadmapVideo = {
  id: string;
  author: string;
};

export type RoadmapStep = {
  title: string;
  description: string;
  focus: string;
  videos: RoadmapVideo[];
};

export type Roadmap = {
  _id?: string;
  slug: string;
  title: string;
  summary: string;
  duration: string;
  level: "Pemula" | "Menengah" | "Lanjutan";
  tags: string[];
  image: string;
  steps: RoadmapStep[];
  createdAt?: number;
  updatedAt?: number;
};

export const roadmaps: Roadmap[] = [
  /* ─────────────────────────────────────────────────────────────
     1. Frontend Foundations (Pemula)
  ───────────────────────────────────────────────────────────── */
  {
    slug: "frontend-foundations",
    title: "Frontend Foundations: HTML, CSS & JavaScript",
    summary:
      "Mulai dari nol: pelajari HTML, CSS, dan JavaScript dasar untuk membangun halaman web pertamamu.",
    duration: "4–6 minggu",
    level: "Pemula",
    tags: ["HTML", "CSS", "JavaScript", "Web Dev"],
    image:
      "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1200&q=80",
    steps: [
      {
        title: "HTML Dasar",
        description:
          "Pahami struktur dokumen HTML, elemen semantik, form, tabel, dan aksesibilitas dasar.",
        focus: "Struktur & Semantik",
        videos: [
          { id: "UB1O30fR-EE", author: "Traversy Media" },
          { id: "qz0aGYrrlhU", author: "Programming with Mosh" },
        ],
      },
      {
        title: "CSS Dasar & Layouting",
        description:
          "Kuasai box model, flexbox, grid, dan cara membuat layout responsif tanpa framework.",
        focus: "Styling & Responsif",
        videos: [
          { id: "yfoY53QXEnI", author: "Traversy Media" },
          { id: "1Rs2ND1ryYc", author: "freeCodeCamp" },
        ],
      },
      {
        title: "JavaScript Dasar",
        description:
          "Variabel, fungsi, array, objek, DOM manipulation, dan event handling.",
        focus: "Logika & Interaktivitas",
        videos: [
          { id: "W6NZfCO5SIk", author: "Programming with Mosh" },
          { id: "hdI2bqOjy3c", author: "Traversy Media" },
        ],
      },
      {
        title: "Proyek Pertama: Landing Page",
        description:
          "Gabungkan HTML + CSS + JS untuk membangun landing page responsif dari nol.",
        focus: "Praktik Nyata",
        videos: [
          { id: "p0bGHP-PXD4", author: "Traversy Media" },
          { id: "3WpLpI7TCfM", author: "Kevin Powell" },
        ],
      },
    ],
  },

  /* ─────────────────────────────────────────────────────────────
     2. React & Next.js (Menengah)
  ───────────────────────────────────────────────────────────── */
  {
    slug: "react-nextjs-modern",
    title: "React & Next.js: Modern Web Development",
    summary:
      "Bangun aplikasi React yang scalable lalu upgrade ke Next.js dengan App Router, SSR, dan deployment.",
    duration: "6–8 minggu",
    level: "Menengah",
    tags: ["React", "Next.js", "TypeScript", "Tailwind"],
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80",
    steps: [
      {
        title: "React Core Concepts",
        description:
          "Komponen, props, state, hooks (useState, useEffect, useContext), dan rendering lifecycle.",
        focus: "Komponen & State",
        videos: [
          { id: "SqcY0GlETPk", author: "Programming with Mosh" },
          { id: "Ke90Tje7VS0", author: "Web Dev Simplified" },
        ],
      },
      {
        title: "React Hooks Lanjutan",
        description:
          "useReducer, useMemo, useCallback, useRef, custom hooks, dan optimisasi performa.",
        focus: "Hooks & Performance",
        videos: [
          { id: "TNhaISOUy6Q", author: "Web Dev Simplified" },
          { id: "O6P86uwfdR0", author: "Jack Herrington" },
        ],
      },
      {
        title: "Next.js App Router",
        description:
          "File-based routing, Server Components, Client Components, loading/error UI, dan metadata API.",
        focus: "Routing & Rendering",
        videos: [
          { id: "wm5gMKuwSYk", author: "Traversy Media" },
          { id: "ZjAqacIC_3c", author: "Lama Dev" },
        ],
      },
      {
        title: "Data Fetching & API Routes",
        description:
          "Server Actions, Route Handlers, fetch dengan caching, revalidate, dan integrasi database.",
        focus: "Backend & Data",
        videos: [
          { id: "vrR3MmGmmT0", author: "ByteGrad" },
          { id: "9dIm3BFLwLk", author: "Hamed Bahram" },
        ],
      },
      {
        title: "Styling dengan Tailwind CSS",
        description:
          "Utility-first CSS, dark mode, responsive design, komponen reusable dengan Tailwind v4.",
        focus: "UI & Design System",
        videos: [
          { id: "ft30zcMlFa8", author: "Traversy Media" },
          { id: "elgqxmdVms8", author: "Kevin Powell" },
        ],
      },
    ],
  },

  /* ─────────────────────────────────────────────────────────────
     3. Fullstack dengan TypeScript (Lanjutan)
  ───────────────────────────────────────────────────────────── */
  {
    slug: "fullstack-typescript",
    title: "Fullstack TypeScript: Node, API & Database",
    summary:
      "Kuasai TypeScript end-to-end: dari type system hingga REST API, MongoDB, dan autentikasi production-ready.",
    duration: "8–10 minggu",
    level: "Lanjutan",
    tags: ["TypeScript", "Node.js", "MongoDB", "Auth"],
    image:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=1200&q=80",
    steps: [
      {
        title: "TypeScript Fundamentals",
        description:
          "Types, interfaces, generics, enums, utility types, dan integrasi dengan tooling modern.",
        focus: "Type Safety",
        videos: [
          { id: "BwuLxPH8IDs", author: "Traversy Media" },
          { id: "d56mG7DezGs", author: "Programming with Mosh" },
        ],
      },
      {
        title: "Node.js & Express API",
        description:
          "Buat REST API dengan Express, middleware, validasi input, error handling, dan CORS.",
        focus: "Backend API",
        videos: [
          { id: "Oe421EPjeBE", author: "freeCodeCamp" },
          { id: "SccSCuHhOw0", author: "Traversy Media" },
        ],
      },
      {
        title: "MongoDB & Mongoose",
        description:
          "Schema design, CRUD operations, aggregation pipeline, indexing, dan koneksi production.",
        focus: "Database",
        videos: [
          { id: "ofme2o29ngU", author: "Web Dev Simplified" },
          { id: "fgTGADljAeg", author: "Traversy Media" },
        ],
      },
      {
        title: "Autentikasi & Autorisasi",
        description:
          "JWT, session, OAuth dengan NextAuth/Clerk, role-based access control, dan keamanan API.",
        focus: "Auth & Security",
        videos: [
          { id: "mbsmsi7l3r4", author: "Web Dev Simplified" },
          { id: "w2h54xz6Ndw", author: "Josh tried coding" },
        ],
      },
      {
        title: "Deployment & CI/CD",
        description:
          "Deploy ke Vercel & Railway, environment variables, GitHub Actions, monitoring, dan logging.",
        focus: "DevOps & Production",
        videos: [
          { id: "2HBIzEx6IZA", author: "Fireship" },
          { id: "ScDWrogElmo", author: "Traversy Media" },
        ],
      },
    ],
  },
];

export function getRoadmapBySlug(slug: string) {
  return roadmaps.find((item) => item.slug === slug);
}
