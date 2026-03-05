import Image from "next/image";
import type { Product } from "@/types/products";

export function ProductActions({ product }: { product: Product }) {
  const isPhysical = product.productType === "physical";
  const platforms = product.platforms || {};

  return (
    <div className="glass-panel rounded-xl p-4">
      <h3 className="mb-3 text-sm font-semibold text-slate-200">
        {isPhysical ? "Beli Produk Ini di:" : "Download Produk di:"}
      </h3>

      <div className="space-y-2">
        {isPhysical ? (
          <>
            {platforms.shopee && (
              <a
                href={platforms.shopee}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold text-white transition hover:brightness-110"
                style={{ background: "#ee4d2d" }}
              >
                <Image
                  src="/assets/shopee.png"
                  alt="Shopee"
                  width={20}
                  height={20}
                  className="shrink-0"
                />
                <span>Beli di Shopee</span>
              </a>
            )}
            {platforms.tiktokshop && (
              <a
                href={platforms.tiktokshop}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold transition hover:brightness-110"
                style={{
                  background:
                    "linear-gradient(135deg, #010101 0%, #1a1a2e 100%)",
                  border: "1px solid rgba(105,232,223,0.4)",
                  color: "#ffffff",
                  boxShadow: "inset 0 0 20px rgba(105,232,223,0.08)",
                }}
              >
                <Image
                  src="/assets/tiktok.png"
                  alt="TikTok"
                  width={20}
                  height={20}
                  className="shrink-0"
                />
                <span>Beli di TikTok Shop</span>
              </a>
            )}
            {platforms.tokopedia && (
              <a
                href={platforms.tokopedia}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold text-white transition hover:brightness-110"
                style={{ background: "#42b549" }}
              >
                <Image
                  src="/assets/tokopedia.png"
                  alt="Tokopedia"
                  width={20}
                  height={20}
                  className="shrink-0"
                />
                <span>Beli di Tokopedia</span>
              </a>
            )}
          </>
        ) : (
          platforms.lynk && (
            <a
              href={platforms.lynk}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold text-white transition hover:brightness-110"
              style={{ background: "#0a66c2" }}
            >
              <Image
                src="/assets/lynkid.png"
                alt="Lynk.id"
                width={80}
                height={24}
                className="shrink-0 object-contain"
              />
              <span>Download di Lynk</span>
            </a>
          )
        )}
      </div>

      <p className="mt-3 text-center text-xs text-slate-500 italic">
        {isPhysical
          ? "Website ini tidak menyediakan sistem pembayaran secara langsung."
          : "Produk digital akan tersedia setelah pembayaran via platform eksternal."}
      </p>
    </div>
  );
}
