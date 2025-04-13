/**
 * Calculates the average of the high, low, and close prices,
 * aka the typical price.
 *
 * @param high The high price.
 * @param low The low price.
 * @param close The close price.
 */
export function hlc3(high: number, low: number, close: number) {
  return (high + low + close) / 3;
}
