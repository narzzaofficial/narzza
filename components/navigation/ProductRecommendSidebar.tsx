import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/data";

type Props = {
  currentId: string;
  category?: string;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

export async function ProductRecommendSidebarLeft({
  currentId,
  category,
}: Props) {
  const allProducts = await getProducts();

  // Prioritaskan produk dengan kategori sama
  const sameCategory = allProducts.filter(
    (p) => p.id !== currentId && p.category === category
  );
  const others = allProducts.filter(
    (p) => p.id !== currentId && p.category !== category
  );

  const recommended = [...sameCategory, ...others].slice(0, 5);
  if (recommended.length === 0) return null;

  return (
    <div className="sidebar-widget">
      <h2 className="widget-heading">Produk Serupa</h2>
      <ul className="mt-3 space-y-3">
        {recommended.map((product) => (
          <li key={product.id}>
            <Link
              href={`/toko/${product.id}`}
              className="group flex items-start gap-3 rounded-xl p-2 transition hover:bg-cyan-500/10"
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-800">
                {product.images?.[0] && (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="48px"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold leading-snug text-slate-100 line-clamp-2 group-hover:text-cyan-200 transition">
                  {product.name}
                </p>
                <p className="mt-1 text-[10px] font-bold text-cyan-300">
                  {formatPrice(product.price)}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function ProductRecommendSidebarRight({ currentId }: Props) {
  const allProducts = await getProducts();
  const featured = allProducts
    .filter((p) => p.id !== currentId && p.featured)
    .slice(0, 4);

  const fallback =
    featured.length > 0
      ? featured
      : allProducts.filter((p) => p.id !== currentId).slice(0, 4);

  if (fallback.length === 0) return null;

  return (
    <div className="sidebar-widget">
      <h2 className="widget-heading">Produk Unggulan</h2>
      <div className="mt-3 space-y-2">
        {fallback.map((product) => (
          <Link
            key={product.id}
            href={`/toko/${product.id}`}
            className="group block rounded-xl border border-slate-700/50 bg-slate-900/40 p-3 transition hover:border-cyan-300/50 hover:bg-cyan-500/10"
          >
            <div className="flex items-center gap-2">
              {product.images?.[0] && (
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-slate-800">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-100 line-clamp-1 group-hover:text-cyan-200 transition">
                  {product.name}
                </p>
                <p className="text-[10px] font-bold text-cyan-300">
                  {formatPrice(product.price)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Link
        href="/toko"
        className="mt-3 block text-center text-xs text-cyan-400 hover:text-cyan-300 transition"
      >
        Lihat Semua Produk
      </Link>
    </div>
  );
}
