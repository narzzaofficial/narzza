import Image from "next/image";
import Link from "next/link";
import { getBooks } from "@/lib/data";

type Props = {
  currentId: number;
};

export async function BookRecommendSidebarLeft({ currentId }: Props) {
  const allBooks = await getBooks();
  const others = allBooks
    .filter((b) => b.id !== currentId)
    .slice(0, 5);

  if (others.length === 0) return null;

  return (
    <div className="sidebar-widget">
      <h2 className="widget-heading">Buku Lainnya</h2>
      <ul className="mt-3 space-y-3">
        {others.map((book) => (
          <li key={book.id}>
            <Link
              href={`/buku/${book.id}`}
              className="group flex items-start gap-3 rounded-xl p-2 transition hover:bg-cyan-500/10"
            >
              <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-md">
                <Image
                  src={book.cover}
                  alt={book.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="40px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold leading-snug text-slate-100 line-clamp-2 group-hover:text-cyan-200 transition">
                  {book.title}
                </p>
                <p className="mt-1 text-[10px] text-slate-400">{book.author}</p>
                <p className="text-[10px] text-cyan-300/80">{book.genre}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function BookRecommendSidebarRight({ currentId }: Props) {
  const allBooks = await getBooks();
  const others = allBooks.filter((b) => b.id !== currentId).slice(5, 10);

  if (others.length === 0) {
    // Fallback: tampilkan buku pertama jika tidak ada halaman ke-2
    const fallback = allBooks.filter((b) => b.id !== currentId).slice(0, 5);
    if (fallback.length === 0) return null;
    return (
      <div className="sidebar-widget">
        <h2 className="widget-heading">Rekomen Buku</h2>
        <ul className="mt-3 space-y-3">
          {fallback.map((book) => (
            <li key={book.id}>
              <Link
                href={`/buku/${book.id}`}
                className="group flex items-start gap-3 rounded-xl p-2 transition hover:bg-cyan-500/10"
              >
                <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-md">
                  <Image
                    src={book.cover}
                    alt={book.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="40px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold leading-snug text-slate-100 line-clamp-2 group-hover:text-cyan-200 transition">
                    {book.title}
                  </p>
                  <p className="mt-1 text-[10px] text-slate-400">
                    ⭐ {book.rating}/5 · {book.pages} hal
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="sidebar-widget">
      <h2 className="widget-heading">Rekomen Buku</h2>
      <ul className="mt-3 space-y-3">
        {others.map((book) => (
          <li key={book.id}>
            <Link
              href={`/buku/${book.id}`}
              className="group flex items-start gap-3 rounded-xl p-2 transition hover:bg-cyan-500/10"
            >
              <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-md">
                <Image
                  src={book.cover}
                  alt={book.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="40px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold leading-snug text-slate-100 line-clamp-2 group-hover:text-cyan-200 transition">
                  {book.title}
                </p>
                <p className="mt-1 text-[10px] text-slate-400">
                  ⭐ {book.rating}/5 · {book.pages} hal
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

