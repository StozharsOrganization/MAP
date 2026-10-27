/**
 * Deterministic number formatting for currency amounts.
 * Prevents SSR / Client hydration mismatches caused by different locale space/comma separators.
 */
export function formatMoney(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null) return '0';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '0';
  return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/**
 * Responsive srcSet for Unsplash images (they resize on the fly via the `w` param).
 * Returns undefined for other hosts so the plain src is used.
 */
export function unsplashSrcSet(url: string | undefined, widths: number[] = [400, 640, 800, 1200]): string | undefined {
  if (!url || !url.includes('images.unsplash.com')) return undefined;
  return widths
    .map((w) => `${url.replace(/([?&])w=\d+/, `$1w=${w}`)}${/[?&]w=\d+/.test(url) ? '' : `&w=${w}`} ${w}w`)
    .join(', ');
}
