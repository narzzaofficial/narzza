export type {
  Story,
  ChatLine,
  Feed,
  BookChapter,
  Book,
  FeedCategory,
} from "@/types/content";

import type { Story, Book } from "@/types/content";

export const stories: Story[] = [
  {
    id: 1,
    name: "AI Corner",
    label: "AI",
    type: "Berita",
    palette: "from-sky-400 to-blue-500",
    image: "https://picsum.photos/seed/ai-corner/400/400",
    viral: true,
  },
  {
    id: 2,
    name: "Code Daily",
    label: "CD",
    type: "Tutorial",
    palette: "from-amber-300 to-orange-500",
    image: "https://picsum.photos/seed/code-daily/400/400",
    viral: true,
  },
  {
    id: 3,
    name: "Lab NAA",
    label: "LAB",
    type: "Riset",
    palette: "from-emerald-400 to-teal-500",
    image: "https://picsum.photos/seed/lab-naa/400/400",
    viral: false,
  },
  {
    id: 4,
    name: "Cyber Byte",
    label: "CB",
    type: "Berita",
    palette: "from-indigo-400 to-blue-600",
    image: "https://picsum.photos/seed/cyber-byte/400/400",
    viral: true,
  },
  {
    id: 5,
    name: "UX Pulse",
    label: "UX",
    type: "Tutorial",
    palette: "from-pink-400 to-rose-500",
    image: "https://picsum.photos/seed/ux-pulse/400/400",
    viral: false,
  },
  {
    id: 6,
    name: "Data Hunt",
    label: "DH",
    type: "Riset",
    palette: "from-violet-400 to-fuchsia-500",
    image: "https://picsum.photos/seed/data-hunt/400/400",
    viral: true,
  },
];

export const books: Book[] = [
  {
    id: 1,
    title: "Clean Code dalam Bahasa Manusia",
    author: "Tim NAA Editorial",
    cover: "https://picsum.photos/seed/clean-code-book/400/600",
    genre: "Software Engineering",
    pages: 48,
    rating: 4.8,
    description:
      "Prinsip clean code disederhanakan lewat format tanya jawab. Cocok buat developer yang mau nulis kode lebih rapi tanpa harus baca buku tebal.",
    chapters: [
      {
        title: "Bab 1: Kenapa Clean Code Penting?",
        lines: [
          { role: "q", text: "Clean code itu sebenernya apa sih?" },
          {
            role: "a",
            text: "Kode yang bisa dibaca, dipahami, dan dimodifikasi dengan mudah oleh developer lain — termasuk diri sendiri 6 bulan ke depan.",
          },
          { role: "q", text: "Kalau kode udah jalan, kenapa harus clean?" },
          {
            role: "a",
            text: "Karena 80% waktu developer dihabiskan untuk membaca kode, bukan menulis. Kode yang berantakan = waktu terbuang.",
          },
          { role: "q", text: "Contoh kode kotor yang sering ditemui?" },
          {
            role: "a",
            text: "Nama variabel satu huruf, fungsi 200+ baris, nested if 5 level, dan komentar yang menjelaskan hal yang sudah jelas.",
          },
          { role: "q", text: "Mulai dari mana biar kode lebih clean?" },
          {
            role: "a",
            text: "Tiga hal: naming yang deskriptif, fungsi kecil yang fokus satu tugas, dan hapus dead code tanpa ragu.",
          },
        ],
      },
      {
        title: "Bab 2: Naming yang Bermakna",
        lines: [
          { role: "q", text: "Nama variabel penting banget ya?" },
          {
            role: "a",
            text: "Sangat. Nama variabel adalah dokumentasi paling minimal. 'userAge' jauh lebih baik daripada 'x' atau 'data1'.",
          },
          { role: "q", text: "Fungsi sebaiknya dinamai gimana?" },
          {
            role: "a",
            text: "Gunakan verb + noun. Contoh: 'calculateTotalPrice', 'fetchUserProfile', 'validateEmailFormat'.",
          },
          { role: "q", text: "Boolean variable gimana?" },
          {
            role: "a",
            text: "Prefix 'is', 'has', 'can', atau 'should'. Contoh: 'isLoggedIn', 'hasPermission', 'canEdit'.",
          },
          { role: "q", text: "Kalau nama terlalu panjang gimana?" },
          {
            role: "a",
            text: "Lebih baik panjang tapi jelas, daripada pendek tapi bikin bingung. IDE modern punya autocomplete.",
          },
        ],
      },
      {
        title: "Bab 3: Fungsi yang Fokus",
        lines: [
          { role: "q", text: "Satu fungsi idealnya berapa baris?" },
          {
            role: "a",
            text: "Tidak ada angka pasti, tapi rule of thumb: kalau perlu scroll untuk baca satu fungsi, itu sudah terlalu panjang.",
          },
          { role: "q", text: "Single responsibility itu maksudnya?" },
          {
            role: "a",
            text: "Satu fungsi hanya melakukan SATU hal. Kalau ada kata 'dan' saat menjelaskan fungsi, pecah jadi dua.",
          },
          { role: "q", text: "Parameter fungsi baiknya berapa?" },
          {
            role: "a",
            text: "Idealnya 0-2. Kalau lebih dari 3, pertimbangkan untuk mengelompokkan ke object.",
          },
          { role: "q", text: "Side effect itu apa dan kenapa bahaya?" },
          {
            role: "a",
            text: "Fungsi yang diam-diam mengubah state lain di luar scope-nya. Bikin bug susah dilacak karena behaviour tersembunyi.",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "JavaScript Modern: ES2024+ Deep Dive",
    author: "NAA Dev Team",
    cover: "https://picsum.photos/seed/js-modern-book/400/600",
    genre: "JavaScript",
    pages: 62,
    rating: 4.7,
    description:
      "Fitur-fitur JavaScript terbaru dijelaskan lewat dialog santai. Dari temporal API sampai pattern matching, semuanya jadi lebih mudah dipahami.",
    chapters: [
      {
        title: "Bab 1: Array & Object Terbaru",
        lines: [
          { role: "q", text: "Array method baru apa yang harus diketahui?" },
          {
            role: "a",
            text: "Array.groupBy() untuk grouping, Array.fromAsync() untuk async iterables, dan toSorted()/toReversed() yang immutable.",
          },
          { role: "q", text: "Bedanya toSorted() sama sort()?" },
          {
            role: "a",
            text: "toSorted() return array baru tanpa mengubah original. sort() mutate array asli. Immutability lebih aman.",
          },
          { role: "q", text: "Structuredclone itu buat apa?" },
          {
            role: "a",
            text: "Deep clone object tanpa library. Bisa handle Date, Map, Set, bahkan circular reference. Pengganti JSON.parse(JSON.stringify()).",
          },
          { role: "q", text: "Object.hasOwn() kenapa lebih baik?" },
          {
            role: "a",
            text: "Lebih aman dari obj.hasOwnProperty() karena tetap works meskipun object dibuat dengan Object.create(null).",
          },
        ],
      },
      {
        title: "Bab 2: Async Pattern Lanjutan",
        lines: [
          { role: "q", text: "Promise.withResolvers() itu apa?" },
          {
            role: "a",
            text: "Shortcut untuk bikin promise yang resolve/reject-nya bisa dipanggil dari luar. Berguna untuk event-based code.",
          },
          { role: "q", text: "Top-level await udah stabil?" },
          {
            role: "a",
            text: "Ya, di ES modules. Bisa langsung await di root module tanpa perlu async wrapper function.",
          },
          { role: "q", text: "AbortSignal.any() fungsinya?" },
          {
            role: "a",
            text: "Gabungkan beberapa abort signal jadi satu. Useful kalau mau cancel request berdasarkan multiple condition.",
          },
          { role: "q", text: "Error handling async yang best practice?" },
          {
            role: "a",
            text: "Selalu try-catch di level tertinggi, gunakan Error cause untuk chaining, dan jangan pernah swallow error tanpa logging.",
          },
        ],
      },
      {
        title: "Bab 3: Pattern Matching & Decorators",
        lines: [
          { role: "q", text: "Pattern matching di JS kayak gimana?" },
          {
            role: "a",
            text: "Masih proposal stage 3, tapi konsepnya mirip switch tapi lebih powerful — bisa match berdasarkan struktur object.",
          },
          { role: "q", text: "Decorators udah bisa dipake?" },
          {
            role: "a",
            text: "Stage 3 dan sudah di-support TypeScript 5+. Bisa dipakai untuk logging, validation, caching di level class/method.",
          },
          { role: "q", text: "Contoh decorator yang useful?" },
          {
            role: "a",
            text: "@log untuk auto-log method calls, @memoize untuk caching return value, @validate untuk input checking.",
          },
          { role: "q", text: "Kapan harus pakai decorator vs HOF?" },
          {
            role: "a",
            text: "Decorator untuk class/method concerns. Higher-order function untuk functional composition. Keduanya saling melengkapi.",
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "System Design untuk Web Developer",
    author: "NAA Architecture Team",
    cover: "https://picsum.photos/seed/sys-design-book/400/600",
    genre: "System Design",
    pages: 56,
    rating: 4.9,
    description:
      "Konsep system design yang biasanya rumit, disajikan lewat pertanyaan sederhana. Dari load balancer sampai database sharding.",
    chapters: [
      {
        title: "Bab 1: Fundamentals Scaling",
        lines: [
          { role: "q", text: "Kapan app perlu di-scale?" },
          {
            role: "a",
            text: "Saat response time mulai naik di bawah traffic normal, atau CPU/memory usage konsisten di atas 70%.",
          },
          { role: "q", text: "Horizontal vs vertical scaling?" },
          {
            role: "a",
            text: "Vertical = upgrade mesin (RAM, CPU). Horizontal = tambah mesin. Horizontal lebih sustainable untuk long-term.",
          },
          { role: "q", text: "Load balancer itu apa sederhananya?" },
          {
            role: "a",
            text: "Traffic cop. Dia distribusikan request ke beberapa server supaya gak ada satu server yang kelebihan beban.",
          },
          { role: "q", text: "Algorithm load balancing yang umum?" },
          {
            role: "a",
            text: "Round robin (bergilir), least connections (ke server paling senggang), dan weighted (berdasarkan kapasitas server).",
          },
        ],
      },
      {
        title: "Bab 2: Caching Strategy",
        lines: [
          { role: "q", text: "Cache itu disimpan di mana?" },
          {
            role: "a",
            text: "Bisa di browser (client), CDN (edge), application layer (Redis/Memcached), atau database query cache.",
          },
          { role: "q", text: "Cache invalidation kenapa susah?" },
          {
            role: "a",
            text: "Karena harus pastikan data cache selalu sinkron dengan source of truth. Stale data bisa bikin bug yang susah di-debug.",
          },
          { role: "q", text: "TTL vs event-based invalidation?" },
          {
            role: "a",
            text: "TTL simple tapi bisa stale. Event-based lebih akurat tapi lebih complex. Pilih berdasarkan seberapa penting data freshness.",
          },
          { role: "q", text: "Cache hit ratio yang bagus berapa?" },
          {
            role: "a",
            text: "Di atas 90% sudah bagus. Kalau di bawah 70%, review cache key strategy dan TTL configuration.",
          },
        ],
      },
      {
        title: "Bab 3: Database di Scale Besar",
        lines: [
          { role: "q", text: "Read replica itu apa?" },
          {
            role: "a",
            text: "Copy database yang khusus handle query baca. Write tetap ke primary. Ini cara paling mudah scale read-heavy app.",
          },
          { role: "q", text: "Sharding kapan dibutuhkan?" },
          {
            role: "a",
            text: "Saat satu database sudah gak kuat handle volume data. Data dipecah ke beberapa database berdasarkan shard key.",
          },
          { role: "q", text: "SQL vs NoSQL untuk scale?" },
          {
            role: "a",
            text: "NoSQL lebih mudah di-scale horizontal, tapi SQL lebih reliable untuk data yang butuh strong consistency dan complex joins.",
          },
          { role: "q", text: "CAP theorem itu apa?" },
          {
            role: "a",
            text: "Distributed system cuma bisa pilih 2 dari 3: Consistency, Availability, Partition tolerance. Pahami trade-off sebelum pilih database.",
          },
        ],
      },
    ],
  },
  {
    id: 4,
    title: "React Performance Mastery",
    author: "NAA Frontend Guild",
    cover: "https://picsum.photos/seed/react-perf-book/400/600",
    genre: "React",
    pages: 44,
    rating: 4.6,
    description:
      "Optimasi React dari dasar sampai advanced. Kenapa component lambat, kapan pakai memo, dan bagaimana profiling yang benar.",
    chapters: [
      {
        title: "Bab 1: Memahami Re-render",
        lines: [
          { role: "q", text: "Kenapa component React bisa re-render terus?" },
          {
            role: "a",
            text: "Setiap kali parent re-render, semua child ikut re-render by default. Ini by design, bukan bug.",
          },
          { role: "q", text: "Re-render itu selalu buruk?" },
          {
            role: "a",
            text: "Tidak. React sudah sangat efisien. Yang buruk itu unnecessary re-render pada component yang berat (list panjang, chart, dll).",
          },
          { role: "q", text: "Cara deteksi component yang lambat?" },
          {
            role: "a",
            text: "Pakai React DevTools Profiler. Record interaksi, lalu lihat component mana yang render paling lama.",
          },
          { role: "q", text: "React.memo kapan dipake?" },
          {
            role: "a",
            text: "Hanya saat component menerima props yang jarang berubah dan render-nya mahal. Jangan memo semua component — overhead-nya gak worth.",
          },
        ],
      },
      {
        title: "Bab 2: State Management yang Efisien",
        lines: [
          { role: "q", text: "State di level mana yang ideal?" },
          {
            role: "a",
            text: "Sedekat mungkin dengan component yang membutuhkan. Jangan angkat state ke atas kalau gak perlu.",
          },
          { role: "q", text: "Context API bikin lambat?" },
          {
            role: "a",
            text: "Context sendiri gak lambat. Yang lambat itu semua consumer re-render saat value berubah. Solusi: split context atau pakai selector.",
          },
          { role: "q", text: "useMemo vs useCallback?" },
          {
            role: "a",
            text: "useMemo untuk cache computed value. useCallback untuk cache function reference. Keduanya cuma berguna kalau dipakai bareng React.memo.",
          },
          { role: "q", text: "Zustand lebih performant dari Redux?" },
          {
            role: "a",
            text: "Untuk kebanyakan app, ya. Zustand punya built-in selector dan gak trigger re-render global seperti context.",
          },
        ],
      },
      {
        title: "Bab 3: Virtualization & Code Splitting",
        lines: [
          { role: "q", text: "Virtualization itu apa?" },
          {
            role: "a",
            text: "Hanya render item yang visible di viewport. List 10,000 item cuma render 20-30 yang keliatan. Library: react-window atau tanstack-virtual.",
          },
          { role: "q", text: "Lazy loading component gimana?" },
          {
            role: "a",
            text: "Pakai React.lazy() + Suspense. Component berat di-load hanya saat dibutuhkan, bukan saat initial bundle.",
          },
          { role: "q", text: "Dynamic import vs static import?" },
          {
            role: "a",
            text: "Static import masuk ke main bundle. Dynamic import(\u0027./module\u0027) bikin chunk terpisah yang di-load on demand.",
          },
          { role: "q", text: "Bundle size target yang sehat?" },
          {
            role: "a",
            text: "Initial JS bundle di bawah 200KB gzipped. Pakai next/bundle-analyzer atau source-map-explorer untuk audit.",
          },
        ],
      },
    ],
  },
  {
    id: 5,
    title: "Git & GitHub untuk Tim Produktif",
    author: "NAA DevOps Team",
    cover: "https://picsum.photos/seed/git-team-book/400/600",
    genre: "DevOps",
    pages: 38,
    rating: 4.5,
    description:
      "Workflow Git yang bikin kolaborasi tim smooth. Branching strategy, code review etiquette, dan CI/CD pipeline dari nol.",
    chapters: [
      {
        title: "Bab 1: Branching Strategy",
        lines: [
          { role: "q", text: "Git Flow vs Trunk-based, mana yang lebih baik?" },
          {
            role: "a",
            text: "Trunk-based lebih cocok untuk tim yang deploy sering. Git Flow untuk project dengan release cycle panjang.",
          },
          { role: "q", text: "Feature branch sebaiknya berapa lama?" },
          {
            role: "a",
            text: "Maksimal 2-3 hari. Semakin lama, semakin susah merge dan semakin besar risiko conflict.",
          },
          { role: "q", text: "Rebase vs merge?" },
          {
            role: "a",
            text: "Rebase untuk feature branch supaya history bersih. Merge untuk main branch supaya ada record kapan feature masuk.",
          },
          { role: "q", text: "Commit message yang baik gimana?" },
          {
            role: "a",
            text: "Format: 'type(scope): description'. Contoh: 'feat(auth): add Google OAuth login'. Gunakan conventional commits.",
          },
        ],
      },
      {
        title: "Bab 2: Code Review yang Efektif",
        lines: [
          { role: "q", text: "PR sebaiknya seberapa besar?" },
          {
            role: "a",
            text: "Di bawah 400 baris changed. Riset menunjukkan review quality turun drastis di atas angka itu.",
          },
          { role: "q", text: "Apa yang harus dicek saat review?" },
          {
            role: "a",
            text: "Logic correctness, edge cases, naming clarity, test coverage, dan apakah sesuai dengan arsitektur yang disepakati.",
          },
          { role: "q", text: "Gimana kasih feedback yang konstruktif?" },
          {
            role: "a",
            text: "Fokus di kode, bukan orang. Tanyakan 'what if' daripada 'you should'. Berikan contoh alternatif, bukan cuma kritik.",
          },
          { role: "q", text: "Auto review tools yang recommended?" },
          {
            role: "a",
            text: "GitHub Copilot PR review, Danger JS untuk automated checks, dan CODEOWNERS untuk auto-assign reviewer.",
          },
        ],
      },
    ],
  },
  {
    id: 6,
    title: "TypeScript Praktis: Dari Nol ke Confident",
    author: "NAA TypeScript Guild",
    cover: "https://picsum.photos/seed/ts-practical-book/400/600",
    genre: "TypeScript",
    pages: 52,
    rating: 4.8,
    description:
      "Belajar TypeScript tanpa teori berlebihan. Langsung praktek dengan pattern yang sering dipakai di dunia nyata.",
    chapters: [
      {
        title: "Bab 1: Kenapa TypeScript?",
        lines: [
          {
            role: "q",
            text: "TypeScript worth it gak sih buat project kecil?",
          },
          {
            role: "a",
            text: "Ya. Autocomplete dan error checking di editor alone sudah bikin development 30% lebih cepat, bahkan di project kecil.",
          },
          { role: "q", text: "Learning curve-nya gimana?" },
          {
            role: "a",
            text: "Kalau udah familiar JavaScript, 1-2 minggu sudah bisa produktif. Advanced types bisa dipelajari bertahap sesuai kebutuhan.",
          },
          { role: "q", text: "Strict mode harus selalu on?" },
          {
            role: "a",
            text: "Idealnya ya. Strict mode catch lebih banyak bug. Kalau migrating dari JS, bisa nyalakan bertahap per rule.",
          },
          { role: "q", text: "'any' boleh dipake?" },
          {
            role: "a",
            text: "Sebagai escape hatch sementara, boleh. Tapi long-term, setiap 'any' adalah potential bug yang gak ketangkep compiler.",
          },
        ],
      },
      {
        title: "Bab 2: Types yang Sering Dipakai",
        lines: [
          { role: "q", text: "Interface vs Type, kapan pakai yang mana?" },
          {
            role: "a",
            text: "Interface untuk object shape yang bisa di-extend. Type untuk union, intersection, dan mapped types. Keduanya bisa saling ganti untuk simple cases.",
          },
          { role: "q", text: "Generic itu buat apa?" },
          {
            role: "a",
            text: "Bikin function/component yang type-safe tapi flexible. Contoh: function getFirst<T>(arr: T[]): T — works untuk array apapun.",
          },
          { role: "q", text: "Utility types yang must-know?" },
          {
            role: "a",
            text: "Partial<T>, Required<T>, Pick<T,K>, Omit<T,K>, Record<K,V>, dan ReturnType<T>. Enam ini cover 90% kebutuhan.",
          },
          { role: "q", text: "Discriminated union itu powerful ya?" },
          {
            role: "a",
            text: "Sangat. Bikin type-safe state machine. Contoh: type Result = { status: 'ok'; data: User } | { status: 'error'; message: string }.",
          },
        ],
      },
      {
        title: "Bab 3: TypeScript di React",
        lines: [
          { role: "q", text: "Props typing yang best practice?" },
          {
            role: "a",
            text: "Definisikan type terpisah. Gunakan children: React.ReactNode. Hindari inline typing yang bikin JSX berantakan.",
          },
          { role: "q", text: "Event handler type gimana?" },
          {
            role: "a",
            text: "React.ChangeEvent<HTMLInputElement> untuk onChange, React.FormEvent<HTMLFormElement> untuk onSubmit. Hover di handler untuk lihat type-nya.",
          },
          { role: "q", text: "useState dengan complex type?" },
          {
            role: "a",
            text: "const [user, setUser] = useState<User | null>(null). Explicit generic kalau initial value gak cukup buat inference.",
          },
          { role: "q", text: "Ref typing yang benar?" },
          {
            role: "a",
            text: "useRef<HTMLDivElement>(null) untuk DOM refs. useRef<number>(0) untuk mutable values. Pastikan generic type-nya sesuai.",
          },
        ],
      },
    ],
  },
];
