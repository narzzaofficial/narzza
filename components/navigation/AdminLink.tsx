import Link from "next/link";

const AdminLink = () => {
  return (
    <Link
      href="/admin"
      className="group relative flex items-center gap-3 rounded-xl bg-amber-500/5 px-3 py-2.5 transition-all duration-150 hover:bg-amber-500/10"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-base">
        🛠️
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold leading-none text-amber-300">
          Admin Panel
        </p>
        <p className="mt-0.5 text-[11px] leading-none text-amber-300/50">
          Kelola konten
        </p>
      </div>
      <svg
        className="h-3.5 w-3.5 shrink-0 text-amber-400/50 transition group-hover:text-amber-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 5l7 7-7 7"
        />
      </svg>
    </Link>
  );
};

export default AdminLink;
