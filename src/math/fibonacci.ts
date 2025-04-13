export type FibonacciLevel = (typeof FIBONACCI_LEVELS)[number];

export const FIBONACCI_LEVELS = [
  0, 23.6, 38.2, 50, 61.8, 78.6, 100, 127.2, 161.8, 261.8, 423.6,
] as const;

/**
 * Calculates the Fibonacci retracement levels for given start and end points.
 *
 * @param {number} start - The starting price point (low for uptrend, high for downtrend)
 * @param {number} end - The ending price point (high for uptrend, low for downtrend)
 * @returns {Record<FibonacciLevel, number>} Object of retracement levels
 */
export function fibonacci(start: number, end: number): Record<FibonacciLevel, number> {
  const priceRange = Math.abs(start - end);
  const isUptrend = start < end;

  return Object.fromEntries(
    FIBONACCI_LEVELS.map((level) => {
      const adjustment = (priceRange * level) / 100;
      const calculated = isUptrend ? end - adjustment : end + adjustment;
      return [level, Math.max(0, calculated)];
    })
  ) as Record<FibonacciLevel, number>;
}
