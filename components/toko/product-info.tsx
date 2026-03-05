import type { Product } from "@/types/products";

export function ProductInfo({ product }: { product: Product }) {
  return (
    <div className="glass-panel rounded-xl p-4">
      <h1 className="mb-3 text-xl font-bold leading-tight text-slate-50">
        {product.name}
      </h1>

      <div className="product-price-box mb-4 rounded-lg p-3">
        <p className="text-2xl font-bold text-orange-500">
          Rp {product.price.toLocaleString("id-ID")}
        </p>
      </div>

      <div className="mb-4 flex items-center justify-between border-b border-slate-700/40 pb-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-400">Stok:</span>
          <span
            className={product.stock > 0 ? "text-emerald-400" : "text-rose-400"}
          >
            {product.stock > 0 ? `${product.stock} unit tersedia` : "Habis"}
          </span>
        </div>
        <span className="product-category-badge rounded-full px-3 py-1 text-xs font-medium">
          {product.category}
        </span>
      </div>

      <div className="mb-6">
        <h2 className="mb-3 text-base font-semibold text-slate-100">
          Deskripsi Produk
        </h2>
        <div className="product-desc-box rounded-lg p-4">
          <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-line">
            {product.description}
          </p>
        </div>
      </div>

      {/* Badges & Technical Details */}
      <div className="space-y-4">
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
            product.productType === "digital"
              ? "bg-purple-600/25 text-purple-800 dark:text-purple-300 ring-1 ring-purple-600/50"
              : "bg-blue-500/20 text-blue-700 dark:text-blue-300 ring-1 ring-blue-400/40"
          }`}
        >
          {product.productType === "digital"
            ? "💾 Produk Digital"
            : "📦 Produk Fisik"}
        </span>

        <div className="product-detail-box rounded-lg p-3">
          <h3 className="mb-3 text-sm font-semibold text-slate-200">
            Keterangan Produk
          </h3>
          <div className="space-y-2 text-sm">
            <DetailRow label="Kategori" value={product.category} />
            <DetailRow label="Kondisi" value="Baru" />
            <DetailRow label="Stok" value={`${product.stock} unit`} />
            <DetailRow label="SKU" value={product.id} mono />
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-400">{label}</span>
      <span
        className={`font-medium text-slate-200 ${mono ? "font-mono text-xs" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
