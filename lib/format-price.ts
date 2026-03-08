/**
 * Format harga ke format Rupiah yang konsisten antara SSR dan client.
 * Menghindari hydration mismatch dari toLocaleString("id-ID") yang
 * hasilnya bisa berbeda antara Node.js server dan browser.
 */
export function formatPrice(price: number): string {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
