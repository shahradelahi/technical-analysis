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
export function fibonacciRetracement(start: number, end: number): Record<FibonacciLevel, number> {
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

/**
 * Returns an array of Fibonacci Sequence of given number
 *
 * @example
 * fibonacci(5) // [1, 1, 2, 3, 5]
 *
 * @param n - The number of Fibonacci numbers to generate
 * @param options - Options for the Fibonacci sequence
 * @param options.zero - Whether to include 0 in the sequence
 * @param options.weighted - Whether to return the sequence as weighted values
 * @returns An array of Fibonacci numbers
 */
export function fibonacci(n: number, options?: { zero?: boolean; weighted?: boolean }): number[] {
  n = Math.abs(Math.floor(n));

  const { zero = false, weighted = false } = options || {};

  let a, b;
  if (zero) {
    a = 0;
    b = 1;
  } else {
    n -= 1;
    a = 1;
    b = 1;
  }

  const result = [a];
  for (let i = 0; i < n; i++) {
    [a, b] = [b, a + b];
    result.push(a);
  }

  if (weighted) {
    const fibSum = result.reduce((sum, val) => sum + val, 0);
    if (fibSum > 0) {
      return result.map((val) => val / fibSum);
    } else {
      return result;
    }
  } else {
    return result;
  }
}
