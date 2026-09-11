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
